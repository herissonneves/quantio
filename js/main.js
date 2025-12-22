/**
 * @fileoverview Quantio - Main Application Entry Point
 * @description Initializes all components when DOM is ready.
 * This module serves as the entry point for the Quantio application,
 * coordinating the initialization of all major components including
 * theme management, tabs navigation, and calculator functionality.
 *
 * @author Quantio Development Team
 * @version 1.0.0
 */

import { initTabs } from './components/tabs.js';
import { initCalculator } from './components/calculator.js';
import { initThemeToggle } from './components/theme-toggle.js';

/**
 * Initializes the application by setting up all components.
 * Components are initialized in a specific order to ensure dependencies
 * are met and the user experience is optimal.
 *
 * @function init
 * @returns {void}
 */
function init() {
    // Initialize theme first to ensure proper styling
    initThemeToggle();
    // Initialize tabs for navigation
    initTabs();
    // Initialize calculator functionality
    initCalculator();
}

/**
 * Initialize the application when the DOM is ready.
 * Handles both cases: when the script loads before DOM is ready
 * and when the DOM is already loaded.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded, initialize immediately
    init();
}

