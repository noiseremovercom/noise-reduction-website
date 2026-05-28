// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Logo and Brand Section */}
                    <div className="footer-brand">
                        <div className="footer-logo" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
                            <span className="logo-icon">🎧</span>
                            <span className="logo-text">Noise-Remover.com</span>
                        </div>
                        <p className="footer-description">
                            Free AI-powered noise reduction tool. Remove background noise from audio and video instantly.
                            No watermark, no hidden costs, unlimited processing.
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/#home">Home</Link></li>
                            <li><Link to="/#how-it-works">How It Works</Link></li>
                            <li><Link to="/#features">Features</Link></li>
                            <li><Link to="/#reviews">Reviews</Link></li>
                            <li><Link to="/#contact">Contact Us</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div className="footer-legal">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service">Terms of Service</Link></li>
                            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
                            <li><Link to="/disclaimer">Disclaimer</Link></li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div className="footer-social">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a 
                                href="https://facebook.com/noiseremover" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="Facebook"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a 
                                href="https://twitter.com/noiseremover" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="Twitter"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a 
                                href="https://instagram.com/noiseremover" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="Instagram"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a 
                                href="https://youtube.com/@noiseremover" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="YouTube"
                            >
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a 
                                href="https://linkedin.com/company/noiseremover" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="LinkedIn"
                            >
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a 
                                href="https://github.com/noiseremover" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label="GitHub"
                            >
                                <i className="fab fa-github"></i>
                            </a>
                        </div>

                        {/* Contact Email */}
                        <div className="footer-contact">
                            <p>
                                <i className="fas fa-envelope"></i>{' '}
                                <a href="mailto:noiseremover.com@gmail.com">
                                    noiseremover.com@gmail.com
                                </a>
                            </p>
                        </div>

                        {/* Copyright */}
                        <p className="copyright">
                            © {currentYear} Noise-Remover.com. All rights reserved.
                        </p>
                        
                        {/* Made with love */}
                        <p className="made-with">
                            Made with <i className="fas fa-heart"></i> for crystal clear audio
                        </p>
                    </div>
                </div>

                {/* Bottom Bar with Additional Links */}
                <div className="footer-bottom">
                    <div className="footer-bottom-links">
                        <Link to="/sitemap">Sitemap</Link>
                        <span className="separator">|</span>
                        <Link to="/accessibility">Accessibility</Link>
                        <span className="separator">|</span>
                        <Link to="/cookies">Cookie Settings</Link>
                        <span className="separator">|</span>
                        <Link to="/contact">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;