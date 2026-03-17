// src/components/ContactForm.jsx
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
    const formRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

    // Your EmailJS credentials
    const SERVICE_ID = 'service_u3x4yai';
    const TEMPLATE_ID = 'template_zry8nms';
    const PUBLIC_KEY = 'WvTiyDx6fLBdm4Hm2';

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        emailjs.sendForm(
            SERVICE_ID, 
            TEMPLATE_ID, 
            formRef.current, 
            PUBLIC_KEY
        )
        .then((result) => {
            console.log('Email sent:', result.text);
            setSubmitStatus('success');
            formRef.current.reset();
            setIsSubmitting(false);
            
            setTimeout(() => setSubmitStatus(null), 5000);
        })
        .catch((error) => {
            console.error('Email error:', error.text);
            setSubmitStatus('error');
            setIsSubmitting(false);
            
            setTimeout(() => setSubmitStatus(null), 5000);
        });
    };

    return (
        <div className="contact-form-container">
            {/* Success Message */}
            {submitStatus === 'success' && (
                <div className="form-success">
                    <i className="fas fa-check-circle"></i>
                    <div>
                        <h4>Message Sent!</h4>
                        <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    </div>
                    <button 
                        type="button" 
                        className="close-success"
                        onClick={() => setSubmitStatus(null)}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
                <div className="form-error">
                    <i className="fas fa-exclamation-circle"></i>
                    <div>
                        <h4>Something went wrong</h4>
                        <p>Please try again or email us directly at noiseremover.com@gmail.com</p>
                    </div>
                    <button 
                        type="button" 
                        className="close-error"
                        onClick={() => setSubmitStatus(null)}
                    >
                        &times;
                    </button>
                </div>
            )}

            <form ref={formRef} onSubmit={sendEmail} className="contact-form">
                {/* Full Name (Single Field - Easier for EmailJS) */}
                <div className="form-group">
                    <label htmlFor="from_name">
                        Full Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="from_name"
                        name="from_name"
                        placeholder="John Doe"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="from_email">
                        Email Address <span className="required">*</span>
                    </label>
                    <input
                        type="email"
                        id="from_email"
                        name="from_email"
                        placeholder="john.doe@example.com"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Subject - IMPORTANT: Your template uses subject */}
                <div className="form-group">
                    <label htmlFor="subject">
                        Subject <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="What is this about?"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Message */}
                <div className="form-group">
                    <label htmlFor="message">
                        Message / Suggestion <span className="required">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can improve or ask your question..."
                        rows="5"
                        required
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Sending...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                Send Message
                            </>
                        )}
                    </button>
                </div>

                {/* Email Fallback Note */}
                <div className="form-note">
                    <i className="fas fa-info-circle"></i>
                    <span>
                        Prefer email? Write to us directly at{' '}
                        <a href="mailto:noiseremover.com@gmail.com">
                            noiseremover.com@gmail.com
                        </a>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;