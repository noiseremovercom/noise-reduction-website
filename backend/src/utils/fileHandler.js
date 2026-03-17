// backend/src/utils/fileHandler.js
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
        'audio/mp4', 'audio/x-m4a', 'audio/flac', 'audio/x-flac',
        'audio/aac', 'audio/ogg', 'audio/webm'
    ];
    
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.webm'];

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed: ${allowedExts.join(', ')}`));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }
});

const handleUpload = (fieldName) => {
    return (req, res, next) => {
        const uploadSingle = upload.single(fieldName);
        
        uploadSingle(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(413).json({ 
                        error: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE / 1048576}MB` 
                    });
                }
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    };
};

module.exports = {
    upload,
    handleUpload
};