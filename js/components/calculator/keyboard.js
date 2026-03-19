/**
 * @fileoverview Calculator keyboard event handler.
 * @module components/calculator/keyboard
 */

import { mapKeyToValue } from "./keymap.js";

/**
 * Creates a `keydown` listener for the calculator.
 *
 * @param {object} params
 * @param {{backspace: Function, handleButtonClick: Function}} params.actions
 * @returns {(event: KeyboardEvent) => void}
 */
export function createKeyboardHandler({ actions }) {
  return function handleKeyboard(event) {
    // Does not interfere when focus is on form fields.
    const target = event.target;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT")
    ) {
      return;
    }

    const value = mapKeyToValue(event.key);
    if (value === null) return;

    event.preventDefault();

    if (value === "Backspace") {
      actions.backspace();
    } else {
      actions.handleButtonClick(value);
    }
  };
}

