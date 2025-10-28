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
        
        this.init();
    }

    init() {
        // Delay chart initialization to ensure library is loaded
        setTimeout(() => {
            this.initChart();
        }, 100);
        
        this.setupEventListeners();
        this.startDataFeed();
        this.requestNotificationPermission();
        
        // Update status
        this.updateConnectionStatus(false);
        
        // Start high-frequency analysis loop for real-time updates (max 1 second latency)
        setInterval(() => this.analyzeMarket(), 500); // Analyze every 0.5 seconds for instant detection
        setInterval(() => this.updatePerformanceStats(), 1000); // Update stats every 1 second
        setInterval(() => this.updateMarketInfo(), 250); // Update market info every 0.25 seconds
        setInterval(() => this.detectPatterns(), 1000); // Pattern detection every 1 second
    }

    initChart() {
        const chartContainer = document.getElementById('chart');
        
        // Check if LightweightCharts is available
        if (!window.LightweightCharts) {
            console.error('LightweightCharts library not loaded');
            chartContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #fff;">Chart library loading... Please refresh if this persists.</div>';
            return;
        }
        
        try {
            this.chart = window.LightweightCharts.createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: chartContainer.clientHeight - 50,
            layout: {
                background: { color: 'transparent' },
                textColor: '#ffffff',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            crosshair: {
                mode: 1, // Normal crosshair mode
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                timeVisible: true,
                secondsVisible: false,
                rightOffset: 12,
                barSpacing: 3,
                fixLeftEdge: true,
                lockVisibleTimeRangeOnResize: true,
            },
            // Performance optimizations
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            },
        });

        this.candlestickSeries = this.chart.addCandlestickSeries({
            upColor: '#4CAF50',
            downColor: '#f44336',
            borderDownColor: '#f44336',
            borderUpColor: '#4CAF50',
            wickDownColor: '#f44336',
            wickUpColor: '#4CAF50',
        });

        // Add support/resistance lines
        this.supportLine = this.chart.addLineSeries({
            color: '#2196F3',
            lineWidth: 2,
            lineStyle: 2, // Dashed line style
        });

        this.resistanceLine = this.chart.addLineSeries({
            color: '#FF9800',
            lineWidth: 2,
            lineStyle: 2, // Dashed line style
        });

            // Handle resize
            window.addEventListener('resize', () => {
                if (this.chart) {
                    this.chart.applyOptions({
                        width: chartContainer.clientWidth,
                        height: chartContainer.clientHeight - 50,
                    });
                }
            });
        } catch (error) {
            console.error('Error initializing chart:', error);
            chartContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #fff;">Error loading chart. Please refresh the page.</div>';
        }
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
        try {
            // Simulate connection to data feed
            await this.simulateConnection();
            this.updateConnectionStatus(true);
            
            // Load initial historical data
            await this.loadHistoricalData();
            
            // Start real-time updates
            this.startWebSocketSimulation();
            this.startRealTimeUpdates();
            
        } catch (error) {
            console.error('Failed to start data feed:', error);
            this.updateConnectionStatus(false);
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
        // Simulate loading historical data
        const data = this.generateSimulatedData(100);
        this.priceData = data;
        this.candlestickSeries.setData(data);
        
        // Calculate support and resistance
        this.calculateSupportResistance();
        
        // Update current price display
        if (data.length > 0) {
            const lastCandle = data[data.length - 1];
            this.updatePriceDisplay(lastCandle.close);
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
        this.chartUpdateQueue.push(updateFunction);
        this.scheduleChartUpdate();
    }
    
    scheduleChartUpdate() {
        if (this.isChartUpdating) return;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - this.lastChartUpdate;
        
        if (timeSinceLastUpdate >= this.chartUpdateThrottle) {
            this.processChartUpdates();
        } else {
            setTimeout(() => {
                if (!this.isChartUpdating) {
                    this.processChartUpdates();
                }
            }, this.chartUpdateThrottle - timeSinceLastUpdate);
        }
    }
    
    processChartUpdates() {
        if (this.chartUpdateQueue.length === 0) return;
        
        this.isChartUpdating = true;
        
        // Process all queued chart updates in a single frame
        requestAnimationFrame(() => {
            try {
                for (const updateFunction of this.chartUpdateQueue) {
                    updateFunction();
                }
            } catch (error) {
                console.warn('Chart update failed:', error);
            }
            
            this.chartUpdateQueue.length = 0;
            this.lastChartUpdate = Date.now();
            this.isChartUpdating = false;
        });
    }

    startRealTimeUpdates() {
        // High-frequency price updates for real-time feel
        setInterval(() => {
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
        setInterval(() => {
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
        
        this.supportLine.setData([
            { time: startTime, value: this.supportLevel },
            { time: currentTime, value: this.supportLevel }
        ]);
        
        this.resistanceLine.setData([
            { time: startTime, value: this.resistanceLevel },
            { time: currentTime, value: this.resistanceLevel }
        ]);
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
        this.updateQueue.set(elementId, updateFunction);
        this.scheduleBatchUpdate();
    }
    
    scheduleBatchUpdate() {
        if (this.isUpdating) return;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - this.lastUpdateTime;
        
        if (timeSinceLastUpdate >= this.updateThrottle) {
            this.processBatchUpdate();
        } else {
            setTimeout(() => {
                if (!this.isUpdating) {
                    this.processBatchUpdate();
                }
            }, this.updateThrottle - timeSinceLastUpdate);
        }
    }
    
    processBatchUpdate() {
        if (this.updateQueue.size === 0) return;
        
        this.isUpdating = true;
        
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            // Process all queued updates in a single frame
            for (const [elementId, updateFunction] of this.updateQueue) {
                try {
                    updateFunction();
                } catch (error) {
                    console.warn(`DOM update failed for ${elementId}:`, error);
                }
            }
            
            this.updateQueue.clear();
            this.lastUpdateTime = Date.now();
            this.isUpdating = false;
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const scanner = new GoldBreakoutScanner();
    
    // Make scanner globally available for debugging
    window.goldScanner = scanner;
});