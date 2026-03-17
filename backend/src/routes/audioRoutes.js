// backend/src/routes/audioRoutes.js
const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const { handleUpload } = require('../utils/fileHandler');

router.get('/health', audioController.healthCheck);
router.get('/versions', audioController.getVersions);
router.post('/process-audio', handleUpload('audio'), audioController.processAudio);

module.exports = router;