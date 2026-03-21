/**
 * @fileoverview Render history list + clear control.
 * @module utils/history-ui
 */

/**
 * @param {HTMLElement} listEl
 * @param {string[]} items
 * @param {(entry: string) => void} [onSelect]
 */
export function renderHistoryList(listEl, items, onSelect) {
  if (!listEl) return;
  listEl.innerHTML = '';
  items.forEach((text) => {
    const li = document.createElement('li');
    li.className = 'component-history__item';
    li.textContent = text;
    if (onSelect) {
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      const activate = () => onSelect(text);
      li.addEventListener('click', activate);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    }
    listEl.appendChild(li);
  });
}

/**
 * Extracts the right-hand side after the last " = " (calculator results).
 * @param {string} line
 * @returns {string|null}
 */
export function parseCalculatorResultFromHistoryLine(line) {
  const marker = ' = ';
  const idx = line.lastIndexOf(marker);
  if (idx === -1) return null;
  return line.slice(idx + marker.length).trim();
}
