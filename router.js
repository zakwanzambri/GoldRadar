/**
 * Advanced SPA Router for GoldRadar
 * Handles client-side routing with lazy loading and caching
 */
class GoldRadarRouter {
    constructor() {
        this.routes = new Map();
        this.currentPage = null;
        this.currentRoute = null;
        this.pageContainer = null;
        this.pageCache = new Map();
        this.loadingIndicator = null;
        
        // Performance tracking
        this.performanceMetrics = {
            pageLoadTimes: new Map(),
            navigationCount: 0,
            errorCount: 0,
            retryCount: 0
        };
        
        // Error handling and retry configuration
        this.errorHandling = {
            maxRetries: 3,
            retryDelay: 1000,
            fallbackRoute: '/dashboard',
            currentRetries: new Map(),
            errorHistory: []
        };
        
        // Connection monitoring
        this.connectionStatus = {
            isOnline: navigator.onLine,
            lastCheck: Date.now(),
            checkInterval: null
        };
        
        // Don't auto-initialize - let the app initialize after registering routes
    }

    init() {
        this.pageContainer = document.getElementById('page-container');
        this.createLoadingIndicator();
        this.setupConnectionMonitoring();
        this.setupErrorHandling();
        
        // Listen for hash change events for client-side routing
        window.addEventListener('hashchange', (e) => {
            const hash = window.location.hash.slice(1) || '/home';
            const route = hash.startsWith('/') ? hash : '/' + hash;
            this.handleRoute(route);
        });
        
        // Listen for navigation events
        window.addEventListener('popstate', (e) => {
            const hash = window.location.hash.slice(1) || '/home';
            const route = hash.startsWith('/') ? hash : '/' + hash;
            this.handleRoute(route);
        });
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.connectionStatus.isOnline = true;
            this.showConnectionStatus('Connection restored', 'success');
            // Retry failed routes if any
            this.retryFailedRoutes();
        });
        
        window.addEventListener('offline', () => {
            this.connectionStatus.isOnline = false;
            this.showConnectionStatus('Connection lost - working offline', 'warning');
        });
        
        // Preload critical pages
        this.preloadCriticalPages();
        
        // Handle initial route - check both pathname and hash
        let initialRoute;
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash.slice(1);
        
        // If we have a hash, use it (traditional SPA routing)
        if (currentHash) {
            initialRoute = currentHash.startsWith('/') ? currentHash : '/' + currentHash;
        }
        // If we have a direct path (from our SPA server), use it
        else if (currentPath && currentPath !== '/') {
            initialRoute = currentPath;
            // Update the hash to maintain consistency
            window.location.hash = '#' + currentPath;
        }
        // Default to dashboard
        else {
            initialRoute = '/dashboard';
            window.location.hash = '#/dashboard';
        }
        
        this.handleRoute(initialRoute);
    }

    createLoadingIndicator() {
        // Enhanced loading system using LoadingManager
        this.loadingManager = window.LoadingManager;
        this.currentLoaderId = null;
    }

    showLoading(text = 'Loading page...', showProgress = true) {
        if (this.loadingManager) {
            this.currentLoaderId = this.loadingManager.showGlobalLoading(text, showProgress);
        }
    }

    hideLoading() {
        if (this.loadingManager && this.currentLoaderId) {
            this.loadingManager.hideGlobalLoading();
            this.currentLoaderId = null;
        }
    }

    updateLoadingProgress(progress, text) {
        if (this.loadingManager) {
            this.loadingManager.updateProgress(progress);
            if (text) {
                const textElement = document.querySelector('.loading-overlay .loading-text');
                if (textElement) textElement.textContent = text;
            }
        }
    }

    register(path, pageClass, title = '', options = {}) {
        console.log(`Registering route: ${path}`); // Debug logging
        this.routes.set(path, {
            pageClass: pageClass,
            title: title,
            instance: null,
            preload: options.preload || false,
            cache: options.cache !== false // Default to true
        });
        console.log(`Routes registered:`, Array.from(this.routes.keys())); // Debug logging
    }

    async preloadCriticalPages() {
        // Preload dashboard page and other critical pages
        const criticalPaths = ['/dashboard', '/scanner'];
        
        for (const path of criticalPaths) {
            const route = this.routes.get(path);
            if (route && route.preload && !this.pageCache.has(path)) {
                try {
                    // Support both class constructors and factory functions
                    const pageInstance = typeof route.pageClass === 'function' && route.pageClass.prototype 
                        ? new route.pageClass() 
                        : route.pageClass();
                    if (route.cache) {
                        this.pageCache.set(path, pageInstance);
                    }
                } catch (error) {
                    console.warn(`Failed to preload page ${path}:`, error);
                }
            }
        }
    }

    navigate(path) {
        // Update browser hash for client-side routing
        const hash = '#' + path;
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        } else {
            // If hash is the same, manually trigger route handling
            this.handleRoute(path);
        }
    }

    async handleRoute(path) {
        console.log(`Handling route: ${path}`); // Debug logging
        
        const startTime = performance.now();
        this.performanceMetrics.navigationCount++;
        let loadingStarted = false;
        
        // Default to dashboard if path is root
        if (path === '/' || path === '') {
            path = '/dashboard';
        }

        // Show loading indicator for longer operations with progress
        const loadingTimeout = setTimeout(() => {
            this.showLoading(`Loading ${path.replace('/', '')} page...`, true);
            loadingStarted = true;
            this.updateLoadingProgress(10, 'Preparing page...');
        }, 100);

        const route = this.routes.get(path);
        
        if (!route) {
            console.warn(`Route not found: ${path}`);
            // Prevent infinite loop - only fallback if not already trying to go to dashboard
            if (path !== '/dashboard') {
                this.handleRoute('/dashboard');
            } else {
                console.error('Dashboard route not found! Cannot fallback.');
            }
            return;
        }

        try {
            if (loadingStarted) this.updateLoadingProgress(20, 'Validating route...');
            
            // Cleanup current page
            if (this.currentPage && typeof this.currentPage.destroy === 'function') {
                this.currentPage.destroy();
            }

            if (loadingStarted) this.updateLoadingProgress(30, 'Checking cache...');

            // Get page instance (from cache or create new)
            let pageInstance;
            if (route.cache && this.pageCache.has(path)) {
                pageInstance = this.pageCache.get(path);
                // Reinitialize cached page if needed
                if (typeof pageInstance.reinit === 'function') {
                    pageInstance.reinit();
                }
            } else {
                if (loadingStarted) this.updateLoadingProgress(40, 'Creating page instance...');
                
                // Support both class constructors and factory functions
                pageInstance = typeof route.pageClass === 'function' && route.pageClass.prototype 
                    ? new route.pageClass() 
                    : route.pageClass();
                if (route.cache) {
                    this.pageCache.set(path, pageInstance);
                }
            }

            this.currentPage = pageInstance;
            this.currentRoute = path;

            // Update page title
            if (route.title) {
                document.title = `GoldRadar - ${route.title}`;
            }

            if (loadingStarted) this.updateLoadingProgress(50, 'Preparing container...');

            // Render page with transition
            if (this.pageContainer) {
                // Add transition class
                this.pageContainer.classList.add('transitioning');
                
                if (loadingStarted) this.updateLoadingProgress(60, 'Transitioning...');
                
                // Add fade out effect
                this.pageContainer.style.opacity = '0';
                
                await new Promise(resolve => setTimeout(resolve, 150));
                
                if (loadingStarted) this.updateLoadingProgress(70, 'Rendering content...');
                
                this.pageContainer.innerHTML = '';
                const content = this.currentPage.render();
                
                // Handle both string and DOM element content
                if (typeof content === 'string') {
                    this.pageContainer.innerHTML = content;
                } else if (content instanceof HTMLElement) {
                    this.pageContainer.appendChild(content);
                }
                
                if (loadingStarted) this.updateLoadingProgress(85, 'Initializing page...');
                
                // Initialize page
                if (typeof this.currentPage.init === 'function') {
                    await this.currentPage.init();
                }
                
                if (loadingStarted) this.updateLoadingProgress(95, 'Finalizing...');
                
                // Fade in effect
                this.pageContainer.style.opacity = '1';
            }

            // Update navigation active state
            this.updateNavigationState(path);
            
            // Dispatch route change event for navigation components
            window.dispatchEvent(new CustomEvent('routeChanged', {
                detail: { route: path, page: this.currentPage }
            }));
            
            if (loadingStarted) this.updateLoadingProgress(100, 'Complete!');
            
            // Clear retry counter for successful route
            if (this.errorHandling && this.errorHandling.currentRetries && this.errorHandling.currentRetries.has(path)) {
                this.errorHandling.currentRetries.delete(path);
            }

            // Record performance metrics
            const loadTime = performance.now() - startTime;
            this.performanceMetrics.pageLoadTimes.set(path, loadTime);
            // Forward to global performance monitor
            if (window.performanceMonitor && typeof window.performanceMonitor.recordPageLoad === 'function') {
                try {
                    window.performanceMonitor.recordPageLoad(path, loadTime);
                } catch (e) {
                    // noop
                }
            }
            
            // Log performance for debugging
            if (loadTime > 100) {
                console.log(`Page ${path} loaded in ${loadTime.toFixed(2)}ms`);
            }

            // Emit detailed route loaded event for analytics consumers
            window.dispatchEvent(new CustomEvent('routeLoaded', {
                detail: { route: path, page: this.currentPage, loadTime }
            }));
            
        } catch (error) {
            console.error(`Error loading page ${path}:`, error);
            this.performanceMetrics.errorCount++;

            // Track error details
            if (this.errorHandling && this.errorHandling.errorHistory) {
                this.errorHandling.errorHistory.push({
                    path,
                    message: error && error.message ? error.message : String(error),
                    time: Date.now()
                });
            }

            // Retry logic
            const currentRetries = this.errorHandling && this.errorHandling.currentRetries
                ? (this.errorHandling.currentRetries.get(path) || 0)
                : 0;
            const canRetry = this.connectionStatus && this.connectionStatus.isOnline
                && this.errorHandling && currentRetries < this.errorHandling.maxRetries;

            if (canRetry) {
                const delay = this.errorHandling.retryDelay * Math.pow(2, currentRetries);
                this.errorHandling.currentRetries.set(path, currentRetries + 1);
                this.performanceMetrics.retryCount++;

                if (loadingStarted) {
                    this.updateLoadingProgress(5, `Recovering... retry ${currentRetries + 1}/${this.errorHandling.maxRetries}`);
                } else {
                    this.showLoading(`Loading ${path.replace('/', '')} page...`, true);
                    loadingStarted = true;
                    this.updateLoadingProgress(5, `Recovering... retry ${currentRetries + 1}/${this.errorHandling.maxRetries}`);
                }

                setTimeout(() => {
                    this.handleRoute(path);
                }, delay);
            } else {
                // Show error state
                if (loadingStarted) {
                    this.updateLoadingProgress(0, 'Error loading page...');
                    setTimeout(() => {
                        this.hideLoading();
                    }, 1000);
                }

                // Fallback to dashboard or render error content
                const fallback = this.errorHandling ? this.errorHandling.fallbackRoute : '/dashboard';
                if (path !== fallback) {
                    setTimeout(() => {
                        this.navigate(fallback);
                    }, 1500);
                } else if (this.pageContainer) {
                    this.pageContainer.innerHTML = `
                        <div style="padding: 40px; text-align: center; color: #666;">
                            <h2>Failed to load ${path.replace('/', '')}</h2>
                            <p>Please check your connection or try again.</p>
                            <button id="router-retry-btn" style="padding: 10px 20px; margin-top: 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Retry
                            </button>
                        </div>
                    `;
                    const btn = document.getElementById('router-retry-btn');
                    if (btn) {
                        btn.addEventListener('click', () => this.handleRoute(path));
                    }
                }
            }
        } finally {
            // Remove transition class
            if (this.pageContainer) {
                this.pageContainer.classList.remove('transitioning');
            }
            
            clearTimeout(loadingTimeout);
            
            // Hide loading after a brief delay to show completion
            setTimeout(() => {
                this.hideLoading();
            }, loadingStarted ? 300 : 0);
        }
    }

    updateNavigationState(activePath) {
        // Update desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === activePath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update mobile navigation
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === activePath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Performance monitoring methods
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            averageLoadTime: this.getAverageLoadTime(),
            cacheHitRate: this.getCacheHitRate()
        };
    }

    getAverageLoadTime() {
        const times = Array.from(this.performanceMetrics.pageLoadTimes.values());
        return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    }

    getCacheHitRate() {
        const totalNavigations = this.performanceMetrics.navigationCount;
        const cachedPages = this.pageCache.size;
        return totalNavigations > 0 ? (cachedPages / totalNavigations) * 100 : 0;
    }

    // Memory management
    clearCache() {
        this.pageCache.forEach(page => {
            if (typeof page.destroy === 'function') {
                page.destroy();
            }
        });
        this.pageCache.clear();
    }

    // Connection monitoring setup
    setupConnectionMonitoring() {
        if (this.connectionStatus && this.connectionStatus.checkInterval) {
            clearInterval(this.connectionStatus.checkInterval);
        }
        if (!this.connectionStatus) return;
        this.connectionStatus.checkInterval = setInterval(() => {
            const online = navigator.onLine;
            if (online !== this.connectionStatus.isOnline) {
                this.connectionStatus.isOnline = online;
                this.showConnectionStatus(online ? 'Back online' : 'Offline mode', online ? 'success' : 'warning');
            }
            this.connectionStatus.lastCheck = Date.now();
        }, 5000);
    }

    // Global error handlers
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            this.performanceMetrics.errorCount++;
            if (this.errorHandling && this.errorHandling.errorHistory) {
                this.errorHandling.errorHistory.push({
                    message: e.message,
                    source: e.filename,
                    lineno: e.lineno,
                    colno: e.colno,
                    time: Date.now()
                });
            }
        });
        window.addEventListener('unhandledrejection', (e) => {
            this.performanceMetrics.errorCount++;
            if (this.errorHandling && this.errorHandling.errorHistory) {
                this.errorHandling.errorHistory.push({
                    message: e.reason && e.reason.message ? e.reason.message : String(e.reason),
                    time: Date.now()
                });
            }
        });
    }

    // Show a lightweight connection status banner
    showConnectionStatus(message, type = 'info') {
        let banner = document.getElementById('connection-status-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'connection-status-banner';
            banner.style.position = 'fixed';
            banner.style.top = '12px';
            banner.style.right = '12px';
            banner.style.zIndex = '10000';
            banner.style.padding = '8px 12px';
            banner.style.borderRadius = '6px';
            banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            banner.style.fontSize = '13px';
            banner.style.opacity = '0';
            banner.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(banner);
        }
        const bg = type === 'success' ? '#1e8e3e' : (type === 'warning' ? '#b76e00' : '#2453a7');
        banner.style.background = bg;
        banner.style.color = '#fff';
        banner.textContent = message;
        banner.style.opacity = '1';
        clearTimeout(this._bannerTimeout);
        this._bannerTimeout = setTimeout(() => {
            banner.style.opacity = '0';
        }, 2500);
    }

    // Retry failed routes opportunistically
    retryFailedRoutes() {
        if (!this.errorHandling || !this.connectionStatus) return;
        this.errorHandling.currentRetries.forEach((count, path) => {
            if (count > 0 && count < this.errorHandling.maxRetries && this.connectionStatus.isOnline) {
                const delay = this.errorHandling.retryDelay * Math.pow(2, count - 1);
                setTimeout(() => this.handleRoute(path), delay);
                this.performanceMetrics.retryCount++;
            }
        });
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// Export for use in other files
window.GoldRadarRouter = GoldRadarRouter;