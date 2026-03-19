/**
 * @fileoverview Pure calculator operations.
 * @module components/calculator/operations
 */

/**
 * Evaluates a simple operation.
 * Kept as a pure function for unit tests.
 *
 * @param {number} firstNum
 * @param {string} operator One of "+", "-", "×", "÷"
 * @param {number} secondNum
 * @returns {number|string} "Error" for division by zero
 */
export function evaluateOperation(firstNum, operator, secondNum) {
  switch (operator) {
    case "+":
      return firstNum + secondNum;
    case "-":
      return firstNum - secondNum;
    case "×":
      return firstNum * secondNum;
    case "÷":
      return secondNum !== 0 ? firstNum / secondNum : "Error";
    default:
      return NaN;
  }
}

