// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const util = require('util');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const execPromise = util.promisify(exec);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://noise-remover-frontend.onrender.com',
        process.env.ALLOWED_ORIGINS
    ].filter(Boolean),
    credentials: true
}));

app.use(express.json());

// 👇 ADDED: Root route for Render health checks
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Noise Reduction API is running',
        endpoints: {
            health: '/api/audio/health',
            versions: '/api/audio/versions',
            process: '/api/audio/process-audio'
        }
    });
});

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
fs.ensureDirSync(tempDir);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }
});

// Health check endpoint
app.get('/api/audio/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'DeepFilterNet3 Audio Processor',
        timestamp: new Date().toISOString()
    });
});

// Get available versions
app.get('/api/audio/versions', (req, res) => {
    res.json({
        versions: [
            { id: 'SE v1.0', label: '✨ SE v1.0 - Studio Quality', strength: 1.5 },
            { id: 'NR v4.0', label: '🔊 NR v4.0 - Crispy Clear', strength: 1.2 },
            { id: 'NR v2.4', label: '🎵 NR v2.4 - Balanced', strength: 1.0 },
            { id: 'NR v2.1.1', label: '🎧 NR v2.1.1 - Clear Voice', strength: 0.8 }
        ]
    });
});

// Process audio endpoint
app.post('/api/audio/process-audio', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        const version = req.body.version || 'SE v1.0';
        const fileId = uuidv4();
        const inputFile = path.join(tempDir, `${fileId}_input.wav`);
        const outputFile = path.join(tempDir, `${fileId}_output.wav`);

        // Save uploaded file
        await fs.writeFile(inputFile, req.file.buffer);

        // Version parameters
        const versionParams = {
            'SE v1.0': { strength: 1.5, postfilter: false, passes: 2 },
            'NR v4.0': { strength: 1.2, postfilter: false, passes: 1 },
            'NR v2.4': { strength: 1.0, postfilter: false, passes: 1 },
            'NR v2.1.1': { strength: 0.8, postfilter: false, passes: 1 }
        };

        const params = versionParams[version] || versionParams['SE v1.0'];

        // Call Python script
        const pythonScript = path.join(__dirname, 'src', 'python_scripts', 'deepfilter_enhance.py');
        const command = `python "${pythonScript}" "${inputFile}" "${outputFile}" ${params.strength} ${params.postfilter} ${params.passes}`;

        await execPromise(command);

        // Check if output exists
        if (!await fs.pathExists(outputFile)) {
            throw new Error('Processing failed - no output file');
        }

        // Read and send result
        const resultBuffer = await fs.readFile(outputFile);
        
        // Cleanup
        await fs.remove(inputFile);
        await fs.remove(outputFile);

        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Content-Disposition', `attachment; filename="enhanced_${req.file.originalname}"`);
        res.send(resultBuffer);

    } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📝 Health check: http://localhost:${PORT}/api/audio/health`);
});

module.exports = app;