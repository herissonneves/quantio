/**
 * Calculator Component
 * Handles calculator button clicks and display updates
 */

// State
let currentInput = "0";
let expression = "";
let shouldResetInput = false;

// DOM Elements
let displayResult;
let displayExpression;

// Font size constants
const MAX_FONT_SIZE = 2.8; // rem
const MIN_FONT_SIZE = 1.2; // rem
const CHARS_AT_MAX_SIZE = 8;

/**
 * Adjust result font size based on content length
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
 * Update the calculator display
 */
function updateDisplay() {
  displayResult.textContent = currentInput;
  displayExpression.textContent = expression;
  adjustResultFontSize();
}

/**
 * Handle number input
 * @param {string} num - The number pressed
 */
function inputNumber(num) {
  if (shouldResetInput) {
    currentInput = num;
    shouldResetInput = false;
  } else if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else if (num === "." && currentInput.includes(".")) {
    return; // Prevent multiple decimals
  } else {
    currentInput += num;
  }
  updateDisplay();
}

/**
 * Handle operator input
 * @param {string} op - The operator pressed
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
 * Calculate the result
 */
function calculate() {
  if (!expression) return;

  const parts = expression.split(" ");
  const firstNum = parseFloat(parts[0]);
  const operator = parts[1];
  const secondNum = parseFloat(currentInput);

  let result;
  switch (operator) {
    case "+":
      result = firstNum + secondNum;
      break;
    case "-":
      result = firstNum - secondNum;
      break;
    case "×":
      result = firstNum * secondNum;
      break;
    case "÷":
      result = secondNum !== 0 ? firstNum / secondNum : "Error";
      break;
    default:
      return;
  }

  // Format result to avoid floating point issues
  if (typeof result === "number") {
    result = Math.round(result * 1000000000) / 1000000000;
    currentInput = result.toString();
  } else {
    currentInput = result;
  }

  expression = "";
  shouldResetInput = true;
  updateDisplay();
}

/**
 * Clear the calculator
 */
function clear() {
  currentInput = "0";
  expression = "";
  shouldResetInput = false;
  updateDisplay();
}

/**
 * Toggle the sign of current input
 */
function toggleSign() {
  if (currentInput !== "0") {
    currentInput = currentInput.startsWith("-")
      ? currentInput.slice(1)
      : "-" + currentInput;
    updateDisplay();
  }
}

/**
 * Calculate percentage
 */
function percentage() {
  const num = parseFloat(currentInput);
  currentInput = (num / 100).toString();
  updateDisplay();
}

/**
 * Handle button click
 * @param {string} value - The button value
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
 * Map keyboard keys to calculator values
 * @param {string} key - The keyboard key pressed
 * @returns {string|null} The mapped calculator value or null
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

/**
 * Handle backspace - remove last character
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
 * Handle keyboard input
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboard(event) {
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
 * Initialize the calculator
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
