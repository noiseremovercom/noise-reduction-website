// src/components/ComparisonToggle.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ComparisonToggle.css';

const ComparisonToggle = ({ 
    originalAudio, 
    processedAudio, 
    fileName, 
    onClose,
    currentVersion = 'NR v4.0'
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSource, setCurrentSource] = useState('original');
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(0.5);
    
    const audioRef = useRef(null);
    const [originalUrl, setOriginalUrl] = useState(null);
    const [processedUrl, setProcessedUrl] = useState(null);

    // Create URLs for audio files
    useEffect(() => {
        if (originalAudio) {
            const url = URL.createObjectURL(originalAudio);
            setOriginalUrl(url);
        }
        if (processedAudio) {
            const url = URL.createObjectURL(processedAudio);
            setProcessedUrl(url);
        }

        return () => {
            if (originalUrl) URL.revokeObjectURL(originalUrl);
            if (processedUrl) URL.revokeObjectURL(processedUrl);
        };
    }, [originalAudio, processedAudio]);

    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = !audioRef.current.paused;
            audioRef.current.pause();
            
            if (currentSource === 'original' && originalUrl) {
                audioRef.current.src = originalUrl;
            } else if (currentSource === 'processed' && processedUrl) {
                audioRef.current.src = processedUrl;
            }
            
            audioRef.current.load();
            audioRef.current.volume = isMuted ? 0 : volume;
            
            if (wasPlaying) {
                audioRef.current.play().catch(e => console.log('Playback failed:', e));
            }
        }
    }, [currentSource, originalUrl, processedUrl]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSource]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log('Playback failed:', e));
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (newVolume > 0) setPreviousVolume(newVolume);
    };

    const toggleMute = () => {
        if (isMuted) {
            setVolume(previousVolume);
            setIsMuted(false);
        } else {
            setPreviousVolume(volume);
            setVolume(0);
            setIsMuted(true);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleDownload = (type) => {
        const url = type === 'original' ? originalUrl : processedUrl;
        const link = document.createElement('a');
        link.href = url;
        link.download = type === 'original' ? `original_${fileName}` : `processed_${fileName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return 'fa-volume-mute';
        if (volume < 0.3) return 'fa-volume-off';
        if (volume < 0.7) return 'fa-volume-down';
        return 'fa-volume-up';
    };

    return (
        <div className="comparison-modal">
            <div className="comparison-content">
                <div className="comparison-header">
                    <h3>
                        <i className="fas fa-waveform"></i> Audio Comparison
                    </h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="comparison-file-info">
                    <i className="fas fa-file-audio"></i>
                    <span>{fileName}</span>
                </div>

                <div className="version-badge">
                    <i className="fas fa-microchip"></i> {currentVersion}
                </div>

                <audio ref={audioRef} />

                <div className="source-toggle">
                    <button
                        className={`source-btn ${currentSource === 'original' ? 'active' : ''}`}
                        onClick={() => setCurrentSource('original')}
                    >
                        <i className="fas fa-volume-off"></i> Original
                    </button>
                    <button
                        className={`source-btn ${currentSource === 'processed' ? 'active' : ''}`}
                        onClick={() => setCurrentSource('processed')}
                    >
                        <i className="fas fa-volume-up"></i> Processed
                    </button>
                </div>

                <div className="time-info-detailed">
                    <div className="time-row">
                        <span className="time-label">Start Time:</span>
                        <span className="time-value">{formatTime(0)}</span>
                    </div>
                    <div className="time-row">
                        <span className="time-label">Total Selection:</span>
                        <span className="time-value">{formatTime(duration)}</span>
                    </div>
                    <div className="time-row">
                        <span className="time-label">End Time:</span>
                        <span className="time-value">{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="playback-section">
                    <button className="play-btn" onClick={togglePlay}>
                        <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
                    </button>

                    <div className="seek-container">
                        <input
                            type="range"
                            className="seek-bar"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            step="0.01"
                        />
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span>
                            <span>/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>

                {/* VOLUME SLIDER ONLY - NO DENOISE SLIDER */}
                <div className="control-section">
                    <div className="control-header">
                        <span className="control-label">
                            <i className="fas fa-volume-up"></i> Volume
                        </span>
                        <span className="control-value">{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="volume-control-wrapper">
                        <button className="mute-btn-small" onClick={toggleMute}>
                            <i className={`fas ${getVolumeIcon()}`}></i>
                        </button>
                        <input
                            type="range"
                            className="volume-slider"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                        />
                    </div>
                </div>

                <div className="download-section">
                    <button 
                        className="download-btn original"
                        onClick={() => handleDownload('original')}
                    >
                        <i className="fas fa-download"></i> Download Original
                    </button>
                    <button 
                        className="download-btn processed"
                        onClick={() => handleDownload('processed')}
                    >
                        <i className="fas fa-download"></i> Download Processed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComparisonToggle;