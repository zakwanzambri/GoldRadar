/**
 * Navigation Component - Enhanced Navigation System
 * Handles routing, active states, breadcrumbs, and navigation history
 */
class Navigation {
    constructor(router) {
        this.router = router;
        this.isMenuOpen = false;
        this.currentRoute = 'home';
        this.navigationHistory = [];
        this.maxHistoryLength = 10;
        this.routeHierarchy = {
            'dashboard': { parent: null, level: 0 },
            'scanner': { parent: null, level: 0 },
            'alerts': { parent: null, level: 0 },
            'backtest': { parent: null, level: 0 },
            'about': { parent: null, level: 0 },
            // Sub-routes for future expansion
            'scanner/results': { parent: 'scanner', level: 1 },
            'alerts/settings': { parent: 'alerts', level: 1 },
            'backtest/results': { parent: 'backtest', level: 1 }
        };
    }

    render() {
        return `
            <nav class="main-navigation">
                <div class="nav-container">
                    <!-- Logo & Brand -->
                    <div class="nav-brand">
                        <div class="brand-logo">
                            <i class="fas fa-chart-line"></i>
                            <span class="brand-text">GoldRadar</span>
                        </div>
                        <div class="brand-tagline">Advanced Gold Trading Analysis</div>
                    </div>

                    <!-- Desktop Navigation Menu -->
                    <div class="nav-menu" id="nav-menu">
                        <div class="nav-items">
                            <a href="#dashboard" class="nav-item" data-route="dashboard">
                                <i class="fas fa-home"></i>
                                <span>Dashboard</span>
                                <div class="nav-indicator"></div>
                            </a>
                            
                            <a href="#scanner" class="nav-item" data-route="scanner">
                                <i class="fas fa-search"></i>
                                <span>Scanner</span>
                                <div class="nav-indicator"></div>
                            </a>
                            
                            <a href="#alerts" class="nav-item" data-route="alerts">
                                <i class="fas fa-bell"></i>
                                <span>Alerts</span>
                                <div class="alert-badge" id="alert-count" style="display: none;">0</div>
                                <div class="nav-indicator"></div>
                            </a>
                            
                            <a href="#backtest" class="nav-item" data-route="backtest">
                                <i class="fas fa-chart-bar"></i>
                                <span>Backtest</span>
                                <div class="nav-indicator"></div>
                            </a>
                            
                            <a href="#about" class="nav-item" data-route="about">
                                <i class="fas fa-info-circle"></i>
                                <span>About</span>
                                <div class="nav-indicator"></div>
                            </a>
                        </div>

                        <!-- Navigation Actions -->
                        <div class="nav-actions">
                            <button class="nav-action-btn theme-toggle" id="theme-toggle" title="Toggle Dark Mode">
                                <i class="fas fa-moon"></i>
                            </button>
                            
                            <button class="nav-action-btn fullscreen-toggle" id="fullscreen-toggle" title="Toggle Fullscreen">
                                <i class="fas fa-expand"></i>
                            </button>
                            
                            <div class="nav-status">
                                <div class="status-indicator online" id="connection-status" title="Connection Status"></div>
                                <span class="status-text">Online</span>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Menu Toggle -->
                    <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>

                <!-- Mobile Navigation Overlay -->
                <div class="mobile-nav-overlay" id="mobile-nav-overlay">
                    <div class="mobile-nav-content">
                        <div class="mobile-nav-header">
                            <div class="mobile-brand">
                                <i class="fas fa-chart-line"></i>
                                <span>GoldRadar</span>
                            </div>
                            <button class="mobile-nav-close" id="mobile-nav-close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="mobile-nav-items">
                            <a href="#dashboard" class="mobile-nav-item" data-route="dashboard">
                                <i class="fas fa-home"></i>
                                <span>Dashboard</span>
                                <i class="fas fa-chevron-right"></i>
                            </a>
                            
                            <a href="#scanner" class="mobile-nav-item" data-route="scanner">
                                <i class="fas fa-search"></i>
                                <span>Scanner</span>
                                <i class="fas fa-chevron-right"></i>
                            </a>
                            
                            <a href="#alerts" class="mobile-nav-item" data-route="alerts">
                                <i class="fas fa-bell"></i>
                                <span>Alerts</span>
                                <div class="mobile-alert-badge" id="mobile-alert-count" style="display: none;">0</div>
                                <i class="fas fa-chevron-right"></i>
                            </a>
                            
                            <a href="#backtest" class="mobile-nav-item" data-route="backtest">
                                <i class="fas fa-chart-bar"></i>
                                <span>Backtest</span>
                                <i class="fas fa-chevron-right"></i>
                            </a>
                            
                            <a href="#about" class="mobile-nav-item" data-route="about">
                                <i class="fas fa-info-circle"></i>
                                <span>About</span>
                                <i class="fas fa-chevron-right"></i>
                            </a>
                        </div>

                        <div class="mobile-nav-actions">
                            <button class="mobile-action-btn" id="mobile-theme-toggle">
                                <i class="fas fa-moon"></i>
                                <span>Dark Mode</span>
                            </button>
                            
                            <button class="mobile-action-btn" id="mobile-fullscreen-toggle">
                                <i class="fas fa-expand"></i>
                                <span>Fullscreen</span>
                            </button>
                        </div>

                        <div class="mobile-nav-footer">
                            <div class="mobile-status">
                                <div class="status-indicator online"></div>
                                <span>System Online</span>
                            </div>
                            <div class="mobile-version">v2.0.0</div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Navigation Breadcrumb -->
                <div class="nav-breadcrumb" id="nav-breadcrumb">
                    <div class="breadcrumb-container">
                        <!-- Navigation History Controls -->
                        <div class="nav-history-controls">
                            <button class="nav-history-btn" id="nav-back-btn" title="Go Back" disabled>
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="nav-history-btn" id="nav-forward-btn" title="Go Forward" disabled>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        
                        <!-- Breadcrumb Trail -->
                        <div class="breadcrumb-trail">
                            <span class="breadcrumb-item">
                                <i class="fas fa-home"></i>
                                Dashboard
                            </span>
                        </div>
                        
                        <!-- Page Actions -->
                        <div class="page-actions">
                            <button class="page-action-btn" id="refresh-page-btn" title="Refresh Page">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupFullscreenToggle();
        this.setupMobileMenu();
        this.updateActiveRoute();
        this.startConnectionMonitoring();
    }

    setupEventListeners() {
        // Desktop navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.currentTarget.dataset.route;
                this.navigateToRoute(route);
            });
        });

        // Mobile navigation items
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.currentTarget.dataset.route;
                this.navigateToRoute(route);
                this.closeMobileMenu();
            });
        });

        // Navigation history controls
        const backBtn = document.getElementById('nav-back-btn');
        const forwardBtn = document.getElementById('nav-forward-btn');
        const refreshBtn = document.getElementById('refresh-page-btn');

        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }

        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => this.goForward());
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshPage());
        }

        // Listen to router events
        window.addEventListener('routeChanged', (e) => {
            this.currentRoute = e.detail.route;
            this.updateActiveRoute();
            this.updateBreadcrumb();
            this.updateHistoryControls();
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileClose = document.getElementById('mobile-nav-close');
        const mobileOverlay = document.getElementById('mobile-nav-overlay');

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        if (mobileClose) {
            mobileClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', (e) => {
                if (e.target === mobileOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        
        const toggleTheme = () => {
            const body = document.body;
            const isDark = body.classList.contains('dark-theme');
            
            if (isDark) {
                body.classList.remove('dark-theme');
                localStorage.setItem('goldradar-theme', 'light');
                this.updateThemeIcons('light');
            } else {
                body.classList.add('dark-theme');
                localStorage.setItem('goldradar-theme', 'dark');
                this.updateThemeIcons('dark');
            }
        };

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', toggleTheme);
        }

        // Load saved theme
        const savedTheme = localStorage.getItem('goldradar-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.updateThemeIcons('dark');
        }
    }

    updateThemeIcons(theme) {
        const desktopIcon = document.querySelector('#theme-toggle i');
        const mobileIcon = document.querySelector('#mobile-theme-toggle i');
        const mobileText = document.querySelector('#mobile-theme-toggle span');

        if (theme === 'dark') {
            if (desktopIcon) desktopIcon.className = 'fas fa-sun';
            if (mobileIcon) mobileIcon.className = 'fas fa-sun';
            if (mobileText) mobileText.textContent = 'Light Mode';
        } else {
            if (desktopIcon) desktopIcon.className = 'fas fa-moon';
            if (mobileIcon) mobileIcon.className = 'fas fa-moon';
            if (mobileText) mobileText.textContent = 'Dark Mode';
        }
    }

    setupFullscreenToggle() {
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        const mobileFullscreenToggle = document.getElementById('mobile-fullscreen-toggle');

        const toggleFullscreen = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log('Error attempting to enable fullscreen:', err);
                });
            } else {
                document.exitFullscreen();
            }
        };

        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', toggleFullscreen);
        }

        if (mobileFullscreenToggle) {
            mobileFullscreenToggle.addEventListener('click', toggleFullscreen);
        }

        // Update fullscreen icon
        document.addEventListener('fullscreenchange', () => {
            const isFullscreen = !!document.fullscreenElement;
            const desktopIcon = document.querySelector('#fullscreen-toggle i');
            const mobileIcon = document.querySelector('#mobile-fullscreen-toggle i');
            const mobileText = document.querySelector('#mobile-fullscreen-toggle span');

            if (isFullscreen) {
                if (desktopIcon) desktopIcon.className = 'fas fa-compress';
                if (mobileIcon) mobileIcon.className = 'fas fa-compress';
                if (mobileText) mobileText.textContent = 'Exit Fullscreen';
            } else {
                if (desktopIcon) desktopIcon.className = 'fas fa-expand';
                if (mobileIcon) mobileIcon.className = 'fas fa-expand';
                if (mobileText) mobileText.textContent = 'Fullscreen';
            }
        });
    }

    navigateToRoute(route) {
        if (this.router) {
            // Add current route to history before navigating
            this.addToHistory(this.currentRoute);
            
            // Ensure route starts with slash
            const formattedRoute = route.startsWith('/') ? route : '/' + route;
            this.router.navigate(formattedRoute);
            
            // Update current route and UI
            this.currentRoute = route;
            this.updateHistoryControls();
        }
    }

    addToHistory(route) {
        if (route && route !== this.navigationHistory[this.navigationHistory.length - 1]) {
            this.navigationHistory.push(route);
            
            // Limit history length
            if (this.navigationHistory.length > this.maxHistoryLength) {
                this.navigationHistory.shift();
            }
        }
    }

    goBack() {
        if (this.navigationHistory.length > 0) {
            const previousRoute = this.navigationHistory.pop();
            if (previousRoute && previousRoute !== this.currentRoute) {
                this.currentRoute = previousRoute;
                if (this.router) {
                    const formattedRoute = previousRoute.startsWith('/') ? previousRoute : '/' + previousRoute;
                    this.router.navigate(formattedRoute);
                }
                this.updateHistoryControls();
                this.updateActiveRoute();
                this.updateBreadcrumb();
            }
        }
    }

    goForward() {
        // For future implementation with forward history
        console.log('Forward navigation - to be implemented');
    }

    refreshPage() {
        if (this.router) {
            const formattedRoute = this.currentRoute.startsWith('/') ? this.currentRoute : '/' + this.currentRoute;
            this.router.navigate(formattedRoute);
        }
    }

    updateHistoryControls() {
        const backBtn = document.getElementById('nav-back-btn');
        const forwardBtn = document.getElementById('nav-forward-btn');
        
        if (backBtn) {
            backBtn.disabled = this.navigationHistory.length === 0;
        }
        
        if (forwardBtn) {
            forwardBtn.disabled = true; // For now, until forward history is implemented
        }
    }

    updateActiveRoute() {
        // Normalize current route (remove leading slash for comparison)
        const normalizedRoute = this.currentRoute.startsWith('/') ? this.currentRoute.slice(1) : this.currentRoute;
        
        // Update desktop navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === normalizedRoute) {
                item.classList.add('active');
            }
        });

        // Update mobile navigation
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === normalizedRoute) {
                item.classList.add('active');
            }
        });
    }

    updateBreadcrumb() {
        const breadcrumbTrail = document.querySelector('.breadcrumb-trail');
        if (!breadcrumbTrail) return;

        const routeNames = {
            '/home': { icon: 'fas fa-home', name: 'Dashboard', description: 'Main dashboard overview' },
            '/dashboard': { icon: 'fas fa-home', name: 'Dashboard', description: 'Main dashboard overview' },
            '/scanner': { icon: 'fas fa-search', name: 'Scanner', description: 'Market scanning tools' },
            '/alerts': { icon: 'fas fa-bell', name: 'Alerts', description: 'Trading alerts and notifications' },
            '/backtest': { icon: 'fas fa-chart-bar', name: 'Backtest', description: 'Strategy backtesting' },
            '/about': { icon: 'fas fa-info-circle', name: 'About', description: 'Application information' },
            // Support routes without slash for backward compatibility
            'home': { icon: 'fas fa-home', name: 'Dashboard', description: 'Main dashboard overview' },
            'dashboard': { icon: 'fas fa-home', name: 'Dashboard', description: 'Main dashboard overview' },
            'scanner': { icon: 'fas fa-search', name: 'Scanner', description: 'Market scanning tools' },
            'alerts': { icon: 'fas fa-bell', name: 'Alerts', description: 'Trading alerts and notifications' },
            'backtest': { icon: 'fas fa-chart-bar', name: 'Backtest', description: 'Strategy backtesting' },
            'about': { icon: 'fas fa-info-circle', name: 'About', description: 'Application information' },
            // Sub-routes
            'scanner/results': { icon: 'fas fa-list', name: 'Scan Results', description: 'Market scan results' },
            'alerts/settings': { icon: 'fas fa-cog', name: 'Alert Settings', description: 'Configure alert preferences' },
            'backtest/results': { icon: 'fas fa-chart-line', name: 'Backtest Results', description: 'Strategy performance results' }
        };

        // Build breadcrumb trail based on route hierarchy
        const breadcrumbItems = this.buildBreadcrumbTrail(this.currentRoute, routeNames);
        
        breadcrumbTrail.innerHTML = breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isClickable = !isLast && item.route;
            
            return `
                <span class="breadcrumb-item ${isLast ? 'current' : ''} ${isClickable ? 'clickable' : ''}" 
                      ${isClickable ? `data-route="${item.route}"` : ''} 
                      title="${item.description || ''}">
                    <i class="${item.icon}"></i>
                    <span class="breadcrumb-text">${item.name}</span>
                </span>
                ${!isLast ? '<i class="breadcrumb-separator fas fa-chevron-right"></i>' : ''}
            `;
        }).join('');

        // Add click handlers for clickable breadcrumb items
        breadcrumbTrail.querySelectorAll('.breadcrumb-item.clickable').forEach(item => {
            item.addEventListener('click', () => {
                const route = item.dataset.route;
                if (route) {
                    this.navigateToRoute(route);
                }
            });
        });
    }

    buildBreadcrumbTrail(currentRoute, routeNames) {
        const normalizedRoute = currentRoute.startsWith('/') ? currentRoute.slice(1) : currentRoute;
        const routeInfo = routeNames[currentRoute] || routeNames[normalizedRoute];
        
        if (!routeInfo) {
            return [{ icon: 'fas fa-home', name: 'Dashboard', route: 'dashboard' }];
        }

        const trail = [];
        
        // Check if this is a sub-route
        const hierarchy = this.routeHierarchy[normalizedRoute];
        if (hierarchy && hierarchy.parent) {
            // Add parent route
            const parentInfo = routeNames[hierarchy.parent];
            if (parentInfo) {
                trail.push({
                    icon: parentInfo.icon,
                    name: parentInfo.name,
                    route: hierarchy.parent,
                    description: parentInfo.description
                });
            }
        }
        
        // Add current route
        trail.push({
            icon: routeInfo.icon,
            name: routeInfo.name,
            route: null, // Current route is not clickable
            description: routeInfo.description
        });

        return trail;
    }

    toggleMobileMenu() {
        const overlay = document.getElementById('mobile-nav-overlay');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const overlay = document.getElementById('mobile-nav-overlay');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (overlay) {
            overlay.classList.add('active');
        }
        
        if (toggle) {
            toggle.classList.add('active');
        }
        
        document.body.classList.add('mobile-menu-open');
        this.isMenuOpen = true;
    }

    closeMobileMenu() {
        const overlay = document.getElementById('mobile-nav-overlay');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        if (toggle) {
            toggle.classList.remove('active');
        }
        
        document.body.classList.remove('mobile-menu-open');
        this.isMenuOpen = false;
    }

    updateAlertCount(count) {
        const desktopBadge = document.getElementById('alert-count');
        const mobileBadge = document.getElementById('mobile-alert-count');

        if (count > 0) {
            if (desktopBadge) {
                desktopBadge.textContent = count > 99 ? '99+' : count;
                desktopBadge.style.display = 'block';
            }
            if (mobileBadge) {
                mobileBadge.textContent = count > 99 ? '99+' : count;
                mobileBadge.style.display = 'block';
            }
        } else {
            if (desktopBadge) desktopBadge.style.display = 'none';
            if (mobileBadge) mobileBadge.style.display = 'none';
        }
    }

    startConnectionMonitoring() {
        // Simulate connection monitoring
        setInterval(() => {
            const isOnline = navigator.onLine;
            const statusIndicators = document.querySelectorAll('.status-indicator');
            const statusTexts = document.querySelectorAll('.status-text');

            statusIndicators.forEach(indicator => {
                indicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
            });

            statusTexts.forEach(text => {
                text.textContent = isOnline ? 'Online' : 'Offline';
            });
        }, 5000);
    }

    // Smooth scroll to top when changing routes
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    destroy() {
        // Cleanup event listeners
        this.closeMobileMenu();
    }
}

// Export for use in main app
window.Navigation = Navigation;