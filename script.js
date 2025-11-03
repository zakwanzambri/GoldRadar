// Gold Breakout Scanner - Main JavaScript File
class GoldBreakoutScanner {
    constructor() {
        this.chart = null;
        this.candlestickSeries = null;
        this.currentTimeframe = 60; // Default to H1
        this.isConnected = false;
        this.priceData = [];
        this.breakoutThreshold = 0.002; // 0.2% threshold
        this.lastPrice = 0;
        this.supportLevel = 0;
        this.resistanceLevel = 0;
        this.alertsEnabled = true;
        
        // Performance tracking
        this.totalSignals = 0;
        this.successfulSignals = 0;
        this.confidenceScores = [];
        
        // DOM update optimization
        this.updateQueue = new Map();
        this.isUpdating = false;
        this.lastUpdateTime = 0;
        this.updateThrottle = 50; // Minimum 50ms between DOM updates
        
        // WebSocket simulation for real-time streaming
        this.wsSimulation = null;
        this.streamingData = true;
        this.tickBuffer = [];
        this.maxBufferSize = 100;
        
        // Chart update optimization
        this.chartUpdateQueue = [];
        this.isChartUpdating = false;
        this.lastChartUpdate = 0;
        this.chartUpdateThrottle = 100; // Minimum 100ms between chart updates
        
        // Real-time update intervals
        this.priceUpdateInterval = null;
        this.candleUpdateInterval = null;
        
        // Initialization guard
        this.initialized = false;
    }

    init() {
        // Always reflect initial disconnected status
        this.updateConnectionStatus(false);

        // If router is present, defer initialization until Home/Dashboard is rendered
        const hasRouter = typeof window.GoldRadarRouter !== 'undefined';
        if (hasRouter) {
            const onRouteChanged = (event) => {
                const detail = event && event.detail ? event.detail : {};
                const route = detail.route || (window.location.hash ? window.location.hash.replace('#', '') : '');
                if (route === '/home' || route === '/dashboard') {
                    // Ensure chart container exists before initializing chart
                    const chartContainer = document.getElementById('chart');
                    if (!chartContainer) {
                        const lm = window.LoadingManager;
                        if (lm) {
                            lm.showRetryError('.chart-container', 'Chart container not found', () => {
                                // Retry by navigating to dashboard route
                                window.location.hash = '#/dashboard';
                            }, () => {
                                lm.hideInlineLoading('.chart-container');
                            });
                        } else {
                            console.warn('Chart container not found when initializing scanner.');
                        }
                        return; // Wait until container exists
                    }

                    if (this.initialized) {
                        // Already initialized; remove listener and do nothing
                        window.removeEventListener('routeChanged', onRouteChanged);
                        return;
                    }

                    // Perform full initialization now that the page is ready
                    this.initChart();
                    this.setupEventListeners();
                    this.startDataFeed();
                    this.requestNotificationPermission();
                    this.startLoops();
                    this.initialized = true;

                    // Stop listening after successful init
                    window.removeEventListener('routeChanged', onRouteChanged);
                }
            };

            // Listen for router to finish rendering the page
            window.addEventListener('routeChanged', onRouteChanged);

            return;
        }

        // Legacy fallback (no router): initialize immediately with slight delay
        setTimeout(() => {
            this.initChart();
        }, 100);
        this.setupEventListeners();
        this.startDataFeed();
        this.requestNotificationPermission();
        this.startLoops();
    }

    async initChart() {
        const loadingManager = window.LoadingManager;
        
        try {
            // Show chart loading state
            if (loadingManager) {
                loadingManager.showInlineLoading('.chart-container', 'Initializing trading chart...');
            }

            // Check if LightweightCharts is available
            if (typeof LightweightCharts === 'undefined') {
                console.error('LightweightCharts library not loaded');
                if (loadingManager) {
                    loadingManager.showError('.chart-container', 'Chart library not loaded');
                }
                return;
            }

            const chartContainer = document.getElementById('chart');
            if (!chartContainer) {
                console.error('Chart container not found');
                if (loadingManager) {
                    loadingManager.showError('.chart-container', 'Chart container not found');
                }
                return;
            }

            // Update loading message
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Configuring chart settings...');
            }

            // Get container dimensions with fallback
            const containerRect = chartContainer.getBoundingClientRect();
            const width = Math.max(containerRect.width || 800, 400);
            const height = Math.max(containerRect.height || 400, 300);

            console.log('Initializing chart with dimensions:', { width, height });

            // Update loading message
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Creating chart instance...');
            }

            // Create chart with proper error handling
            this.chart = LightweightCharts.createChart(chartContainer, {
                width: width,
                height: height,
                layout: {
                    backgroundColor: 'transparent',
                    textColor: '#d1d4dc',
                },
                grid: {
                    vertLines: {
                        color: 'rgba(42, 46, 57, 0.5)',
                    },
                    horzLines: {
                        color: 'rgba(42, 46, 57, 0.5)',
                    },
                },
                rightPriceScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                },
                timeScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                    timeVisible: true,
                    secondsVisible: false,
                },
                crosshair: {
                    mode: LightweightCharts.CrosshairMode.Normal,
                },
                handleScroll: {
                    mouseWheel: true,
                    pressedMouseMove: true,
                },
                handleScale: {
                    axisPressedMouseMove: true,
                    mouseWheel: true,
                    pinch: true,
                },
            });

            // Update loading message
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Adding chart series...');
            }

            // Create candlestick series
            this.candlestickSeries = this.chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            // Add volume series
            this.volumeSeries = this.chart.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '',
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });

            // Update loading message
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Setting up chart interactions...');
            }

            // Handle window resize
            const resizeObserver = new ResizeObserver(entries => {
                if (this.chart && entries.length > 0) {
                    const { width, height } = entries[0].contentRect;
                    this.chart.applyOptions({
                        width: Math.max(width, 400),
                        height: Math.max(height, 300)
                    });
                }
            });
            
            resizeObserver.observe(chartContainer);

            // Final loading step
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Chart ready!');
            }

            // Brief delay to show completion
            await new Promise(resolve => setTimeout(resolve, 300));

            console.log('Chart initialized successfully');
            
        } catch (error) {
            console.error('Error initializing chart:', error);
            if (loadingManager) {
                loadingManager.showError('.chart-container', 'Chart initialization failed');
            } else {
                // Show fallback message to user
                const chartContainer = document.getElementById('chart');
                if (chartContainer) {
                    chartContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Chart initialization failed. Please refresh the page.</div>';
                }
            }
        } finally {
            // Hide loading state
            if (loadingManager) {
                loadingManager.hideInlineLoading('.chart-container');
            }
        }
    }

    // Start recurring analysis and UI update loops
    startLoops() {
        // Start high-frequency analysis loop for real-time updates (max 1 second latency)
        setInterval(() => this.analyzeMarket(), 500); // Analyze every 0.5 seconds for instant detection
        setInterval(() => this.updatePerformanceStats(), 1000); // Update stats every 1 second
        setInterval(() => this.updateMarketInfo(), 250); // Update market info every 0.25 seconds
        setInterval(() => this.detectPatterns(), 1000); // Pattern detection every 1 second
    }

    setupEventListeners() {
        // Timeframe buttons
        document.querySelectorAll('.tf-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTimeframe = parseInt(e.target.dataset.tf);
                this.loadHistoricalData();
            });
        });

        // Alert settings
        document.getElementById('alerts-enabled').addEventListener('change', (e) => {
            this.alertsEnabled = e.target.checked;
        });

        // Chart controls
        document.getElementById('auto-scale').addEventListener('click', () => {
            this.chart.timeScale().fitContent();
        });

        document.getElementById('reset-zoom').addEventListener('click', () => {
            this.chart.timeScale().resetTimeScale();
        });

        // Modal controls
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('alert-modal').style.display = 'none';
        });

        document.getElementById('dismiss-alert').addEventListener('click', () => {
            document.getElementById('alert-modal').style.display = 'none';
        });

        // Backtesting
        document.getElementById('run-backtest').addEventListener('click', () => {
            this.runBacktest();
        });
    }

    async startDataFeed() {
        const loadingManager = window.LoadingManager;
        
        try {
            console.log('Starting data feed...');
            
            // Show loading state for data feed initialization
            if (loadingManager) {
                loadingManager.showInlineLoading('.connection-status', 'Initializing data feed...');
            }
            
            // Update connection status
            this.updateConnectionStatus(false);
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.connection-status', 'Connecting to market data...');
            }
            
            // Simulate connection process
            await this.simulateConnection();
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.connection-status', 'Waiting for chart initialization...');
            }
            
            // Wait for chart to be fully initialized
            let retries = 0;
            const maxRetries = 20;
            
            while ((!this.chart || !this.candlestickSeries) && retries < maxRetries) {
                console.log(`Waiting for chart to be ready... (${retries + 1}/${maxRetries})`);
                
                if (loadingManager) {
                    loadingManager.updateInlineLoadingMessage('.connection-status', `Waiting for chart... (${retries + 1}/${maxRetries})`);
                }
                
                await new Promise(resolve => setTimeout(resolve, 200));
                retries++;
            }
            
            if (!this.chart || !this.candlestickSeries) {
                console.error('Chart not ready after waiting, cannot start data feed');
                this.updateConnectionStatus(false);
                
                if (loadingManager) {
                    loadingManager.showError('.connection-status', 'Chart initialization failed');
                }
                return;
            }
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.connection-status', 'Loading historical data...');
            }
            
            // Load historical data first
            await this.loadHistoricalData();
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.connection-status', 'Starting real-time updates...');
            }
            
            // Start WebSocket simulation
            this.startWebSocketSimulation();
            
            // Start real-time updates
            this.startRealTimeUpdates();
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.connection-status', 'Data feed connected!');
            }
            
            // Update connection status to connected
            this.updateConnectionStatus(true);
            
            // Brief delay to show success message
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log('Data feed started successfully');
            
        } catch (error) {
            console.error('Failed to start data feed:', error);
            this.updateConnectionStatus(false);
            
            if (loadingManager) {
                loadingManager.showError('.connection-status', 'Failed to start data feed');
            }
        } finally {
            // Hide loading state
            if (loadingManager) {
                loadingManager.hideInlineLoading('.connection-status');
            }
        }
    }

    async simulateConnection() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.isConnected = true;
                resolve();
            }, 2000);
        });
    }
    
    startWebSocketSimulation() {
        // Simulate WebSocket connection for real-time tick data
        this.wsSimulation = setInterval(() => {
            if (this.streamingData && this.priceData.length > 0) {
                const tick = this.generateTick();
                this.processTick(tick);
            }
        }, 100); // Generate ticks every 100ms for real-time feel
    }
    
    generateTick() {
        const lastCandle = this.priceData[this.priceData.length - 1];
        const basePrice = lastCandle ? lastCandle.close : 2000;
        
        // Generate realistic tick data with micro-movements
        const volatility = 0.0002; // 0.02% volatility per tick
        const change = (Math.random() - 0.5) * volatility * basePrice;
        const newPrice = basePrice + change;
        
        return {
            price: newPrice,
            timestamp: Date.now(),
            volume: Math.floor(Math.random() * 100 + 10),
            bid: newPrice - (Math.random() * 0.5 + 0.2),
            ask: newPrice + (Math.random() * 0.5 + 0.2)
        };
    }
    
    processTick(tick) {
        // Add to buffer for processing
        this.tickBuffer.push(tick);
        
        // Keep buffer size manageable
        if (this.tickBuffer.length > this.maxBufferSize) {
            this.tickBuffer.shift();
        }
        
        // Update price display immediately for real-time feel
        this.updatePriceDisplay(tick.price);
        
        // Update spread based on bid/ask
        this.queueDOMUpdate('spread-update', () => {
            const spreadEl = document.getElementById('spread');
            if (spreadEl) {
                const spread = (tick.ask - tick.bid).toFixed(1);
                spreadEl.textContent = spread;
            }
        });
    }
    
    stopWebSocketSimulation() {
        if (this.wsSimulation) {
            clearInterval(this.wsSimulation);
            this.wsSimulation = null;
        }
        this.streamingData = false;
    }

    async loadHistoricalData() {
        const loadingManager = window.LoadingManager;
        
        try {
            console.log('Loading historical data...');
            
            // Show loading state for data loading
            if (loadingManager) {
                loadingManager.showInlineLoading('.chart-container', 'Loading historical data...');
            }
            
            // Wait for chart to be initialized
            let retries = 0;
            const maxRetries = 10;
            
            while ((!this.chart || !this.candlestickSeries) && retries < maxRetries) {
                console.log(`Waiting for chart initialization... (${retries + 1}/${maxRetries})`);
                if (loadingManager) {
                    loadingManager.updateInlineLoadingMessage('.chart-container', `Waiting for chart... (${retries + 1}/${maxRetries})`);
                }
                await new Promise(resolve => setTimeout(resolve, 100));
                retries++;
            }
            
            if (!this.chart || !this.candlestickSeries) {
                console.error('Chart not initialized after waiting');
                if (loadingManager) {
                    loadingManager.showError('.chart-container', 'Chart not initialized');
                }
                return;
            }
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Generating market data...');
            }
            
            // Generate simulated data
            const data = this.generateSimulatedData(100);
            this.priceData = data;
            
            console.log('Generated data points:', data.length);
            console.log('Sample data:', data.slice(0, 3));
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Loading candlestick data...');
            }
            
            // Set data to candlestick series
            if (this.candlestickSeries && typeof this.candlestickSeries.setData === 'function') {
                this.candlestickSeries.setData(data);
                console.log('Data loaded to candlestick series successfully');
            } else {
                console.error('Candlestick series not properly initialized');
                if (loadingManager) {
                    loadingManager.showError('.chart-container', 'Candlestick series error');
                }
                return;
            }
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Loading volume data...');
            }
            
            // Generate and set volume data
            const volumeData = data.map(candle => ({
                time: candle.time,
                value: Math.floor(Math.random() * 1000000) + 500000, // Random volume
                color: candle.close >= candle.open ? '#26a69a' : '#ef5350'
            }));
            
            if (this.volumeSeries && typeof this.volumeSeries.setData === 'function') {
                this.volumeSeries.setData(volumeData);
                console.log('Volume data loaded successfully');
            }
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Calculating support/resistance...');
            }
            
            // Calculate support and resistance
            this.calculateSupportResistance();
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Updating price display...');
            }
            
            // Update current price display
            if (data.length > 0) {
                const lastCandle = data[data.length - 1];
                this.updatePriceDisplay(lastCandle.close);
                console.log('Current price updated:', lastCandle.close);
            }
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Finalizing chart...');
            }
            
            // Fit chart content
            if (this.chart && typeof this.chart.timeScale === 'function') {
                this.chart.timeScale().fitContent();
            }
            
            if (loadingManager) {
                loadingManager.updateInlineLoadingMessage('.chart-container', 'Data loaded successfully!');
            }
            
            // Brief delay to show completion
            await new Promise(resolve => setTimeout(resolve, 300));
            
            console.log('Historical data loading completed successfully');
            
        } catch (error) {
            console.error('Error loading historical data:', error);
            if (loadingManager) {
                loadingManager.showError('.chart-container', 'Failed to load historical data');
            }
        } finally {
            // Hide loading state
            if (loadingManager) {
                loadingManager.hideInlineLoading('.chart-container');
            }
        }
    }

    generateSimulatedData(count) {
        const data = [];
        let basePrice = 2000 + Math.random() * 100; // XAU/USD around $2000-2100
        let time = Math.floor(Date.now() / 1000) - (count * this.currentTimeframe * 60);
        
        for (let i = 0; i < count; i++) {
            const volatility = 0.005; // 0.5% volatility
            const change = (Math.random() - 0.5) * volatility * basePrice;
            
            const open = basePrice;
            const close = basePrice + change;
            const high = Math.max(open, close) + Math.random() * 0.002 * basePrice;
            const low = Math.min(open, close) - Math.random() * 0.002 * basePrice;
            
            data.push({
                time: time,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
            });
            
            basePrice = close;
            time += this.currentTimeframe * 60;
        }
        
        return data;
    }

    // Optimized chart update system
    queueChartUpdate(updateFunction) {
        if (!updateFunction || typeof updateFunction !== 'function') {
            console.warn('Invalid update function provided to queueChartUpdate');
            return;
        }
        
        this.chartUpdateQueue.push(updateFunction);
        this.scheduleChartUpdate();
    }
    
    scheduleChartUpdate() {
        // Prevent infinite loops with guard conditions
        if (this.isChartUpdating || this.chartUpdateQueue.length === 0) return;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - this.lastChartUpdate;
        
        if (timeSinceLastUpdate >= this.chartUpdateThrottle) {
            this.processChartUpdates();
        } else {
            // Use setTimeout with proper cleanup to prevent infinite loops
            const timeoutId = setTimeout(() => {
                // Double-check conditions before processing
                if (!this.isChartUpdating && this.chartUpdateQueue.length > 0) {
                    this.processChartUpdates();
                }
            }, this.chartUpdateThrottle - timeSinceLastUpdate);
            
            // Store timeout ID for potential cleanup
            this.chartUpdateTimeoutId = timeoutId;
        }
    }
    
    processChartUpdates() {
        if (this.chartUpdateQueue.length === 0 || this.isChartUpdating) return;
        
        // Clear any pending timeout
        if (this.chartUpdateTimeoutId) {
            clearTimeout(this.chartUpdateTimeoutId);
            this.chartUpdateTimeoutId = null;
        }
        
        this.isChartUpdating = true;
        
        // Process all queued chart updates in a single frame
        requestAnimationFrame(() => {
            try {
                const updates = [...this.chartUpdateQueue]; // Create a copy
                this.chartUpdateQueue.length = 0; // Clear the queue immediately
                
                for (const updateFunction of updates) {
                    if (typeof updateFunction === 'function') {
                        updateFunction();
                    }
                }
            } catch (error) {
                console.warn('Chart update failed:', error);
            } finally {
                this.lastChartUpdate = Date.now();
                this.isChartUpdating = false;
            }
        });
    }

    startRealTimeUpdates() {
        // Stop any existing intervals first
        this.stopRealTimeUpdates();
        
        // High-frequency price updates for real-time feel
        this.priceUpdateInterval = setInterval(() => {
            if (this.isConnected && this.priceData.length > 0) {
                // Update current price more frequently for real-time display
                const lastCandle = this.priceData[this.priceData.length - 1];
                const tickChange = (Math.random() - 0.5) * 0.0005 * lastCandle.close;
                const newPrice = lastCandle.close + tickChange;
                
                // Update price display immediately
                this.updatePriceDisplay(newPrice);
                this.lastPrice = newPrice;
            }
        }, 500); // Update price every 0.5 seconds for real-time feel
        
        // Candle updates based on timeframe with optimized rendering
        this.candleUpdateInterval = setInterval(() => {
            if (this.isConnected && this.priceData.length > 0) {
                const newCandle = this.generateNewCandle();
                this.priceData.push(newCandle);
                
                // Queue chart update for optimized rendering
                this.queueChartUpdate(() => {
                    if (this.candlestickSeries) {
                        this.candlestickSeries.update(newCandle);
                    }
                });
                
                // Keep only last 200 candles for performance
                if (this.priceData.length > 200) {
                    this.priceData.shift();
                }
            }
        }, Math.max(this.currentTimeframe * 1000, 2000)); // Minimum 2 seconds for candle updates
    }

    stopRealTimeUpdates() {
        if (this.priceUpdateInterval) {
            clearInterval(this.priceUpdateInterval);
            this.priceUpdateInterval = null;
        }
        if (this.candleUpdateInterval) {
            clearInterval(this.candleUpdateInterval);
            this.candleUpdateInterval = null;
        }
    }

    generateNewCandle() {
        const lastCandle = this.priceData[this.priceData.length - 1];
        const volatility = 0.003;
        const change = (Math.random() - 0.5) * volatility * lastCandle.close;
        
        const open = lastCandle.close;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 0.001 * open;
        const low = Math.min(open, close) - Math.random() * 0.001 * open;
        
        return {
            time: lastCandle.time + this.currentTimeframe * 60,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
        };
    }

    calculateSupportResistance() {
        if (this.priceData.length < 20) return;
        
        const recentData = this.priceData.slice(-20);
        const highs = recentData.map(d => d.high);
        const lows = recentData.map(d => d.low);
        
        this.resistanceLevel = Math.max(...highs);
        this.supportLevel = Math.min(...lows);
        
        // Update support/resistance lines on chart
        const currentTime = this.priceData[this.priceData.length - 1].time;
        const startTime = this.priceData[Math.max(0, this.priceData.length - 50)].time;
        
        // Only update lines if they are properly initialized
        if (this.supportLine && typeof this.supportLine.setData === 'function') {
            this.supportLine.setData([
                { time: startTime, value: this.supportLevel },
                { time: currentTime, value: this.supportLevel }
            ]);
        }
        
        if (this.resistanceLine && typeof this.resistanceLine.setData === 'function') {
            this.resistanceLine.setData([
                { time: startTime, value: this.resistanceLevel },
                { time: currentTime, value: this.resistanceLevel }
            ]);
        }
    }

    analyzeMarket() {
        if (this.priceData.length < 10) return;
        
        const currentPrice = this.priceData[this.priceData.length - 1].close;
        const previousPrice = this.priceData[this.priceData.length - 2].close;
        
        // Breakout detection
        const breakoutResult = this.detectBreakout(currentPrice, previousPrice);
        
        if (breakoutResult.detected) {
            this.handleBreakoutDetected(breakoutResult);
        } else {
            this.updateBreakoutStatus('consolidation', 0);
        }
        
        // Pattern detection
        this.detectPatterns();
        
        // Update support/resistance
        this.calculateSupportResistance();
    }

    detectBreakout(currentPrice, previousPrice) {
        const priceChange = Math.abs(currentPrice - previousPrice) / previousPrice;
        const volume = Math.random() * 1000000; // Simulated volume
        
        let breakoutType = null;
        let confidence = 0;
        
        // Resistance breakout
        if (currentPrice > this.resistanceLevel && previousPrice <= this.resistanceLevel) {
            breakoutType = 'resistance_breakout';
            confidence = Math.min(95, 60 + (priceChange * 10000));
        }
        // Support breakout
        else if (currentPrice < this.supportLevel && previousPrice >= this.supportLevel) {
            breakoutType = 'support_breakout';
            confidence = Math.min(95, 60 + (priceChange * 10000));
        }
        // High volatility breakout
        else if (priceChange > this.breakoutThreshold) {
            breakoutType = currentPrice > previousPrice ? 'bullish_breakout' : 'bearish_breakout';
            confidence = Math.min(90, 50 + (priceChange * 5000));
        }
        
        // Volume confirmation
        if (volume > 500000) {
            confidence += 10;
        }
        
        return {
            detected: breakoutType !== null,
            type: breakoutType,
            confidence: Math.round(confidence),
            price: currentPrice,
            volume: volume
        };
    }

    handleBreakoutDetected(breakout) {
        this.updateBreakoutStatus('breakout', breakout.confidence);
        
        // Add to signals
        this.addSignal(breakout);
        
        // Show alert if enabled
        if (this.alertsEnabled) {
            this.showAlert(breakout);
        }
        
        // Update performance tracking
        this.totalSignals++;
        this.confidenceScores.push(breakout.confidence);
    }

    addSignal(breakout) {
        const signalsList = document.getElementById('signals-list');
        const signalItem = document.createElement('div');
        signalItem.className = 'signal-item';
        
        const time = new Date().toLocaleTimeString();
        const typeText = this.getBreakoutTypeText(breakout.type);
        
        signalItem.innerHTML = `
            <div class="signal-time">${time}</div>
            <div class="signal-desc">${typeText} - Confidence: ${breakout.confidence}%</div>
        `;
        
        signalsList.insertBefore(signalItem, signalsList.firstChild);
        
        // Keep only last 10 signals
        while (signalsList.children.length > 10) {
            signalsList.removeChild(signalsList.lastChild);
        }
    }

    getBreakoutTypeText(type) {
        const types = {
            'resistance_breakout': 'Resistance Breakout (BUY)',
            'support_breakout': 'Support Breakout (SELL)',
            'bullish_breakout': 'Bullish Breakout (BUY)',
            'bearish_breakout': 'Bearish Breakout (SELL)'
        };
        return types[type] || 'Unknown Breakout';
    }

    showAlert(breakout) {
        const modal = document.getElementById('alert-modal');
        const title = document.getElementById('alert-title');
        const message = document.getElementById('alert-message');
        const type = document.getElementById('alert-type');
        const confidence = document.getElementById('alert-confidence');
        const price = document.getElementById('alert-price');
        
        title.textContent = 'Breakout Detected!';
        message.textContent = `A ${this.getBreakoutTypeText(breakout.type)} has been detected.`;
        type.textContent = this.getBreakoutTypeText(breakout.type);
        confidence.textContent = `${breakout.confidence}%`;
        price.textContent = `$${breakout.price.toFixed(2)}`;
        
        modal.style.display = 'block';
        
        // Play sound if enabled
        if (document.getElementById('sound-alerts').checked) {
            this.playAlertSound();
        }
        
        // Browser notification
        if (document.getElementById('browser-notifications').checked) {
            this.showBrowserNotification(breakout);
        }
    }

    playAlertSound() {
        // Create audio context for alert sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    showBrowserNotification(breakout) {
        if (Notification.permission === 'granted') {
            new Notification('Gold Breakout Detected!', {
                body: `${this.getBreakoutTypeText(breakout.type)} - Confidence: ${breakout.confidence}%`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffd700"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
            });
        }
    }

    detectPatterns() {
        // Simple pattern detection
        if (this.priceData.length < 20) return;
        
        const recentData = this.priceData.slice(-20);
        const patterns = [];
        
        // Ascending Triangle
        if (this.isAscendingTriangle(recentData)) {
            patterns.push({ name: 'Ascending Triangle', confidence: 75 });
        }
        
        // Double Top
        if (this.isDoubleTop(recentData)) {
            patterns.push({ name: 'Double Top', confidence: 68 });
        }
        
        // Head and Shoulders
        if (this.isHeadAndShoulders(recentData)) {
            patterns.push({ name: 'Head & Shoulders', confidence: 82 });
        }
        
        this.updatePatternDisplay(patterns);
    }

    isAscendingTriangle(data) {
        // Simplified ascending triangle detection
        const highs = data.map(d => d.high);
        const lows = data.map(d => d.low);
        
        const recentHighs = highs.slice(-5);
        const recentLows = lows.slice(-5);
        
        const highsFlat = Math.max(...recentHighs) - Math.min(...recentHighs) < 5;
        const lowsRising = recentLows[4] > recentLows[0];
        
        return highsFlat && lowsRising;
    }

    isDoubleTop(data) {
        // Simplified double top detection
        const highs = data.map(d => d.high);
        const maxHigh = Math.max(...highs);
        const highIndices = [];
        
        highs.forEach((high, index) => {
            if (high > maxHigh * 0.98) {
                highIndices.push(index);
            }
        });
        
        return highIndices.length >= 2 && (highIndices[highIndices.length - 1] - highIndices[0]) > 5;
    }

    isHeadAndShoulders(data) {
        // Simplified head and shoulders detection
        if (data.length < 15) return false;
        
        const highs = data.map(d => d.high);
        const peaks = [];
        
        for (let i = 1; i < highs.length - 1; i++) {
            if (highs[i] > highs[i-1] && highs[i] > highs[i+1]) {
                peaks.push({ index: i, value: highs[i] });
            }
        }
        
        if (peaks.length >= 3) {
            const [left, head, right] = peaks.slice(-3);
            return head.value > left.value && head.value > right.value && 
                   Math.abs(left.value - right.value) < head.value * 0.02;
        }
        
        return false;
    }

    updatePatternDisplay(patterns) {
        const patternsList = document.getElementById('detected-patterns');
        
        if (patterns.length === 0) {
            patternsList.innerHTML = '<div class="pattern-item"><span class="pattern-name">No patterns detected</span><span class="pattern-confidence">0%</span></div>';
            return;
        }
        
        patternsList.innerHTML = patterns.map(pattern => `
            <div class="pattern-item">
                <span class="pattern-name">${pattern.name}</span>
                <span class="pattern-confidence">${pattern.confidence}%</span>
            </div>
        `).join('');
    }

    updateBreakoutStatus(status, confidence) {
        const indicator = document.getElementById('breakout-indicator');
        const confidenceValue = document.getElementById('confidence-value');
        const confidenceFill = document.getElementById('confidence-fill');
        
        if (status === 'breakout') {
            indicator.className = 'status-display breakout';
            indicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Breakout Detected ✅</span>';
        } else {
            indicator.className = 'status-display consolidation';
            indicator.innerHTML = '<i class="fas fa-clock"></i><span>Consolidation ⏳</span>';
        }
        
        confidenceValue.textContent = `${confidence}%`;
        confidenceFill.style.width = `${confidence}%`;
    }

    // Efficient DOM update system with batching
    queueDOMUpdate(elementId, updateFunction) {
        if (!elementId || !updateFunction || typeof updateFunction !== 'function') {
            console.warn('Invalid parameters provided to queueDOMUpdate');
            return;
        }
        
        this.updateQueue.set(elementId, updateFunction);
        this.scheduleBatchUpdate();
    }
    
    scheduleBatchUpdate() {
        // Prevent infinite loops with guard conditions
        if (this.isUpdating || this.updateQueue.size === 0) return;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - this.lastUpdateTime;
        
        if (timeSinceLastUpdate >= this.updateThrottle) {
            this.processBatchUpdate();
        } else {
            // Use setTimeout with proper cleanup to prevent infinite loops
            const timeoutId = setTimeout(() => {
                // Double-check conditions before processing
                if (!this.isUpdating && this.updateQueue.size > 0) {
                    this.processBatchUpdate();
                }
            }, this.updateThrottle - timeSinceLastUpdate);
            
            // Store timeout ID for potential cleanup
            this.domUpdateTimeoutId = timeoutId;
        }
    }
    
    processBatchUpdate() {
        if (this.updateQueue.size === 0 || this.isUpdating) return;
        
        // Clear any pending timeout
        if (this.domUpdateTimeoutId) {
            clearTimeout(this.domUpdateTimeoutId);
            this.domUpdateTimeoutId = null;
        }
        
        this.isUpdating = true;
        
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            try {
                // Create a copy of the update queue and clear it immediately
                const updates = new Map(this.updateQueue);
                this.updateQueue.clear();
                
                // Process all queued updates in a single frame
                for (const [elementId, updateFunction] of updates) {
                    try {
                        if (typeof updateFunction === 'function') {
                            updateFunction();
                        }
                    } catch (error) {
                        console.warn(`DOM update failed for ${elementId}:`, error);
                    }
                }
            } catch (error) {
                console.warn('Batch update failed:', error);
            } finally {
                this.lastUpdateTime = Date.now();
                this.isUpdating = false;
            }
        });
    }

    updatePriceDisplay(price) {
        const change = price - this.lastPrice;
        const changePercent = this.lastPrice > 0 ? (change / this.lastPrice) * 100 : 0;
        
        // Queue price display updates for batch processing
        this.queueDOMUpdate('price-display', () => {
            const currentPriceEl = document.getElementById('current-price');
            const priceChangeEl = document.getElementById('price-change');
            
            if (currentPriceEl) {
                currentPriceEl.textContent = `$${price.toFixed(2)}`;
            }
            
            if (priceChangeEl && change !== 0) {
                const sign = change > 0 ? '+' : '';
                priceChangeEl.textContent = `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
                priceChangeEl.className = change > 0 ? 'change positive' : 'change negative';
            }
        });
        
        this.lastPrice = price;
    }

    updateMarketInfo() {
        // Simulate market data
        const spread = (Math.random() * 2 + 0.5).toFixed(1);
        const volume = Math.floor(Math.random() * 1000000 + 500000);
        const atr = (Math.random() * 10 + 5).toFixed(1);
        
        // Queue market info updates for batch processing
        this.queueDOMUpdate('market-info', () => {
            const spreadEl = document.getElementById('spread');
            const volumeEl = document.getElementById('volume');
            const atrEl = document.getElementById('atr');
            
            if (spreadEl) spreadEl.textContent = spread;
            if (volumeEl) volumeEl.textContent = volume.toLocaleString();
            if (atrEl) atrEl.textContent = atr;
        });
    }

    updateConnectionStatus(connected) {
        const statusDot = document.getElementById('connection-status');
        const statusText = document.getElementById('status-text');
        
        if (connected) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'Connected';
        } else {
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'Disconnected';
        }
    }

    updatePerformanceStats() {
        const successRate = this.totalSignals > 0 ? 
            Math.round((this.successfulSignals / this.totalSignals) * 100) : 0;
        
        const avgConfidence = this.confidenceScores.length > 0 ?
            Math.round(this.confidenceScores.reduce((a, b) => a + b, 0) / this.confidenceScores.length) : 0;
        
        document.getElementById('success-rate').textContent = `${successRate}%`;
        document.getElementById('total-signals').textContent = this.totalSignals;
        document.getElementById('avg-confidence').textContent = `${avgConfidence}%`;
        
        // Simulate some successful signals for demo
        if (this.totalSignals > 0 && Math.random() > 0.3) {
            this.successfulSignals++;
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    runBacktest() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const resultsDiv = document.getElementById('backtest-results');
        
        if (!startDate || !endDate) {
            resultsDiv.innerHTML = '<p style="color: #f44336;">Please select both start and end dates.</p>';
            return;
        }
        
        // Simulate backtesting
        resultsDiv.innerHTML = '<p>Running backtest...</p>';
        
        setTimeout(() => {
            const totalTrades = Math.floor(Math.random() * 50 + 20);
            const winRate = Math.floor(Math.random() * 30 + 60); // 60-90%
            const avgReturn = (Math.random() * 3 + 1).toFixed(2); // 1-4%
            const maxDrawdown = (Math.random() * 5 + 2).toFixed(2); // 2-7%
            
            resultsDiv.innerHTML = `
                <h4>Backtest Results (${startDate} to ${endDate})</h4>
                <div class="backtest-stats">
                    <div class="stat-row">
                        <span>Total Trades:</span>
                        <span>${totalTrades}</span>
                    </div>
                    <div class="stat-row">
                        <span>Win Rate:</span>
                        <span style="color: #4CAF50;">${winRate}%</span>
                    </div>
                    <div class="stat-row">
                        <span>Average Return:</span>
                        <span style="color: #4CAF50;">+${avgReturn}%</span>
                    </div>
                    <div class="stat-row">
                        <span>Max Drawdown:</span>
                        <span style="color: #f44336;">-${maxDrawdown}%</span>
                    </div>
                </div>
                <style>
                    .backtest-stats { margin-top: 15px; }
                    .stat-row { 
                        display: flex; 
                        justify-content: space-between; 
                        padding: 8px 0; 
                        border-bottom: 1px solid rgba(255,255,255,0.1); 
                    }
                </style>
            `;
        }, 2000);
    }
}

// Removed DOMContentLoaded instantiation to avoid duplicate scanner instances.