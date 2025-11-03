/**
 * Scanner Page - Auto Scan Zone Breakout + Hasil Analisis
 * Dedicated page untuk breakout scanning dan analisis mendalam
 */
class ScannerPage {
    constructor(goldScanner) {
        this.goldScanner = goldScanner;
        this.scanResults = [];
        this.isScanning = false;
    }

    render() {
        return `
            <div class="page-container scanner-page">
                <div class="page-header">
                    <h2><i class="fas fa-radar"></i> Breakout Scanner</h2>
                    <p>Auto scan zone breakout dengan analisis mendalam</p>
                </div>

                <!-- Scanner Controls -->
                <div class="card scanner-controls">
                    <h3><i class="fas fa-cogs"></i> Scanner Settings</h3>
                    <div class="controls-grid">
                        <div class="control-group">
                            <label>Timeframe Scan:</label>
                            <select id="scan-timeframe">
                                <option value="1">1 Minute</option>
                                <option value="5" selected>5 Minutes</option>
                                <option value="15">15 Minutes</option>
                                <option value="30">30 Minutes</option>
                                <option value="60">1 Hour</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Confidence Threshold:</label>
                            <input type="range" id="confidence-threshold" min="50" max="95" value="75">
                            <span id="confidence-value">75%</span>
                        </div>
                        <div class="control-group">
                            <label>Volume Filter:</label>
                            <input type="checkbox" id="volume-filter" checked>
                            <span>Minimum volume required</span>
                        </div>
                        <div class="control-group">
                            <button id="start-scan" class="scan-btn primary">
                                <i class="fas fa-play"></i> Start Scan
                            </button>
                            <button id="stop-scan" class="scan-btn secondary" disabled>
                                <i class="fas fa-stop"></i> Stop Scan
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Scan Status -->
                <div class="card scan-status">
                    <h3><i class="fas fa-activity"></i> Scan Status</h3>
                    <div class="status-display">
                        <div class="scan-stats">
                            <div class="scan-stats-header">
                                <span id="scan-status-text">Ready to scan</span>
                                <div id="scan-progress" class="progress-bar">
                                    <div class="progress-fill"></div>
                                </div>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Scans Completed:</span>
                                <span id="scans-completed">0</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Breakouts Found:</span>
                                <span id="breakouts-found">0</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Success Rate:</span>
                                <span id="success-rate">0%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Scan Results -->
                <div class="card scan-results">
                    <h3><i class="fas fa-list"></i> Scan Results</h3>
                    <div class="results-header">
                        <div class="results-filters">
                            <select id="results-filter">
                                <option value="all">All Results</option>
                                <option value="bullish">Bullish Breakouts</option>
                                <option value="bearish">Bearish Breakouts</option>
                                <option value="high-confidence">High Confidence (>80%)</option>
                            </select>
                            <button id="clear-results" class="clear-btn">
                                <i class="fas fa-trash"></i> Clear Results
                            </button>
                        </div>
                    </div>
                    <div id="results-container" class="results-container">
                        <div class="no-results">
                            <i class="fas fa-search"></i>
                            <p>No scan results yet. Start scanning to see breakout opportunities.</p>
                        </div>
                    </div>
                </div>

                <!-- Pattern Analysis -->
                <div class="card pattern-analysis">
                    <h3><i class="fas fa-brain"></i> AI Pattern Analysis</h3>
                    <div class="pattern-grid">
                        <div class="pattern-item">
                            <div class="pattern-header">
                                <i class="fas fa-chart-line"></i>
                                <span>Bull Flag</span>
                            </div>
                            <div class="pattern-confidence" id="bull-flag-confidence">0%</div>
                            <div class="pattern-status" id="bull-flag-status">Not Detected</div>
                        </div>
                        <div class="pattern-item">
                            <div class="pattern-header">
                                <i class="fas fa-chart-line"></i>
                                <span>Bear Flag</span>
                            </div>
                            <div class="pattern-confidence" id="bear-flag-confidence">0%</div>
                            <div class="pattern-status" id="bear-flag-status">Not Detected</div>
                        </div>
                        <div class="pattern-item">
                            <div class="pattern-header">
                                <i class="fas fa-triangle-exclamation"></i>
                                <span>Triangle</span>
                            </div>
                            <div class="pattern-confidence" id="triangle-confidence">0%</div>
                            <div class="pattern-status" id="triangle-status">Not Detected</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        const tStart = performance.now();
        // Show skeleton screens while loading
        this.showSkeletonScreens();
        
        try {
            // Simulate loading delay for scanner initialization
            await new Promise(resolve => setTimeout(resolve, 800));
            
            this.setupScannerControls();
            this.setupResultsFilter();
            
            // Initialize pattern analysis with loading
            await this.initializePatternAnalysis();
            
            // Load initial scan data
            await this.loadInitialData();
            
            // Hide skeleton screens and show real content
            this.hideSkeletonScreens();
            // Record page load time and emit pageReady
            if (window.performanceMonitor) {
                window.performanceMonitor.recordPageLoad('ScannerPage', performance.now() - tStart);
            }
            document.dispatchEvent(new CustomEvent('pageReady', { detail: { page: 'scanner' } }));
            
        } catch (error) {
            console.error('Error initializing scanner:', error);
            this.hideSkeletonScreens();
            const loadingUtil = window.LoadingUtil;
            if (loadingUtil) {
                loadingUtil.showRetryError('.scanner-page', 'Failed to initialize scanner', () => this.init());
            }
        }
    }

    showSkeletonScreens() {
        const loadingManager = window.LoadingManager;
        if (!loadingManager) return;

        // Show skeleton for scan status
        this.scanStatusSkeleton = loadingManager.showSkeleton('.scan-status .status-display', 'card', {
            title: 'Scan Status',
            lines: 3
        });

        // Show skeleton for scan results
        this.scanResultsSkeleton = loadingManager.showSkeleton('#results-container', 'table', {
            rows: 5,
            columns: 4
        });

        // Show skeleton for pattern analysis
        this.patternAnalysisSkeleton = loadingManager.showSkeleton('.pattern-analysis .pattern-grid', 'list', {
            items: 3
        });
    }

    hideSkeletonScreens() {
        const loadingManager = window.LoadingManager;
        if (!loadingManager) return;

        // Hide all skeleton screens
        if (this.scanStatusSkeleton) loadingManager.hideSkeleton(this.scanStatusSkeleton);
        if (this.scanResultsSkeleton) loadingManager.hideSkeleton(this.scanResultsSkeleton);
        if (this.patternAnalysisSkeleton) loadingManager.hideSkeleton(this.patternAnalysisSkeleton);
    }

    async initializePatternAnalysis() {
        // Simulate loading pattern analysis
        await new Promise(resolve => setTimeout(resolve, 600));
        this.startPatternAnalysis();
    }

    async loadInitialData() {
        // Simulate loading initial scanner data
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Initialize with some sample data
        this.updateScanStats();
        this.renderResults();
    }

    setupScannerControls() {
        const startBtn = document.getElementById('start-scan');
        const stopBtn = document.getElementById('stop-scan');
        const confidenceSlider = document.getElementById('confidence-threshold');
        const confidenceValue = document.getElementById('confidence-value');

        // Confidence slider
        if (confidenceSlider && confidenceValue) {
            confidenceSlider.addEventListener('input', (e) => {
                confidenceValue.textContent = e.target.value + '%';
            });
        }

        // Start scan
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startScanning();
            });
        }

        // Stop scan
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopScanning();
            });
        }
    }

    setupResultsFilter() {
        const filter = document.getElementById('results-filter');
        const clearBtn = document.getElementById('clear-results');

        if (filter) {
            filter.addEventListener('change', (e) => {
                this.filterResults(e.target.value);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearResults();
            });
        }
    }

    async startScanning() {
        this.isScanning = true;
        const startBtn = document.getElementById('start-scan');
        const stopBtn = document.getElementById('stop-scan');
        const statusText = document.getElementById('scan-status-text');
        const loadingUtil = window.LoadingUtil;

        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        if (statusText) statusText.textContent = 'Initializing scanner...';

        try {
            // Show loading for scan initialization
            if (loadingUtil) {
                loadingUtil.showInline('.scan-status .status-display', 'Initializing scanner...');
            }

            // Simulate scanner initialization
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (statusText) statusText.textContent = 'Scanning for breakouts...';

            // Hide initialization loading
            if (loadingUtil) {
                loadingUtil.hideInline('.scan-status .status-display');
            }

            // Start scanning process
            this.scanInterval = setInterval(() => {
                this.performScan();
            }, 2000);

        } catch (error) {
            console.error('Error starting scanner:', error);
            if (loadingUtil) {
                loadingUtil.hideInline('.scan-status .status-display');
                loadingUtil.showRetryError('.scan-status .status-display', 'Scanner initialization failed', () => this.startScanning());
            }
            this.stopScanning();
        }
    }

    stopScanning() {
        this.isScanning = false;
        const startBtn = document.getElementById('start-scan');
        const stopBtn = document.getElementById('stop-scan');
        const statusText = document.getElementById('scan-status-text');

        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (statusText) statusText.textContent = 'Scan stopped';

        if (this.scanInterval) {
            clearInterval(this.scanInterval);
        }
    }

    async performScan() {
        if (!this.isScanning) return;

        const loadingManager = window.LoadingManager;
        const statusText = document.getElementById('scan-status-text');

        try {
            // Show scanning progress
            if (statusText) statusText.textContent = 'Analyzing patterns...';
            
            // Simulate pattern analysis time
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simulate breakout detection
            const confidence = Math.random() * 100;
            const threshold = parseInt(document.getElementById('confidence-threshold')?.value || 75);
            
            if (confidence > threshold) {
                const result = {
                    timestamp: new Date(),
                    type: Math.random() > 0.5 ? 'bullish' : 'bearish',
                    confidence: Math.round(confidence),
                    price: 2000 + (Math.random() * 100),
                    volume: Math.floor(Math.random() * 10000) + 1000
                };
                
                // Add result with loading animation
                await this.addScanResultWithLoading(result);
            }

            this.updateScanStats();

            // Reset status
            if (statusText) statusText.textContent = 'Scanning for breakouts...';

        } catch (error) {
            console.error('Error during scan:', error);
            if (statusText) statusText.textContent = 'Scan error - retrying...';
            const loadingUtil = window.LoadingUtil;
            if (loadingUtil) {
                loadingUtil.showRetryError('#results-container', 'Scan failed. Tap Retry to try again.', () => this.performScan());
            }
        }
    }

    async addScanResultWithLoading(result) {
        const loadingUtil = window.LoadingUtil;
        const resultsContainer = document.getElementById('results-container');

        if (loadingUtil && resultsContainer) {
            // Show brief loading for new result
            loadingUtil.showInline('#results-container', 'Adding new result...');
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Add the actual result
            this.addScanResult(result);
            
            // Hide loading
            loadingUtil.hideInline('#results-container');
        } else {
            // Fallback to original method
            this.addScanResult(result);
        }
    }

    addScanResult(result) {
        this.scanResults.unshift(result);
        this.renderResults();
        
        // Update breakouts found counter
        const breakoutsFound = document.getElementById('breakouts-found');
        if (breakoutsFound) {
            breakoutsFound.textContent = this.scanResults.length;
        }
    }

    renderResults() {
        const container = document.getElementById('results-container');
        if (!container) return;

        if (this.scanResults.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No scan results yet. Start scanning to see breakout opportunities.</p>
                </div>
            `;
            return;
        }

        const resultsHTML = this.scanResults.map(result => `
            <div class="result-item ${result.type}">
                <div class="result-header">
                    <span class="result-type">
                        <i class="fas fa-arrow-${result.type === 'bullish' ? 'up' : 'down'}"></i>
                        ${result.type.toUpperCase()} BREAKOUT
                    </span>
                    <span class="result-time">${result.timestamp.toLocaleTimeString()}</span>
                </div>
                <div class="result-details">
                    <div class="detail">
                        <span>Price:</span>
                        <span>$${result.price.toFixed(2)}</span>
                    </div>
                    <div class="detail">
                        <span>Confidence:</span>
                        <span>${result.confidence}%</span>
                    </div>
                    <div class="detail">
                        <span>Volume:</span>
                        <span>${result.volume.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = resultsHTML;
    }

    updateScanStats() {
        const scansCompleted = document.getElementById('scans-completed');
        const successRate = document.getElementById('success-rate');
        
        if (scansCompleted) {
            const currentScans = parseInt(scansCompleted.textContent) + 1;
            scansCompleted.textContent = currentScans;
            
            if (successRate) {
                const rate = this.scanResults.length > 0 ? 
                    Math.round((this.scanResults.length / currentScans) * 100) : 0;
                successRate.textContent = rate + '%';
            }
        }
    }

    startPatternAnalysis() {
        // Simulate AI pattern analysis
        this.patternInterval = setInterval(() => {
            this.updatePatternAnalysis();
        }, 5000);
        
        // Initial pattern analysis
        this.updatePatternAnalysis();
    }

    async updatePatternAnalysis() {
        const loadingUtil = window.LoadingUtil;
        const patternGrid = document.querySelector('.pattern-grid');
        
        if (!patternGrid) return;

        try {
            // Show loading for pattern analysis
            if (loadingUtil) {
                loadingUtil.showInline('.pattern-analysis', 'Analyzing patterns with AI...');
            }

            // Simulate AI processing time
            await new Promise(resolve => setTimeout(resolve, 1500));

            const patterns = [
                { name: 'Head and Shoulders', probability: Math.floor(Math.random() * 20) + 80, status: 'forming' },
                { name: 'Double Top', probability: Math.floor(Math.random() * 25) + 70, status: 'confirmed' },
                { name: 'Ascending Triangle', probability: Math.floor(Math.random() * 15) + 85, status: 'breakout' },
                { name: 'Bull Flag', probability: Math.floor(Math.random() * 30) + 65, status: 'forming' }
            ];

            // Update pattern display
            patternGrid.innerHTML = patterns.map(pattern => `
                <div class="pattern-item ${pattern.status}">
                    <h4>${pattern.name}</h4>
                    <div class="probability">${pattern.probability}%</div>
                    <div class="status">${pattern.status}</div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${pattern.probability}%"></div>
                    </div>
                </div>
            `).join('');

            // Hide loading
            if (loadingUtil) {
                loadingUtil.hideInline('.pattern-analysis');
            }

        } catch (error) {
            console.error('Error updating pattern analysis:', error);
            if (loadingUtil) {
                loadingUtil.hideInline('.pattern-analysis');
                loadingUtil.showRetryError('.pattern-analysis', 'Pattern analysis failed. Tap Retry to try again.', () => this.updatePatternAnalysis());
            }
        }
    }

    filterResults(filterType) {
        // Implementation for filtering results
        console.log('Filtering results by:', filterType);
    }

    clearResults() {
        this.scanResults = [];
        this.renderResults();
        
        // Reset counters
        const breakoutsFound = document.getElementById('breakouts-found');
        if (breakoutsFound) breakoutsFound.textContent = '0';
    }

    destroy() {
        const tStart = performance.now();
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
        }
        this.stopScanning();
        // Cleanup any inline loaders on this page
        const loadingUtil = window.LoadingUtil;
        if (loadingUtil) {
            loadingUtil.hideInline('.scan-status .status-display');
            loadingUtil.hideInline('#results-container');
            loadingUtil.hideInline('.pattern-analysis');
        }
        // Record cleanup duration
        if (window.performanceMonitor) {
            window.performanceMonitor.recordInteraction('cleanup', 'ScannerPage.destroy', performance.now() - tStart);
        }
    }
}

// Export for use in main app
window.ScannerPage = ScannerPage;