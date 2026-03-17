import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
    return (
        <>
            <Header />
            <div className="legal-page">
                <div className="container">
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last Updated: March 2026</p>

                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing or using Noise-Remover.com ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use the Service.</p>
                    </section>

                    <section>
                        <h2>2. Description of Service</h2>
                        <p>Noise-Remover.com provides a free online tool that uses AI technology to remove background noise from audio and video files. The Service is provided "as is" and "as available" without any warranties, express or implied.</p>
                    </section>

                    <section>
                        <h2>3. Free Usage</h2>
                        <p>The Service is completely free to use with no hidden costs, watermarks, or limitations. We reserve the right to modify or discontinue the Service at any time without notice.</p>
                    </section>

                    <section>
                        <h2>4. User Responsibilities</h2>
                        <p>As a user of the Service, you agree to:</p>
                        <ul>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Not upload files that contain malware, viruses, or harmful code</li>
                            <li>Not attempt to reverse engineer or copy the technology</li>
                            <li>Not use the Service to infringe upon others' intellectual property rights</li>
                            <li>Not upload files containing illegal or inappropriate content</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Intellectual Property</h2>
                        <p>The Service, including its original content, features, and functionality, is owned by Noise-Remover.com and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                    </section>

                    <section>
                        <h2>6. User Content</h2>
                        <p>You retain all rights to any audio or video files you upload to the Service. By uploading files, you grant us permission to process them solely for the purpose of providing the noise reduction service. Files are automatically deleted from our servers within 1 hour of processing.</p>
                    </section>

                    <section>
                        <h2>7. Reviews and Feedback</h2>
                        <p>When you submit reviews or feedback, you grant us a non-exclusive, worldwide, perpetual, irrevocable, royalty-free license to use, reproduce, modify, and display such content in connection with the Service.</p>
                    </section>

                    <section>
                        <h2>8. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law, in no event shall Noise-Remover.com be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                    </section>

                    <section>
                        <h2>9. Disclaimer of Warranties</h2>
                        <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
                    </section>

                    <section>
                        <h2>10. Governing Law</h2>
                        <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the Service operates, without regard to its conflict of law provisions.</p>
                    </section>

                    <section>
                        <h2>11. Changes to Terms</h2>
                        <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
                    </section>

                    <section>
                        <h2>12. Contact Information</h2>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <p>Email: <a href="mailto:noiseremover.com@gmail.com">noiseremover.com@gmail.com</a></p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsOfService;