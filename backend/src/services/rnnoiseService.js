// backend/src/services/rnnoiseService.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const logger = require('../utils/logger');

class RNNoiseService {
    constructor() {
        // Create temp directory
        this.tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        
        // Path to Python script
        this.pythonScript = path.join(__dirname, '../python_denoise.py');
        
        logger.info('✅ RNNoise Service initialized (Python backend)');
    }

    /**
     * Process audio with Python noisereduce
     */
    async processAudio(audioBuffer, originalName) {
        const fileId = crypto.randomBytes(16).toString('hex');
        const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        
        const inputFile = path.join(this.tempDir, `${fileId}_${safeName}`);
        const outputFile = path.join(this.tempDir, `denoised_${fileId}.wav`);

        try {
            logger.info(`🎵 Processing: ${originalName} (${(audioBuffer.length/1024/1024).toFixed(2)}MB)`);

            // 1. Save original file
            fs.writeFileSync(inputFile, audioBuffer);
            logger.info(`📄 Original saved: ${path.basename(inputFile)}`);

            // 2. Process with Python
            logger.info('🔊 Applying noise reduction with Python...');
            
            const command = `python "${this.pythonScript}" "${inputFile}" "${outputFile}"`;
            const { stdout, stderr } = await execPromise(command);
            
            if (stderr) {
                logger.warn('Python stderr:', stderr);
            }
            
            if (stdout) {
                logger.info('Python output:', stdout.trim());
            }

            // 3. Check if output file was created
            if (!fs.existsSync(outputFile)) {
                throw new Error('Python processing failed - no output file');
            }

            // 4. Read result
            const resultBuffer = fs.readFileSync(outputFile);
            const stats = fs.statSync(outputFile);

            logger.info(`✅ Complete: ${(stats.size/1024/1024).toFixed(2)}MB`);

            // 5. Cleanup input file
            fs.unlinkSync(inputFile);

            return {
                success: true,
                buffer: resultBuffer,
                fileName: `denoised_${safeName.replace(/\.[^/.]+$/, '')}.wav`,
                size: stats.size
            };

        } catch (error) {
            logger.error('❌ Error:', error);
            // Cleanup on error
            if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
            throw new Error(`Processing failed: ${error.message}`);
        }
    }
}

module.exports = new RNNoiseService();