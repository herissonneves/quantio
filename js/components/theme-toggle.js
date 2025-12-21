/**
 * Theme Toggle Component
 * Handles switching between light/dark themes and contrast levels
 */

const THEME_KEY = 'quantio-theme';
const CONTRAST_KEY = 'quantio-contrast';

const CONTRASTS = ['default', 'mc', 'hc'];

let currentTheme = 'light';
let currentContrast = 'default';

/**
 * Get the theme stylesheet path
 * @param {string} theme - 'light' or 'dark'
 * @param {string} contrast - 'default', 'mc', or 'hc'
 * @returns {string} Path to the theme CSS file
 */
function getThemePath(theme, contrast) {
    if (contrast === 'default') {
        return `css/themes/theme-${theme}.css`;
    }
    return `css/themes/theme-${theme}-${contrast}.css`;
}

/**
 * Get saved theme from localStorage or system preference
 * @returns {string} 'light' or 'dark'
 */
function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

/**
 * Get saved contrast from localStorage
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
 * Apply theme and contrast to the page
 * @param {string} theme - 'light' or 'dark'
 * @param {string} contrast - 'default', 'mc', or 'hc'
 */
function applyTheme(theme, contrast) {
    const themeStylesheet = document.getElementById('theme-stylesheet');
    if (themeStylesheet) {
        themeStylesheet.href = getThemePath(theme, contrast);
    }

    // Update html attribute for CSS hooks (:root)
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-contrast', contrast);

    currentTheme = theme;
    currentContrast = contrast;

    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(CONTRAST_KEY, contrast);

    // Update contrast buttons active state
    updateContrastButtons();
}

/**
 * Update the active state of contrast buttons
 */
function updateContrastButtons() {
    const buttons = document.querySelectorAll('.contrast-selector__btn');
    buttons.forEach(btn => {
        const contrast = btn.getAttribute('data-contrast');
        btn.classList.toggle('contrast-selector__btn--active', contrast === currentContrast);
    });
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme, currentContrast);
}

/**
 * Set contrast level
 * @param {string} contrast - 'default', 'mc', or 'hc'
 */
function setContrast(contrast) {
    if (CONTRASTS.includes(contrast)) {
        applyTheme(currentTheme, contrast);
    }
}

/**
 * Initialize the theme toggle
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
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light', currentContrast);
        }
    });
}
