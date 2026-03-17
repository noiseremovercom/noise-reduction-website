import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <>
            <Header />
            <div className="legal-page">
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last Updated: March 2026</p>

                    <section>
                        <h2>1. Introduction</h2>
                        <p>Noise-Remover.com ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        
                        <h3>2.1 Audio Files</h3>
                        <p>When you use our noise reduction service, you upload audio or video files. These files are processed temporarily and automatically deleted from our servers within 1 hour of processing. We do not store, share, or use your files for any other purpose.</p>
                        
                        <h3>2.2 Personal Information</h3>
                        <p>We may collect personal information that you voluntarily provide to us when you:</p>
                        <ul>
                            <li>Contact us via email or contact form</li>
                            <li>Submit a review</li>
                            <li>Sign up for newsletters (if applicable)</li>
                        </ul>
                        <p>This information may include your name, email address, and any other information you choose to provide.</p>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide and maintain our noise reduction service</li>
                            <li>Process and complete your requests</li>
                            <li>Respond to your inquiries and support needs</li>
                            <li>Improve our website and services</li>
                            <li>Display user reviews (with your consent)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Cookies and Tracking Technologies</h2>
                        <p>We may use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                    </section>

                    <section>
                        <h2>5. Third-Party Services</h2>
                        <p>We may employ third-party companies and individuals to facilitate our website, provide services on our behalf, or assist us in analyzing how our website is used. These third parties have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
                    </section>

                    <section>
                        <h2>6. Data Security</h2>
                        <p>We implement appropriate technical and organizational security measures to protect your information. However, please remember that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.</p>
                    </section>

                    <section>
                        <h2>7. Children's Privacy</h2>
                        <p>Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.</p>
                    </section>

                    <section>
                        <h2>8. Changes to This Privacy Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
                    </section>

                    <section>
                        <h2>9. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p>Email: <a href="mailto:noiseremover.com@gmail.com">noiseremover.com@gmail.com</a></p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;