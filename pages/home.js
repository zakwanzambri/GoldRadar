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

    init() {
        try {
            console.log('HomePage: Starting initialization');
            
            // Initialize existing functionality from the original script
            this.initializeExistingFunctionality();
            this.setupTimeframeControls();
            this.setupChartControls();
            
            console.log('HomePage: Initialization completed successfully');
        } catch (error) {
            console.error('HomePage: Initialization failed:', error);
            // Don't throw the error to prevent page crashes
        }
    }

    initializeExistingFunctionality() {
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

    initializeChart() {
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

        this.candlestickSeries = this.chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

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
        } catch (error) {
            console.error('HomePage: Chart initialization failed:', error);
        }
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

    updateMarketData() {
        // Use existing update function if available
        if (typeof window.updateMarketData === 'function') {
            window.updateMarketData();
            return;
        }

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

        // Update breakout status
        this.updateBreakoutStatus();
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
    }
}

// Export for use in main app
window.HomePage = HomePage;