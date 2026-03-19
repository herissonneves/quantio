/**
 * @fileoverview Calculator Component
 * @description Orchestrates the calculator using dedicated modules.
 * @module components/calculator
 * @version 1.1.0
 */

import { createCalculatorActions } from "./calculator/actions.js";
import { createKeyboardHandler } from "./calculator/keyboard.js";
import { evaluateOperation } from "./calculator/operations.js";
import { mapKeyToValue } from "./calculator/keymap.js";

export { evaluateOperation, mapKeyToValue };

/**
 * Initializes the calculator component.
 * Sets up DOM element references, attaches event listeners for buttons and keyboard,
 * and initializes the display.
 *
 * @function initCalculator
 * @returns {void}
 */
export function initCalculator() {
  const calculator = document.querySelector(".calculator");
  if (!calculator) return;

  const displayResult = calculator.querySelector(".calculator__result");
  const displayExpression = calculator.querySelector(".calculator__expression");
  const buttons = calculator.querySelectorAll(".calculator__button");

  const state = {
    currentInput: "0",
    expression: "",
    shouldResetInput: false,
  };

  const actions = createCalculatorActions({
    state,
    displayResult,
    displayExpression,
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent.trim();
      actions.handleButtonClick(value);
    });
  });

  document.addEventListener("keydown", createKeyboardHandler({ actions }));

  // Ensures consistent initial render.
  actions.updateDisplay();
}
