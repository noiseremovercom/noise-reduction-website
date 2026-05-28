// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import ReviewModal from '../components/ReviewModal';
import ContactForm from '../components/ContactForm';
import DemoPlayer from '../components/DemoPlayer';
import VersionSelector from '../components/VersionSelector';
import ComparisonToggle from '../components/ComparisonToggle';
import { processAudio, checkHealth, getVersions } from '../services/api';

const HomePage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processingStatus, setProcessingStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [processedAudio, setProcessedAudio] = useState(null);
    const [originalAudioBlob, setOriginalAudioBlob] = useState(null);
    const [error, setError] = useState(null);
    const [apiStatus, setApiStatus] = useState('checking');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    
    // Version selection state
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState('SE v1.0');
    const [versionInfo, setVersionInfo] = useState(null);

    const [reviews, setReviews] = useState([]);

    // Load reviews from localStorage
    useEffect(() => {
        const savedReviews = localStorage.getItem('noiseRemoverReviews');
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        } else {
            const defaultReviews = [
                {
                    id: 1,
                    name: 'Sarah J.',
                    rating: 5,
                    review: 'This tool saved my podcast! Background noise disappeared completely. Best free tool I\'ve ever used.',
                    date: 'March 12, 2026'
                },
                {
                    id: 2,
                    name: 'Prof. Michael Chen',
                    rating: 5,
                    review: 'I record lectures for my students and this makes my recordings sound professional. Thank you!',
                    date: 'March 10, 2026'
                },
                {
                    id: 3,
                    name: 'David R.',
                    rating: 4,
                    review: 'Removed traffic noise from my vlog footage perfectly. Easy to use and completely free!',
                    date: 'March 8, 2026'
                }
            ];
            setReviews(defaultReviews);
            localStorage.setItem('noiseRemoverReviews', JSON.stringify(defaultReviews));
        }
    }, []);

    // Save reviews to localStorage
    useEffect(() => {
        if (reviews.length > 0) {
            localStorage.setItem('noiseRemoverReviews', JSON.stringify(reviews));
        }
    }, [reviews]);

    // Check API health and load versions
    useEffect(() => {
        const initializeApi = async () => {
            try {
                await checkHealth();
                setApiStatus('online');
                
                // Load available versions
                const versionsData = await getVersions();
                setVersions(versionsData.versions || []);
                if (versionsData.versions && versionsData.versions.length > 0) {
                    setSelectedVersion(versionsData.versions[0].id);
                }
            } catch (err) {
                setApiStatus('offline');
                console.error('API health check failed:', err);
            }
        };
        initializeApi();
    }, []);

    // Update version info when selection changes
    useEffect(() => {
        const version = versions.find(v => v.id === selectedVersion);
        setVersionInfo(version);
    }, [selectedVersion, versions]);

    const demos = [
        {
            id: 'fan',
            title: 'Fan Noise',
            before: '/samples/fan-before.mp3',
            after: '/samples/fan-after.mp3'
        },
        {
            id: 'dog',
            title: 'Dog Barking',
            before: '/samples/dog-before.mp3',
            after: '/samples/dog-after.mp3'
        },
        {
            id: 'car',
            title: 'Car Traffic',
            before: '/samples/car-before.mp3',
            after: '/samples/car-after.mp3'
        }
    ];

    const handleFileUpload = (file) => {
        setSelectedFile(file);
        setProcessedAudio(null);
        setOriginalAudioBlob(null);
        setError(null);
        setProcessingStatus('idle');
        setShowComparison(false);
    };

    const handleProcess = async () => {
        if (!selectedFile) return;

        try {
            setProcessingStatus('uploading');
            setError(null);
            
            // Store original file for comparison
            const originalBlob = new Blob([selectedFile], { type: selectedFile.type });
            setOriginalAudioBlob(originalBlob);
            
            const result = await processAudio(selectedFile, selectedVersion, (uploadProgress) => {
                setProgress(uploadProgress);
                if (uploadProgress === 100) {
                    setProcessingStatus('processing');
                }
            });

            setProgress(100);
            setProcessingStatus('completed');
            
            const audioUrl = URL.createObjectURL(result);
            setProcessedAudio({
                url: audioUrl,
                blob: result,
                fileName: `enhanced_${selectedFile.name.replace(/\.[^/.]+$/, '')}.wav`
            });

        } catch (err) {
            setProcessingStatus('error');
            setError(err.message);
            console.error('Processing error:', err);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setProcessedAudio(null);
        setOriginalAudioBlob(null);
        setProcessingStatus('idle');
        setProgress(0);
        setError(null);
        setShowComparison(false);
    };

    const handleAddReview = (newReview) => {
        setReviews([newReview, ...reviews]);
    };

    const handleCompareClick = () => {
        if (originalAudioBlob && processedAudio) {
            setShowComparison(true);
        } else {
            alert('Please process an audio file first');
        }
    };

    const handleCloseComparison = () => {
        setShowComparison(false);
    };

    // Get only first 6 reviews for homepage
    const displayedReviews = reviews.slice(0, 6);
    const hasMoreReviews = reviews.length > 6;

    const faqs = [
        {
            question: "How to remove background noise from video?",
            answer: "Simply upload your video file to our tool, click 'Remove Background Noise,' and download the cleaned version. Our AI automatically detects and removes background noise while preserving the original audio quality. We support MP4, MOV, WEBM, and other common video formats."
        },
        {
            question: "How to remove background noise from audio?",
            answer: "Upload your audio file (MP3, WAV, M4A, FLAC, AAC, etc.), let our AI process it, and download the clean result. It takes just seconds and works perfectly for podcasts, recordings, music, and more. 100% free with no watermark."
        },
        {
            question: "How to reduce noise in video?",
            answer: "Our tool supports video files too! Upload your video, and we'll remove background noise from the audio track while keeping the video quality intact. Perfect for vlogs, interviews, YouTube content, and professional video production."
        },
        {
            question: "How can we reduce noise pollution?",
            answer: "While we can't solve real-world noise pollution, our tool can help clean up recordings affected by environmental noise like traffic, construction, crowds, or wind. It's perfect for field recordings, outdoor interviews, and location sound."
        },
        {
            question: "How to reduce background noise in video?",
            answer: "Same as audio! Upload your video, and our AI will process the audio track to remove background noise. We support MP4, MOV, WEBM, and other common video formats. The video quality remains unchanged while the audio becomes crystal clear."
        },
        {
            question: "Is there a free AI tool to clean audio?",
            answer: "Yes! Noise-Remover.com is completely free with no hidden costs. Use it unlimited times with no watermarks, no restrictions, and no account required. Just upload and download!"
        },
        {
            question: "What is the best background noise eliminator?",
            answer: "Our AI-powered tool is consistently rated as one of the best free options available. It uses advanced deep learning to remove noise while preserving voice quality. Try it yourself and hear the difference!"
        },
        {
            question: "How to remove unwanted audio noise?",
            answer: "Upload your file, click 'Remove Background Noise,' and our AI handles everything automatically. No technical knowledge required! We remove static, hums, background chatter, traffic noise, wind, and more."
        },
        {
            question: "How to clean an audio file from noise?",
            answer: "Simply use our tool! We remove static, hums, background chatter, traffic noise, and more while preserving voice clarity. It's perfect for cleaning up old recordings, podcasts, interviews, and music."
        },
        {
            question: "How to make audio clearer online for free?",
            answer: "Noise-Remover.com is the perfect solution. Our AI not only removes noise but also enhances clarity and boosts volume. Just upload, process, and download - completely free!"
        }
    ];

    return (
        <>
            <Header />
            
            <main>
                {/* SECTION 1: HOME / HERO */}
                <section id="home" className="hero-section">
                    <div className="container">
                        <div className="hero-content">
                            <h1 className="hero-title">
                                Remove Background Noise From Audio & Video – Free AI Noise Reducer
                            </h1>
                            <p className="hero-subtitle">
                                Clean, enhance, and boost your audio effortlessly for podcasts, videos, and more. 
                                100% free, no watermark, unlimited processing.
                            </p>
                            
                            {/* Demo Players */}
                            <DemoPlayer demos={demos} />
                            
                            {/* API Status Warning */}
                            {apiStatus === 'offline' && (
                                <div className="api-warning">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <span> Cannot connect to processing engine. Please check your connection.</span>
                                </div>
                            )}
                            
                            {/* Tool Container */}
                            <div className="tool-container">
                                <h2><i className="fas fa-magic"></i> Try It Now – Free!</h2>
                                
                                {/* Version Selector Component */}
                                {versions.length > 0 && (
                                    <VersionSelector 
                                        versions={versions}
                                        selectedVersion={selectedVersion}
                                        onVersionChange={setSelectedVersion}
                                        versionInfo={versionInfo}
                                        disabled={processingStatus === 'processing' || processingStatus === 'uploading'}
                                    />
                                )}
                                
                                <FileUploader 
                                    onFileUpload={handleFileUpload}
                                    isProcessing={processingStatus === 'processing' || processingStatus === 'uploading'}
                                />
                                
                                {selectedFile && !processedAudio && processingStatus === 'idle' && (
                                    <button 
                                        onClick={handleProcess}
                                        className="process-button"
                                        disabled={apiStatus !== 'online'}
                                    >
                                        <i className="fas fa-magic button-icon"></i>
                                        Process with {selectedVersion}
                                    </button>
                                )}
                                
                                {/* Progress Bar */}
                                {(processingStatus === 'uploading' || processingStatus === 'processing') && (
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="progress-text">
                                            {processingStatus === 'uploading' ? 'Uploading...' : 'Processing...'} {progress}%
                                        </p>
                                    </div>
                                )}
                                
                                {/* Error Message */}
                                {error && (
                                    <div className="error-message">
                                        <i className="fas fa-exclamation-circle"></i>
                                        <p>{error}</p>
                                        <button onClick={handleReset} className="reset-button">
                                            Try Again
                                        </button>
                                    </div>
                                )}
                                
                                {/* Result Player */}
                                {processedAudio && (
                                    <div className="result-container">
                                        <h3>Your Clean Audio:</h3>
                                        <audio controls src={processedAudio.url}>
                                            Your browser does not support the audio element.
                                        </audio>
                                        
                                        {/* Compare Button */}
                                        {originalAudioBlob && (
                                            <div className="comparison-buttons">
                                                <button 
                                                    className="compare-btn"
                                                    onClick={() => setShowComparison(true)}
                                                >
                                                    <i className="fas fa-waveform"></i> Compare Original vs Processed
                                                </button>
                                            </div>
                                        )}
                                        
                                        <div className="result-buttons">
                                            <a 
                                                href={processedAudio.url} 
                                                download={processedAudio.fileName}
                                                className="download-button"
                                            >
                                                <i className="fas fa-download"></i> Download
                                            </a>
                                            <button onClick={handleReset} className="reset-button">
                                                <i className="fas fa-redo"></i> New File
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: HOW IT WORKS */}
                <section id="how-it-works" className="how-it-works-section">
                    <div className="container">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">
                            Three simple steps to crystal clear audio
                        </p>
                        
                        <div className="steps-grid">
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <i className="fas fa-upload step-icon"></i>
                                <h3>Upload Your File</h3>
                                <p>
                                    Drag and drop or browse to select your audio or video file. 
                                    We support all major formats up to 50MB.
                                </p>
                            </div>
                            
                            <div className="step-card">
                                <div className="step-number">2</div>
                                <i className="fas fa-microchip step-icon"></i>
                                <h3>Choose Your Version</h3>
                                <p>
                                    Select from our AI models: SE v1.0 for studio quality, 
                                    NR v4.0 for crispy clear voice, or balanced options.
                                </p>
                            </div>
                            
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <i className="fas fa-download step-icon"></i>
                                <h3>Download & Compare</h3>
                                <p>
                                    Download your clean audio and compare with original 
                                    using our built-in comparison tool.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: FEATURES */}
                <section id="features" className="features-section">
                    <div className="container">
                        <h2 className="section-title">Why Choose Noise-Remover.com?</h2>
                        <p className="section-subtitle">
                            The best free AI noise reduction tool online
                        </p>
                        
                        <div className="features-grid">
                            <div className="feature-card">
                                <i className="fas fa-brain feature-icon"></i>
                                <h3>AI-Powered Noise Reduction</h3>
                                <p>
                                    Eliminate distractions like traffic, wind, fans, and background 
                                    chatter with advanced AI.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <i className="fas fa-volume-up feature-icon"></i>
                                <h3>Audio Enhancer</h3>
                                <p>
                                    Not just noise removal – we enhance clarity and boost volume 
                                    for professional results.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <i className="fas fa-film feature-icon"></i>
                                <h3>Video Noise Removal</h3>
                                <p>
                                    Remove background noise from video files too. Perfect for 
                                    content creators and vloggers.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <i className="fas fa-infinity feature-icon"></i>
                                <h3>Completely Free</h3>
                                <p>
                                    No credit card, no hidden fees, no watermarks. Unlimited 
                                    processing forever.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <i className="fas fa-lock feature-icon"></i>
                                <h3>Private & Secure</h3>
                                <p>
                                    Your files are processed securely and automatically deleted 
                                    after 1 hour.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <i className="fas fa-bolt feature-icon"></i>
                                <h3>Multiple AI Models</h3>
                                <p>
                                    Choose from SE v1.0, NR v4.0, NR v2.4, and NR v2.1.1 – 
                                    each optimized for different needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: REVIEWS */}
                <section id="reviews" className="reviews-section">
                    <div className="container">
                        <div className="reviews-header">
                            <h2 className="section-title">What Our Users Are Saying</h2>
                            <p className="section-subtitle">
                                Join thousands of satisfied content creators
                            </p>
                            <button 
                                className="write-review-btn"
                                onClick={() => setIsReviewModalOpen(true)}
                            >
                                <i className="fas fa-pen"></i> Write a Review
                            </button>
                        </div>
                        
                        <div className="reviews-grid">
                            {displayedReviews.map((review) => (
                                <div key={review.id} className="review-card">
                                    <div className="review-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <i 
                                                key={i} 
                                                className={i < review.rating ? 'fas fa-star' : 'far fa-star'}
                                            ></i>
                                        ))}
                                    </div>
                                    <p className="review-text">"{review.review}"</p>
                                    <p className="review-author">- {review.name}</p>
                                    <p className="review-date">{review.date}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* View All Reviews Button */}
                        {hasMoreReviews && (
                            <div className="view-all-container">
                                <Link to="/reviews" className="view-all-btn">
                                    View All Reviews ({reviews.length})
                                    <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 5: CONTACT US */}
                <section id="contact" className="contact-section">
                    <div className="container">
                        <h2 className="section-title">Contact Us</h2>
                        <p className="section-subtitle">Have questions? We'd love to hear from you</p>
                        
                        <div className="contact-container">
                            <div className="contact-info">
                                <h3>Get in Touch</h3>
                                <p>
                                    <i className="fas fa-envelope"></i>
                                    <a href="mailto:noiseremover.com@gmail.com">
                                        noiseremover.com@gmail.com
                                    </a>
                                </p>
                                <p>
                                    <i className="fas fa-clock"></i>
                                    Response time: Within 24 hours
                                </p>
                                <p>
                                    <i className="fas fa-smile"></i>
                                    We value your feedback!
                                </p>
                                <p>
                                    <i className="fas fa-question-circle"></i>
                                    Check our FAQ below for quick answers
                                </p>
                            </div>
                            
                            <ContactForm />
                        </div>
                    </div>
                </section>

                {/* SECTION 6: FAQ */}
                <section className="faq-section">
                    <div className="container">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <p className="section-subtitle">
                            Everything you need to know about noise removal
                        </p>
                        
                        <div className="faq-grid">
                            {faqs.map((faq, index) => (
                                <div key={index} className="faq-item">
                                    <h3>{faq.question}</h3>
                                    <p>{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onAddReview={handleAddReview}
            />

            {/* Comparison Toggle Modal - Clean version without denoise slider */}
            {showComparison && originalAudioBlob && processedAudio && (
                <ComparisonToggle
                    originalAudio={originalAudioBlob}
                    processedAudio={processedAudio.blob}
                    fileName={selectedFile?.name || 'audio.wav'}
                    onClose={handleCloseComparison}
                    currentVersion={selectedVersion}
                />
            )}

            <Footer />
        </>
    );
};

export default HomePage;