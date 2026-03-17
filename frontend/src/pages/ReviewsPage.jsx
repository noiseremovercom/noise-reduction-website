// src/pages/ReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewModal from '../components/ReviewModal';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'highest', 'lowest'

    // Load reviews from localStorage
    useEffect(() => {
        const savedReviews = localStorage.getItem('noiseRemoverReviews');
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        }
    }, []);

    // Sort reviews based on selected option
    const getSortedReviews = () => {
        let sorted = [...reviews];
        switch(sortBy) {
            case 'highest':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return sorted.sort((a, b) => a.rating - b.rating);
            case 'newest':
            default:
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    };

    const handleAddReview = (newReview) => {
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem('noiseRemoverReviews', JSON.stringify(updatedReviews));
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingCount = (rating) => {
        return reviews.filter(review => review.rating === rating).length;
    };

    const sortedReviews = getSortedReviews();

    return (
        <>
            <Header />
            
            <main className="reviews-page">
                <div className="container">
                    {/* Page Header */}
                    <div className="reviews-page-header">
                        <h1>Customer Reviews</h1>
                        <p>See what our users are saying about Noise-Remover.com</p>
                    </div>

                    {/* Rating Summary */}
                    {reviews.length > 0 && (
                        <div className="rating-summary">
                            <div className="average-rating">
                                <span className="big-rating">{calculateAverageRating()}</span>
                                <span className="out-of">/5</span>
                                <div className="summary-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <i 
                                            key={i}
                                            className={i < Math.round(calculateAverageRating()) ? 'fas fa-star' : 'far fa-star'}
                                        ></i>
                                    ))}
                                </div>
                                <span className="total-reviews">Based on {reviews.length} reviews</span>
                            </div>
                            
                            <div className="rating-breakdown">
                                {[5,4,3,2,1].map(rating => (
                                    <div key={rating} className="rating-row">
                                        <span className="rating-label">{rating} stars</span>
                                        <div className="rating-bar-container">
                                            <div 
                                                className="rating-bar"
                                                style={{ width: `${(getRatingCount(rating) / reviews.length) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="rating-count">{getRatingCount(rating)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="reviews-controls">
                        <div className="reviews-count">
                            <strong>{reviews.length}</strong> {reviews.length === 1 ? 'Review' : 'Reviews'}
                        </div>
                        
                        <div className="sort-controls">
                            <label htmlFor="sort">Sort by:</label>
                            <select 
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="highest">Highest Rating</option>
                                <option value="lowest">Lowest Rating</option>
                            </select>
                        </div>
                        
                        <button 
                            className="write-review-btn"
                            onClick={() => setIsReviewModalOpen(true)}
                        >
                            <i className="fas fa-pen"></i> Write a Review
                        </button>
                    </div>

                    {/* Reviews Grid */}
                    {reviews.length === 0 ? (
                        <div className="no-reviews">
                            <i className="fas fa-comment-dots"></i>
                            <h3>No reviews yet</h3>
                            <p>Be the first to share your experience!</p>
                            <button 
                                className="write-review-btn large"
                                onClick={() => setIsReviewModalOpen(true)}
                            >
                                Write a Review
                            </button>
                        </div>
                    ) : (
                        <div className="reviews-full-grid">
                            {sortedReviews.map((review) => (
                                <div key={review.id} className="review-full-card">
                                    <div className="review-header">
                                        <div className="review-stars">
                                            {[...Array(5)].map((_, i) => (
                                                <i 
                                                    key={i} 
                                                    className={i < review.rating ? 'fas fa-star' : 'far fa-star'}
                                                ></i>
                                            ))}
                                        </div>
                                        <span className="review-date">{review.date}</span>
                                    </div>
                                    <p className="review-text">"{review.review}"</p>
                                    <p className="review-author">- {review.name}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Back to Home Link */}
                    <div className="back-to-home">
                        <Link to="/#reviews">
                            <i className="fas fa-arrow-left"></i> Back to Homepage
                        </Link>
                    </div>
                </div>
            </main>

            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onAddReview={handleAddReview}
            />

            <Footer />
        </>
    );
};

export default ReviewsPage;