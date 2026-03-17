// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10485760;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000, // 5 minutes
    maxContentLength: MAX_FILE_SIZE,
    maxBodyLength: MAX_FILE_SIZE
});

// Request interceptor for logging
api.interceptors.request.use(request => {
    console.log('Starting Request:', request.url);
    return request;
});

// Response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('Response:', response.status);
        return response;
    },
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

/**
 * Upload and process audio file with specific version
 * @param {File} audioFile 
 * @param {string} version - 'SE v1.0', 'NR v4.0', 'NR v2.4', 'NR v2.1.1'
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise<Blob>}
 */
export const processAudio = async (audioFile, version = 'SE v1.0', onUploadProgress) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('version', version);

    try {
        // Validate file size
        if (audioFile.size > MAX_FILE_SIZE) {
            throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1048576}MB`);
        }

        // Validate file type
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/webm'];
        if (!validTypes.includes(audioFile.type) && !audioFile.name.match(/\.(mp3|wav|m4a|flac|aac|ogg|webm)$/i)) {
            throw new Error('Invalid file type. Please upload an audio file.');
        }

        const response = await api.post('/audio/process-audio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
            onUploadProgress: (progressEvent) => {
                if (onUploadProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onUploadProgress(percentCompleted);
                }
            },
        });

        // Check if response is an error (JSON) or audio file (blob)
        if (response.headers['content-type']?.includes('application/json')) {
            const text = await response.data.text();
            const error = JSON.parse(text);
            throw new Error(error.error || 'Processing failed');
        }

        return response.data;
    } catch (error) {
        if (error.response?.data) {
            try {
                const text = await error.response.data.text();
                const errorData = JSON.parse(text);
                throw new Error(errorData.error || errorData.message || 'Processing failed');
            } catch {
                throw new Error(error.message || 'Network error');
            }
        }
        throw error;
    }
};

/**
 * Check API health
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
    try {
        const response = await api.get('/audio/health');
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};

/**
 * Get available processing versions
 * @returns {Promise<Object>}
 */
export const getVersions = async () => {
    try {
        const response = await api.get('/audio/versions');
        console.log('Versions response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch versions:', error);
        // Return fallback data
        return {
            versions: [
                { id: 'SE v1.0', label: '✨ SE v1.0 - Studio Quality', strength: 1.5 },
                { id: 'NR v4.0', label: '🔊 NR v4.0 - Crispy Clear', strength: 1.2 },
                { id: 'NR v2.4', label: '🎵 NR v2.4 - Balanced', strength: 1.0 },
                { id: 'NR v2.1.1', label: '🎧 NR v2.1.1 - Clear Voice', strength: 0.8 }
            ]
        };
    }
};

export default api;