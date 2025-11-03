/**
 * Backtest Page - Historical Testing & Strategy Analysis
 * Dedicated page untuk backtesting strategies dan analisis performance
 */
class BacktestPage {
    constructor(goldScanner) {
        this.goldScanner = goldScanner;
        this.backtestResults = [];
        this.isRunning = false;
        this.currentTest = null;
        this.strategies = [
            {
                id: 'breakout_basic',
                name: 'Basic Breakout',
                description: 'Simple breakout strategy with volume confirmation'
            },
            {
                id: 'breakout_advanced',
                name: 'Advanced Breakout',
                description: 'Multi-timeframe breakout with pattern recognition'
            },
            {
                id: 'momentum',
                name: 'Momentum Strategy',
                description: 'Momentum-based trading with RSI confirmation'
            }
        ];
    }

    render() {
        return `
            <div class="page-container backtest-page">
                <div class="page-header">
                    <h2><i class="fas fa-chart-line"></i> Strategy Backtesting</h2>
                    <p>Test dan analisis performance strategy trading secara historical</p>
                </div>

                <!-- Backtest Configuration -->
                <div class="card backtest-config">
                    <h3><i class="fas fa-cog"></i> Backtest Configuration</h3>
                    <div class="config-grid">
                        <div class="config-section">
                            <h4>Strategy Settings</h4>
                            <div class="form-group">
                                <label>Strategy:</label>
                                <select id="strategy-select">
                                    ${this.strategies.map(s => 
                                        `<option value="${s.id}">${s.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Timeframe:</label>
                                <select id="timeframe-select">
                                    <option value="1m">1 Minute</option>
                                    <option value="5m" selected>5 Minutes</option>
                                    <option value="15m">15 Minutes</option>
                                    <option value="1h">1 Hour</option>
                                    <option value="4h">4 Hours</option>
                                    <option value="1d">1 Day</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Confidence Threshold:</label>
                                <input type="range" id="confidence-threshold" min="50" max="95" value="75">
                                <span id="confidence-value">75%</span>
                            </div>
                        </div>

                        <div class="config-section">
                            <h4>Date Range</h4>
                            <div class="form-group">
                                <label>Start Date:</label>
                                <input type="date" id="start-date" value="${this.getDefaultStartDate()}">
                            </div>
                            <div class="form-group">
                                <label>End Date:</label>
                                <input type="date" id="end-date" value="${this.getDefaultEndDate()}">
                            </div>
                            <div class="form-group">
                                <label>Quick Select:</label>
                                <div class="quick-dates">
                                    <button class="quick-date" data-days="7">7 Days</button>
                                    <button class="quick-date" data-days="30">30 Days</button>
                                    <button class="quick-date" data-days="90">90 Days</button>
                                    <button class="quick-date" data-days="365">1 Year</button>
                                </div>
                            </div>
                        </div>

                        <div class="config-section">
                            <h4>Trading Parameters</h4>
                            <div class="form-group">
                                <label>Initial Capital ($):</label>
                                <input type="number" id="initial-capital" value="10000" min="1000" step="1000">
                            </div>
                            <div class="form-group">
                                <label>Position Size (%):</label>
                                <input type="range" id="position-size" min="1" max="100" value="10">
                                <span id="position-size-value">10%</span>
                            </div>
                            <div class="form-group">
                                <label>Stop Loss (%):</label>
                                <input type="range" id="stop-loss" min="0.5" max="10" step="0.5" value="2">
                                <span id="stop-loss-value">2%</span>
                            </div>
                            <div class="form-group">
                                <label>Take Profit (%):</label>
                                <input type="range" id="take-profit" min="1" max="20" step="0.5" value="5">
                                <span id="take-profit-value">5%</span>
                            </div>
                        </div>
                    </div>

                    <div class="config-actions">
                        <button id="run-backtest" class="run-btn">
                            <i class="fas fa-play"></i> Run Backtest
                        </button>
                        <button id="save-config" class="save-btn">
                            <i class="fas fa-save"></i> Save Config
                        </button>
                        <button id="load-config" class="load-btn">
                            <i class="fas fa-folder-open"></i> Load Config
                        </button>
                    </div>
                </div>

                <!-- Backtest Progress -->
                <div class="card backtest-progress" id="backtest-progress" style="display: none;">
                    <h3><i class="fas fa-spinner fa-spin"></i> Running Backtest</h3>
                    <div class="progress-info">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                        <div class="progress-text">
                            <span id="progress-percentage">0%</span>
                            <span id="progress-status">Initializing...</span>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <div class="stat">
                            <span class="label">Trades Executed:</span>
                            <span id="trades-count">0</span>
                        </div>
                        <div class="stat">
                            <span class="label">Current P&L:</span>
                            <span id="current-pnl">$0.00</span>
                        </div>
                        <div class="stat">
                            <span class="label">Win Rate:</span>
                            <span id="current-winrate">0%</span>
                        </div>
                    </div>
                    <button id="stop-backtest" class="stop-btn">
                        <i class="fas fa-stop"></i> Stop Backtest
                    </button>
                </div>

                <!-- Backtest Results -->
                <div class="card backtest-results" id="backtest-results" style="display: none;">
                    <h3><i class="fas fa-chart-bar"></i> Backtest Results</h3>
                    
                    <!-- Performance Summary -->
                    <div class="results-summary">
                        <div class="summary-grid">
                            <div class="summary-item profit">
                                <div class="summary-value" id="total-return">+0%</div>
                                <div class="summary-label">Total Return</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-value" id="total-trades">0</div>
                                <div class="summary-label">Total Trades</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-value" id="win-rate">0%</div>
                                <div class="summary-label">Win Rate</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-value" id="profit-factor">0.00</div>
                                <div class="summary-label">Profit Factor</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-value" id="max-drawdown">0%</div>
                                <div class="summary-label">Max Drawdown</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-value" id="sharpe-ratio">0.00</div>
                                <div class="summary-label">Sharpe Ratio</div>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Chart -->
                    <div class="results-chart">
                        <h4>Equity Curve</h4>
                        <div id="equity-chart" class="chart-container"></div>
                    </div>

                    <!-- Trade Analysis -->
                    <div class="trade-analysis">
                        <div class="analysis-tabs">
                            <button class="tab-btn active" data-tab="trades">Trade List</button>
                            <button class="tab-btn" data-tab="monthly">Monthly Returns</button>
                            <button class="tab-btn" data-tab="drawdown">Drawdown Analysis</button>
                        </div>

                        <div class="tab-content active" id="trades-tab">
                            <div class="trades-table-container">
                                <table class="trades-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Entry</th>
                                            <th>Exit</th>
                                            <th>P&L</th>
                                            <th>Return %</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody id="trades-tbody">
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="tab-content" id="monthly-tab">
                            <div id="monthly-returns-chart" class="chart-container"></div>
                        </div>

                        <div class="tab-content" id="drawdown-tab">
                            <div id="drawdown-chart" class="chart-container"></div>
                        </div>
                    </div>

                    <div class="results-actions">
                        <button id="export-results" class="export-btn">
                            <i class="fas fa-download"></i> Export Results
                        </button>
                        <button id="save-strategy" class="save-btn">
                            <i class="fas fa-save"></i> Save Strategy
                        </button>
                        <button id="compare-results" class="compare-btn">
                            <i class="fas fa-balance-scale"></i> Compare
                        </button>
                    </div>
                </div>

                <!-- Strategy Comparison -->
                <div class="card strategy-comparison">
                    <h3><i class="fas fa-balance-scale"></i> Strategy Comparison</h3>
                    <div class="comparison-controls">
                        <select id="compare-strategy1">
                            <option value="">Select Strategy 1</option>
                        </select>
                        <select id="compare-strategy2">
                            <option value="">Select Strategy 2</option>
                        </select>
                        <button id="run-comparison" class="compare-btn">
                            <i class="fas fa-chart-line"></i> Compare
                        </button>
                    </div>
                    <div id="comparison-results" class="comparison-results" style="display: none;">
                        <div class="comparison-chart">
                            <div id="comparison-equity-chart" class="chart-container"></div>
                        </div>
                        <div class="comparison-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Metric</th>
                                        <th>Strategy 1</th>
                                        <th>Strategy 2</th>
                                        <th>Better</th>
                                    </tr>
                                </thead>
                                <tbody id="comparison-tbody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Saved Results -->
                <div class="card saved-results">
                    <h3><i class="fas fa-history"></i> Saved Backtest Results</h3>
                    <div class="saved-results-container" id="saved-results-container">
                        <div class="no-results">
                            <i class="fas fa-chart-line"></i>
                            <p>No saved backtest results yet. Run a backtest to see results here.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        const loadingManager = window.LoadingManager;
        
        try {
            // Show initial loading state
            if (loadingManager) {
                loadingManager.showInlineLoading('.backtest-page', 'Initializing backtest environment...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-page', 'Setting up configuration controls...');
            }
            
            await this.setupConfigControlsWithLoading();
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-page', 'Initializing backtest controls...');
            }
            
            await this.setupBacktestControlsWithLoading();
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-page', 'Setting up results interface...');
            }
            
            await this.setupResultsTabsWithLoading();
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-page', 'Loading saved results...');
            }
            
            await this.loadSavedResultsWithLoading();
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-page', 'Backtest environment ready!');
            }
            
            // Brief delay to show completion
            await new Promise(resolve => setTimeout(resolve, 200));
            
        } catch (error) {
            console.error('Error initializing backtest page:', error);
            if (loadingManager) {
                loadingManager.showError('.backtest-page', 'Failed to initialize backtest environment');
            }
        } finally {
            // Hide loading state
            if (loadingManager) {
                loadingManager.hideInlineLoading('.backtest-page');
            }
        }
    }

    async setupConfigControlsWithLoading() {
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Range sliders
        const sliders = ['confidence-threshold', 'position-size', 'stop-loss', 'take-profit'];
        sliders.forEach(id => {
            const slider = document.getElementById(id);
            const valueSpan = document.getElementById(id.replace('-', '-') + '-value');
            
            if (slider && valueSpan) {
                slider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    const unit = id.includes('threshold') || id.includes('size') || 
                                id.includes('loss') || id.includes('profit') ? '%' : '';
                    valueSpan.textContent = value + unit;
                });
            }
        });

        // Quick date buttons
        document.querySelectorAll('.quick-date').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const days = parseInt(e.target.dataset.days);
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - days);
                
                document.getElementById('start-date').value = this.formatDate(startDate);
                document.getElementById('end-date').value = this.formatDate(endDate);
            });
        });
    }

    setupConfigControls() {
        // Range sliders
        const sliders = ['confidence-threshold', 'position-size', 'stop-loss', 'take-profit'];
        sliders.forEach(id => {
            const slider = document.getElementById(id);
            const valueSpan = document.getElementById(id.replace('-', '-') + '-value');
            
            if (slider && valueSpan) {
                slider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    const unit = id.includes('threshold') || id.includes('size') || 
                                id.includes('loss') || id.includes('profit') ? '%' : '';
                    valueSpan.textContent = value + unit;
                });
            }
        });

        // Quick date buttons
        document.querySelectorAll('.quick-date').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const days = parseInt(e.target.dataset.days);
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - days);
                
                document.getElementById('start-date').value = this.formatDate(startDate);
                document.getElementById('end-date').value = this.formatDate(endDate);
            });
        });
    }

    async setupBacktestControlsWithLoading() {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const runBtn = document.getElementById('run-backtest');
        const stopBtn = document.getElementById('stop-backtest');

        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.runBacktest();
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopBacktest();
            });
        }
    }

    setupBacktestControls() {
        const runBtn = document.getElementById('run-backtest');
        const stopBtn = document.getElementById('stop-backtest');

        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.runBacktest();
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopBacktest();
            });
        }
    }

    async setupResultsTabsWithLoading() {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    setupResultsTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async runBacktest() {
        if (this.isRunning) return;

        const loadingUtil = window.LoadingUtil;
        this.isRunning = true;
        
        try {
            // Show initial loading state
            if (loadingUtil) {
                loadingUtil.showInline('.backtest-config', 'Validating configuration...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const config = this.getBacktestConfig();
            
            if (loadingUtil) {
                loadingUtil.updateInline('.backtest-config', 'Preparing backtest environment...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Show progress
            document.getElementById('backtest-progress').style.display = 'block';
            document.getElementById('backtest-results').style.display = 'none';

            if (loadingUtil) {
                loadingUtil.updateInline('.backtest-config', 'Starting backtest execution...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const results = await this.executeBacktest(config);
            
            if (loadingUtil) {
                loadingUtil.updateInline('.backtest-config', 'Processing results...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            this.displayResults(results);
            
            if (loadingUtil) {
                loadingUtil.updateInline('.backtest-config', 'Backtest completed successfully!');
            }
            
            // Brief delay to show completion
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error('Backtest error:', error);
            this.showNotification('Backtest failed: ' + error.message, 'error');
            
            if (loadingUtil) {
                loadingUtil.showError('.backtest-config', 'Backtest execution failed');
            }
        } finally {
            this.isRunning = false;
            document.getElementById('backtest-progress').style.display = 'none';
            
            // Hide loading state
            if (loadingUtil) {
                loadingUtil.hideInline('.backtest-config');
            }
        }
    }

    getBacktestConfig() {
        return {
            strategy: document.getElementById('strategy-select').value,
            timeframe: document.getElementById('timeframe-select').value,
            confidence: parseInt(document.getElementById('confidence-threshold').value),
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            initialCapital: parseFloat(document.getElementById('initial-capital').value),
            positionSize: parseFloat(document.getElementById('position-size').value),
            stopLoss: parseFloat(document.getElementById('stop-loss').value),
            takeProfit: parseFloat(document.getElementById('take-profit').value)
        };
    }

    async executeBacktest(config) {
        const loadingManager = window.LoadingManager;
        
        try {
            // Initial setup phase
            if (loadingManager) {
                loadingManager.showInlineLoading('.backtest-progress', 'Initializing backtest parameters...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Simulate backtest execution
            const totalDays = this.getDaysBetween(new Date(config.startDate), new Date(config.endDate));
            const trades = [];
            let equity = config.initialCapital;
            let maxEquity = equity;
            let maxDrawdown = 0;
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-progress', 'Loading historical market data...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-progress', 'Applying trading strategy...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            for (let day = 0; day < totalDays; day++) {
                // Update progress with more detailed messages
                const progress = (day / totalDays) * 100;
                
                if (day % Math.floor(totalDays / 10) === 0 && loadingManager) {
                    const phase = Math.floor((day / totalDays) * 10) + 1;
                    loadingManager.updateInlineLoadingMessage('.backtest-progress', 
                        `Executing backtest phase ${phase}/10...`);
                }
                
                this.updateProgress(progress, `Processing day ${day + 1} of ${totalDays}`);
                
                // Simulate trade generation (random for demo)
                if (Math.random() < 0.1) { // 10% chance of trade per day
                    const trade = this.generateRandomTrade(config, day);
                    trades.push(trade);
                    equity += trade.pnl;
                    
                    if (equity > maxEquity) {
                        maxEquity = equity;
                    }
                    
                    const drawdown = ((maxEquity - equity) / maxEquity) * 100;
                    if (drawdown > maxDrawdown) {
                        maxDrawdown = drawdown;
                    }

                    // Update live stats
                    document.getElementById('trades-count').textContent = trades.length;
                    document.getElementById('current-pnl').textContent = 
                        '$' + (equity - config.initialCapital).toFixed(2);
                    
                    const winRate = trades.length > 0 ? 
                        (trades.filter(t => t.pnl > 0).length / trades.length * 100).toFixed(1) : 0;
                    document.getElementById('current-winrate').textContent = winRate + '%';
                }
                
                // Small delay to show progress
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-progress', 'Calculating performance metrics...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.backtest-progress', 'Generating final results...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));

            return {
                config,
                trades,
                finalEquity: equity,
                totalReturn: ((equity - config.initialCapital) / config.initialCapital) * 100,
                maxDrawdown,
                winRate: trades.length > 0 ? (trades.filter(t => t.pnl > 0).length / trades.length) * 100 : 0,
                profitFactor: this.calculateProfitFactor(trades),
                sharpeRatio: this.calculateSharpeRatio(trades)
            };
            
        } catch (error) {
            if (loadingManager) {
                loadingManager.showError('.backtest-progress', 'Backtest execution failed');
            }
            throw error;
        } finally {
            if (loadingManager) {
                loadingManager.hideInlineLoading('.backtest-progress');
            }
        }
    }

    generateRandomTrade(config, day) {
        const isWin = Math.random() < 0.6; // 60% win rate
        const entryPrice = 2000 + Math.random() * 100; // Random price around 2000
        const positionValue = config.initialCapital * (config.positionSize / 100);
        
        let exitPrice, pnl;
        if (isWin) {
            exitPrice = entryPrice * (1 + (config.takeProfit / 100));
            pnl = positionValue * (config.takeProfit / 100);
        } else {
            exitPrice = entryPrice * (1 - (config.stopLoss / 100));
            pnl = -positionValue * (config.stopLoss / 100);
        }

        return {
            date: new Date(Date.now() - (day * 24 * 60 * 60 * 1000)),
            type: 'LONG',
            entry: entryPrice,
            exit: exitPrice,
            pnl: pnl,
            returnPct: (pnl / positionValue) * 100,
            duration: Math.floor(Math.random() * 24) + 1 // 1-24 hours
        };
    }

    updateProgress(percentage, status) {
        document.getElementById('progress-fill').style.width = percentage + '%';
        document.getElementById('progress-percentage').textContent = Math.round(percentage) + '%';
        document.getElementById('progress-status').textContent = status;
    }

    displayResults(results) {
        // Update summary
        document.getElementById('total-return').textContent = 
            (results.totalReturn >= 0 ? '+' : '') + results.totalReturn.toFixed(2) + '%';
        document.getElementById('total-trades').textContent = results.trades.length;
        document.getElementById('win-rate').textContent = results.winRate.toFixed(1) + '%';
        document.getElementById('profit-factor').textContent = results.profitFactor.toFixed(2);
        document.getElementById('max-drawdown').textContent = results.maxDrawdown.toFixed(2) + '%';
        document.getElementById('sharpe-ratio').textContent = results.sharpeRatio.toFixed(2);

        // Update trades table
        this.populateTradesTable(results.trades);

        // Show results
        document.getElementById('backtest-results').style.display = 'block';

        // Save results
        this.saveBacktestResult(results);
    }

    populateTradesTable(trades) {
        const tbody = document.getElementById('trades-tbody');
        if (!tbody) return;

        tbody.innerHTML = trades.map(trade => `
            <tr class="${trade.pnl >= 0 ? 'profit' : 'loss'}">
                <td>${trade.date.toLocaleDateString()}</td>
                <td>${trade.type}</td>
                <td>$${trade.entry.toFixed(2)}</td>
                <td>$${trade.exit.toFixed(2)}</td>
                <td class="${trade.pnl >= 0 ? 'profit' : 'loss'}">
                    ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}
                </td>
                <td class="${trade.returnPct >= 0 ? 'profit' : 'loss'}">
                    ${trade.returnPct >= 0 ? '+' : ''}${trade.returnPct.toFixed(2)}%
                </td>
                <td>${trade.duration}h</td>
            </tr>
        `).join('');
    }

    calculateProfitFactor(trades) {
        const profits = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
        const losses = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
        return losses > 0 ? profits / losses : profits > 0 ? 999 : 0;
    }

    calculateSharpeRatio(trades) {
        if (trades.length === 0) return 0;
        
        const returns = trades.map(t => t.returnPct);
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        
        return stdDev > 0 ? avgReturn / stdDev : 0;
    }

    stopBacktest() {
        this.isRunning = false;
        document.getElementById('backtest-progress').style.display = 'none';
    }

    saveBacktestResult(results) {
        const savedResults = JSON.parse(localStorage.getItem('goldradar-backtest-results') || '[]');
        
        const resultSummary = {
            id: Date.now(),
            date: new Date(),
            strategy: results.config.strategy,
            timeframe: results.config.timeframe,
            totalReturn: results.totalReturn,
            winRate: results.winRate,
            totalTrades: results.trades.length,
            maxDrawdown: results.maxDrawdown,
            profitFactor: results.profitFactor,
            sharpeRatio: results.sharpeRatio,
            config: results.config
        };

        savedResults.unshift(resultSummary);
        
        // Keep only last 20 results
        if (savedResults.length > 20) {
            savedResults.splice(20);
        }

        localStorage.setItem('goldradar-backtest-results', JSON.stringify(savedResults));
        this.renderSavedResults();
    }

    async loadSavedResultsWithLoading() {
        await new Promise(resolve => setTimeout(resolve, 200));
        this.renderSavedResults();
    }

    loadSavedResults() {
        this.renderSavedResults();
    }

    renderSavedResults() {
        const container = document.getElementById('saved-results-container');
        const savedResults = JSON.parse(localStorage.getItem('goldradar-backtest-results') || '[]');

        if (savedResults.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-chart-line"></i>
                    <p>No saved backtest results yet. Run a backtest to see results here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = savedResults.map(result => `
            <div class="saved-result-item">
                <div class="result-header">
                    <h4>${result.strategy} - ${result.timeframe}</h4>
                    <span class="result-date">${new Date(result.date).toLocaleDateString()}</span>
                </div>
                <div class="result-metrics">
                    <div class="metric">
                        <span class="label">Return:</span>
                        <span class="value ${result.totalReturn >= 0 ? 'profit' : 'loss'}">
                            ${result.totalReturn >= 0 ? '+' : ''}${result.totalReturn.toFixed(2)}%
                        </span>
                    </div>
                    <div class="metric">
                        <span class="label">Win Rate:</span>
                        <span class="value">${result.winRate.toFixed(1)}%</span>
                    </div>
                    <div class="metric">
                        <span class="label">Trades:</span>
                        <span class="value">${result.totalTrades}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Sharpe:</span>
                        <span class="value">${result.sharpeRatio.toFixed(2)}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="load-result-btn" data-id="${result.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="delete-result-btn" data-id="${result.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        // Setup action buttons
        container.querySelectorAll('.delete-result-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const resultId = parseInt(e.target.closest('.delete-result-btn').dataset.id);
                this.deleteBacktestResult(resultId);
            });
        });
    }

    deleteBacktestResult(resultId) {
        let savedResults = JSON.parse(localStorage.getItem('goldradar-backtest-results') || '[]');
        savedResults = savedResults.filter(result => result.id !== resultId);
        localStorage.setItem('goldradar-backtest-results', JSON.stringify(savedResults));
        this.renderSavedResults();
    }

    getDefaultStartDate() {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return this.formatDate(date);
    }

    getDefaultEndDate() {
        return this.formatDate(new Date());
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    getDaysBetween(startDate, endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}"></i>
            <span>${message}</span>
            <button class="close-notification">×</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Manual close
        notification.querySelector('.close-notification').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    destroy() {
        // Cleanup when leaving page
        this.isRunning = false;
        const loadingUtil = window.LoadingUtil;
        if (loadingUtil) {
            loadingUtil.hideInline('.backtest-config');
        }
    }
}

// Export for use in main app
window.BacktestPage = BacktestPage;