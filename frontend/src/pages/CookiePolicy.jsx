import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CookiePolicy = () => {
    return (
        <>
            <Header />
            <div className="legal-page">
                <div className="container">
                    <h1>Cookie Policy</h1>
                    <p className="last-updated">Last Updated: March 2026</p>

                    <section>
                        <h2>1. What Are Cookies</h2>
                        <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
                    </section>

                    <section>
                        <h2>2. How We Use Cookies</h2>
                        <p>Noise-Remover.com uses cookies for the following purposes:</p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Types of Cookies We Use</h2>
                        
                        <h3>3.1 Essential Cookies</h3>
                        <p>These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as setting your privacy preferences or filling in forms.</p>
                        
                        <h3>3.2 Analytics Cookies</h3>
                        <p>We use analytics cookies to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.</p>
                        
                        <h3>3.3 Functional Cookies</h3>
                        <p>These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</p>
                    </section>

                    <section>
                        <h2>4. Third-Party Cookies</h2>
                        <p>In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site:</p>
                        <ul>
                            <li>Google Analytics - helps us understand site usage patterns</li>
                            <li>Social media sharing buttons may set cookies to track usage</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Managing Cookies</h2>
                        <p>Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience and lose some functionality.</p>
                        <p>To learn more about managing cookies, visit:</p>
                        <ul>
                            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</a></li>
                            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener">Mozilla Firefox</a></li>
                            <li><a href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener">Safari</a></li>
                            <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener">Internet Explorer/Edge</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Your Consent</h2>
                        <p>By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy.</p>
                    </section>

                    <section>
                        <h2>7. Changes to This Cookie Policy</h2>
                        <p>We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page with an updated effective date.</p>
                    </section>

                    <section>
                        <h2>8. Contact Us</h2>
                        <p>If you have any questions about our use of cookies, please contact us at:</p>
                        <p>Email: <a href="mailto:noiseremover.com@gmail.com">noiseremover.com@gmail.com</a></p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CookiePolicy;