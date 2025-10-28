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
            navigationCount: 0
        };
        
        // Initialize router
        this.init();
    }

    init() {
        this.pageContainer = document.getElementById('page-content');
        this.createLoadingIndicator();
        
        // Listen for navigation events
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
        
        // Handle initial route
        this.handleRoute(window.location.pathname);
        
        // Preload critical pages
        this.preloadCriticalPages();
    }

    createLoadingIndicator() {
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator';
        this.loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading...</div>
        `;
        this.loadingIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: none;
            z-index: 10000;
        `;
        document.body.appendChild(this.loadingIndicator);
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    register(path, pageClass, title = '', options = {}) {
        this.routes.set(path, {
            pageClass: pageClass,
            title: title,
            instance: null,
            preload: options.preload || false,
            cache: options.cache !== false // Default to true
        });
    }

    async preloadCriticalPages() {
        // Preload home page and other critical pages
        const criticalPaths = ['/home', '/scanner'];
        
        for (const path of criticalPaths) {
            const route = this.routes.get(path);
            if (route && route.preload && !this.pageCache.has(path)) {
                try {
                    const pageInstance = new route.pageClass();
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
        // Update browser history
        if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
        }
        
        this.handleRoute(path);
    }

    async handleRoute(path) {
        const startTime = performance.now();
        this.performanceMetrics.navigationCount++;
        
        // Default to home if path is root
        if (path === '/' || path === '') {
            path = '/home';
        }

        const route = this.routes.get(path);
        
        if (!route) {
            console.warn(`Route not found: ${path}`);
            // Fallback to home
            this.navigate('/home');
            return;
        }

        // Show loading for slower transitions
        const loadingTimeout = setTimeout(() => {
            this.showLoading();
        }, 100);

        try {
            // Cleanup current page
            if (this.currentPage && typeof this.currentPage.destroy === 'function') {
                this.currentPage.destroy();
            }

            // Get page instance (from cache or create new)
            let pageInstance;
            if (route.cache && this.pageCache.has(path)) {
                pageInstance = this.pageCache.get(path);
                // Reinitialize cached page if needed
                if (typeof pageInstance.reinit === 'function') {
                    pageInstance.reinit();
                }
            } else {
                pageInstance = new route.pageClass();
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

            // Render page with transition
            if (this.pageContainer) {
                // Add fade out effect
                this.pageContainer.style.opacity = '0';
                
                await new Promise(resolve => setTimeout(resolve, 150));
                
                this.pageContainer.innerHTML = '';
                const content = this.currentPage.render();
                this.pageContainer.appendChild(content);
                
                // Initialize page
                if (typeof this.currentPage.init === 'function') {
                    await this.currentPage.init();
                }
                
                // Fade in effect
                this.pageContainer.style.opacity = '1';
            }

            // Update navigation active state
            this.updateNavigationState(path);
            
            // Record performance metrics
            const loadTime = performance.now() - startTime;
            this.performanceMetrics.pageLoadTimes.set(path, loadTime);
            
            // Log performance for debugging
            if (loadTime > 100) {
                console.log(`Page ${path} loaded in ${loadTime.toFixed(2)}ms`);
            }
            
        } catch (error) {
            console.error(`Error loading page ${path}:`, error);
            // Fallback to home on error
            if (path !== '/home') {
                this.navigate('/home');
            }
        } finally {
            clearTimeout(loadingTimeout);
            this.hideLoading();
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

    getCurrentRoute() {
        return this.currentRoute;
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// Export for use in other files
window.GoldRadarRouter = GoldRadarRouter;