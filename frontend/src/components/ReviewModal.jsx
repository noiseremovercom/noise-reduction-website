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

    return (
        <div className="modal show" onClick={handleOverlayClick}>
            <div className="modal-content">
                <span className="close-modal" onClick={onClose}>&times;</span>
                
                <h2>
                    <i className="fas fa-pen"></i> Write a Review
                </h2>
                
                <form className="review-form" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="form-group">
                        <label>
                            Your Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && (
                            <span className="error-message">{errors.name}</span>
                        )}
                    </div>

                    {/* Rating Field */}
                    <div className="form-group">
                        <label>
                            Your Rating <span className="required">*</span>
                        </label>
                        <div className="star-rating-container">
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={star <= (hoverRating || rating) ? 'fas fa-star' : 'far fa-star'}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    ></i>
                                ))}
                            </div>
                            <span className="rating-text">
                                {rating === 0 && 'Click to rate'}
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </span>
                        </div>
                        <div className="rating-hint">
                            <i className="fas fa-star-of-life"></i> Click on stars to rate
                        </div>
                        {errors.rating && (
                            <span className="error-message">{errors.rating}</span>
                        )}
                    </div>

                    {/* Review Field */}
                    <div className="form-group">
                        <label>
                            Your Review <span className="required">*</span>
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your experience..."
                            rows="5"
                            className={errors.review ? 'error' : ''}
                        ></textarea>
                        <div className={`char-counter ${review.length > 450 ? (review.length > 480 ? 'danger' : 'warning') : ''}`}>
                            {review.length}/500 characters
                            {review.length > 450 && review.length <= 480 && ' (Getting close to limit)'}
                            {review.length > 480 && ' (Almost at limit!)'}
                        </div>
                        {errors.review && (
                            <span className="error-message">{errors.review}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-review-btn">
                        <i className="fas fa-paper-plane"></i> Submit Review
                    </button>
                </form>

                <div className="modal-footer">
                    <p>
                        Your review will help others discover our free tool!
                        <i className="fas fa-smile"></i>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;