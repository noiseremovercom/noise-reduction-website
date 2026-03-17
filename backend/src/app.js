// backend/src/app.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const audioRoutes = require('./routes/audioRoutes');
const logger = require('./utils/logger');

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS configuration - Updated for production
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://noise-remover-frontend.onrender.com',
        process.env.ALLOWED_ORIGINS
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use('/api', limiter);

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

// Routes
app.use('/api/audio', audioRoutes);

// 404 handler
app.use((req, res) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    
    if (err.message.includes('File too large')) {
        return res.status(413).json({ error: err.message });
    }
    
    if (err.message.includes('Invalid file type')) {
        return res.status(415).json({ error: err.message });
    }
    
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;