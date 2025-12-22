/**
 * @fileoverview Tabs Component
 * @description Material Design 3 style tabs with panel switching functionality.
 * Provides a tabbed interface where clicking a tab activates the corresponding panel
 * and deactivates all others.
 *
 * @module components/tabs
 * @version 1.0.0
 */

/**
 * CSS selectors for tab elements.
 * @type {Object<string, string>}
 * @readonly
 */
const SELECTORS = {
    /** Selector for tab item buttons */
    item: '.tabs__item',
    /** Selector for tab panel containers */
    panel: '.tabs__panel',
};

/**
 * CSS class names for active states.
 * @type {Object<string, string>}
 * @readonly
 */
const CLASSES = {
    /** Class applied to the active tab item */
    itemActive: 'tabs__item--active',
    /** Class applied to the active tab panel */
    panelActive: 'tabs__panel--active',
};

/**
 * Initializes tabs functionality by attaching click event listeners
 * to tab items and managing the active state of tabs and panels.
 *
 * @function initTabs
 * @param {HTMLElement|Document} [container=document] - The container element
 *     to search for tabs within. Defaults to document for global search.
 * @returns {void}
 *
 * @example
 * // Initialize tabs in the entire document
 * initTabs();
 *
 * @example
 * // Initialize tabs within a specific container
 * const container = document.querySelector('.my-tabs-container');
 * initTabs(container);
 */
export function initTabs(container = document) {
    const tabItems = container.querySelectorAll(SELECTORS.item);
    const tabPanels = container.querySelectorAll(SELECTORS.panel);

    // Early return if no tabs or panels found
    if (!tabItems.length || !tabPanels.length) {
        return;
    }

    // Attach click handlers to each tab item
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Remove active state from all tabs
            tabItems.forEach(t => t.classList.remove(CLASSES.itemActive));
            // Add active state to clicked tab
            tab.classList.add(CLASSES.itemActive);

            // Update panel visibility
            tabPanels.forEach(panel => {
                panel.classList.remove(CLASSES.panelActive);
                if (panel.id === targetId) {
                    panel.classList.add(CLASSES.panelActive);
                }
            });
        });
    });
}

