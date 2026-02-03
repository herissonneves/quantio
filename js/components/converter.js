/**
 * @fileoverview Converter Component
 * @description Handles unit conversion functionality with dynamic unit selection
 * based on conversion category. Supports length, mass, temperature, volume, and time.
 *
 * @module components/converter
 * @version 1.0.0
 */

/**
 * Unit definitions for each conversion category.
 * Each unit has a name, abbreviation, and conversion factor to base unit (meter, gram, etc.).
 * @type {Object<string, Array<Object>>}
 */
export const UNIT_DEFINITIONS = {
    length: [
        { name: 'Millimeter', abbr: 'mm', factor: 0.001 },
        { name: 'Centimeter', abbr: 'cm', factor: 0.01 },
        { name: 'Decimeter', abbr: 'dm', factor: 0.1 },
        { name: 'Meter', abbr: 'm', factor: 1 },
        { name: 'Decameter', abbr: 'dam', factor: 10 },
        { name: 'Hectometer', abbr: 'hm', factor: 100 },
        { name: 'Kilometer', abbr: 'km', factor: 1000 },
        { name: 'Inch', abbr: 'in', factor: 0.0254 },
        { name: 'Foot', abbr: 'ft', factor: 0.3048 },
        { name: 'Yard', abbr: 'yd', factor: 0.9144 },
        { name: 'Mile', abbr: 'mi', factor: 1609.344 },
        { name: 'Nautical Mile', abbr: 'nmi', factor: 1852 },
    ],
    mass: [
        { name: 'Milligram', abbr: 'mg', factor: 0.001 },
        { name: 'Centigram', abbr: 'cg', factor: 0.01 },
        { name: 'Decigram', abbr: 'dg', factor: 0.1 },
        { name: 'Gram', abbr: 'g', factor: 1 },
        { name: 'Decagram', abbr: 'dag', factor: 10 },
        { name: 'Hectogram', abbr: 'hg', factor: 100 },
        { name: 'Kilogram', abbr: 'kg', factor: 1000 },
        { name: 'Metric Ton', abbr: 't', factor: 1000000 },
        { name: 'Ounce', abbr: 'oz', factor: 28.3495 },
        { name: 'Pound', abbr: 'lb', factor: 453.592 },
        { name: 'Stone', abbr: 'st', factor: 6350.29 },
    ],
    temperature: [
        { name: 'Celsius', abbr: '°C' },
        { name: 'Fahrenheit', abbr: '°F' },
        { name: 'Kelvin', abbr: 'K' },
    ],
    volume: [
        { name: 'Milliliter', abbr: 'ml', factor: 0.001 },
        { name: 'Centiliter', abbr: 'cl', factor: 0.01 },
        { name: 'Deciliter', abbr: 'dl', factor: 0.1 },
        { name: 'Liter', abbr: 'L', factor: 1 },
        { name: 'Decaliter', abbr: 'dal', factor: 10 },
        { name: 'Hectoliter', abbr: 'hl', factor: 100 },
        { name: 'Cubic Meter', abbr: 'm³', factor: 1000 },
        { name: 'Fluid Ounce', abbr: 'fl oz', factor: 0.0295735 },
        { name: 'Cup', abbr: 'cup', factor: 0.236588 },
        { name: 'Pint', abbr: 'pt', factor: 0.473176 },
        { name: 'Quart', abbr: 'qt', factor: 0.946353 },
        { name: 'Gallon', abbr: 'gal', factor: 3.78541 },
    ],
    time: [
        { name: 'Nanosecond', abbr: 'ns', factor: 0.000000001 },
        { name: 'Microsecond', abbr: 'µs', factor: 0.000001 },
        { name: 'Millisecond', abbr: 'ms', factor: 0.001 },
        { name: 'Second', abbr: 's', factor: 1 },
        { name: 'Minute', abbr: 'min', factor: 60 },
        { name: 'Hour', abbr: 'h', factor: 3600 },
        { name: 'Day', abbr: 'd', factor: 86400 },
        { name: 'Week', abbr: 'wk', factor: 604800 },
        { name: 'Month', abbr: 'mo', factor: 2629746 },
        { name: 'Year', abbr: 'yr', factor: 31556952 },
    ],
};

// DOM Elements
let categorySelect;
let inputValue;
let inputUnit;
let outputValue;
let outputUnit;

/**
 * Current conversion category.
 * @type {string}
 */
let currentCategory = 'length';

/**
 * Populates unit selectors with options based on the current category.
 *
 * @function populateUnitSelectors
 * @returns {void}
 */
function populateUnitSelectors() {
    const units = UNIT_DEFINITIONS[currentCategory];

    // Clear existing options
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';

    // Populate both selectors
    units.forEach((unit, index) => {
        const option1 = document.createElement('option');
        option1.value = index.toString();
        option1.textContent = `${unit.abbr} (${unit.name})`;
        inputUnit.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = index.toString();
        option2.textContent = `${unit.abbr} (${unit.name})`;
        outputUnit.appendChild(option2);
    });

    // Set default selections (first and second unit)
    if (units.length >= 2) {
        inputUnit.value = '0';
        outputUnit.value = '1';
    } else if (units.length === 1) {
        inputUnit.value = '0';
        outputUnit.value = '0';
    }
}

/**
 * Converts a value from one unit to another (pure function for testing).
 * Handles special case for temperature conversions.
 *
 * @function convertValue
 * @param {number} value - The value to convert
 * @param {number} fromIndex - Index of source unit in UNIT_DEFINITIONS[category]
 * @param {number} toIndex - Index of target unit in UNIT_DEFINITIONS[category]
 * @param {string} category - Conversion category (length, mass, temperature, volume, time)
 * @returns {number} The converted value
 */
export function convertValue(value, fromIndex, toIndex, category) {
    if (isNaN(value) || value === '') {
        return 0;
    }

    const units = UNIT_DEFINITIONS[category];
    if (!units || !units[fromIndex] || !units[toIndex]) {
        return 0;
    }

    const fromUnit = units[fromIndex];
    const toUnit = units[toIndex];

    // Special handling for temperature
    if (category === 'temperature') {
        // Convert to base unit (Celsius)
        let celsius;
        if (fromUnit.abbr === '°C') {
            celsius = value;
        } else if (fromUnit.abbr === '°F') {
            celsius = (value - 32) * 5/9;
        } else if (fromUnit.abbr === 'K') {
            celsius = value - 273.15;
        }

        // Convert from Celsius to target unit
        if (toUnit.abbr === '°C') {
            return celsius;
        } else if (toUnit.abbr === '°F') {
            return (celsius * 9/5) + 32;
        } else if (toUnit.abbr === 'K') {
            return celsius + 273.15;
        }
    }

    // Standard conversion: convert to base unit, then to target unit
    const baseValue = value * fromUnit.factor;
    return baseValue / toUnit.factor;
}

/**
 * Converts a value from one unit to another (uses current category).
 *
 * @function convert
 * @param {number} value - The value to convert
 * @param {number} fromIndex - Index of source unit in UNIT_DEFINITIONS
 * @param {number} toIndex - Index of target unit in UNIT_DEFINITIONS
 * @returns {number} The converted value
 */
function convert(value, fromIndex, toIndex) {
    return convertValue(value, fromIndex, toIndex, currentCategory);
}

/**
 * Gets the byte size of a string.
 *
 * @function getByteSize
 * @param {string} str - The string to measure
 * @returns {number} The size in bytes
 */
export function getByteSize(str) {
    return new Blob([str]).size;
}

/**
 * Converts input string to number and validates byte size.
 * Truncates the number if its string representation exceeds 8 bytes.
 *
 * @function validateAndLimitInput
 * @returns {string} The validated input value
 */
function validateAndLimitInput() {
    const inputString = inputValue.value.trim();

    // If empty, return empty
    if (!inputString || inputString === '' || inputString === '-' || inputString === '.') {
        return inputString; // Allow partial input during typing
    }

    // Convert to number
    const numValue = parseFloat(inputString);

    // If not a valid number yet (user might be typing), allow the string as-is if it's under 8 bytes
    if (isNaN(numValue)) {
        const byteSize = getByteSize(inputString);
        if (byteSize <= 8) {
            return inputString; // Allow partial input
        }
        // If invalid and too large, return previous valid value
        return '';
    }

    // Convert number back to string to check byte size
    let numString = numValue.toString();
    let byteSize = getByteSize(numString);

    // If exceeds 8 bytes, truncate decimal places
    if (byteSize > 8) {
        // Try reducing decimal precision
        let precision = 10;
        while (byteSize > 8 && precision >= 0) {
            numString = numValue.toFixed(precision);
            // Remove trailing zeros
            numString = parseFloat(numString).toString();
            byteSize = getByteSize(numString);
            precision--;
        }

        // If still too large, use scientific notation
        if (byteSize > 8) {
            numString = numValue.toExponential(2);
            byteSize = getByteSize(numString);

            // If still too large, truncate
            if (byteSize > 8) {
                const maxLength = 7; // Leave 1 byte for safety
                numString = numString.substring(0, maxLength);
            }
        }
    }

    return numString;
}

/**
 * Limits output value to maximum 8 bytes.
 *
 * @function limitOutputSize
 * @param {number} value - The numeric value to format
 * @returns {string} The formatted value limited to 8 bytes
 */
export function limitOutputSize(value) {
    if (isNaN(value) || value === null || value === undefined) {
        return '';
    }

    // Convert to string
    let valueString = value.toString();
    let byteSize = getByteSize(valueString);

    // If exceeds 8 bytes, format it
    if (byteSize > 8) {
        // Try reducing decimal precision
        let precision = 10;
        while (byteSize > 8 && precision >= 0) {
            valueString = value.toFixed(precision);
            // Remove trailing zeros
            valueString = parseFloat(valueString).toString();
            byteSize = getByteSize(valueString);
            precision--;
        }

        // If still too large, use scientific notation
        if (byteSize > 8) {
            valueString = value.toExponential(2);
            byteSize = getByteSize(valueString);

            // If still too large, truncate
            if (byteSize > 8) {
                const maxLength = 7; // Leave 1 byte for safety
                valueString = valueString.substring(0, maxLength);
            }
        }
    }

    return valueString;
}

/**
 * Updates the output value based on input value and selected units.
 *
 * @function updateConversion
 * @returns {void}
 */
function updateConversion() {
    // Validate and limit input size
    const validatedInput = validateAndLimitInput();
    if (inputValue.value !== validatedInput) {
        inputValue.value = validatedInput;
    }

    // If input is empty, clear output
    if (!validatedInput || validatedInput === '') {
        outputValue.value = '';
        return;
    }

    const value = parseFloat(validatedInput);
    const fromIndex = parseInt(inputUnit.value);
    const toIndex = parseInt(outputUnit.value);

    const result = convert(value, fromIndex, toIndex);

    // Format result to avoid floating point issues
    const roundedResult = Math.round(result * 1000000000) / 1000000000;

    // Limit output to 8 bytes
    const limitedOutput = limitOutputSize(roundedResult);
    outputValue.value = limitedOutput;
}

/**
 * Handles category change event.
 * Updates unit selectors and resets values.
 *
 * @function handleCategoryChange
 * @returns {void}
 */
function handleCategoryChange() {
    currentCategory = categorySelect.value;
    populateUnitSelectors();
    inputValue.value = '';
    outputValue.value = '';
}

/**
 * Initializes the converter component.
 * Sets up event listeners and populates initial unit selectors.
 *
 * @function initConverter
 * @returns {void}
 *
 * @example
 * // Initialize converter on page load
 * initConverter();
 */
export function initConverter() {
    categorySelect = document.getElementById('category-select');
    inputValue = document.getElementById('input-value');
    inputUnit = document.getElementById('input-unit');
    outputValue = document.getElementById('output-value');
    outputUnit = document.getElementById('output-unit');

    if (!categorySelect || !inputValue || !inputUnit || !outputValue || !outputUnit) {
        return;
    }

    // Populate initial unit selectors
    populateUnitSelectors();

    // Ensure input field is enabled and functional
    inputValue.removeAttribute('readonly');
    inputValue.removeAttribute('disabled');
    inputValue.setAttribute('tabindex', '0');

    // Ensure output is readonly and non-editable
    outputValue.setAttribute('readonly', 'readonly');
    outputValue.setAttribute('tabindex', '-1');

    // Prevent manual editing of output field
    outputValue.addEventListener('keydown', (e) => {
        e.preventDefault();
        return false;
    });

    outputValue.addEventListener('focus', () => {
        outputValue.blur();
    });

    outputValue.addEventListener('mousedown', (e) => {
        e.preventDefault();
        return false;
    });

    // Event listeners
    categorySelect.addEventListener('change', handleCategoryChange);

    // Input field - allow all keyboard input with size validation
    inputValue.addEventListener('input', (e) => {
        // Validate and update in real-time
        const validated = validateAndLimitInput();
        if (inputValue.value !== validated) {
            inputValue.value = validated;
        }
        updateConversion();
    });
    inputValue.addEventListener('keydown', (e) => {
        // Allow navigation and editing keys
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'];
        if (allowedKeys.includes(e.key)) {
            return;
        }

        // For other keys, check if the resulting value would exceed 8 bytes
        const currentValue = inputValue.value;
        const selectionStart = inputValue.selectionStart || 0;
        const selectionEnd = inputValue.selectionEnd || 0;
        const beforeSelection = currentValue.substring(0, selectionStart);
        const afterSelection = currentValue.substring(selectionEnd);
        const testValue = beforeSelection + e.key + afterSelection;

        // First check raw string size (for partial input like "12." or "-")
        const rawByteSize = getByteSize(testValue);
        if (rawByteSize > 8) {
            e.preventDefault();
            return false;
        }

        // Then check if it's a valid number, check the number's string representation
        const testNum = parseFloat(testValue);
        if (!isNaN(testNum)) {
            const testNumString = testNum.toString();
            const numByteSize = getByteSize(testNumString);

            if (numByteSize > 8) {
                e.preventDefault();
                return false;
            }
        }
    });
    inputValue.addEventListener('keyup', updateConversion);
    inputValue.addEventListener('change', updateConversion);

    // Unit selectors
    inputUnit.addEventListener('change', updateConversion);
    outputUnit.addEventListener('change', updateConversion);
}

