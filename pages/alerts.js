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

    init() {
        this.setupAlertSettings();
        this.setupCreateAlert();
        this.setupAlertActions();
        this.loadAlerts();
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

    createAlert() {
        const type = document.getElementById('alert-type')?.value;
        const condition = document.getElementById('alert-condition')?.value;
        const value = document.getElementById('alert-value')?.value;
        const message = document.getElementById('alert-message')?.value;

        if (!type || !condition || !value) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

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
        this.renderActiveAlerts();
        this.updateAlertStats();
        this.showNotification('Alert created successfully', 'success');

        // Clear form
        document.getElementById('alert-value').value = '';
        document.getElementById('alert-message').value = '';
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
    }

    destroy() {
        // Save alerts before leaving
        localStorage.setItem('goldradar-alerts', JSON.stringify(this.alerts));
    }
}

// Export for use in main app
window.AlertsPage = AlertsPage;