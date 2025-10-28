/**
 * Simple SPA Router for GoldRadar
 * Handles client-side routing for multi-page structure
 */
class GoldRadarRouter {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });

        // Handle initial load
        this.handleRoute(window.location.pathname || '/');
    }

    // Register a route
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    // Navigate to a route
    navigate(path) {
        if (path !== this.currentRoute) {
            window.history.pushState({}, '', path);
            this.handleRoute(path);
        }
    }

    // Handle route changes
    handleRoute(path) {
        // Default to home if path is empty
        if (path === '' || path === '/') {
            path = '/';
        }

        this.currentRoute = path;
        
        // Update active navigation
        this.updateActiveNav(path);
        
        // Execute route handler
        if (this.routes[path]) {
            this.routes[path]();
        } else {
            // 404 - redirect to home
            this.navigate('/');
        }
    }

    // Update active navigation item
    updateActiveNav(path) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current nav item
        const activeNav = document.querySelector(`[data-route="${path}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Export for use in other files
window.GoldRadarRouter = GoldRadarRouter;