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

// ========== UPDATED CORS CONFIGURATION ==========
const allowedOrigins = [
    // Production origins
    'https://noise-remover-frontend.onrender.com',
    'https://noise-reduction-website-1.onrender.com',
    'https://noise-reduction-website.onrender.com',
    
    // Local development
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    
    // Flutter web development (runs on various ports)
    /^http:\/\/localhost:[0-9]+$/,
    /^http:\/\/127\.0\.0\.1:[0-9]+$/,
    
    // For testing with file:// protocol (opening HTML directly)
    'null'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) {
            return callback(null, true);
        }
        
        // Check if origin matches any in the allowed list
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return allowed === origin;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            // Log the blocked origin for debugging
            console.log(`[CORS] Blocked request from origin: ${origin}`);
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
    maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));
// ================================================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply rate limiting to all routes
app.use('/api', limiter);

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'unknown'}`);
    next();
});

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'DeepFilterNet Audio Processor',
        timestamp: new Date().toISOString(),
        cors: {
            allowedOrigins: allowedOrigins.filter(o => !(o instanceof RegExp)).map(o => o.toString())
        }
    });
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