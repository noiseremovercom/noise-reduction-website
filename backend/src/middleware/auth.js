// backend/src/middleware/apiKeyAuth.js

// Get valid API keys from environment variables
const VALID_API_KEYS = process.env.VALID_API_KEYS 
    ? process.env.VALID_API_KEYS.split(',').map(k => k.trim())
    : [];

// Master API key for admin/development
const MASTER_API_KEY = process.env.MASTER_API_KEY;

// For development, you can also allow testing without key
const ALLOW_NO_KEY = process.env.NODE_ENV !== 'production';

/**
 * API Key Authentication Middleware
 * Checks for API key in headers or query parameters
 */
const apiKeyAuth = (req, res, next) => {
    // Get API key from multiple possible locations
    let apiKey = req.headers['x-api-key'] || 
                 req.headers['authorization'] || 
                 req.query.api_key;
    
    // Remove 'Bearer ' prefix if present
    if (apiKey && apiKey.startsWith('Bearer ')) {
        apiKey = apiKey.substring(7);
    }
    
    // Check if API key is provided
    if (!apiKey) {
        // In development, we can optionally allow requests without key
        if (ALLOW_NO_KEY) {
            console.log('[API_KEY] Development mode: allowing request without key');
            req.apiKey = 'dev-mode';
            req.apiKeyType = 'dev';
            return next();
        }
        
        return res.status(401).json({ 
            error: 'API key required',
            message: 'Please provide a valid API key in the x-api-key header',
            documentation: 'Include your API key in the request headers'
        });
    }
    
    // Check against valid keys
    const isValid = VALID_API_KEYS.includes(apiKey) || apiKey === MASTER_API_KEY;
    
    if (!isValid) {
        return res.status(403).json({ 
            error: 'Invalid API key',
            message: 'The provided API key is not valid'
        });
    }
    
    // Attach key info to request for logging
    req.apiKey = apiKey;
    req.apiKeyType = apiKey === MASTER_API_KEY ? 'master' : 'app';
    
    next();
};

/**
 * Optional: Rate limiting middleware per API key
 */
const apiKeyRateLimiter = () => {
    const usageMap = new Map(); // In production, use Redis
    
    return (req, res, next) => {
        const apiKey = req.apiKey || 'anonymous';
        const now = Date.now();
        const windowStart = now - 60 * 60 * 1000; // 1 hour window
        
        // Get existing timestamps for this key
        let timestamps = usageMap.get(apiKey) || [];
        
        // Filter timestamps within current window
        timestamps = timestamps.filter(t => t > windowStart);
        
        // Check rate limit (100 requests per hour per key)
        const limit = process.env.API_RATE_LIMIT_PER_HOUR || 100;
        
        if (timestamps.length >= limit) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: `You have exceeded your ${limit} requests per hour limit`,
                reset: windowStart + 60 * 60 * 1000
            });
        }
        
        // Add current timestamp
        timestamps.push(now);
        usageMap.set(apiKey, timestamps);
        
        next();
    };
};

module.exports = {
    apiKeyAuth,
    apiKeyRateLimiter
};