import React from 'react';

const Sitemap = () => {
  return (
    <div className="container" style={{ padding: '4rem 0', minHeight: '60vh', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>Sitemap</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        <div>
          <h3 style={{ color: '#7C3AED', marginBottom: '1rem' }}>Main Pages</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="/">Home</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/how-it-works">How It Works</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/features">Features</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/reviews">Reviews</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/contact">Contact Us</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/blog">Blog</a></li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ color: '#7C3AED', marginBottom: '1rem' }}>Legal</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="/privacy-policy">Privacy Policy</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/terms-of-service">Terms of Service</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/cookie-policy">Cookie Policy</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/disclaimer">Disclaimer</a></li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ color: '#7C3AED', marginBottom: '1rem' }}>Tools</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="/#upload">Noise Reducer Tool</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/sitemap">Sitemap</a></li>
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default Sitemap;
