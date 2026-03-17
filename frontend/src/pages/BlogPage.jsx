// src/pages/BlogPage.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Blog posts data
    const blogPosts = [
        {
            id: 1,
            title: "How to Remove Background Noise from Podcast Recordings",
            excerpt: "Discover professional techniques to eliminate background chatter, HVAC noise, and room echo from your podcast episodes. Learn why AI noise reduction outperforms traditional filters for podcast production.",
            content: `
                <h2>Introduction</h2>
                <p>Podcasting has become one of the most popular forms of content creation, but poor audio quality can ruin even the most interesting content. Background noise is the number one enemy of podcasters. In this comprehensive guide, we'll show you how to achieve studio-quality sound using AI-powered noise reduction.</p>
                
                <h2>Common Sources of Podcast Noise</h2>
                <p>Before we dive into solutions, let's identify common noise sources: computer fans, HVAC systems, traffic, room echo, keyboard clicks, and background conversations. Each requires a slightly different approach.</p>
                
                <h2>Why AI Noise Reduction Works Best</h2>
                <p>Traditional noise gates and filters often cut off parts of speech or leave artifacts. AI-powered tools like Noise-Remover.com analyze the audio spectrum and intelligently separate speech from noise, preserving natural voice quality while eliminating distractions.</p>
                
                <h2>Step-by-Step Guide</h2>
                <p>1. Upload your raw podcast file<br>2. Let our AI process it (takes 5-10 seconds per minute of audio)<br>3. Download the cleaned version<br>4. Import into your DAW for final adjustments</p>
                
                <h2>Tips for Best Results</h2>
                <p>Record in a treated space, use a quality microphone, maintain consistent distance from the mic, and always record a few seconds of room tone for reference.</p>
            `,
            date: "March 13, 2026",
            author: "Sarah Johnson",
            authorRole: "Audio Engineer",
            authorImage: "https://via.placeholder.com/50x50",
            category: "podcast",
            tags: ["Podcast", "Noise Reduction", "Audio Quality", "Recording Tips"],
            image: "https://via.placeholder.com/800x400",
            readTime: "5 min read",
            views: 1245,
            comments: 23
        },
        {
            id: 2,
            title: "Remove Background Noise from Video: Complete Guide for Creators",
            excerpt: "Whether you're a YouTuber, vlogger, or filmmaker, background noise can ruin your video. This guide shows you how to clean audio in video files without degrading quality.",
            content: `
                <h2>Introduction</h2>
                <p>Video content is everywhere, but great visuals mean nothing without clear audio. Wind noise, traffic, crowds, and equipment hum can make your videos unwatchable. Learn how to salvage your footage with AI noise removal.</p>
                
                <h2>Common Video Audio Problems</h2>
                <p>Location sound is challenging. Wind noise, traffic, crowds, air conditioners, camera motors, and handling noise all plague video recordings. Each requires specific treatment.</p>
                
                <h2>How AI Video Noise Removal Works</h2>
                <p>Our tool processes the audio track separately, leaving video quality untouched. The AI identifies noise patterns and removes them while preserving dialogue, music, and important sound effects.</p>
                
                <h2>Step-by-Step Process</h2>
                <p>1. Upload your video file (MP4, MOV, WEBM supported)<br>2. AI analyzes and processes audio track<br>3. Preview the result<br>4. Download with clean audio</p>
                
                <h2>Pro Tips</h2>
                <p>Use lavalier mics for interviews, record room tone, monitor audio levels, and always backup original files before processing.</p>
            `,
            date: "March 10, 2026",
            author: "Michael Chen",
            authorRole: "Video Producer",
            authorImage: "https://via.placeholder.com/50x50",
            category: "video",
            tags: ["Video Editing", "Noise Reduction", "Vlog Tips", "YouTube"],
            image: "https://via.placeholder.com/800x400",
            readTime: "4 min read",
            views: 2341,
            comments: 45
        },
        {
            id: 3,
            title: "How AI Noise Removal Works: The Technology Behind Clean Audio",
            excerpt: "Understand the science of AI-powered noise reduction. Learn about neural networks, spectral analysis, and why AI beats traditional filters for removing background noise.",
            content: `
                <h2>The Technology Behind AI Noise Reduction</h2>
                <p>Ever wondered how AI can magically remove background noise? It's not magic—it's sophisticated deep learning. This article explains the technology in simple terms.</p>
                
                <h2>Traditional vs AI Methods</h2>
                <p>Traditional noise gates simply cut audio below a threshold, often cutting off speech tails. Spectral subtraction leaves musical artifacts. AI methods use neural networks trained on thousands of hours of clean and noisy audio to understand what speech should sound like.</p>
                
                <h2>How Neural Networks Learn</h2>
                <p>Our models are trained on diverse datasets including podcasts, lectures, meetings, and field recordings. They learn to identify patterns in speech and distinguish them from noise patterns.</p>
                
                <h2>Real-time Processing</h2>
                <p>Modern AI can process audio faster than real-time using optimized neural networks. DeepFilterNet, the technology behind our tool, achieves 3.8 PESQ score—close to professional studio quality.</p>
                
                <h2>Future Developments</h2>
                <p>Research continues into better models, lower latency, and more natural sound. The future of audio processing is AI-driven and accessible to everyone.</p>
            `,
            date: "March 7, 2026",
            author: "Dr. Emily Rodriguez",
            authorRole: "AI Research Scientist",
            authorImage: "https://via.placeholder.com/50x50",
            category: "technology",
            tags: ["AI Technology", "Deep Learning", "Audio Processing", "Neural Networks"],
            image: "https://via.placeholder.com/800x400",
            readTime: "6 min read",
            views: 3567,
            comments: 89
        },
        {
            id: 4,
            title: "Cleaning Audio for Music Production: Remove Noise Without Artifacts",
            excerpt: "Musicians and producers: learn how to remove background noise from recordings while preserving musical details. Tips for cleaning vocals, acoustic instruments, and demos.",
            content: `
                <h2>Introduction</h2>
                <p>Musicians often record in imperfect spaces—bedrooms, garages, practice rooms. Background noise can ruin otherwise great takes. Here's how to clean your recordings professionally.</p>
                
                <h2>Challenges in Music Production</h2>
                <p>Unlike speech, music has complex harmonics, dynamics, and silence between notes. Aggressive noise reduction can kill the life in your recordings. We need a delicate touch.</p>
                
                <h2>Our Approach for Music</h2>
                <p>Our tool offers a "music mode" with lighter processing that preserves transients, harmonics, and reverb tails while reducing background hum and hiss.</p>
                
                <h2>Vocals vs Instruments</h2>
                <p>Vocals require different treatment than acoustic guitars or drums. Learn how to adjust settings for each source type for optimal results.</p>
                
                <h2>Mastering Chain Integration</h2>
                <p>Where noise reduction fits in your mastering chain: typically early, before EQ and compression, but after any corrective processing.</p>
            `,
            date: "March 4, 2026",
            author: "David Williams",
            authorRole: "Music Producer",
            authorImage: "https://via.placeholder.com/50x50",
            category: "music",
            tags: ["Music Production", "Recording", "Studio Tips", "Audio Engineering"],
            image: "https://via.placeholder.com/800x400",
            readTime: "5 min read",
            views: 1876,
            comments: 34
        },
        {
            id: 5,
            title: "Best Free Noise Removal Tools for Remote Workers and Online Meetings",
            excerpt: "Working from home? Clean up your Zoom, Teams, and Slack recordings. Compare free noise reduction tools and learn how to sound professional in every meeting.",
            content: `
                <h2>Introduction</h2>
                <p>Remote work is here to stay, and so is background noise. Dogs barking, kids playing, traffic—all can make you sound unprofessional. Here's how to fix it.</p>
                
                <h2>Real-time vs Post-processing</h2>
                <p>Some tools work in real-time during calls, others process recordings afterward. We'll cover both approaches and when to use each.</p>
                
                <h2>Top Free Tools Compared</h2>
                <p>1. Noise-Remover.com (our tool) - Best quality, unlimited free<br>2. Krisp - Good but limited free minutes<br>3. NVIDIA Broadcast - Requires RTX GPU<br>4. RNNoise - Open source, technical setup required</p>
                
                <h2>Setup Guide</h2>
                <p>How to configure your system for optimal results: microphone placement, room treatment, software settings, and testing.</p>
                
                <h2>Pro Tips for Remote Workers</h2>
                <p>Use a headset, mute when not speaking, choose a quiet room, and always test before important meetings.</p>
            `,
            date: "March 1, 2026",
            author: "Lisa Thompson",
            authorRole: "Remote Work Consultant",
            authorImage: "https://via.placeholder.com/50x50",
            category: "remote-work",
            tags: ["Remote Work", "Meetings", "Productivity", "Work From Home"],
            image: "https://via.placeholder.com/800x400",
            readTime: "4 min read",
            views: 4231,
            comments: 67
        }
    ];

    // Categories for filtering
    const categories = [
        { id: 'all', name: 'All Posts', count: blogPosts.length },
        { id: 'podcast', name: 'Podcast', count: blogPosts.filter(p => p.category === 'podcast').length },
        { id: 'video', name: 'Video', count: blogPosts.filter(p => p.category === 'video').length },
        { id: 'technology', name: 'Technology', count: blogPosts.filter(p => p.category === 'technology').length },
        { id: 'music', name: 'Music', count: blogPosts.filter(p => p.category === 'music').length },
        { id: 'remote-work', name: 'Remote Work', count: blogPosts.filter(p => p.category === 'remote-work').length }
    ];

    // Filter posts based on category and search
    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const [expandedPost, setExpandedPost] = useState(null);

    const handleReadMore = (postId) => {
        setExpandedPost(expandedPost === postId ? null : postId);
        // Scroll to post
        setTimeout(() => {
            document.getElementById(`post-${postId}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    return (
        <>
            <Header />
            
            <main className="blog-page">
                <div className="container">
                    {/* Header Section */}
                    <div className="blog-header">
                        <h1 className="blog-main-title">Noise Reduction Blog</h1>
                        <p className="blog-main-subtitle">
                            Expert guides, tutorials, and insights for crystal clear audio
                        </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="blog-toolbar">
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="category-filters">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.name} ({category.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="blog-results">
                        <p>Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}</p>
                    </div>

                    {/* Blog Posts Grid */}
                    <div className="blog-posts-grid">
                        {filteredPosts.map(post => (
                            <article 
                                key={post.id} 
                                id={`post-${post.id}`}
                                className={`blog-post-card ${expandedPost === post.id ? 'expanded' : ''}`}
                            >
                                {/* Post Image */}
                                <div className="post-image">
                                    <img src={post.image} alt={post.title} />
                                    <span className="post-category">{post.category}</span>
                                    <span className="post-read-time">{post.readTime}</span>
                                </div>

                                {/* Post Content */}
                                <div className="post-content">
                                    <div className="post-meta">
                                        <span className="post-date">
                                            <i className="far fa-calendar"></i> {post.date}
                                        </span>
                                        <span className="post-views">
                                            <i className="far fa-eye"></i> {post.views}
                                        </span>
                                        <span className="post-comments">
                                            <i className="far fa-comment"></i> {post.comments}
                                        </span>
                                    </div>

                                    <h2 className="post-title">{post.title}</h2>
                                    
                                    <div className="post-excerpt">
                                        {expandedPost === post.id ? (
                                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                                        ) : (
                                            <p>{post.excerpt}</p>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div className="post-tags">
                                        {post.tags.map(tag => (
                                            <span 
                                                key={tag} 
                                                className="post-tag"
                                                onClick={() => setSearchQuery(tag)}
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Author Info */}
                                    <div className="post-author">
                                        <img src={post.authorImage} alt={post.author} />
                                        <div className="author-info">
                                            <span className="author-name">{post.author}</span>
                                            <span className="author-role">{post.authorRole}</span>
                                        </div>
                                        <button 
                                            className="read-more-btn"
                                            onClick={() => handleReadMore(post.id)}
                                        >
                                            {expandedPost === post.id ? 'Show Less' : 'Read Full Article'}
                                            <i className={`fas fa-chevron-${expandedPost === post.id ? 'up' : 'down'}`}></i>
                                        </button>
                                    </div>

                                    {/* Share Buttons (shown when expanded) */}
                                    {expandedPost === post.id && (
                                        <div className="post-share">
                                            <span>Share this article:</span>
                                            <div className="share-icons">
                                                <a href="#" className="share-icon facebook">
                                                    <i className="fab fa-facebook-f"></i>
                                                </a>
                                                <a href="#" className="share-icon twitter">
                                                    <i className="fab fa-twitter"></i>
                                                </a>
                                                <a href="#" className="share-icon linkedin">
                                                    <i className="fab fa-linkedin-in"></i>
                                                </a>
                                                <a href="#" className="share-icon email">
                                                    <i className="fas fa-envelope"></i>
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredPosts.length === 0 && (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <h3>No articles found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                            <button 
                                className="reset-btn"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination (for future use) */}
                    {filteredPosts.length > 0 && (
                        <div className="blog-pagination">
                            <button className="pagination-btn" disabled>Previous</button>
                            <span className="pagination-current">Page 1</span>
                            <button className="pagination-btn">Next</button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
};

export default BlogPage;