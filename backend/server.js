// backend/server.js
// Load environment variables FIRST, before anything else!
const dotenv = require('dotenv');
dotenv.config();

// Now import everything else
const app = require('./src/app');
const logger = require('./src/utils/logger');
const rnnoiseService = require('./src/services/rnnoiseService'); // Changed from elevenLabsService

const PORT = process.env.PORT || 5000;

// Start cleanup scheduler (clean files older than 1 hour)
// If your RNNoise service has this method, uncomment:
// rnnoiseService.scheduleCleanup(3600000);

const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`📝 Health check: http://localhost:${PORT}/api/audio/health`);
    logger.info(`🎵 RNNoise Audio Processor ready (Python backend)`);
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