// backend/src/controllers/audioController.js
const deepFilterService = require('../services/deepFilterService');
const logger = require('../utils/logger');

class AudioController {
    async processAudio(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No audio file provided' });
            }

            // Get version from request (default to SE v1.0)
            const version = req.body.version || 'SE v1.0';
            const useVad = req.body.useVad !== 'false';
            
            // Log request with API key info (if available)
            logger.info(`Processing: ${req.file.originalname} with version: ${version}, VAD: ${useVad}`);
            if (req.apiKey) {
                logger.info(`API Key used: ${req.apiKeyType} - ${req.apiKey.substring(0, 8)}...`);
            }

            // Process audio
            const result = await deepFilterService.processAudio(
                req.file.buffer,
                req.file.originalname,
                version,
                useVad
            );

            // Set response headers
            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
            res.setHeader('Content-Length', result.size);
            res.setHeader('X-Processing-Version', version);
            res.setHeader('X-Processing-Time', result.processingTime || 'unknown');
            
            res.send(result.buffer);

        } catch (error) {
            logger.error('Processing error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async processBatchAudio(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No audio files provided' });
            }
            
            const results = [];
            for (const file of req.files) {
                const result = await deepFilterService.processAudio(
                    file.buffer,
                    file.originalname,
                    req.body.version || 'SE v1.0'
                );
                results.push(result);
            }
            
            res.json({ 
                success: true, 
                count: results.length,
                files: results.map(r => ({ name: r.fileName, size: r.size }))
            });
            
        } catch (error) {
            logger.error('Batch processing error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getVersions(req, res) {
        try {
            const versions = deepFilterService.getVersions();
            res.json({ versions });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getStats(req, res) {
        try {
            const stats = await deepFilterService.getStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    healthCheck(req, res) {
        res.json({ 
            status: 'healthy', 
            service: 'DeepFilterNet3 Audio Processor',
            version: '3.0',
            features: ['VAD', 'Multiple Profiles', 'API Key Auth', 'CORS Enabled'],
            profiles: deepFilterService.getProfiles ? deepFilterService.getProfiles() : ['gentle', 'light', 'standard', 'aggressive', 'auto'],
            timestamp: new Date().toISOString()
        });
    }
}

const audioController = new AudioController();
module.exports = {
    processAudio: audioController.processAudio.bind(audioController),
    processBatchAudio: audioController.processBatchAudio.bind(audioController),
    getVersions: audioController.getVersions.bind(audioController),
    getStats: audioController.getStats.bind(audioController),
    healthCheck: audioController.healthCheck.bind(audioController)
};