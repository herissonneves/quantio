/**
 * @fileoverview Calculator actions (numeric/operator input and state/DOM updates).
 * @module components/calculator/actions
 */

import { evaluateOperation } from "./operations.js";
import { canFitInDisplay, updateDisplay } from "./display.js";

/**
 * Creates a set of handlers using shared state and DOM references.
 *
 * @param {object} params
 * @param {{currentInput: string, expression: string, shouldResetInput: boolean}} params.state
 * @param {HTMLElement|null} params.displayResult
 * @param {HTMLElement|null} params.displayExpression
 * @param {(line: string) => void} [params.onCalculationComplete] Called when user presses "=" with a valid expression
 */
export function createCalculatorActions({
  state,
  displayResult,
  displayExpression,
  onCalculationComplete,
}) {
  function commitDisplay() {
    updateDisplay({
      displayResult,
      displayExpression,
      currentInput: state.currentInput,
      expression: state.expression,
    });
  }

  function inputNumber(num) {
    let newInput;

    if (state.shouldResetInput) {
      newInput = num;
      state.shouldResetInput = false;
    } else if (state.currentInput === "0" && num !== ".") {
      newInput = num;
    } else if (num === "." && state.currentInput.includes(".")) {
      return; // Prevent multiple decimals
    } else {
      newInput = state.currentInput + num;
    }

    if (!canFitInDisplay(displayResult, newInput)) return;

    state.currentInput = newInput;
    commitDisplay();
  }

  /**
   * @param {{ recordToHistory?: boolean }} [options]
   */
  function calculate(options = {}) {
    const { recordToHistory = false } = options;
    if (!state.expression) return;

    const parts = state.expression.split(" ");
    const firstNum = parseFloat(parts[0]);
    const operator = parts[1];
    const secondNum = parseFloat(state.currentInput);

    const result = evaluateOperation(firstNum, operator, secondNum);

    if (recordToHistory && onCalculationComplete) {
      if (typeof result === "number" && Number.isNaN(result)) {
        // Invalid operation; do not record.
      } else {
        const rhs =
          typeof result === "number"
            ? (() => {
                const rounded = Math.round(result * 1000000000) / 1000000000;
                return rounded.toString();
              })()
            : String(result);
        const line = `${parts[0]} ${operator} ${state.currentInput} = ${rhs}`;
        onCalculationComplete(line);
      }
    }

    if (typeof result === "number") {
      const roundedResult = Math.round(result * 1000000000) / 1000000000;
      const resultString = roundedResult.toString();

      if (!canFitInDisplay(displayResult, resultString)) {
        // Truncates character-by-character until it fits in the display.
        let truncated = resultString;
        while (truncated.length > 0 && !canFitInDisplay(displayResult, truncated)) {
          truncated = truncated.slice(0, -1);
        }
        state.currentInput = truncated || "0";
      } else {
        state.currentInput = resultString;
      }
    } else {
      // "Error"
      state.currentInput = result;
    }

    state.expression = "";
    state.shouldResetInput = true;
    commitDisplay();
  }

  function inputOperator(op) {
    if (state.expression && !state.shouldResetInput) {
      calculate();
    }
    state.expression = `${state.currentInput} ${op}`;
    state.shouldResetInput = true;
    commitDisplay();
  }

  function clear() {
    state.currentInput = "0";
    state.expression = "";
    state.shouldResetInput = false;
    commitDisplay();
  }

  function toggleSign() {
    if (state.currentInput === "0") return;

    const newInput = state.currentInput.startsWith("-")
      ? state.currentInput.slice(1)
      : "-" + state.currentInput;

    if (!canFitInDisplay(displayResult, newInput)) return;

    state.currentInput = newInput;
    commitDisplay();
  }

  function percentage() {
    const num = parseFloat(state.currentInput);
    state.currentInput = (num / 100).toString();
    commitDisplay();
  }

  function backspace() {
    if (state.currentInput.length > 1) {
      state.currentInput = state.currentInput.slice(0, -1);
    } else {
      state.currentInput = "0";
    }
    commitDisplay();
  }

  function handleButtonClick(value) {
    switch (value) {
      case "C":
        clear();
        break;
      case "±":
        toggleSign();
        break;
      case "%":
        percentage();
        break;
      case "+":
      case "-":
      case "×":
      case "÷":
        inputOperator(value);
        break;
      case "=":
        calculate({ recordToHistory: true });
        break;
      default:
        inputNumber(value);
    }
  }

  return {
    // Used by the keyboard handler
    backspace,
    handleButtonClick,

    // Used by button/flow handlers
    calculate,
    inputNumber,
    inputOperator,
    clear,
    toggleSign,
    percentage,

    // Utility
    updateDisplay: commitDisplay,
  };
}

