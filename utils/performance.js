/**
 * Performance monitoring utilities for GoldRadar
 * Tracks page load times, memory usage, and user interactions
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoads: new Map(),
            interactions: [],
            memoryUsage: [],
            errors: []
        };
        
        this.startTime = performance.now();
        this.init();
    }

    init() {
        // Monitor page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.recordMetric('page_hidden', performance.now());
            } else {
                this.recordMetric('page_visible', performance.now());
            }
        });

        // Monitor memory usage periodically
        if ('memory' in performance) {
            setInterval(() => {
                this.recordMemoryUsage();
            }, 30000); // Every 30 seconds
        }

        // Monitor errors
        window.addEventListener('error', (event) => {
            this.recordError({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: Date.now()
            });
        });

        // Monitor unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.recordError({
                message: 'Unhandled Promise Rejection: ' + event.reason,
                timestamp: Date.now()
            });
        });
    }

    recordPageLoad(pageName, loadTime) {
        this.metrics.pageLoads.set(pageName, {
            loadTime: loadTime,
            timestamp: Date.now()
        });
        
        // Log slow page loads
        if (loadTime > 1000) {
            console.warn(`Slow page load detected: ${pageName} took ${loadTime.toFixed(2)}ms`);
        }
    }

    recordInteraction(type, element, duration = 0) {
        this.metrics.interactions.push({
            type: type,
            element: element,
            duration: duration,
            timestamp: Date.now()
        });

        // Keep only last 100 interactions to prevent memory bloat
        if (this.metrics.interactions.length > 100) {
            this.metrics.interactions = this.metrics.interactions.slice(-100);
        }
    }

    recordMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            this.metrics.memoryUsage.push({
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit,
                timestamp: Date.now()
            });

            // Keep only last 20 memory readings
            if (this.metrics.memoryUsage.length > 20) {
                this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-20);
            }

            // Warn about high memory usage
            const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
            if (usagePercent > 80) {
                console.warn(`High memory usage detected: ${usagePercent.toFixed(1)}%`);
            }
        }
    }

    recordError(error) {
        this.metrics.errors.push(error);
        
        // Keep only last 50 errors
        if (this.metrics.errors.length > 50) {
            this.metrics.errors = this.metrics.errors.slice(-50);
        }
    }

    recordMetric(name, value) {
        if (!this.metrics[name]) {
            this.metrics[name] = [];
        }
        
        this.metrics[name].push({
            value: value,
            timestamp: Date.now()
        });
    }

    getMetrics() {
        return {
            ...this.metrics,
            uptime: performance.now() - this.startTime,
            averagePageLoadTime: this.getAveragePageLoadTime(),
            errorRate: this.getErrorRate(),
            memoryTrend: this.getMemoryTrend()
        };
    }

    getAveragePageLoadTime() {
        const loads = Array.from(this.metrics.pageLoads.values());
        if (loads.length === 0) return 0;
        
        const totalTime = loads.reduce((sum, load) => sum + load.loadTime, 0);
        return totalTime / loads.length;
    }

    getErrorRate() {
        const timeWindow = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();
        const recentErrors = this.metrics.errors.filter(
            error => (now - error.timestamp) < timeWindow
        );
        
        return recentErrors.length;
    }

    getMemoryTrend() {
        if (this.metrics.memoryUsage.length < 2) return 'stable';
        
        const recent = this.metrics.memoryUsage.slice(-5);
        const first = recent[0].used;
        const last = recent[recent.length - 1].used;
        
        const change = ((last - first) / first) * 100;
        
        if (change > 10) return 'increasing';
        if (change < -10) return 'decreasing';
        return 'stable';
    }

    // Performance optimization suggestions
    getOptimizationSuggestions() {
        const suggestions = [];
        const metrics = this.getMetrics();

        // Check page load times
        if (metrics.averagePageLoadTime > 500) {
            suggestions.push({
                type: 'performance',
                message: 'Average page load time is high. Consider implementing lazy loading or code splitting.',
                priority: 'high'
            });
        }

        // Check memory usage
        if (metrics.memoryTrend === 'increasing') {
            suggestions.push({
                type: 'memory',
                message: 'Memory usage is increasing. Check for memory leaks in event listeners or intervals.',
                priority: 'medium'
            });
        }

        // Check error rate
        if (metrics.errorRate > 5) {
            suggestions.push({
                type: 'errors',
                message: 'High error rate detected. Review recent errors and implement proper error handling.',
                priority: 'high'
            });
        }

        return suggestions;
    }

    // Export metrics for analysis
    exportMetrics() {
        const data = {
            timestamp: new Date().toISOString(),
            metrics: this.getMetrics(),
            suggestions: this.getOptimizationSuggestions(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        return JSON.stringify(data, null, 2);
    }

    // Clear old metrics to free memory
    cleanup() {
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
        
        // Clean interactions
        this.metrics.interactions = this.metrics.interactions.filter(
            interaction => interaction.timestamp > cutoff
        );
        
        // Clean memory usage
        this.metrics.memoryUsage = this.metrics.memoryUsage.filter(
            usage => usage.timestamp > cutoff
        );
        
        // Clean errors
        this.metrics.errors = this.metrics.errors.filter(
            error => error.timestamp > cutoff
        );
    }
}

// Create global performance monitor instance
window.performanceMonitor = new PerformanceMonitor();

// Auto-cleanup every hour
setInterval(() => {
    window.performanceMonitor.cleanup();
}, 60 * 60 * 1000);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}