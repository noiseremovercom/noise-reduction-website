// src/components/VersionSelector.jsx
import React, { useState, useEffect } from 'react';
import './VersionSelector.css';

const VersionSelector = ({ 
    versions, 
    selectedVersion, 
    onVersionChange, 
    versionInfo,
    disabled = false 
}) => {
    const [showInfo, setShowInfo] = useState(false);
    const [localVersions, setLocalVersions] = useState([]);

    useEffect(() => {
        if (versions && versions.length > 0) {
            setLocalVersions(versions);
        } else {
            const fallbackVersions = [
                { id: 'SE v1.0', label: '✨ SE v1.0 - Studio Quality', strength: 1.5 },
                { id: 'NR v4.0', label: '🔊 NR v4.0 - High Noise Reduction', strength: 1.2 },
                { id: 'NR v2.4', label: '🎵 NR v2.4 - Balanced', strength: 1.0 },
                { id: 'NR v2.1.1', label: '🎧 NR v2.1.1 - Clear Voice', strength: 0.8 }
            ];
            setLocalVersions(fallbackVersions);
        }
    }, [versions]);

    // DISPLAY VALUES ONLY
    const versionDetails = {
        'SE v1.0': {
            icon: '✨',
            color: '#9f7aea',
            description: 'High (1.5) – 99% Noise Reduction - Studio Quality - No Mic Needed ',
            longDescription: 'Perfect for professional podcasts. Advanced processing with up to 99% noise reduction, delivering excellent results even without using a professional microphone. 🎙️',
            badge: 'PROFESSIONAL'
        },
        'NR v4.0': {
            icon: '🔊',
            color: '#667eea',
            description: 'Medium (1.2) - 95% Noise Reduction - Studio Quality - No Mic Needed',
            longDescription: 'Ideal for YouTube and vlog creators. Just upload audio—no mic needed. Enjoy noise-free sound. 🎥🎙️. ',
            badge: 'Essential'
        },
        'NR v2.4': {
            icon: '🎵',
            color: '#48bb78',
            description: 'Medium (1.0) – 90% Noise Reduction. Best for removing noise when using a microphone. 🎙️',
            longDescription: '90% Noise Reduction – Best for podcast microphones and users removing noise while recording with a mic.',
            badge: 'STANDARD'
        },
        'NR v2.1.1': {
            icon: '🎧',
            color: '#ed8936',
            description: 'Low (0.8) - 85% noise reduction - Best For Noise Reduction Mics',
            longDescription: 'Ideal for mic users. Light processing preserves natural sound and delivers clear, crisp voice quality. 🎙️',
            badge: 'NATURAL'
        }
    };

    const getVersionStyle = (versionId) => {
        const details = versionDetails[versionId] || versionDetails['SE v1.0'];
        return {
            borderLeftColor: details.color,
            backgroundColor: `${details.color}10`
        };
    };

    const handleVersionChange = (e) => {
        onVersionChange(e.target.value);
    };

    const displayVersions = localVersions.length > 0 ? localVersions : versions;

    return (
        <div className="version-selector-container">
            <div className="version-selector-header">
                <label htmlFor="version-select">
                    <i className="fas fa-microchip"></i> Select AI Model:
                </label>
                <button 
                    className="info-toggle-btn"
                    onClick={() => setShowInfo(!showInfo)}
                    type="button"
                >
                    <i className={`fas fa-${showInfo ? 'times' : 'info-circle'}`}></i>
                </button>
            </div>

            <div className="version-selector-wrapper">
                <select
                    id="version-select"
                    value={selectedVersion || 'SE v1.0'}
                    onChange={handleVersionChange}
                    disabled={disabled}
                    className="version-select"
                >
                    {displayVersions.map((version) => (
                        <option key={version.id} value={version.id}>
                            {version.label || version.id}
                        </option>
                    ))}
                </select>
                
                {selectedVersion && (
                    <div className="selected-version-badge" style={getVersionStyle(selectedVersion)}>
                        <span className="version-icon">{versionDetails[selectedVersion]?.icon || '🎯'}</span>
                        <span className="version-name">{selectedVersion}</span>
                        {versionDetails[selectedVersion]?.badge && (
                            <span className="version-badge">{versionDetails[selectedVersion].badge}</span>
                        )}
                    </div>
                )}
            </div>

            {showInfo && (
                <div className="version-info-panel">
                    <h4>Available AI Models</h4>
                    <div className="version-grid">
                        {displayVersions.map((version) => {
                            const details = versionDetails[version.id] || {
                                icon: '🎯',
                                color: '#718096',
                                description: 'AI-powered noise reduction'
                            };
                            return (
                                <div 
                                    key={version.id} 
                                    className={`version-card ${selectedVersion === version.id ? 'selected' : ''}`}
                                    onClick={() => !disabled && onVersionChange(version.id)}
                                    style={{ borderTopColor: details.color }}
                                >
                                    <div className="version-card-header">
                                        <span className="version-card-icon">{details.icon}</span>
                                        <span className="version-card-title">{version.id}</span>
                                        {details.badge && (
                                            <span className="version-card-badge" style={{ backgroundColor: details.color }}>
                                                {details.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="version-card-description">{details.description}</p>
                                    <p className="version-card-long">{details.longDescription}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {versionInfo && (
                <div className="version-stats">
                    <div className="stat-item">
                        <span className="stat-label">Processing Power</span>
                        <span className="stat-value">
                            {versionInfo.id === 'SE v1.0' ? 'High (1.5)' :
                             versionInfo.id === 'NR v4.0' ? 'Medium (1.2)' :
                             versionInfo.id === 'NR v2.4' ? 'Medium (1.0)' : 
                             'Low (0.8)'}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Noise Reduction</span>
                        <span className="stat-value">
                            {versionInfo.id === 'SE v1.0' ? '99%' :
                             versionInfo.id === 'NR v4.0' ? '95%' :
                             versionInfo.id === 'NR v2.4' ? '90%' : '85%'}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Voice Clarity</span>
                        <span className="stat-value">
                            {versionInfo.id === 'SE v1.0' ? 'Studio' :
                             versionInfo.id === 'NR v4.0' ? 'Crispy' :
                             versionInfo.id === 'NR v2.4' ? 'Clear' : 'Natural'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VersionSelector;