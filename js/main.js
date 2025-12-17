/**
 * Quantio - Main Application Entry Point
 * Initializes all components when DOM is ready
 */

import { initTabs } from './components/tabs.js';

/**
 * Initialize the application
 */
function init() {
    initTabs();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

