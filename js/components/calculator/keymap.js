/**
 * @fileoverview Key mapping for calculator inputs.
 * @module components/calculator/keymap
 */

/**
 * Converts a `KeyboardEvent.key` into the corresponding calculator value.
 *
 * @param {string} key
 * @returns {string|null} Mapped value or `null` if unsupported
 */
export function mapKeyToValue(key) {
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

