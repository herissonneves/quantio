/**
 * Tabs Component
 * Material Design 3 style tabs with panel switching
 */

const SELECTORS = {
    item: '.tabs__item',
    panel: '.tabs__panel',
};

const CLASSES = {
    itemActive: 'tabs__item--active',
    panelActive: 'tabs__panel--active',
};

/**
 * Initialize tabs functionality
 * @param {HTMLElement} container - The tabs container element (optional, defaults to document)
 */
export function initTabs(container = document) {
    const tabItems = container.querySelectorAll(SELECTORS.item);
    const tabPanels = container.querySelectorAll(SELECTORS.panel);

    if (!tabItems.length || !tabPanels.length) {
        return;
    }

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Update active tab
            tabItems.forEach(t => t.classList.remove(CLASSES.itemActive));
            tab.classList.add(CLASSES.itemActive);

            // Update active panel
            tabPanels.forEach(panel => {
                panel.classList.remove(CLASSES.panelActive);
                if (panel.id === targetId) {
                    panel.classList.add(CLASSES.panelActive);
                }
            });
        });
    });
}

