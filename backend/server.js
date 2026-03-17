// backend/server.js
// Load environment variables FIRST, before anything else!
const dotenv = require('dotenv');
dotenv.config();

// Now import everything else
const app = require('./src/app');
const logger = require('./src/utils/logger');
const elevenLabsService = require('./src/services/elevenLabsService');

const PORT = process.env.PORT || 5000;

// Start cleanup scheduler (clean files older than 1 hour)
elevenLabsService.scheduleCleanup(3600000);

const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`📝 Health check: http://localhost:${PORT}/api/audio/health`);
    logger.info(`🎵 ElevenLabs Audio Isolation API ready`);
});

// Graceful shutdown
const gracefulShutdown = () => {
    logger.info('Received shutdown signal, closing server...');
    
    server.close(() => {
        logger.info('HTTP server closed');
        
        // Clean up temp directory
        const fs = require('fs');
        const path = require('path');
        const tempDir = path.join(__dirname, 'temp');
        
        if (fs.existsSync(tempDir)) {
            const files = fs.readdirSync(tempDir);
            files.forEach(file => {
                fs.unlinkSync(path.join(tempDir, file));
                logger.info(`Cleaned up: ${file}`);
            });
        }
        
        logger.info('Shutdown complete');
        process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = server;