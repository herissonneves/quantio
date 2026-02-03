/**
 * @fileoverview Calculator Component
 * @description Handles calculator functionality including button clicks, keyboard input,
 * arithmetic operations, and display management. Implements input validation to prevent
 * display overflow and supports dynamic font scaling for long numbers.
 *
 * @module components/calculator
 * @version 1.0.0
 */

/**
 * Current input value displayed in the calculator.
 * @type {string}
 */
let currentInput = "0";

/**
 * Current expression being evaluated (first number and operator).
 * @type {string}
 */
let expression = "";

/**
 * Flag indicating whether the input should be reset on next number entry.
 * @type {boolean}
 */
let shouldResetInput = false;

/**
 * DOM element for the result display.
 * @type {HTMLElement|null}
 */
let displayResult;

/**
 * DOM element for the expression display.
 * @type {HTMLElement|null}
 */
let displayExpression;

/**
 * Maximum font size for the result display (in rem).
 * @type {number}
 * @constant
 */
const MAX_FONT_SIZE = 2.8;

/**
 * Minimum font size for the result display (in rem).
 * @type {number}
 * @constant
 */
const MIN_FONT_SIZE = 1.2;

/**
 * Number of characters at which font size starts scaling down.
 * @type {number}
 * @constant
 */
const CHARS_AT_MAX_SIZE = 8;

/**
 * Maximum number of lines allowed in the display.
 * @type {number}
 * @constant
 */
const MAX_DISPLAY_LINES = 2;

/**
 * Checks if the given input string fits within the display constraints (2 lines max).
 * Temporarily applies the input to the display element and measures its height
 * to determine if it would overflow.
 *
 * @function canFitInDisplay
 * @param {string} input - The input string to check
 * @returns {boolean} True if input fits within display, false if it would overflow
 */
function canFitInDisplay(input) {
  if (!displayResult) return true;

  // Temporarily set the text to check if it fits
  const originalText = displayResult.textContent;
  const originalFontSize = displayResult.style.fontSize;
  const originalDisplay = displayResult.style.display;

  // Calculate expected font size
  const length = input.length;
  let fontSize;
  if (length <= CHARS_AT_MAX_SIZE) {
    fontSize = MAX_FONT_SIZE;
  } else {
    const scale = CHARS_AT_MAX_SIZE / length;
    fontSize = Math.max(MIN_FONT_SIZE, MAX_FONT_SIZE * scale);
  }

  // Set temporary values
  displayResult.textContent = input;
  displayResult.style.fontSize = `${fontSize}rem`;
  displayResult.style.display = '-webkit-box'; // Ensure line-clamp is active

  // Force a reflow to get accurate measurements
  displayResult.offsetHeight;

  // Check if content fits (scrollHeight should not exceed 2 lines)
  // Get computed line-height
  const computedStyle = window.getComputedStyle(displayResult);
  const lineHeightValue = parseFloat(computedStyle.lineHeight);
  const maxHeight = lineHeightValue * MAX_DISPLAY_LINES;
  const actualHeight = displayResult.scrollHeight;

  // Restore original values
  displayResult.textContent = originalText;
  displayResult.style.fontSize = originalFontSize;
  displayResult.style.display = originalDisplay;

  return actualHeight <= maxHeight;
}

/**
 * Dynamically adjusts the font size of the result display based on content length.
 * Uses maximum font size for short numbers and scales down proportionally for longer numbers.
 *
 * @function adjustResultFontSize
 * @returns {void}
 */
function adjustResultFontSize() {
  const length = currentInput.length;

  if (length <= CHARS_AT_MAX_SIZE) {
    displayResult.style.fontSize = `${MAX_FONT_SIZE}rem`;
  } else {
    // Gradually decrease font size
    const scale = CHARS_AT_MAX_SIZE / length;
    const newSize = Math.max(MIN_FONT_SIZE, MAX_FONT_SIZE * scale);
    displayResult.style.fontSize = `${newSize}rem`;
  }
}

/**
 * Updates both the result and expression displays with current values.
 * Also adjusts font size to ensure content fits properly.
 *
 * @function updateDisplay
 * @returns {void}
 */
function updateDisplay() {
  displayResult.textContent = currentInput;
  displayExpression.textContent = expression;
  adjustResultFontSize();
}

/**
 * Handles numeric input including digits and decimal point.
 * Validates input to prevent multiple decimal points and display overflow.
 *
 * @function inputNumber
 * @param {string} num - The number or decimal point to add
 * @returns {void}
 */
function inputNumber(num) {
  let newInput;

  if (shouldResetInput) {
    newInput = num;
    shouldResetInput = false;
  } else if (currentInput === "0" && num !== ".") {
    newInput = num;
  } else if (num === "." && currentInput.includes(".")) {
    return; // Prevent multiple decimals
  } else {
    newInput = currentInput + num;
  }

  // Check if the new input would fit in the display
  if (!canFitInDisplay(newInput)) {
    return; // Don't accept more characters if it won't fit
  }

  currentInput = newInput;
  updateDisplay();
}

/**
 * Handles operator input (+, -, ×, ÷).
 * If an expression already exists, calculates it before setting the new operator.
 *
 * @function inputOperator
 * @param {string} op - The operator symbol to apply
 * @returns {void}
 */
function inputOperator(op) {
  if (expression && !shouldResetInput) {
    calculate();
  }
  expression = `${currentInput} ${op}`;
  shouldResetInput = true;
  updateDisplay();
}

/**
 * Evaluates a single operation (pure function for testing).
 *
 * @function evaluateOperation
 * @param {number} firstNum - First operand
 * @param {string} operator - Operator (+, -, ×, ÷)
 * @param {number} secondNum - Second operand
 * @returns {number|string} The result or 'Error' for division by zero
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

/**
 * Calculates the result of the current expression.
 * Handles basic arithmetic operations and division by zero.
 * Truncates results that don't fit in the display.
 *
 * @function calculate
 * @returns {void}
 */
function calculate() {
  if (!expression) return;

  const parts = expression.split(" ");
  const firstNum = parseFloat(parts[0]);
  const operator = parts[1];
  const secondNum = parseFloat(currentInput);

  const result = evaluateOperation(firstNum, operator, secondNum);

  // Format result to avoid floating point issues
  if (typeof result === "number") {
    const roundedResult = Math.round(result * 1000000000) / 1000000000;
    const resultString = roundedResult.toString();

    // If result doesn't fit, truncate it
    if (!canFitInDisplay(resultString)) {
      // Find the maximum length that fits
      let truncated = resultString;
      while (truncated.length > 0 && !canFitInDisplay(truncated)) {
        truncated = truncated.slice(0, -1);
      }
      currentInput = truncated || "0";
    } else {
      currentInput = resultString;
    }
  } else {
    currentInput = result;
  }

  expression = "";
  shouldResetInput = true;
  updateDisplay();
}

/**
 * Clears the calculator, resetting input, expression, and state flags.
 *
 * @function clear
 * @returns {void}
 */
function clear() {
  currentInput = "0";
  expression = "";
  shouldResetInput = false;
  updateDisplay();
}

/**
 * Toggles the sign of the current input (positive/negative).
 * Validates that the result would fit in the display before applying.
 *
 * @function toggleSign
 * @returns {void}
 */
function toggleSign() {
  if (currentInput !== "0") {
    const newInput = currentInput.startsWith("-")
      ? currentInput.slice(1)
      : "-" + currentInput;

    // Check if the new input would fit in the display
    if (!canFitInDisplay(newInput)) {
      return; // Don't toggle if it won't fit
    }

    currentInput = newInput;
    updateDisplay();
  }
}

/**
 * Calculates the percentage of the current input (divides by 100).
 *
 * @function percentage
 * @returns {void}
 */
function percentage() {
  const num = parseFloat(currentInput);
  currentInput = (num / 100).toString();
  updateDisplay();
}

/**
 * Routes button click values to the appropriate handler function.
 * Supports numbers, operators, and special functions (clear, sign toggle, percentage, equals).
 *
 * @function handleButtonClick
 * @param {string} value - The button value clicked
 * @returns {void}
 */
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
      calculate();
      break;
    default:
      inputNumber(value);
  }
}

/**
 * Maps keyboard keys to their corresponding calculator values.
 * Supports numeric keys, operators, and special function keys.
 *
 * @function mapKeyToValue
 * @param {string} key - The keyboard key that was pressed
 * @returns {string|null} The mapped calculator value, or null if key is not mapped
 */
function mapKeyToValue(key) {
  const keyMap = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    ".": ".",
    ",": ".",
    "+": "+",
    "-": "-",
    "*": "×",
    x: "×",
    X: "×",
    "/": "÷",
    Enter: "=",
    "=": "=",
    Escape: "C",
    c: "C",
    C: "C",
    Delete: "C",
    "%": "%",
    Backspace: "Backspace",
  };
  return keyMap[key] || null;
}

// Export mapKeyToValue for testing
export { mapKeyToValue };

/**
 * Removes the last character from the current input.
 * Resets to "0" if only one character remains.
 *
 * @function backspace
 * @returns {void}
 */
function backspace() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
  updateDisplay();
}

/**
 * Handles keyboard input events for calculator operations.
 * Prevents default behavior for mapped keys and routes to appropriate handlers.
 * Only processes events when calculator is active and input is not focused.
 *
 * @function handleKeyboard
 * @param {KeyboardEvent} event - The keyboard event object
 * @returns {void}
 */
function handleKeyboard(event) {
  // Don't interfere if user is typing in an input field
  const target = event.target;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
    return;
  }

  const value = mapKeyToValue(event.key);

  if (value === null) return;

  // Prevent default for mapped keys
  event.preventDefault();

  if (value === "Backspace") {
    backspace();
  } else {
    handleButtonClick(value);
  }
}

/**
 * Initializes the calculator component.
 * Sets up DOM element references, attaches event listeners for buttons and keyboard,
 * and initializes the display.
 *
 * @function initCalculator
 * @returns {void}
 *
 * @example
 * // Initialize calculator on page load
 * initCalculator();
 */
export function initCalculator() {
  const calculator = document.querySelector(".calculator");
  if (!calculator) return;

  displayResult = calculator.querySelector(".calculator__result");
  displayExpression = calculator.querySelector(".calculator__expression");
  const buttons = calculator.querySelectorAll(".calculator__button");

  // Add click event to all buttons
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent.trim();
      handleButtonClick(value);
    });
  });

  // Add keyboard event listener
  document.addEventListener("keydown", handleKeyboard);

  // Initialize display
  updateDisplay();
}
