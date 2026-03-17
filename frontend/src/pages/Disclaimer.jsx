import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Disclaimer = () => {
    return (
        <>
            <Header />
            <div className="legal-page">
                <div className="container">
                    <h1>Disclaimer</h1>
                    <p className="last-updated">Last Updated: March 2026</p>

                    <section>
                        <h2>1. General Information</h2>
                        <p>The information provided by Noise-Remover.com ("we," "us," or "our") on https://noise-remover.com (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>
                    </section>

                    <section>
                        <h2>2. Professional Disclaimer</h2>
                        <p>The Site cannot and does not contain professional audio engineering advice. The audio processing information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.</p>
                    </section>

                    <section>
                        <h2>3. External Links Disclaimer</h2>
                        <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
                    </section>

                    <section>
                        <h2>4. Testimonials Disclaimer</h2>
                        <p>The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.</p>
                    </section>

                    <section>
                        <h2>5. No Responsibility Disclaimer</h2>
                        <p>In no event shall Noise-Remover.com be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service.</p>
                    </section>

                    <section>
                        <h2>6. "Use at Your Own Risk" Disclaimer</h2>
                        <p>All information in the Site is provided "as is," with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability, and fitness for a particular purpose.</p>
                        <p>We will not be liable to you or anyone else for any decision made or action taken in reliance on the information given by the Site or for any consequential, special or similar damages, even if advised of the possibility of such damages.</p>
                    </section>

                    <section>
                        <h2>7. Technology Disclaimer</h2>
                        <p>While our AI noise reduction technology is highly effective, results may vary depending on the quality of the original recording and the nature of the background noise. We do not guarantee that all background noise will be completely removed or that the processed audio will meet your specific requirements.</p>
                    </section>

                    <section>
                        <h2>8. Contact Us</h2>
                        <p>If you have any questions about this Disclaimer, please contact us at:</p>
                        <p>Email: <a href="mailto:noiseremover.com@gmail.com">noiseremover.com@gmail.com</a></p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Disclaimer;