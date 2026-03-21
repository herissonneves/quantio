/**
 * @fileoverview LocalStorage-backed history list (newest first).
 * @module utils/history-store
 */

const DEFAULT_MAX = 50;

/**
 * @param {string} storageKey
 * @param {number} [maxItems]
 */
export function createHistoryStore(storageKey, maxItems = DEFAULT_MAX) {
  /**
   * @returns {string[]}
   */
  function load() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  /**
   * @param {string[]} items
   */
  function save(items) {
    const trimmed = items.slice(0, maxItems);
    localStorage.setItem(storageKey, JSON.stringify(trimmed));
    return trimmed;
  }

  /**
   * @param {string} entry
   * @returns {string[]}
   */
  function add(entry) {
    if (!entry || typeof entry !== 'string') return load();
    const items = load();
    if (items[0] === entry) return items;
    items.unshift(entry);
    return save(items);
  }

  /**
   * @returns {string[]}
   */
  function clear() {
    return save([]);
  }

  return { load, add, clear, save };
}
