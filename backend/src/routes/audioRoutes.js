// backend/src/routes/audioRoutes.js
const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const { handleUpload } = require('../utils/fileHandler');
const { apiKeyAuth, apiKeyRateLimiter } = require('../middleware/apiKeyAuth');

// ========== PUBLIC ROUTES (No API Key Required) ==========
// Health check
router.get('/health', audioController.healthCheck);

// Get available processing versions
router.get('/versions', audioController.getVersions);

// Get service stats (optional)
router.get('/stats', audioController.getStats);

// ========== PROTECTED ROUTES (API Key Required) ==========
// Apply API key authentication and rate limiting to audio processing
router.post(
    '/process-audio', 
    apiKeyAuth,                    // First, verify API key
    apiKeyRateLimiter(),           // Second, check rate limits
    handleUpload('audio'),         // Third, handle file upload
    audioController.processAudio   // Finally, process the audio
);

// Optional: Batch processing endpoint (if needed)
router.post(
    '/process-batch',
    apiKeyAuth,
    apiKeyRateLimiter(),
    handleUpload('audio', { multiple: true }),
    audioController.processBatchAudio
);

module.exports = router;