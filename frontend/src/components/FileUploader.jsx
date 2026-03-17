// src/components/FileUploader.jsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 10485760; // 10MB in bytes

const FileUploader = ({ onFileUpload, isProcessing }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            const error = rejectedFiles[0].errors[0];
            if (error.code === 'file-too-large') {
                setError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1048576}MB`);
            } else if (error.code === 'file-invalid-type') {
                setError('Invalid file type. Please upload an audio file.');
            } else {
                setError(error.message);
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setError(null);
            onFileUpload(selectedFile);
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.webm'],
            'video/*': ['.mp4', '.mov', '.webm']
        },
        maxSize: MAX_FILE_SIZE,
        disabled: isProcessing,
        multiple: false
    });

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="uploader-container">
            <div 
                {...getRootProps()} 
                className={`upload-area ${isDragActive ? 'drag-over' : ''} 
                    ${isDragReject ? 'reject' : ''} 
                    ${isProcessing ? 'disabled' : ''}
                    ${error ? 'error' : ''}`}
            >
                <input {...getInputProps()} />
                
                <div className="upload-icon-wrapper">
                    <i className="fas fa-cloud-upload-alt upload-icon"></i>
                </div>
                
                <p className="upload-text">
                    {isDragActive ? 'Drop your file here!' : 'Drag & Drop Your File'}
                </p>
                <p className="upload-subtext">
                    <i className="fas fa-mouse-pointer"></i> or <i className="fas fa-folder-open"></i> click to browse
                </p>
                <div className="supported-formats">
                    <i className="fas fa-check-circle"></i>
                    Supports: MP3, WAV, M4A, FLAC, AAC, OGG, WEBM, MP4, MOV
                </div>
                <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                    Max file size: 10 MB
                </p>
            </div>
            
            {error && (
                <div className="error-message">
                    <i className="fas fa-exclamation-circle error-icon"></i>
                    <p>{error}</p>
                </div>
            )}
            
            {file && !error && (
                <div className="file-info">
                    <div className="file-icon">
                        <i className="fas fa-file-audio"></i>
                    </div>
                    <div className="file-details">
                        <h4>{file.name}</h4>
                        <div className="file-meta">
                            <span className="file-size">{formatFileSize(file.size)}</span>
                            <span className="file-type">{file.type || 'audio/video file'}</span>
                        </div>
                    </div>
                    <button 
                        className="remove-file"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            onFileUpload(null);
                        }}
                        title="Remove file"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUploader;