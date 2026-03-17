// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();
    const isBlogPage = location.pathname === '/blog';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // Prevent scrolling when menu is open on mobile
        document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    const scrollToSection = (sectionId) => {
        closeMenu();
        
        // If we're on blog page, navigate to home first
        if (isBlogPage) {
            window.location.href = `/#${sectionId}`;
            return;
        }
        
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80; // Height of fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            setActiveSection(sectionId);
        }
    };

    // Update active section based on scroll position
    useEffect(() => {
        if (isBlogPage) return;

        const handleScroll = () => {
            const sections = ['home', 'how-it-works', 'features', 'reviews', 'contact'];
            const headerOffset = 100;
            
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { top, bottom } = element.getBoundingClientRect();
                    if (top <= headerOffset && bottom > headerOffset) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isBlogPage]);

    // Handle hash links when coming from blog page
    useEffect(() => {
        if (location.hash && !isBlogPage) {
            const sectionId = location.hash.substring(1); // Remove the #
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 100);
        }
    }, [location, isBlogPage]);

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'how-it-works', label: 'How It Works' },
        { id: 'features', label: 'Features' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'contact', label: 'Contact Us' }
    ];

    return (
        <header className="header">
            <div className="container">
                <nav className="navbar">
                    {/* Logo */}
                    <div className="logo">
                        <Link to="/" onClick={closeMenu}>
                            <span className="logo-icon">🎧</span>
                            <span className="logo-text">Noise-Remover.com</span>
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        {navItems.map((item) => (
                            <li key={item.id} className="nav-item">
                                {isBlogPage ? (
                                    <Link
                                        to={`/#${item.id}`}
                                        className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                                        onClick={closeMenu}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <a
                                        href={`#${item.id}`}
                                        className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(item.id);
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                )}
                            </li>
                        ))}
                        
                        {/* Blog Link - Always goes to blog page */}
                        <li className="nav-item">
                            <Link
                                to="/blog"
                                className={`nav-link ${isBlogPage ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                Blogs
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Toggle */}
                    <div 
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
                        onClick={toggleMenu}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;