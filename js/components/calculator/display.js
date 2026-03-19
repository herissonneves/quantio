/**
 * @fileoverview Display rendering and layout validation logic.
 * @module components/calculator/display
 */

import {
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  CHARS_AT_MAX_SIZE,
  MAX_DISPLAY_LINES,
} from "./constants.js";

/**
 * Checks whether the text fits into the display (2-line clamp) without overflowing.
 *
 * @param {HTMLElement|null} displayResult
 * @param {string} input
 * @returns {boolean}
 */
export function canFitInDisplay(displayResult, input) {
  if (!displayResult) return true;

  // Temporarily swaps content to measure overflow.
  const originalText = displayResult.textContent;
  const originalFontSize = displayResult.style.fontSize;
  const originalDisplay = displayResult.style.display;

  const length = input.length;
  let fontSize;
  if (length <= CHARS_AT_MAX_SIZE) {
    fontSize = MAX_FONT_SIZE;
  } else {
    const scale = CHARS_AT_MAX_SIZE / length;
    fontSize = Math.max(MIN_FONT_SIZE, MAX_FONT_SIZE * scale);
  }

  displayResult.textContent = input;
  displayResult.style.fontSize = `${fontSize}rem`;
  displayResult.style.display = "-webkit-box"; // Ensures line-clamp

  // Forces reflow for consistent measurements.
  displayResult.offsetHeight;

  const computedStyle = window.getComputedStyle(displayResult);
  const lineHeightValue = parseFloat(computedStyle.lineHeight);
  const maxHeight = lineHeightValue * MAX_DISPLAY_LINES;
  const actualHeight = displayResult.scrollHeight;

  // Restores the original state.
  displayResult.textContent = originalText;
  displayResult.style.fontSize = originalFontSize;
  displayResult.style.display = originalDisplay;

  return actualHeight <= maxHeight;
}

/**
 * Adjusts the result font size based on the current input length.
 *
 * @param {HTMLElement} displayResult
 * @param {string} currentInput
 */
export function adjustResultFontSize(displayResult, currentInput) {
  const length = currentInput.length;

  if (length <= CHARS_AT_MAX_SIZE) {
    displayResult.style.fontSize = `${MAX_FONT_SIZE}rem`;
  } else {
    const scale = CHARS_AT_MAX_SIZE / length;
    const newSize = Math.max(MIN_FONT_SIZE, MAX_FONT_SIZE * scale);
    displayResult.style.fontSize = `${newSize}rem`;
  }
}

/**
 * Updates the result and expression text, and adjusts the font size.
 *
 * @param {object} params
 * @param {HTMLElement|null} params.displayResult
 * @param {HTMLElement|null} params.displayExpression
 * @param {string} params.currentInput
 * @param {string} params.expression
 */
export function updateDisplay({
  displayResult,
  displayExpression,
  currentInput,
  expression,
}) {
  if (!displayResult || !displayExpression) return;

  displayResult.textContent = currentInput;
  displayExpression.textContent = expression;
  adjustResultFontSize(displayResult, currentInput);
}

