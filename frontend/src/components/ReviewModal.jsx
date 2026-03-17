// src/components/ReviewModal.jsx
import React, { useState, useEffect } from 'react';

const ReviewModal = ({ isOpen, onClose, onAddReview }) => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            resetForm();
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const resetForm = () => {
        setName('');
        setRating(0);
        setReview('');
        setHoverRating(0);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (!review.trim()) {
            newErrors.review = 'Review is required';
        } else if (review.trim().length < 10) {
            newErrors.review = 'Review must be at least 10 characters';
        } else if (review.trim().length > 500) {
            newErrors.review = 'Review cannot exceed 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newReview = {
            id: Date.now(),
            name: name.trim(),
            rating: rating,
            review: review.trim(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        onAddReview(newReview);
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Inline styles to force modal to show
    const modalStyle = {
        display: 'flex',
        position: 'fixed',
        zIndex: 2000,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const modalContentStyle = {
        background: 'white',
        padding: '2.5rem',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        animation: 'slideUp 0.3s ease'
    };

    const closeStyle = {
        position: 'absolute',
        top: '1rem',
        right: '1.5rem',
        fontSize: '2rem',
        cursor: 'pointer',
        color: '#718096',
        transition: 'all 0.3s ease',
        lineHeight: '1'
    };

    return (
        <div style={modalStyle} onClick={handleOverlayClick}>
            <div style={modalContentStyle}>
                <span style={closeStyle} onClick={onClose}>&times;</span>
                
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-pen" style={{ color: '#667eea' }}></i> Write a Review
                </h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Your Name <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: `2px solid ${errors.name ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                        {errors.name && (
                            <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.3rem', display: 'block' }}>{errors.name}</span>
                        )}
                    </div>

                    {/* Rating Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Your Rating <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.8rem' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={star <= (hoverRating || rating) ? 'fas fa-star' : 'far fa-star'}
                                        style={{ color: star <= (hoverRating || rating) ? '#fbbf24' : '#e2e8f0', cursor: 'pointer' }}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    ></i>
                                ))}
                            </div>
                            <span style={{ color: '#718096' }}>
                                {rating === 0 && 'Click to rate'}
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </span>
                        </div>
                        {errors.rating && (
                            <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.3rem', display: 'block' }}>{errors.rating}</span>
                        )}
                    </div>

                    {/* Review Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Your Review <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your experience..."
                            rows="5"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: `2px solid ${errors.review ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontFamily: 'inherit'
                            }}
                        ></textarea>
                        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#718096', marginTop: '0.3rem' }}>
                            {review.length}/500 characters
                        </div>
                        {errors.review && (
                            <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.3rem', display: 'block' }}>{errors.review}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        <i className="fas fa-paper-plane"></i> Submit Review
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <p style={{ color: '#718096', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        Your review will help others discover our free tool!
                        <i className="fas fa-smile" style={{ color: '#f59e0b' }}></i>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;