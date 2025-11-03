/**
 * Alerts Page - Notifikasi & Senarai Alert Terkini
 * Dedicated page untuk pengurusan alert dan notifikasi
 */
class AlertsPage {
    constructor(goldScanner) {
        this.goldScanner = goldScanner;
        this.alerts = [];
        this.alertSettings = {
            sound: true,
            desktop: true,
            email: false,
            priceAlerts: true,
            breakoutAlerts: true,
            patternAlerts: true
        };
    }

    render() {
        return `
            <div class="page-container alerts-page">
                <div class="page-header">
                    <h2><i class="fas fa-bell"></i> Alert Management</h2>
                    <p>Urus notifikasi dan alert untuk breakout signals</p>
                </div>

                <!-- Alert Settings -->
                <div class="card alert-settings">
                    <h3><i class="fas fa-cog"></i> Alert Settings</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <h4>Notification Types</h4>
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="sound-alerts" ${this.alertSettings.sound ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <span>Sound Alerts</span>
                            </div>
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="desktop-alerts" ${this.alertSettings.desktop ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <span>Desktop Notifications</span>
                            </div>
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="email-alerts" ${this.alertSettings.email ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <span>Email Notifications</span>
                            </div>
                        </div>

                        <div class="setting-group">
                            <h4>Alert Categories</h4>
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="price-alerts" ${this.alertSettings.priceAlerts ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <span>Price Alerts</span>
                            </div>
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="breakout-alerts" ${this.alertSettings.breakoutAlerts ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <span>Breakout Alerts</span>
                            </div>
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="pattern-alerts" ${this.alertSettings.patternAlerts ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <span>Pattern Alerts</span>
                            </div>
                        </div>

                        <div class="setting-group">
                            <h4>Alert Thresholds</h4>
                            <div class="threshold-item">
                                <label>Breakout Confidence:</label>
                                <input type="range" id="breakout-threshold" min="50" max="95" value="75">
                                <span id="breakout-threshold-value">75%</span>
                            </div>
                            <div class="threshold-item">
                                <label>Price Change (%):</label>
                                <input type="range" id="price-threshold" min="0.1" max="5" step="0.1" value="1">
                                <span id="price-threshold-value">1%</span>
                            </div>
                            <div class="threshold-item">
                                <label>Volume Spike:</label>
                                <input type="range" id="volume-threshold" min="100" max="500" step="50" value="200">
                                <span id="volume-threshold-value">200%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Create New Alert -->
                <div class="card create-alert">
                    <h3><i class="fas fa-plus"></i> Create New Alert</h3>
                    <div class="alert-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Alert Type:</label>
                                <select id="alert-type">
                                    <option value="price">Price Alert</option>
                                    <option value="breakout">Breakout Alert</option>
                                    <option value="pattern">Pattern Alert</option>
                                    <option value="volume">Volume Alert</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Condition:</label>
                                <select id="alert-condition">
                                    <option value="above">Above</option>
                                    <option value="below">Below</option>
                                    <option value="crosses">Crosses</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Value:</label>
                                <input type="number" id="alert-value" placeholder="2000.00" step="0.01">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Message:</label>
                                <input type="text" id="alert-message" placeholder="Custom alert message">
                            </div>
                            <div class="form-group">
                                <button id="create-alert-btn" class="create-btn">
                                    <i class="fas fa-plus"></i> Create Alert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Alerts -->
                <div class="card active-alerts">
                    <h3><i class="fas fa-list"></i> Active Alerts</h3>
                    <div class="alerts-header">
                        <div class="alerts-count">
                            <span id="active-count">0</span> active alerts
                        </div>
                        <div class="alerts-actions">
                            <button id="test-alert" class="test-btn">
                                <i class="fas fa-volume-up"></i> Test Alert
                            </button>
                            <button id="clear-all-alerts" class="clear-btn">
                                <i class="fas fa-trash"></i> Clear All
                            </button>
                        </div>
                    </div>
                    <div id="active-alerts-container" class="alerts-container">
                        <div class="no-alerts">
                            <i class="fas fa-bell-slash"></i>
                            <p>No active alerts. Create an alert to get notified of market movements.</p>
                        </div>
                    </div>
                </div>

                <!-- Alert History -->
                <div class="card alert-history">
                    <h3><i class="fas fa-history"></i> Alert History</h3>
                    <div class="history-filters">
                        <select id="history-filter">
                            <option value="all">All Alerts</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                        <select id="type-filter">
                            <option value="all">All Types</option>
                            <option value="price">Price Alerts</option>
                            <option value="breakout">Breakout Alerts</option>
                            <option value="pattern">Pattern Alerts</option>
                        </select>
                    </div>
                    <div id="alert-history-container" class="history-container">
                        <div class="no-history">
                            <i class="fas fa-clock"></i>
                            <p>No alert history yet. Alerts will appear here once triggered.</p>
                        </div>
                    </div>
                </div>

                <!-- Alert Statistics -->
                <div class="card alert-stats">
                    <h3><i class="fas fa-chart-bar"></i> Alert Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value" id="total-alerts">0</div>
                            <div class="stat-label">Total Alerts</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="triggered-alerts">0</div>
                            <div class="stat-label">Triggered Today</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="success-rate">0%</div>
                            <div class="stat-label">Success Rate</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="avg-response">0s</div>
                            <div class="stat-label">Avg Response</div>
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
            // Simulate loading delay for alerts initialization
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.setupAlertSettings();
            this.setupCreateAlert();
            this.setupAlertActions();
            
            // Load alerts with loading state
            await this.loadAlertsWithLoading();
            
            // Initialize alert monitoring
            await this.initializeAlertMonitoring();
            
            // Hide skeleton screens and show real content
            this.hideSkeletonScreens();
            // Record page load time and emit pageReady
            if (window.performanceMonitor) {
                window.performanceMonitor.recordPageLoad('AlertsPage', performance.now() - tStart);
            }
            document.dispatchEvent(new CustomEvent('pageReady', { detail: { page: 'alerts' } }));
            
        } catch (error) {
            console.error('Error initializing alerts:', error);
            this.hideSkeletonScreens();
            const loadingUtil = window.LoadingUtil;
            if (loadingUtil) {
                loadingUtil.showRetryError('.alerts-page', 'Failed to initialize alerts', () => this.init());
            }
        }
    }

    showSkeletonScreens() {
        const loadingManager = window.LoadingManager;
        if (!loadingManager) return;

        // Show skeleton for alert settings
        this.settingsSkeleton = loadingManager.showSkeleton('.alert-settings .settings-grid', 'card', {
            title: 'Alert Settings',
            lines: 4
        });

        // Show skeleton for active alerts
        this.activeAlertsSkeleton = loadingManager.showSkeleton('#active-alerts-container', 'list', {
            items: 3
        });

        // Show skeleton for alert history
        this.historySkeleton = loadingManager.showSkeleton('#alert-history-container', 'table', {
            rows: 4,
            columns: 3
        });

        // Show skeleton for alert statistics
        this.statsSkeleton = loadingManager.showSkeleton('.alert-stats .stats-grid', 'card', {
            title: 'Statistics',
            lines: 2
        });
    }

    hideSkeletonScreens() {
        const loadingManager = window.LoadingManager;
        if (!loadingManager) return;

        // Hide all skeleton screens
        if (this.settingsSkeleton) loadingManager.hideSkeleton(this.settingsSkeleton);
        if (this.activeAlertsSkeleton) loadingManager.hideSkeleton(this.activeAlertsSkeleton);
        if (this.historySkeleton) loadingManager.hideSkeleton(this.historySkeleton);
        if (this.statsSkeleton) loadingManager.hideSkeleton(this.statsSkeleton);
    }

    async loadAlertsWithLoading() {
        const loadingUtil = window.LoadingUtil;
        
        try {
            // Show loading for alerts data
            if (loadingUtil) {
                loadingUtil.showInline('#active-alerts-container', 'Loading alerts...');
            }

            // Simulate loading alerts from storage/server
            await new Promise(resolve => setTimeout(resolve, 600));
            
            this.loadAlerts();
            
            // Hide loading
            if (loadingUtil) {
                loadingUtil.hideInline('#active-alerts-container');
            }

        } catch (error) {
            console.error('Error loading alerts:', error);
            if (loadingUtil) {
                loadingUtil.hideInline('#active-alerts-container');
                loadingUtil.showRetryError('#active-alerts-container', 'Loading alerts failed. Tap Retry to try again.', () => this.loadAlertsWithLoading());
            }
        }
    }

    async initializeAlertMonitoring() {
        // Simulate alert monitoring initialization
        await new Promise(resolve => setTimeout(resolve, 400));
        this.startAlertMonitoring();
    }

    setupAlertSettings() {
        // Setup toggle switches
        const switches = {
            'sound-alerts': 'sound',
            'desktop-alerts': 'desktop',
            'email-alerts': 'email',
            'price-alerts': 'priceAlerts',
            'breakout-alerts': 'breakoutAlerts',
            'pattern-alerts': 'patternAlerts'
        };

        Object.entries(switches).forEach(([id, setting]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.alertSettings[setting] = e.target.checked;
                    this.saveSettings();
                });
            }
        });

        // Setup threshold sliders
        const thresholds = ['breakout-threshold', 'price-threshold', 'volume-threshold'];
        thresholds.forEach(id => {
            const slider = document.getElementById(id);
            const valueSpan = document.getElementById(id + '-value');
            
            if (slider && valueSpan) {
                slider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    const unit = id.includes('price') ? '%' : id.includes('volume') ? '%' : '%';
                    valueSpan.textContent = value + unit;
                });
            }
        });
    }

    setupCreateAlert() {
        const createBtn = document.getElementById('create-alert-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createAlert();
            });
        }
    }

    setupAlertActions() {
        const testBtn = document.getElementById('test-alert');
        const clearBtn = document.getElementById('clear-all-alerts');

        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.testAlert();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllAlerts();
            });
        }
    }

    async createAlert() {
        const type = document.getElementById('alert-type')?.value;
        const condition = document.getElementById('alert-condition')?.value;
        const value = document.getElementById('alert-value')?.value;
        const message = document.getElementById('alert-message')?.value;
        const loadingManager = window.LoadingManager;
        const createBtn = document.getElementById('create-alert-btn');

        if (!type || !condition || !value) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Disable button and show loading
            if (createBtn) createBtn.disabled = true;
            if (loadingManager) {
                loadingManager.showInlineLoading('.create-alert', 'Creating alert...');
            }

            // Simulate alert creation processing
            await new Promise(resolve => setTimeout(resolve, 800));

            const alert = {
                id: Date.now(),
                type,
                condition,
                value: parseFloat(value),
                message: message || `${type} alert ${condition} ${value}`,
                created: new Date(),
                active: true,
                triggered: false
            };

            this.alerts.push(alert);
            
            // Update UI with loading feedback
            await this.renderActiveAlertsWithLoading();
            await this.updateAlertStatsWithLoading();
            
            this.showNotification('Alert created successfully', 'success');

            // Clear form
            document.getElementById('alert-value').value = '';
            document.getElementById('alert-message').value = '';

        } catch (error) {
            console.error('Error creating alert:', error);
            this.showNotification('Error creating alert', 'error');
        } finally {
            // Re-enable button and hide loading
            if (createBtn) createBtn.disabled = false;
            if (loadingManager) {
                loadingManager.hideInlineLoading('.create-alert');
            }
        }
    }

    async renderActiveAlertsWithLoading() {
        const loadingUtil = window.LoadingUtil;
        
        try {
            // Show brief loading for alerts update
            if (loadingUtil) {
                loadingUtil.showInline('#active-alerts-container', 'Updating alerts...');
            }

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 300));
            
            this.renderActiveAlerts();
            
            // Hide loading
            if (loadingUtil) {
                loadingUtil.hideInline('#active-alerts-container');
            }

        } catch (error) {
            console.error('Error rendering alerts:', error);
            if (loadingUtil) {
                loadingUtil.hideInline('#active-alerts-container');
                loadingUtil.showRetryError('#active-alerts-container', 'Updating alerts failed. Tap Retry to try again.', () => this.renderActiveAlertsWithLoading());
            }
        }
    }

    async updateAlertStatsWithLoading() {
        const loadingUtil = window.LoadingUtil;
        
        try {
            // Show brief loading for stats update
            if (loadingUtil) {
                loadingUtil.showInline('.alert-stats', 'Updating statistics...');
            }

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 200));
            
            this.updateAlertStats();
            
            // Hide loading
            if (loadingUtil) {
                loadingUtil.hideInline('.alert-stats');
            }

        } catch (error) {
            console.error('Error updating stats:', error);
            if (loadingUtil) {
                loadingUtil.hideInline('.alert-stats');
                loadingUtil.showRetryError('.alert-stats', 'Updating statistics failed. Tap Retry to try again.', () => this.updateAlertStatsWithLoading());
            }
        }
    }

    renderActiveAlerts() {
        const container = document.getElementById('active-alerts-container');
        const countEl = document.getElementById('active-count');
        
        if (!container) return;

        const activeAlerts = this.alerts.filter(alert => alert.active);
        
        if (countEl) {
            countEl.textContent = activeAlerts.length;
        }

        if (activeAlerts.length === 0) {
            container.innerHTML = `
                <div class="no-alerts">
                    <i class="fas fa-bell-slash"></i>
                    <p>No active alerts. Create an alert to get notified of market movements.</p>
                </div>
            `;
            return;
        }

        const alertsHTML = activeAlerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-header">
                    <span class="alert-type">
                        <i class="fas fa-${this.getAlertIcon(alert.type)}"></i>
                        ${alert.type.toUpperCase()}
                    </span>
                    <button class="delete-alert" data-id="${alert.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="alert-details">
                    <div class="alert-condition">
                        ${alert.condition} ${alert.value}
                    </div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-created">
                        Created: ${alert.created.toLocaleString()}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = alertsHTML;

        // Setup delete buttons
        container.querySelectorAll('.delete-alert').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const alertId = parseInt(e.target.closest('.delete-alert').dataset.id);
                this.deleteAlert(alertId);
            });
        });
    }

    getAlertIcon(type) {
        const icons = {
            price: 'dollar-sign',
            breakout: 'bolt',
            pattern: 'shapes',
            volume: 'chart-bar'
        };
        return icons[type] || 'bell';
    }

    deleteAlert(alertId) {
        this.alerts = this.alerts.filter(alert => alert.id !== alertId);
        this.renderActiveAlerts();
        this.updateAlertStats();
        this.showNotification('Alert deleted', 'info');
    }

    clearAllAlerts() {
        this.alerts = this.alerts.filter(alert => !alert.active);
        this.renderActiveAlerts();
        this.updateAlertStats();
        this.showNotification('All active alerts cleared', 'info');
    }

    testAlert() {
        this.triggerAlert({
            type: 'test',
            message: 'This is a test alert to verify your notification settings.',
            value: 'Test'
        });
    }

    triggerAlert(alert) {
        // Sound notification
        if (this.alertSettings.sound) {
            this.playAlertSound();
        }

        // Desktop notification
        if (this.alertSettings.desktop) {
            this.showDesktopNotification(alert);
        }

        // Visual notification
        this.showNotification(alert.message, 'alert');

        // Mark as triggered if it's a real alert
        if (alert.id) {
            const alertIndex = this.alerts.findIndex(a => a.id === alert.id);
            if (alertIndex !== -1) {
                this.alerts[alertIndex].triggered = true;
                this.alerts[alertIndex].triggeredAt = new Date();
            }
        }
    }

    playAlertSound() {
        // Create audio context for alert sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    showDesktopNotification(alert) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('GoldRadar Alert', {
                body: alert.message,
                icon: '/favicon.ico',
                tag: 'goldradar-alert'
            });
        }
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

    startAlertMonitoring() {
        // Monitor for alert conditions every 2 seconds
        setInterval(() => {
            this.checkAlertConditions();
        }, 2000);
    }

    checkAlertConditions() {
        // Simulate checking alert conditions
        this.alerts.filter(alert => alert.active && !alert.triggered).forEach(alert => {
            // Simulate random trigger for demo
            if (Math.random() < 0.001) { // Very low probability for demo
                this.triggerAlert(alert);
            }
        });
    }

    updateAlertStats() {
        const totalEl = document.getElementById('total-alerts');
        const triggeredEl = document.getElementById('triggered-alerts');
        const successRateEl = document.getElementById('success-rate');

        if (totalEl) totalEl.textContent = this.alerts.length;
        
        const triggeredToday = this.alerts.filter(alert => 
            alert.triggered && 
            alert.triggeredAt && 
            alert.triggeredAt.toDateString() === new Date().toDateString()
        ).length;
        
        if (triggeredEl) triggeredEl.textContent = triggeredToday;
        
        const successRate = this.alerts.length > 0 ? 
            Math.round((this.alerts.filter(a => a.triggered).length / this.alerts.length) * 100) : 0;
        
        if (successRateEl) successRateEl.textContent = successRate + '%';
    }

    saveSettings() {
        localStorage.setItem('goldradar-alert-settings', JSON.stringify(this.alertSettings));
    }

    loadAlerts() {
        const saved = localStorage.getItem('goldradar-alerts');
        if (saved) {
            this.alerts = JSON.parse(saved);
            this.renderActiveAlerts();
            this.updateAlertStats();
        }
        
        // Load alert history
        this.loadAlertHistory();
    }

    async loadAlertHistory() {
        const loadingUtil = window.LoadingUtil;
        const historyContainer = document.getElementById('alert-history-container');
        
        if (!historyContainer) return;

        try {
            // Show loading for history
            if (loadingUtil) {
                loadingUtil.showInline('#alert-history-container', 'Loading alert history...');
            }

            // Simulate loading history from server/storage
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Generate sample alert history
            const sampleHistory = this.generateSampleHistory();
            
            this.renderAlertHistory(sampleHistory);
            
            // Hide loading
            if (loadingUtil) {
                loadingUtil.hideInline('#alert-history-container');
            }

        } catch (error) {
            console.error('Error loading alert history:', error);
            if (loadingUtil) {
                loadingUtil.hideInline('#alert-history-container');
            }
        }
    }

    generateSampleHistory() {
        const types = ['price', 'breakout', 'pattern', 'volume'];
        const conditions = ['above', 'below'];
        const history = [];

        for (let i = 0; i < 8; i++) {
            const date = new Date();
            date.setHours(date.getHours() - Math.floor(Math.random() * 72)); // Last 3 days

            history.push({
                id: Date.now() + i,
                type: types[Math.floor(Math.random() * types.length)],
                condition: conditions[Math.floor(Math.random() * conditions.length)],
                value: (1950 + Math.random() * 100).toFixed(2),
                message: `Alert triggered for ${types[Math.floor(Math.random() * types.length)]}`,
                triggeredAt: date,
                success: Math.random() > 0.3 // 70% success rate
            });
        }

        return history.sort((a, b) => b.triggeredAt - a.triggeredAt);
    }

    renderAlertHistory(history) {
        const container = document.getElementById('alert-history-container');
        if (!container) return;

        if (history.length === 0) {
            container.innerHTML = `
                <div class="no-history">
                    <i class="fas fa-clock"></i>
                    <p>No alert history yet. Alerts will appear here once triggered.</p>
                </div>
            `;
            return;
        }

        const historyHTML = history.map(alert => `
            <div class="history-item ${alert.success ? 'success' : 'failed'}">
                <div class="history-header">
                    <span class="history-type">
                        <i class="fas fa-${this.getAlertIcon(alert.type)}"></i>
                        ${alert.type.toUpperCase()}
                    </span>
                    <span class="history-time">
                        ${alert.triggeredAt.toLocaleString()}
                    </span>
                </div>
                <div class="history-details">
                    <div class="history-condition">
                        ${alert.condition} ${alert.value}
                    </div>
                    <div class="history-message">${alert.message}</div>
                    <div class="history-status ${alert.success ? 'success' : 'failed'}">
                        <i class="fas fa-${alert.success ? 'check' : 'times'}"></i>
                        ${alert.success ? 'Successful' : 'Failed'}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = historyHTML;
    }

    destroy() {
        // Save alerts before leaving
        const tStart = performance.now();
        localStorage.setItem('goldradar-alerts', JSON.stringify(this.alerts));
        // Cleanup inline loaders
        const loadingUtil = window.LoadingUtil;
        if (loadingUtil) {
            loadingUtil.hideInline('#active-alerts-container');
            loadingUtil.hideInline('#alert-history-container');
            loadingUtil.hideInline('.alert-stats');
        }
        // Record cleanup duration
        if (window.performanceMonitor) {
            window.performanceMonitor.recordInteraction('cleanup', 'AlertsPage.destroy', performance.now() - tStart);
        }
    }
}

// Export for use in main app
window.AlertsPage = AlertsPage;