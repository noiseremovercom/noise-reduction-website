// backend/src/controllers/audioController.js
const audioService = require('../services/deepFilterService');
const logger = require('../utils/logger');

class AudioController {
    async processAudio(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No audio file provided' });
            }

            // Get processing version from request (default: 'SE v1.0')
            const version = req.body.version || 'SE v1.0';
            
            logger.info(`Processing: ${req.file.originalname} with version: ${version}`);

            const result = await audioService.processAudio(
                req.file.buffer,
                req.file.originalname,
                version
            );

            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
            res.setHeader('Content-Length', result.size);
            res.setHeader('X-Processing-Version', version);
            res.send(result.buffer);

        } catch (error) {
            logger.error('Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getVersions(req, res) {
        try {
            const versions = audioService.getVersions();
            res.json({ 
                versions,
                default: 'SE v1.0',
                description: {
                    'SE v1.0': 'Studio quality - maximum noise removal + speech enhancement',
                    'NR v4.0': 'Crispy clear voice with minimal noise',
                    'NR v2.4': 'Balanced enhancement, very minor noise',
                    'NR v2.1.1': 'Very clear voice, preserves natural sound'
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    healthCheck(req, res) {
        res.json({ 
            status: 'healthy', 
            service: 'DeepFilterNet3 Audio Processor',
            versions: audioService.getVersions(),
            timestamp: new Date().toISOString()
        });
    }
}

const audioController = new AudioController();
module.exports = {
    processAudio: audioController.processAudio.bind(audioController),
    getVersions: audioController.getVersions.bind(audioController),
    healthCheck: audioController.healthCheck.bind(audioController)
};