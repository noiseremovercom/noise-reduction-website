// backend/src/services/deepFilterService.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const logger = require('../utils/logger');

class AudioService {
    constructor() {
        this.tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        
        this.pythonScript = path.join(__dirname, '../python_scripts/deepfilter_audio_processor.py');
        
        // EXACT CONFIGURATION as requested
        this.versions = {
            'SE v1.0': { 
                strength: 2.8,        // High processing
                postfilter: false,      // Keep postfilter for maximum clarity
                volumeBoost: 2.8,
                passes: 11,             // Double pass for maximum noise removal
                noiseReduction: '99%',
                clarity: 'Studio',
                description: 'Professional podcasts - 99% noise reduction',
                label: '✨ SE v1.0 - Studio Quality'
            },
            'NR v4.0': { 
                strength: 1.9,        // Medium-high processing
                postfilter: false,      // Postfilter for crispiness
                volumeBoost: 3.9,
                passes: 11,
                noiseReduction: '95%',
                clarity: 'Crispy',
                description: 'YouTube videos - 95% noise reduction',
                label: '🔊 NR v4.0 - Crispy Clear'
            },
            'NR v2.4': { 
                strength: 1.5,        // Medium processing
                postfilter: false,     // No postfilter for natural sound
                volumeBoost: 2.0,
                passes: 6,
                noiseReduction: '90%',
                clarity: 'Clear',
                description: 'General use - 90% noise reduction',
                label: '🎵 NR v2.4 - Balanced'
            },
            'NR v2.1.1': { 
                strength: 1.2,        // Low processing
                postfilter: false,     // No postfilter for natural sound
                volumeBoost: 1.5,
                passes: 4,
                noiseReduction: '85%',
                clarity: 'Natural',
                description: 'Music, singing - 85% noise reduction',
                label: '🎧 NR v2.1.1 - Clear Voice'
            }
        };
        
        logger.info('✅ DeepFilterNet3 Audio Service initialized');
        logger.info(`📁 Temp directory: ${this.tempDir}`);
        logger.info(`🐍 Python script: ${this.pythonScript}`);
        logger.info(`🎯 Available versions: ${Object.keys(this.versions).join(', ')}`);
    }

    async processAudio(audioBuffer, originalName, version = 'SE v1.0') {
        const fileId = crypto.randomBytes(16).toString('hex');
        const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        
        const inputFile = path.join(this.tempDir, `${fileId}_${safeName}`);
        const outputFile = path.join(this.tempDir, `enhanced_${fileId}.wav`);

        try {
            const config = this.versions[version];
            if (!config) {
                throw new Error(`Unknown version: ${version}`);
            }

            logger.info(`🎵 Processing: ${originalName} (${(audioBuffer.length/1024/1024).toFixed(2)}MB)`);
            logger.info(`⚡ Version: ${version} - ${config.description}`);
            logger.info(`📊 Config: strength=${config.strength}, postfilter=${config.postfilter}, passes=${config.passes}`);

            // Save original file
            fs.writeFileSync(inputFile, audioBuffer);
            logger.info(`📄 Original saved: ${path.basename(inputFile)}`);

            if (!fs.existsSync(inputFile)) {
                throw new Error('Failed to save input file');
            }
            logger.info(`✅ Input file verified: ${inputFile}`);

            logger.info('🔊 Applying DeepFilterNet3 noise reduction...');
            
            // Command: python script.py input_file output_file strength postfilter passes volumeBoost
            const command = `python "${this.pythonScript}" "${inputFile}" "${outputFile}" ${config.strength} ${config.postfilter} ${config.passes} ${config.volumeBoost}`;
            
            logger.info(`📝 Executing command: ${command}`);

            const { stdout, stderr } = await execPromise(command);
            
            // Log Python output
            if (stdout) {
                stdout.split('\n').forEach(line => {
                    if (line.trim()) {
                        if (line.includes('[SUCCESS]')) {
                            logger.info(`✅ ${line.replace('[SUCCESS]', '').trim()}`);
                        } else if (line.includes('[INFO]')) {
                            logger.info(`ℹ️ ${line.replace('[INFO]', '').trim()}`);
                        } else if (line.includes('[ERROR]')) {
                            logger.error(`❌ ${line.replace('[ERROR]', '').trim()}`);
                        } else if (line.trim()) {
                            logger.info(`🐍 ${line.trim()}`);
                        }
                    }
                });
            }

            if (stderr && !stderr.includes('Warning')) {
                logger.warn(`⚠️ Python stderr: ${stderr}`);
            }

            // Check if output file was created
            if (!fs.existsSync(outputFile)) {
                throw new Error('Processing failed - no output file');
            }

            const resultBuffer = fs.readFileSync(outputFile);
            const stats = fs.statSync(outputFile);

            logger.info(`✅ Complete: ${(stats.size/1024/1024).toFixed(2)}MB`);

            // Cleanup input file
            fs.unlinkSync(inputFile);

            return {
                success: true,
                buffer: resultBuffer,
                fileName: `enhanced_${safeName.replace(/\.[^/.]+$/, '')}.wav`,
                size: stats.size,
                version: version,
                config: config
            };

        } catch (error) {
            logger.error('❌ Processing error:', error);
            
            // Cleanup on error
            if (fs.existsSync(inputFile)) {
                try {
                    fs.unlinkSync(inputFile);
                } catch (e) {
                    logger.error('Error cleaning up input file:', e);
                }
            }
            if (fs.existsSync(outputFile)) {
                try {
                    fs.unlinkSync(outputFile);
                } catch (e) {
                    logger.error('Error cleaning up output file:', e);
                }
            }
            
            throw new Error(`Processing failed: ${error.message}`);
        }
    }

    getVersions() {
        return Object.entries(this.versions).map(([key, value]) => ({
            id: key,
            label: value.label,
            description: value.description,
            strength: value.strength,
            noiseReduction: value.noiseReduction,
            clarity: value.clarity
        }));
    }
}

module.exports = new AudioService();