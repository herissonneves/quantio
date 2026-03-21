/**
 * @fileoverview Single shared history panel for Calculator and Converter tabs.
 * @module components/app-history
 */

import { createHistoryStore } from '../utils/history-store.js';
import { parseCalculatorResultFromHistoryLine, renderHistoryList } from '../utils/history-ui.js';

const TAB_CALCULATOR = 'calculator';
const TAB_CONVERTER = 'converter';

const calculatorStore = createHistoryStore('quantio-history-calculator');
const converterStore = createHistoryStore('quantio-history-converter');

/** @type {{ applyHistoryResult: (value: string) => void } | null} */
let calculatorTarget = null;

/**
 * @param {{ applyHistoryResult: (value: string) => void }} target
 */
export function registerCalculatorHistoryTarget(target) {
  calculatorTarget = target;
}

/**
 * @param {string} line
 */
export function addCalculatorHistoryEntry(line) {
  calculatorStore.add(line);
  document.dispatchEvent(
    new CustomEvent('quantio:historychanged', { detail: { tab: TAB_CALCULATOR } }),
  );
}

/**
 * @param {string} line
 */
export function addConverterHistoryEntry(line) {
  converterStore.add(line);
  document.dispatchEvent(
    new CustomEvent('quantio:historychanged', { detail: { tab: TAB_CONVERTER } }),
  );
}

function getActiveTabId() {
  const active = document.querySelector('.tabs__item--active');
  return active?.dataset?.tab ?? TAB_CALCULATOR;
}

function refreshAppHistoryUi() {
  const listEl = document.getElementById('app-history-list');
  if (!listEl) return;

  const tab = getActiveTabId();

  if (tab === TAB_CALCULATOR) {
    renderHistoryList(listEl, calculatorStore.load(), (entry) => {
      const value = parseCalculatorResultFromHistoryLine(entry);
      if (value == null || value === '') return;
      calculatorTarget?.applyHistoryResult(value);
    });
  } else {
    renderHistoryList(listEl, converterStore.load(), null);
  }
}

/**
 * Wires the shared history panel and reacts to tab / history updates.
 */
export function initAppHistory() {
  const clearBtn = document.getElementById('app-history-clear');

  clearBtn?.addEventListener('click', () => {
    const tab = getActiveTabId();
    if (tab === TAB_CALCULATOR) {
      calculatorStore.clear();
    } else {
      converterStore.clear();
    }
    refreshAppHistoryUi();
  });

  document.addEventListener('quantio:tabchange', () => {
    refreshAppHistoryUi();
  });

  document.addEventListener('quantio:historychanged', (e) => {
    const active = getActiveTabId();
    const source = e.detail?.tab;
    if (!source || source === active) {
      refreshAppHistoryUi();
    }
  });

  refreshAppHistoryUi();
}
