// Lightweight wrapper around LoadingManager to track loader IDs by selector
// Provides consistent show/update/hide/error handling across pages.

(function() {
  const loaderMap = new Map(); // selector -> loaderId

  function getManager() {
    return window.LoadingManager;
  }

  function showInline(targetSelector, text = '') {
    const mgr = getManager();
    if (!mgr) return null;
    const id = mgr.showInlineLoading(targetSelector, text);
    if (id) loaderMap.set(targetSelector, id);
    return id;
  }

  function updateInline(targetSelector, text = '') {
    const mgr = getManager();
    if (!mgr) return null;
    // Will update existing loader or create a new one if missing
    const id = mgr.updateInlineLoadingMessage(targetSelector, text);
    if (id) loaderMap.set(targetSelector, id);
    return id;
  }

  function hideInline(targetSelector) {
    const mgr = getManager();
    if (!mgr) return;
    const id = loaderMap.get(targetSelector);
    // hideInlineLoading supports selector or id
    mgr.hideInlineLoading(id || targetSelector);
    loaderMap.delete(targetSelector);
  }

  function showError(targetSelector, text = 'An error occurred') {
    const mgr = getManager();
    if (!mgr) return null;
    const id = mgr.showError(targetSelector, text);
    if (id) loaderMap.set(targetSelector, id);
    return id;
  }

  function showRetryError(targetSelector, text, onRetry) {
    const mgr = getManager();
    if (!mgr) return null;
    const id = mgr.showRetryError(targetSelector, text, (ctx) => {
      try {
        if (typeof onRetry === 'function') onRetry(ctx);
      } finally {
        // Let caller decide when to hide, after retry succeeds
      }
    });
    if (id) loaderMap.set(targetSelector, id);
    return id;
  }

  // Expose globally
  window.LoadingUtil = {
    showInline,
    updateInline,
    hideInline,
    showError,
    showRetryError,
    _getManager: getManager
  };
})();