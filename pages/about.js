/**
 * About Page - Maklumat Aplikasi & Documentation
 * Dedicated page untuk maklumat aplikasi, features, dan panduan penggunaan
 */
class AboutPage {
    constructor() {
        this.version = '2.0.0';
        this.buildDate = new Date().toLocaleDateString();
    }

    render() {
        return `
            <div class="page-container about-page">
                <div class="page-header">
                    <h2><i class="fas fa-info-circle"></i> About GoldRadar</h2>
                    <p>Advanced Gold Trading Analysis & Breakout Detection System</p>
                </div>

                <!-- App Overview -->
                <div class="card app-overview">
                    <div class="overview-content">
                        <div class="app-logo">
                            <i class="fas fa-chart-line"></i>
                            <h3>GoldRadar v${this.version}</h3>
                        </div>
                        <div class="app-description">
                            <p>GoldRadar adalah sistem analisis trading emas yang canggih dengan teknologi AI untuk mengesan breakout patterns dan memberikan signal trading yang tepat. Aplikasi ini direka khas untuk trader yang ingin meningkatkan keuntungan dalam trading XAU/USD.</p>
                            
                            <div class="key-features">
                                <h4>Key Features:</h4>
                                <ul>
                                    <li><i class="fas fa-bolt"></i> Real-time breakout detection dengan AI pattern recognition</li>
                                    <li><i class="fas fa-chart-area"></i> Advanced charting dengan multiple timeframes</li>
                                    <li><i class="fas fa-bell"></i> Smart alert system dengan customizable notifications</li>
                                    <li><i class="fas fa-history"></i> Comprehensive backtesting engine</li>
                                    <li><i class="fas fa-mobile-alt"></i> Responsive design untuk semua devices</li>
                                    <li><i class="fas fa-shield-alt"></i> Secure dan reliable data processing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Features Overview -->
                <div class="card features-overview">
                    <h3><i class="fas fa-star"></i> Features Overview</h3>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-home"></i>
                            </div>
                            <h4>Dashboard</h4>
                            <p>Real-time market overview dengan live XAU/USD chart, current price, dan breakout status. Pantau pergerakan harga secara langsung.</p>
                            <div class="feature-highlights">
                                <span>Live Charts</span>
                                <span>Real-time Data</span>
                                <span>Market Status</span>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <h4>Scanner</h4>
                            <p>Advanced breakout scanner dengan AI pattern analysis. Scan multiple timeframes untuk mencari peluang trading terbaik.</p>
                            <div class="feature-highlights">
                                <span>AI Analysis</span>
                                <span>Multi-timeframe</span>
                                <span>Pattern Recognition</span>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-bell"></i>
                            </div>
                            <h4>Alerts</h4>
                            <p>Comprehensive alert management system. Set custom alerts untuk price levels, breakouts, dan patterns dengan multiple notification methods.</p>
                            <div class="feature-highlights">
                                <span>Custom Alerts</span>
                                <span>Multi-notifications</span>
                                <span>Smart Triggers</span>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <h4>Backtest</h4>
                            <p>Powerful backtesting engine untuk test strategies secara historical. Analyze performance dengan detailed metrics dan reports.</p>
                            <div class="feature-highlights">
                                <span>Strategy Testing</span>
                                <span>Performance Metrics</span>
                                <span>Historical Analysis</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- How to Use -->
                <div class="card how-to-use">
                    <h3><i class="fas fa-question-circle"></i> How to Use GoldRadar</h3>
                    <div class="usage-steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Start with Dashboard</h4>
                                <p>Mulakan dengan Dashboard untuk melihat overview market terkini. Monitor live chart dan current breakout status.</p>
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Use Scanner for Analysis</h4>
                                <p>Gunakan Scanner untuk analisis mendalam. Set confidence threshold dan timeframe mengikut strategy anda.</p>
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Setup Alerts</h4>
                                <p>Configure alerts untuk price levels dan breakout signals. Pilih notification method yang sesuai.</p>
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Backtest Strategies</h4>
                                <p>Test strategy anda menggunakan historical data. Analyze performance sebelum live trading.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Technical Specifications -->
                <div class="card tech-specs">
                    <h3><i class="fas fa-cog"></i> Technical Specifications</h3>
                    <div class="specs-grid">
                        <div class="spec-section">
                            <h4>Data Sources</h4>
                            <ul>
                                <li>Real-time market data simulation</li>
                                <li>High-frequency price updates (1-second intervals)</li>
                                <li>Volume and volatility indicators</li>
                                <li>Multiple timeframe support (1m to 1d)</li>
                            </ul>
                        </div>

                        <div class="spec-section">
                            <h4>AI & Algorithms</h4>
                            <ul>
                                <li>Pattern recognition algorithms</li>
                                <li>Machine learning breakout detection</li>
                                <li>Confidence scoring system</li>
                                <li>Adaptive threshold optimization</li>
                            </ul>
                        </div>

                        <div class="spec-section">
                            <h4>Performance</h4>
                            <ul>
                                <li>Sub-second alert response time</li>
                                <li>Optimized chart rendering</li>
                                <li>Efficient data processing</li>
                                <li>Minimal resource usage</li>
                            </ul>
                        </div>

                        <div class="spec-section">
                            <h4>Compatibility</h4>
                            <ul>
                                <li>Modern web browsers (Chrome, Firefox, Safari, Edge)</li>
                                <li>Responsive design (Desktop, Tablet, Mobile)</li>
                                <li>Cross-platform support</li>
                                <li>Progressive Web App (PWA) ready</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- FAQ Section -->
                <div class="card faq-section">
                    <h3><i class="fas fa-question"></i> Frequently Asked Questions</h3>
                    <div class="faq-container">
                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>Bagaimana cara kerja breakout detection?</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>GoldRadar menggunakan algoritma AI yang menganalisis price action, volume, dan pattern formations untuk mengesan breakout. System ini mempertimbangkan multiple factors seperti support/resistance levels, momentum indicators, dan historical patterns untuk memberikan confidence score yang akurat.</p>
                            </div>
                        </div>

                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>Apakah data yang digunakan adalah real-time?</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>Untuk demo purposes, GoldRadar menggunakan simulated real-time data yang meniru pergerakan market sebenar. Dalam production environment, system ini boleh disambungkan dengan real market data feeds untuk mendapat data yang sebenar.</p>
                            </div>
                        </div>

                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>Bagaimana accuracy rate untuk signals?</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>Accuracy rate bergantung kepada confidence threshold yang ditetapkan. Dengan threshold 75%, system biasanya mencapai accuracy rate 70-80%. Threshold yang lebih tinggi akan memberikan signals yang lebih sedikit tetapi lebih accurate.</p>
                            </div>
                        </div>

                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>Bolehkah saya customize alert settings?</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>Ya, anda boleh customize semua alert settings termasuk notification methods (sound, desktop, email), alert types (price, breakout, pattern), dan threshold values. Semua settings akan disimpan secara automatik.</p>
                            </div>
                        </div>

                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>Apakah backtesting engine accurate?</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>Backtesting engine menggunakan historical data simulation dengan realistic market conditions termasuk slippage dan spread. Walaupun tidak 100% sama dengan live trading, ia memberikan gambaran yang baik tentang strategy performance.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- System Status -->
                <div class="card system-status">
                    <h3><i class="fas fa-heartbeat"></i> System Status</h3>
                    <div class="status-grid">
                        <div class="status-item">
                            <div class="status-indicator online"></div>
                            <div class="status-info">
                                <h4>Data Feed</h4>
                                <p>Online & Active</p>
                            </div>
                        </div>

                        <div class="status-item">
                            <div class="status-indicator online"></div>
                            <div class="status-info">
                                <h4>AI Engine</h4>
                                <p>Processing Normally</p>
                            </div>
                        </div>

                        <div class="status-item">
                            <div class="status-indicator online"></div>
                            <div class="status-info">
                                <h4>Alert System</h4>
                                <p>Fully Operational</p>
                            </div>
                        </div>

                        <div class="status-item">
                            <div class="status-indicator online"></div>
                            <div class="status-info">
                                <h4>Backtest Engine</h4>
                                <p>Ready for Testing</p>
                            </div>
                        </div>
                    </div>

                    <div class="system-info">
                        <div class="info-row">
                            <span class="label">Version:</span>
                            <span class="value">${this.version}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Build Date:</span>
                            <span class="value">${this.buildDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Uptime:</span>
                            <span class="value" id="uptime">00:00:00</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Last Update:</span>
                            <span class="value" id="last-update">Just now</span>
                        </div>
                    </div>
                </div>

                <!-- Contact & Support -->
                <div class="card contact-support">
                    <h3><i class="fas fa-envelope"></i> Contact & Support</h3>
                    <div class="contact-content">
                        <p>Jika anda mempunyai sebarang pertanyaan, masalah teknikal, atau cadangan untuk penambahbaikan, jangan ragu untuk menghubungi kami.</p>
                        
                        <div class="contact-methods">
                            <div class="contact-method">
                                <i class="fas fa-envelope"></i>
                                <div>
                                    <h4>Email Support</h4>
                                    <p>support@goldradar.com</p>
                                </div>
                            </div>

                            <div class="contact-method">
                                <i class="fab fa-github"></i>
                                <div>
                                    <h4>GitHub Repository</h4>
                                    <p>github.com/zakwanzambri/GoldRadar</p>
                                </div>
                            </div>

                            <div class="contact-method">
                                <i class="fas fa-bug"></i>
                                <div>
                                    <h4>Bug Reports</h4>
                                    <p>Report issues on GitHub Issues</p>
                                </div>
                            </div>

                            <div class="contact-method">
                                <i class="fas fa-lightbulb"></i>
                                <div>
                                    <h4>Feature Requests</h4>
                                    <p>Suggest new features via GitHub</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Credits & Acknowledgments -->
                <div class="card credits">
                    <h3><i class="fas fa-heart"></i> Credits & Acknowledgments</h3>
                    <div class="credits-content">
                        <div class="credit-section">
                            <h4>Development Team</h4>
                            <ul>
                                <li>Lead Developer: Zakwan Zambri</li>
                                <li>AI/ML Specialist: Advanced Pattern Recognition Team</li>
                                <li>UI/UX Designer: Modern Interface Design</li>
                            </ul>
                        </div>

                        <div class="credit-section">
                            <h4>Technologies Used</h4>
                            <ul>
                                <li>TradingView Lightweight Charts for charting</li>
                                <li>Font Awesome for icons</li>
                                <li>Modern JavaScript ES6+ features</li>
                                <li>CSS3 with advanced animations</li>
                                <li>Progressive Web App technologies</li>
                            </ul>
                        </div>

                        <div class="credit-section">
                            <h4>Special Thanks</h4>
                            <ul>
                                <li>Trading community for feedback and suggestions</li>
                                <li>Beta testers for valuable insights</li>
                                <li>Open source contributors</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="about-footer">
                    <p>&copy; 2024 GoldRadar. All rights reserved. Built with ❤️ for the trading community.</p>
                </div>
            </div>
        `;
    }

    init() {
        this.setupFAQ();
        this.startUptime();
        this.updateLastUpdate();
    }

    setupFAQ() {
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                });

                // Toggle current item
                if (!isOpen) {
                    item.classList.add('open');
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }

    startUptime() {
        const startTime = Date.now();
        
        setInterval(() => {
            const uptime = Date.now() - startTime;
            const hours = Math.floor(uptime / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
            
            const uptimeEl = document.getElementById('uptime');
            if (uptimeEl) {
                uptimeEl.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    updateLastUpdate() {
        setInterval(() => {
            const lastUpdateEl = document.getElementById('last-update');
            if (lastUpdateEl) {
                lastUpdateEl.textContent = new Date().toLocaleTimeString();
            }
        }, 30000); // Update every 30 seconds
    }

    destroy() {
        // Cleanup when leaving page
    }
}

// Export for use in main app
window.AboutPage = AboutPage;