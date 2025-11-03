/**
 * Enhanced Loading Components System
 * Provides various loading states and skeleton screens for better UX
 */

class LoadingManager {
    constructor() {
        this.activeLoaders = new Map();
        this.loadingQueue = new Set();
        this.init();
    }

    init() {
        this.injectStyles();
        // Wait for DOM to be ready before creating global loader
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createGlobalLoader();
            });
        } else {
            this.createGlobalLoader();
        }
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced Loading Styles */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .loading-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .loading-content {
                background: var(--bg-primary);
                border: 1px solid var(--border-primary);
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                max-width: 300px;
                width: 90%;
            }

            /* Enhanced Spinner */
            .loading-spinner-enhanced {
                width: 50px;
                height: 50px;
                border: 3px solid var(--border-secondary);
                border-top: 3px solid var(--accent-color);
                border-radius: 50%;
                animation: spin-enhanced 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                margin: 0 auto 20px;
            }

            @keyframes spin-enhanced {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.1); }
                100% { transform: rotate(360deg) scale(1); }
            }

            /* Progress Bar */
            .loading-progress {
                width: 100%;
                height: 4px;
                background: var(--border-secondary);
                border-radius: 2px;
                overflow: hidden;
                margin: 15px 0;
            }

            .loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-color), var(--success-color));
                border-radius: 2px;
                transition: width 0.3s ease;
                position: relative;
            }

            .loading-progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            /* Skeleton Screens */
            .skeleton {
                background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 4px;
            }

            @keyframes skeleton-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .skeleton-text {
                height: 16px;
                margin: 8px 0;
                border-radius: 4px;
            }

            .skeleton-text.large { height: 24px; }
            .skeleton-text.small { height: 12px; }
            .skeleton-text.title { height: 32px; margin: 16px 0; }

            .skeleton-card {
                background: var(--bg-secondary);
                border: 1px solid var(--border-primary);
                border-radius: 8px;
                padding: 20px;
                margin: 10px 0;
            }

            .skeleton-chart {
                height: 300px;
                background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 8px;
                position: relative;
                overflow: hidden;
            }

            .skeleton-chart::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                border: 3px solid var(--border-secondary);
                border-top: 3px solid var(--accent-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .skeleton-table {
                width: 100%;
                border-collapse: collapse;
            }

            .skeleton-table td {
                padding: 12px;
                border-bottom: 1px solid var(--border-primary);
            }

            .skeleton-row {
                display: flex;
                gap: 15px;
                align-items: center;
                margin: 10px 0;
            }

            .skeleton-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                flex-shrink: 0;
            }

            .skeleton-content {
                flex: 1;
            }

            /* Inline Loading States */
            .loading-inline {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--text-muted);
                font-size: 14px;
            }

            /* Inline Error State */
            .loading-error {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--error-color, #e74c3c);
                font-size: 14px;
            }

            .loading-error .error-icon {
                font-size: 16px;
                line-height: 1;
            }

            .loading-dots {
                display: inline-flex;
                gap: 2px;
            }

            .loading-dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: var(--accent-color);
                animation: loading-dots 1.4s infinite ease-in-out;
            }

            .loading-dot:nth-child(1) { animation-delay: -0.32s; }
            .loading-dot:nth-child(2) { animation-delay: -0.16s; }

            @keyframes loading-dots {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1.2); opacity: 1; }
            }

            /* Button Loading States */
            .btn-loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }

            .btn-loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .btn-loading .btn-text {
                opacity: 0;
            }

            /* Pulse Animation for Loading Elements */
            .loading-pulse {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }

            /* Responsive Adjustments */
            @media (max-width: 768px) {
                .loading-content {
                    padding: 20px;
                    margin: 20px;
                }

                .skeleton-chart {
                    height: 200px;
                }

                .skeleton-row {
                    gap: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createGlobalLoader() {
        if (!document.body) {
            console.warn('LoadingManager: document.body not available yet');
            return;
        }
        
        this.globalLoader = document.createElement('div');
        this.globalLoader.className = 'loading-overlay';
        this.globalLoader.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
                <div class="loading-progress">
                    <div class="loading-progress-bar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(this.globalLoader);
    }

    // Show global loading with optional progress
    showGlobalLoading(text = 'Loading...', showProgress = false) {
        const textElement = this.globalLoader.querySelector('.loading-text');
        const progressContainer = this.globalLoader.querySelector('.loading-progress');
        
        textElement.textContent = text;
        progressContainer.style.display = showProgress ? 'block' : 'none';
        
        this.globalLoader.classList.add('active');
        return 'global-loader';
    }

    // Hide global loading
    hideGlobalLoading() {
        this.globalLoader.classList.remove('active');
    }

    // Update progress (0-100)
    updateProgress(progress) {
        const progressBar = this.globalLoader.querySelector('.loading-progress-bar');
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // Create skeleton for specific elements
    createSkeleton(type, options = {}) {
        const skeleton = document.createElement('div');
        
        switch (type) {
            case 'text':
                skeleton.className = `skeleton skeleton-text ${options.size || ''}`;
                skeleton.style.width = options.width || '100%';
                break;
                
            case 'card':
                skeleton.className = 'skeleton-card';
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-text title" style="width: 60%"></div>
                    <div class="skeleton skeleton-text" style="width: 100%"></div>
                    <div class="skeleton skeleton-text" style="width: 80%"></div>
                    <div class="skeleton skeleton-text" style="width: 90%"></div>
                `;
                break;
                
            case 'chart':
                skeleton.className = 'skeleton-chart';
                skeleton.style.height = options.height || '300px';
                break;
                
            case 'table':
                const rows = options.rows || 5;
                const cols = options.cols || 4;
                skeleton.innerHTML = `
                    <table class="skeleton-table">
                        ${Array(rows).fill().map(() => `
                            <tr>
                                ${Array(cols).fill().map(() => `
                                    <td><div class="skeleton skeleton-text"></div></td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </table>
                `;
                break;
                
            case 'list':
                const items = options.items || 5;
                skeleton.innerHTML = Array(items).fill().map(() => `
                    <div class="skeleton-row">
                        <div class="skeleton skeleton-avatar"></div>
                        <div class="skeleton-content">
                            <div class="skeleton skeleton-text" style="width: 70%"></div>
                            <div class="skeleton skeleton-text small" style="width: 50%"></div>
                        </div>
                    </div>
                `).join('');
                break;
        }
        
        return skeleton;
    }

    // Show skeleton in target element
    showSkeleton(targetSelector, type, options = {}) {
        const target = document.querySelector(targetSelector);
        if (!target) return null;
        
        const skeleton = this.createSkeleton(type, options);
        const loaderId = `skeleton-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        skeleton.setAttribute('data-loader-id', loaderId);
        
        // Store original content
        this.activeLoaders.set(loaderId, {
            target,
            originalContent: target.innerHTML,
            type: 'skeleton'
        });
        
        target.innerHTML = '';
        target.appendChild(skeleton);
        
        return loaderId;
    }

    // Hide skeleton and restore content
    hideSkeleton(loaderId) {
        const loader = this.activeLoaders.get(loaderId);
        if (!loader) return;
        
        loader.target.innerHTML = loader.originalContent;
        this.activeLoaders.delete(loaderId);
    }

    // Show inline loading (for buttons, etc.)
    showInlineLoading(targetSelector, text = '') {
        const target = document.querySelector(targetSelector);
        if (!target) return null;

        const loaderId = `inline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        this.activeLoaders.set(loaderId, {
            target,
            originalContent: target.innerHTML,
            originalClasses: target.className,
            type: 'inline'
        });

        if (target.tagName === 'BUTTON') {
            target.classList.add('btn-loading');
            target.innerHTML = `<span class="btn-text">${target.textContent}</span>`;
        } else {
            target.innerHTML = `
                <span class="loading-inline">
                    ${text}
                    <span class="loading-dots">
                        <span class="loading-dot"></span>
                        <span class="loading-dot"></span>
                        <span class="loading-dot"></span>
                    </span>
                </span>
            `;
        }

        return loaderId;
    }

    // Hide inline loading
    hideInlineLoading(ref) {
        let loader = null;
        // Allow passing a selector string in addition to loaderId
        if (typeof ref === 'string' && (ref.startsWith('.') || ref.startsWith('#'))) {
            const target = document.querySelector(ref);
            if (target) {
                for (const [id, l] of this.activeLoaders.entries()) {
                    if (l.target === target) {
                        loader = l;
                        this.activeLoaders.delete(id);
                        break;
                    }
                }
            }
        } else {
            loader = this.activeLoaders.get(ref);
            if (loader) this.activeLoaders.delete(ref);
        }

        if (!loader) return;

        loader.target.innerHTML = loader.originalContent;
        loader.target.className = loader.originalClasses;
    }

    // Update inline loading message for an existing loader or create one
    updateInlineLoadingMessage(targetSelector, text = '') {
        const target = document.querySelector(targetSelector);
        if (!target) return null;

        // Find active loader associated with this target
        let foundLoaderId = null;
        for (const [id, l] of this.activeLoaders.entries()) {
            if (l.target === target) {
                foundLoaderId = id;
                break;
            }
        }

        if (foundLoaderId) {
            // Update message inside existing inline loader
            const inline = target.querySelector('.loading-inline');
            if (inline) {
                // Replace only the text, keep dots animation
                const dots = inline.querySelector('.loading-dots');
                inline.innerHTML = `${text}${dots ? dots.outerHTML : ''}`;
            } else {
                // If structure changed, re-render
                target.innerHTML = `
                    <span class="loading-inline">
                        ${text}
                        <span class="loading-dots">
                            <span class="loading-dot"></span>
                            <span class="loading-dot"></span>
                            <span class="loading-dot"></span>
                        </span>
                    </span>
                `;
            }
            return foundLoaderId;
        }

        // No existing loader, show a new one
        return this.showInlineLoading(targetSelector, text);
    }

    // Show an inline error state
    showError(targetSelector, text = 'An error occurred') {
        const target = document.querySelector(targetSelector);
        if (!target) return null;

        // If there's already a loader, reuse its original content reference
        let loaderId = null;
        let existingLoader = null;
        for (const [id, l] of this.activeLoaders.entries()) {
            if (l.target === target) {
                loaderId = id;
                existingLoader = l;
                break;
            }
        }

        if (!existingLoader) {
            loaderId = `inline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            this.activeLoaders.set(loaderId, {
                target,
                originalContent: target.innerHTML,
                originalClasses: target.className,
                type: 'inline-error'
            });
        }

        target.innerHTML = `
            <span class="loading-error">
                <span class="error-icon">⚠️</span>
                ${text}
            </span>
        `;

        return loaderId;
    }

    // Utility method to wrap async operations with loading
    async withLoading(asyncFn, options = {}) {
        const { 
            global = false, 
            target = null, 
            type = 'skeleton', 
            text = 'Loading...',
            skeletonOptions = {}
        } = options;
        
        let loaderId = null;
        
        try {
            if (global) {
                loaderId = this.showGlobalLoading(text, options.showProgress);
            } else if (target) {
                if (type === 'skeleton') {
                    loaderId = this.showSkeleton(target, options.skeletonType || 'card', skeletonOptions);
                } else {
                    loaderId = this.showInlineLoading(target, text);
                }
            }
            
            const result = await asyncFn();
            return result;
            
        } finally {
            if (loaderId) {
                if (global) {
                    this.hideGlobalLoading();
                } else if (type === 'skeleton') {
                    this.hideSkeleton(loaderId);
                } else {
                    this.hideInlineLoading(loaderId);
                }
            }
        }
    }

    // Clean up all active loaders
    cleanup() {
        this.activeLoaders.forEach((loader, loaderId) => {
            if (loader.type === 'skeleton') {
                this.hideSkeleton(loaderId);
            } else {
                this.hideInlineLoading(loaderId);
            }
        });
        this.hideGlobalLoading();
    }
}

// Create global instance
window.LoadingManager = new LoadingManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingManager;
}