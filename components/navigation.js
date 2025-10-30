/**
 * Navigation Component - Responsive Navigation System
 * Handles routing, active states, dan mobile responsiveness
 */
class Navigation {
    constructor(router) {
        this.router = router;
        this.isMenuOpen = false;
        this.currentRoute = 'home';
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

                <!-- Navigation Breadcrumb -->
                <div class="nav-breadcrumb" id="nav-breadcrumb">
                    <div class="breadcrumb-container">
                        <span class="breadcrumb-item">
                            <i class="fas fa-home"></i>
                            Dashboard
                        </span>
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

        // Listen to router events
        window.addEventListener('routeChanged', (e) => {
            this.currentRoute = e.detail.route;
            this.updateActiveRoute();
            this.updateBreadcrumb();
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
            // Ensure route starts with slash
            const formattedRoute = route.startsWith('/') ? route : '/' + route;
            this.router.navigate(formattedRoute);
        }
    }

    updateActiveRoute() {
        // Update desktop navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === this.currentRoute) {
                item.classList.add('active');
            }
        });

        // Update mobile navigation
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === this.currentRoute) {
                item.classList.add('active');
            }
        });
    }

    updateBreadcrumb() {
        const breadcrumb = document.getElementById('nav-breadcrumb');
        if (!breadcrumb) return;

        const routeNames = {
            home: { icon: 'fas fa-home', name: 'Dashboard' },
            scanner: { icon: 'fas fa-search', name: 'Scanner' },
            alerts: { icon: 'fas fa-bell', name: 'Alerts' },
            backtest: { icon: 'fas fa-chart-bar', name: 'Backtest' },
            about: { icon: 'fas fa-info-circle', name: 'About' }
        };

        const route = routeNames[this.currentRoute];
        if (route) {
            breadcrumb.querySelector('.breadcrumb-container').innerHTML = `
                <span class="breadcrumb-item">
                    <i class="${route.icon}"></i>
                    ${route.name}
                </span>
            `;
        }
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