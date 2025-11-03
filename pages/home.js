/**
 * Home Page - Live Chart XAU/USD + Breakout Signal
 * Main dashboard dengan live chart dan real-time data
 */
class HomePage {
    constructor(goldScanner) {
        this.goldScanner = goldScanner;
    }

    render() {
        // Get the legacy dashboard content and modify it for the new structure
        const legacyDashboard = document.getElementById('legacy-dashboard');
        if (legacyDashboard) {
            const dashboardContent = legacyDashboard.innerHTML;
            return `
                <div class="home-page">
                    <div class="page-header">
                        <h1><i class="fas fa-home"></i> Dashboard</h1>
                        <p>Real-time XAU/USD analysis and breakout detection</p>
                    </div>
                    ${dashboardContent}
                </div>
            `;
        }

        // Fallback if legacy dashboard is not available
        return `
            <div class="home-page">
                <div class="page-header">
                    <h1><i class="fas fa-home"></i> Dashboard</h1>
                    <p>Real-time XAU/USD analysis and breakout detection</p>
                </div>

                <div class="dashboard">
                    <!-- Left Panel - Controls & Info -->
                    <div class="left-panel">
                        <!-- Market Status -->
                        <div class="card market-status">
                            <h3><i class="fas fa-coins"></i> XAU/USD Status</h3>
                            <div class="price-display">
                                <span id="current-price">$0.00</span>
                                <span id="price-change" class="change">+0.00 (0.00%)</span>
                            </div>
                            <div class="market-info">
                                <div class="info-item">
                                    <span>Spread:</span>
                                    <span id="spread">0.0</span>
                                </div>
                                <div class="info-item">
                                    <span>Volume:</span>
                                    <span id="volume">0</span>
                                </div>
                                <div class="info-item">
                                    <span>ATR:</span>
                                    <span id="atr">0.0</span>
                                </div>
                            </div>
                        </div>

                        <!-- Breakout Status -->
                        <div class="card breakout-status">
                            <h3><i class="fas fa-exclamation-triangle"></i> Breakout Status</h3>
                            <div id="breakout-indicator" class="status-display consolidation">
                                <i class="fas fa-clock"></i>
                                <span>Consolidation ⏳</span>
                            </div>
                            <div id="confidence-score" class="confidence">
                                <span>Confidence: </span>
                                <span id="confidence-value">0%</span>
                                <div class="confidence-bar">
                                    <div id="confidence-fill" class="confidence-fill"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Timeframe Controls -->
                        <div class="card timeframe-controls">
                            <h3><i class="fas fa-clock"></i> Timeframe</h3>
                            <div class="timeframe-buttons">
                                <button class="tf-btn" data-tf="15">M15</button>
                                <button class="tf-btn active" data-tf="60">H1</button>
                                <button class="tf-btn" data-tf="240">H4</button>
                                <button class="tf-btn" data-tf="1440">Daily</button>
                            </div>
                        </div>

                        <!-- Alert Settings -->
                        <div class="card alert-settings">
                            <h3><i class="fas fa-bell"></i> Alert Settings</h3>
                            <div class="alert-controls">
                                <label class="switch">
                                    <input type="checkbox" id="alerts-enabled" checked>
                                    <span class="slider"></span>
                                </label>
                                <span>Enable Alerts</span>
                            </div>
                            <div class="notification-methods">
                                <label>
                                    <input type="checkbox" id="browser-notifications" checked>
                                    Browser Notifications
                                </label>
                                <label>
                                    <input type="checkbox" id="sound-alerts" checked>
                                    Sound Alerts
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Center Panel - Chart -->
                    <div class="center-panel">
                        <div class="card chart-container">
                            <div class="chart-header">
                                <h3><i class="fas fa-chart-candlestick"></i> XAU/USD Live Chart</h3>
                                <div class="chart-controls">
                                    <button id="auto-scale" class="chart-btn">
                                        <i class="fas fa-expand-arrows-alt"></i>
                                    </button>
                                    <button id="reset-zoom" class="chart-btn">
                                        <i class="fas fa-search-minus"></i>
                                    </button>
                                </div>
                            </div>
                            <div id="chart" class="chart"></div>
                        </div>
                    </div>

                    <!-- Right Panel - Signals & History -->
                    <div class="right-panel">
                        <!-- Recent Signals -->
                        <div class="card signals-panel">
                            <h3><i class="fas fa-signal"></i> Recent Signals</h3>
                            <div id="signals-list" class="signals-list">
                                <div class="signal-item">
                                    <div class="signal-time">No signals yet</div>
                                    <div class="signal-desc">Waiting for breakout detection...</div>
                                </div>
                            </div>
                        </div>

                        <!-- Pattern Detection -->
                        <div class="card pattern-detection">
                            <h3><i class="fas fa-brain"></i> Pattern Detection</h3>
                            <div id="detected-patterns" class="patterns-list">
                                <div class="pattern-item">
                                    <span class="pattern-name">Scanning...</span>
                                    <span class="pattern-confidence">0%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Performance Stats -->
                        <div class="card performance-stats">
                            <h3><i class="fas fa-chart-bar"></i> Performance</h3>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-label">Success Rate</span>
                                    <span class="stat-value" id="success-rate">0%</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Total Signals</span>
                                    <span class="stat-value" id="total-signals">0</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Avg Confidence</span>
                                    <span class="stat-value" id="avg-confidence">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        // Show skeleton screens while loading
        this.showSkeletonScreens();
        
        try {
            console.log('HomePage: Starting initialization');
            
            // Initialize existing functionality from the original script
            await this.initializeExistingFunctionality();
            this.setupTimeframeControls();
            this.setupChartControls();
            
            // Initialize chart with loading state
            await this.initializeChart();
            
            // Hide skeleton screens and show real content
            this.hideSkeletonScreens();
            
            console.log('HomePage: Initialization completed successfully');
        } catch (error) {
            console.error('HomePage: Initialization failed:', error);
            this.hideSkeletonScreens();
            // Don't throw the error to prevent page crashes
        }
    }

    showSkeletonScreens() {
        const loadingManager = window.LoadingManager;
        if (!loadingManager) return;

        // Show skeleton for market status
        this.marketStatusSkeleton = loadingManager.showSkeleton('.market-status', 'card', {
            title: 'Market Status',
            lines: 4
        });

        // Show skeleton for chart
        this.chartSkeleton = loadingManager.showSkeleton('.chart-container', 'chart', {
            height: '400px'
        });

        // Show skeleton for signals panel
        this.signalsSkeleton = loadingManager.showSkeleton('.signals-panel', 'list', {
            items: 3
        });

        // Show skeleton for pattern detection
        this.patternSkeleton = loadingManager.showSkeleton('.pattern-detection', 'card', {
            title: 'Pattern Detection',
            lines: 3
        });

        // Show skeleton for performance stats
        this.statsSkeleton = loadingManager.showSkeleton('.performance-stats', 'card', {
            title: 'Performance Stats',
            lines: 3
        });
    }

    hideSkeletonScreens() {
        const loadingManager = window.LoadingManager;
        if (!loadingManager) return;

        // Hide all skeleton screens
        if (this.marketStatusSkeleton) loadingManager.hideSkeleton(this.marketStatusSkeleton);
        if (this.chartSkeleton) loadingManager.hideSkeleton(this.chartSkeleton);
        if (this.signalsSkeleton) loadingManager.hideSkeleton(this.signalsSkeleton);
        if (this.patternSkeleton) loadingManager.hideSkeleton(this.patternSkeleton);
        if (this.statsSkeleton) loadingManager.hideSkeleton(this.statsSkeleton);
    }

    async initializeExistingFunctionality() {
        try {
            // Simulate loading market data
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Check if the original script functions are available
            if (typeof window.initializeChart === 'function') {
                window.initializeChart();
            }
            
            if (typeof window.startRealTimeUpdates === 'function') {
                window.startRealTimeUpdates();
            }
            
            if (typeof window.setupEventListeners === 'function') {
                window.setupEventListeners();
            }

            // If original functions are not available, initialize basic functionality
            if (!window.chart) {
                this.initializeChart();
                this.startRealTimeUpdates();
            }
            
            // Update market data after initialization
            await this.updateMarketData();
            this.updateBreakoutStatus();
            
        } catch (error) {
            console.error('Error initializing existing functionality:', error);
        }
    }

    setupTimeframeControls() {
        const timeframeButtons = document.querySelectorAll('.tf-btn');
        timeframeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                timeframeButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                const timeframe = e.target.dataset.tf;
                this.updateTimeframe(timeframe);
            });
        });
    }

    setupChartControls() {
        const autoScaleBtn = document.getElementById('auto-scale');
        const resetZoomBtn = document.getElementById('reset-zoom');

        if (autoScaleBtn) {
            autoScaleBtn.addEventListener('click', () => {
                const chart = window.chart || this.chart;
                if (chart) {
                    chart.timeScale().fitContent();
                }
            });
        }

        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => {
                const chart = window.chart || this.chart;
                if (chart) {
                    chart.timeScale().resetTimeScale();
                }
            });
        }
    }

    async initializeChart() {
        const loadingUtil = window.LoadingUtil;
        
        try {
            const chartContainer = document.getElementById('chart');
            if (!chartContainer) {
                console.warn('HomePage: Chart container not found');
                return;
            }

            // Check if LightweightCharts is available
            if (typeof LightweightCharts === 'undefined') {
                console.error('HomePage: LightweightCharts library not loaded');
                return;
            }

            // Show chart loading state
            if (loadingUtil) {
                loadingUtil.showInline('.chart-container', 'Initializing chart...');
            }

            // Simulate loading delay for chart initialization
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update loading message
            if (loadingUtil) {
                loadingUtil.updateInline('.chart-container', 'Creating chart instance...');
            }

            this.chart = LightweightCharts.createChart(chartContainer, {
                width: chartContainer.clientWidth,
                height: 400,
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#333',
                },
                grid: {
                    vertLines: {
                        color: '#f0f0f0',
                    },
                    horzLines: {
                        color: '#f0f0f0',
                    },
                },
                crosshair: {
                    mode: LightweightCharts.CrosshairMode.Normal,
                },
                rightPriceScale: {
                    borderColor: '#cccccc',
                },
                timeScale: {
                    borderColor: '#cccccc',
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            // Update loading message
            if (loadingUtil) {
                loadingUtil.updateInline('.chart-container', 'Adding chart series...');
            }

            this.candlestickSeries = this.chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            // Load initial chart data
            await this.loadChartData();

            // Make chart available globally for compatibility
            window.chart = this.chart;
            window.candlestickSeries = this.candlestickSeries;

            // Handle window resize
            window.addEventListener('resize', () => {
                if (this.chart && chartContainer) {
                    this.chart.applyOptions({
                        width: chartContainer.clientWidth,
                    });
                }
            });

            // Start real-time updates
            await this.startRealTimeUpdatesWithLoading();

        } catch (error) {
            console.error('HomePage: Chart initialization failed:', error);
            if (loadingUtil) {
                loadingUtil.showError('.chart-container', 'Failed to initialize chart');
            }
        } finally {
            // Hide loading state
            if (loadingUtil) {
                loadingUtil.hideInline('.chart-container');
            }
        }
    }

    async loadChartData() {
        const loadingUtil = window.LoadingUtil;
        
        try {
            // Update loading message for data loading
            if (loadingUtil) {
                loadingUtil.updateInline('.chart-container', 'Loading historical data...');
            }

            // Simulate loading chart data with progress updates
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (loadingUtil) {
                loadingUtil.updateInline('.chart-container', 'Processing market data...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Generate sample data for demonstration
            const data = this.generateSampleData();
            
            if (loadingUtil) {
                loadingUtil.updateInline('.chart-container', 'Rendering chart data...');
            }
            
            if (this.candlestickSeries && data.length > 0) {
                this.candlestickSeries.setData(data);
            }
            
            // Final loading step
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error('HomePage: Failed to load chart data:', error);
            if (loadingUtil) {
                loadingUtil.showError('.chart-container', 'Failed to load chart data');
            }
        }
    }

    async startRealTimeUpdatesWithLoading() {
        const loadingUtil = window.LoadingUtil;
        
        try {
            if (loadingUtil) {
                loadingUtil.updateInline('.chart-container', 'Starting real-time updates...');
            }

            // Simulate connection setup delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Start the actual real-time updates
            this.startRealTimeUpdates();

            if (loadingUtil) {
                loadingUtil.updateInline('.chart-container', 'Chart ready!');
            }

            // Brief delay to show "ready" message
            await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
            console.error('HomePage: Failed to start real-time updates:', error);
            if (loadingUtil) {
                loadingUtil.showError('.chart-container', 'Failed to start real-time updates');
            }
        }
    }

    generateSampleData() {
        const data = [];
        const basePrice = 2000;
        let currentPrice = basePrice;
        const now = new Date();
        
        for (let i = 100; i >= 0; i--) {
            const time = Math.floor((now.getTime() - i * 60000) / 1000); // 1 minute intervals
            const change = (Math.random() - 0.5) * 10;
            currentPrice += change;
            
            const open = currentPrice;
            const close = currentPrice + (Math.random() - 0.5) * 5;
            const high = Math.max(open, close) + Math.random() * 3;
            const low = Math.min(open, close) - Math.random() * 3;
            
            data.push({
                time: time,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2))
            });
            
            currentPrice = close;
        }
        
        return data;
    }

    updateTimeframe(timeframe) {
        console.log(`Switching to ${timeframe} minute timeframe`);
        // Call original timeframe update if available
        if (typeof window.updateTimeframe === 'function') {
            window.updateTimeframe(timeframe);
        }
    }

    startRealTimeUpdates() {
        // Use existing real-time updates if available
        if (typeof window.startRealTimeUpdates === 'function') {
            return;
        }

        // Fallback: basic real-time simulation
        this.updateInterval = setInterval(() => {
            this.updateMarketData();
            this.updateChart();
        }, 1000);
    }

    async updateMarketData() {
        const loadingUtil = window.LoadingUtil;
        
        try {
            // Show inline loading for market data sections
            if (loadingUtil) {
                loadingUtil.showInline('.market-status .card-content', 'Updating market data...');
            }

            // Use existing update function if available
            if (typeof window.updateMarketData === 'function') {
                window.updateMarketData();
                return;
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 400));

            // Fallback: basic market data simulation
            const basePrice = 2000;
            const variation = (Math.random() - 0.5) * 20;
            const currentPrice = basePrice + variation;
            const change = (Math.random() - 0.5) * 5;
            const changePercent = (change / currentPrice * 100).toFixed(2);

            // Update price display
            const priceElement = document.getElementById('current-price');
            const changeElement = document.getElementById('price-change');
            
            if (priceElement) {
                priceElement.textContent = `$${currentPrice.toFixed(2)}`;
            }
            
            if (changeElement) {
                changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`;
                changeElement.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
            }

            // Update other market info
            const spreadElement = document.getElementById('spread');
            const volumeElement = document.getElementById('volume');
            const atrElement = document.getElementById('atr');

            if (spreadElement) spreadElement.textContent = (Math.random() * 2).toFixed(1);
            if (volumeElement) volumeElement.textContent = Math.floor(Math.random() * 10000);
            if (atrElement) atrElement.textContent = (Math.random() * 5).toFixed(1);

            // Update signals and pattern detection
            await this.updateSignalsData();
            await this.updatePatternData();
            await this.updatePerformanceStats();

        } catch (error) {
            console.error('Error updating market data:', error);
        } finally {
            // Hide inline loading
            if (loadingUtil) {
                loadingUtil.hideInline('.market-status .card-content');
            }
        }
    }

    async updateSignalsData() {
        // Simulate loading signals data
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Update signals panel with sample data
        const signalsContainer = document.querySelector('.signals-panel .card-content');
        if (signalsContainer) {
            const signals = [
                { type: 'BUY', price: '2001.50', time: '2 min ago', confidence: 'High' },
                { type: 'SELL', price: '1998.20', time: '5 min ago', confidence: 'Medium' },
                { type: 'BUY', price: '1995.80', time: '8 min ago', confidence: 'High' }
            ];
            
            signalsContainer.innerHTML = signals.map(signal => `
                <div class="signal-item ${signal.type.toLowerCase()}">
                    <span class="signal-type">${signal.type}</span>
                    <span class="signal-price">$${signal.price}</span>
                    <span class="signal-time">${signal.time}</span>
                    <span class="signal-confidence">${signal.confidence}</span>
                </div>
            `).join('');
        }
    }

    async updatePatternData() {
        // Simulate loading pattern data
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const patternContainer = document.querySelector('.pattern-detection .card-content');
        if (patternContainer) {
            const patterns = [
                'Ascending Triangle',
                'Support Level at $1995',
                'RSI Oversold Signal'
            ];
            
            patternContainer.innerHTML = patterns.map(pattern => `
                <div class="pattern-item">
                    <i class="fas fa-chart-line"></i>
                    <span>${pattern}</span>
                </div>
            `).join('');
        }
    }

    async updatePerformanceStats() {
        // Simulate loading performance data
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const statsContainer = document.querySelector('.performance-stats .card-content');
        if (statsContainer) {
            const stats = {
                'Win Rate': '68.5%',
                'Profit Factor': '1.42',
                'Max Drawdown': '3.2%'
            };
            
            statsContainer.innerHTML = Object.entries(stats).map(([key, value]) => `
                <div class="stat-item">
                    <span class="stat-label">${key}:</span>
                    <span class="stat-value">${value}</span>
                </div>
            `).join('');
        }
    }

    updateChart() {
        const series = window.candlestickSeries || this.candlestickSeries;
        if (!series) return;

        // Generate new candlestick data
        const time = Math.floor(Date.now() / 1000);
        const basePrice = 2000;
        const open = basePrice + (Math.random() - 0.5) * 10;
        const close = open + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 3;
        const low = Math.min(open, close) - Math.random() * 3;

        series.update({
            time: time,
            open: open,
            high: high,
            low: low,
            close: close
        });
    }

    updateBreakoutStatus() {
        const indicator = document.getElementById('breakout-indicator');
        const confidenceValue = document.getElementById('confidence-value');
        const confidenceFill = document.getElementById('confidence-fill');
        const confidence = Math.random() * 100;
        
        if (indicator) {
            if (confidence > 80) {
                indicator.className = 'status-display bullish';
                indicator.innerHTML = '<i class="fas fa-arrow-up"></i><span>Strong Bullish Breakout 🚀</span>';
            } else if (confidence > 60) {
                indicator.className = 'status-display bearish';
                indicator.innerHTML = '<i class="fas fa-arrow-down"></i><span>Bearish Breakout 📉</span>';
            } else {
                indicator.className = 'status-display consolidation';
                indicator.innerHTML = '<i class="fas fa-clock"></i><span>Consolidation ⏳</span>';
            }
        }

        if (confidenceValue) {
            confidenceValue.textContent = confidence.toFixed(0) + '%';
        }

        if (confidenceFill) {
            confidenceFill.style.width = confidence + '%';
        }
    }

    destroy() {
        // Cleanup when leaving page
        if (this.goldScanner) {
            this.goldScanner.stopRealTimeUpdates();
        }
        // Hide any lingering inline loaders
        const loadingUtil = window.LoadingUtil;
        if (loadingUtil) {
            loadingUtil.hideInline('.chart-container');
            loadingUtil.hideInline('.market-status .card-content');
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Export for use in main app
window.HomePage = HomePage;