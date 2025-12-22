/**
 * @fileoverview Theme Toggle Component
 * @description Handles switching between light/dark themes and contrast levels.
 * Manages theme persistence in localStorage and responds to system preferences.
 * Supports three contrast levels: default, medium contrast (mc), and high contrast (hc).
 *
 * @module components/theme-toggle
 * @version 1.0.0
 */

/**
 * LocalStorage key for storing theme preference.
 * @type {string}
 * @constant
 */
const THEME_KEY = 'quantio-theme';

/**
 * LocalStorage key for storing contrast preference.
 * @type {string}
 * @constant
 */
const CONTRAST_KEY = 'quantio-contrast';

/**
 * Available contrast levels.
 * @type {Array<string>}
 * @constant
 * @readonly
 */
const CONTRASTS = ['default', 'mc', 'hc'];

/**
 * Current active theme ('light' or 'dark').
 * @type {string}
 */
let currentTheme = 'light';

/**
 * Current active contrast level.
 * @type {string}
 */
let currentContrast = 'default';

/**
 * Generates the path to the theme stylesheet based on theme and contrast.
 *
 * @function getThemePath
 * @param {string} theme - Theme name: 'light' or 'dark'
 * @param {string} contrast - Contrast level: 'default', 'mc', or 'hc'
 * @returns {string} Path to the theme CSS file
 *
 * @example
 * getThemePath('dark', 'hc'); // Returns 'css/themes/theme-dark-hc.css'
 * getThemePath('light', 'default'); // Returns 'css/themes/theme-light.css'
 */
function getThemePath(theme, contrast) {
    if (contrast === 'default') {
        return `css/themes/theme-${theme}.css`;
    }
    return `css/themes/theme-${theme}-${contrast}.css`;
}

/**
 * Retrieves the saved theme from localStorage or falls back to system preference.
 * If no saved preference exists, checks the user's system color scheme preference.
 *
 * @function getSavedTheme
 * @returns {string} 'light' or 'dark'
 */
function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }
    // Check system preference as fallback
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

/**
 * Retrieves the saved contrast level from localStorage.
 * Returns 'default' if no valid contrast is found.
 *
 * @function getSavedContrast
 * @returns {string} 'default', 'mc', or 'hc'
 */
function getSavedContrast() {
    const saved = localStorage.getItem(CONTRAST_KEY);
    if (CONTRASTS.includes(saved)) {
        return saved;
    }
    return 'default';
}

/**
 * Applies the specified theme and contrast level to the page.
 * Updates the stylesheet, DOM attributes, localStorage, and UI state.
 *
 * @function applyTheme
 * @param {string} theme - Theme to apply: 'light' or 'dark'
 * @param {string} contrast - Contrast level: 'default', 'mc', or 'hc'
 * @returns {void}
 */
function applyTheme(theme, contrast) {
    const themeStylesheet = document.getElementById('theme-stylesheet');
    if (themeStylesheet) {
        themeStylesheet.href = getThemePath(theme, contrast);
    }

    // Update html attribute for CSS hooks (:root)
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-contrast', contrast);

    // Update internal state
    currentTheme = theme;
    currentContrast = contrast;

    // Persist preferences
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(CONTRAST_KEY, contrast);

    // Update contrast buttons active state
    updateContrastButtons();
}

/**
 * Updates the visual active state of contrast selector buttons.
 * Adds the active class to the button matching the current contrast level.
 *
 * @function updateContrastButtons
 * @returns {void}
 */
function updateContrastButtons() {
    const buttons = document.querySelectorAll('.contrast-selector__btn');
    buttons.forEach(btn => {
        const contrast = btn.getAttribute('data-contrast');
        btn.classList.toggle('contrast-selector__btn--active', contrast === currentContrast);
    });
}

/**
 * Toggles between light and dark themes while preserving the current contrast level.
 *
 * @function toggleTheme
 * @returns {void}
 */
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme, currentContrast);
}

/**
 * Sets the contrast level while preserving the current theme.
 * Only applies if the contrast level is valid.
 *
 * @function setContrast
 * @param {string} contrast - Contrast level to set: 'default', 'mc', or 'hc'
 * @returns {void}
 */
function setContrast(contrast) {
    if (CONTRASTS.includes(contrast)) {
        applyTheme(currentTheme, contrast);
    }
}

/**
 * Initializes the theme toggle component.
 * Sets up event listeners for theme and contrast controls, applies saved preferences,
 * and listens for system theme changes.
 *
 * @function initThemeToggle
 * @returns {void}
 *
 * @example
 * // Initialize theme toggle on page load
 * initThemeToggle();
 */
export function initThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    const contrastSelector = document.getElementById('contrast-selector');

    // Apply saved theme and contrast on load
    currentTheme = getSavedTheme();
    currentContrast = getSavedContrast();
    applyTheme(currentTheme, currentContrast);

    // Theme toggle click handler
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTheme);
    }

    // Contrast buttons click handlers
    if (contrastSelector) {
        const contrastButtons = contrastSelector.querySelectorAll('.contrast-selector__btn');
        contrastButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const contrast = btn.getAttribute('data-contrast');
                setContrast(contrast);
            });
        });
    }

    // Listen for system theme changes
    // Only auto-switch if user hasn't manually set a preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light', currentContrast);
        }
    });
}
