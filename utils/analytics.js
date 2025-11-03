/**
 * Lightweight Analytics utility for GoldRadar
 * Tracks page views, user interactions, and errors, and flushes metrics.
 */

class Analytics {
    constructor(options = {}) {
        this.events = [];
        this.maxEvents = 500;
        this.flushIntervalMs = options.flushIntervalMs || 60000; // 1 min
        this.endpoint = options.endpoint || (window.ANALYTICS_ENDPOINT || null);
        this.nightlyBeacon = !!options.nightlyBeacon;
        this.snapshotHour = typeof options.snapshotHour === 'number' ? options.snapshotHour : 3; // 3 AM local
        this.flushTimer = null;
        this.snapshotTimer = null;
    }

    init() {
        // Listen for route load completion to track page views with timing
        window.addEventListener('routeLoaded', (e) => {
            const detail = e && e.detail ? e.detail : {};
            const route = detail.route || window.location.hash.replace('#', '') || '/';
            const loadTime = typeof detail.loadTime === 'number' ? detail.loadTime : 0;
            this.trackPageView(route, loadTime);
        });

        // Forward global errors to analytics
        window.addEventListener('error', (event) => {
            this.trackError({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.trackError({ message: 'Unhandled Promise Rejection', reason: String(event.reason) });
        });

        // Periodic flush
        this.flushTimer = setInterval(() => this.flush(), this.flushIntervalMs);

        // Nightly snapshot of full metrics via beacon
        if (this.nightlyBeacon) {
            this.scheduleNightlySnapshot();
        }

        // Flush before unload when possible
        window.addEventListener('visibilitychange', () => {
            if (document.hidden) this.flush();
        });
        window.addEventListener('beforeunload', () => {
            this.flush(true);
        });
    }

    trackPageView(route, loadTime = 0) {
        try {
            const payload = { type: 'pageview', route, loadTime, ts: Date.now() };
            this._pushEvent(payload);
            if (window.performanceMonitor && typeof window.performanceMonitor.recordPageLoad === 'function') {
                window.performanceMonitor.recordPageLoad(route, loadTime);
            }
        } catch (e) {
            // noop
        }
    }

    trackEvent(name, properties = {}) {
        try {
            const payload = { type: 'event', name, properties, ts: Date.now() };
            this._pushEvent(payload);
            if (window.performanceMonitor && typeof window.performanceMonitor.recordInteraction === 'function') {
                const el = properties && properties.elementId ? `#${properties.elementId}` : (properties && properties.element ? properties.element : name);
                window.performanceMonitor.recordInteraction(name, el, properties && properties.duration ? properties.duration : 0);
            }
        } catch (e) {
            // noop
        }
    }

    trackError(error) {
        try {
            const payload = { type: 'error', error, ts: Date.now() };
            this._pushEvent(payload);
            if (window.performanceMonitor && typeof window.performanceMonitor.recordError === 'function') {
                window.performanceMonitor.recordError({ ...error, timestamp: Date.now() });
            }
        } catch (e) {
            // noop
        }
    }

    _pushEvent(evt) {
        this.events.push(evt);
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }
    }

    flush(useBeacon = false) {
        if (this.events.length === 0) return;
        const data = {
            ts: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            events: this.events.slice(),
        };

        // Try to send via beacon if endpoint present
        try {
            if (useBeacon && this.endpoint && navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                navigator.sendBeacon(this.endpoint, blob);
                this.events = [];
                return;
            }
        } catch (e) {
            // fallthrough to console
        }

        // Fallback: log to console (no backend in this environment)
        console.log('[Analytics] flush', data);
        this.events = [];
    }

    scheduleNightlySnapshot() {
        try {
            const now = new Date();
            const next = new Date(now);
            next.setHours(this.snapshotHour, 0, 0, 0);
            if (next.getTime() <= now.getTime()) {
                // If the time passed today, schedule for tomorrow
                next.setDate(next.getDate() + 1);
            }
            const delay = next.getTime() - now.getTime();
            this.snapshotTimer = setTimeout(() => {
                this.sendSnapshot();
                // Then every 24 hours
                this.snapshotTimer = setInterval(() => this.sendSnapshot(), 24 * 60 * 60 * 1000);
            }, delay);
        } catch (e) {
            console.warn('[Analytics] Failed to schedule nightly snapshot', e);
        }
    }

    sendSnapshot() {
        try {
            if (!window.performanceMonitor || typeof window.performanceMonitor.exportMetrics !== 'function') {
                console.warn('[Analytics] PerformanceMonitor not available for snapshot');
                return;
            }
            const json = window.performanceMonitor.exportMetrics();
            const payload = {
                type: 'snapshot',
                ts: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                data: JSON.parse(json)
            };

            // Prefer beacon when endpoint exists
            if (this.endpoint && navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                navigator.sendBeacon(this.endpoint, blob);
            } else {
                console.log('[Analytics] nightly snapshot', payload);
            }
        } catch (e) {
            console.error('[Analytics] Failed to send snapshot', e);
        }
    }

    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
        if (this.snapshotTimer) {
            try {
                clearTimeout(this.snapshotTimer);
            } catch (e) {
                // if it's an interval, clearInterval will still work
                clearInterval(this.snapshotTimer);
            }
            this.snapshotTimer = null;
        }
    }
}

// Export
window.Analytics = Analytics;