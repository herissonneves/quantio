/**
 * @fileoverview Componente Converter
 * @description Orquestra a conversão de unidades: DOM, seleção de categorias e eventos.
 * Suporta length, mass, temperature, volume e time.
 *
 * @module components/converter
 * @version 1.0.0
 */

import { UNIT_DEFINITIONS } from './converter/units.js';
import { convertValue as convertValueFn, roundConversionResult } from './converter/conversion.js';
import {
    getByteSize,
    limitOutputSize,
    validateAndLimitInputString,
    wouldExceedByteLimit,
} from './converter/validation.js';
import { addConverterHistoryEntry } from './app-history.js';

// Re-exporta para compatibilidade e testes
export { UNIT_DEFINITIONS, getByteSize, limitOutputSize };
export { convertValue } from './converter/conversion.js';

// Refs de DOM
let categorySelect;
let inputValue;
let inputUnit;
let outputValue;
let outputUnit;

/** @type {string} */
let currentCategory = 'length';

/** @type {ReturnType<typeof setTimeout> | null} */
let historyDebounceTimer = null;

const CONVERTER_HISTORY_DEBOUNCE_MS = 700;

const CATEGORY_LABELS = {
    length: 'Length',
    mass: 'Mass / Weight',
    temperature: 'Temperature',
    volume: 'Volume',
    time: 'Time',
};

/**
 * Preenche os selects de unidade conforme a categoria atual.
 */
function populateUnitSelectors() {
    const units = UNIT_DEFINITIONS[currentCategory];
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';

    units.forEach((unit, index) => {
        const label = `${unit.abbr} (${unit.name})`;
        const option1 = document.createElement('option');
        option1.value = String(index);
        option1.textContent = label;
        inputUnit.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = String(index);
        option2.textContent = label;
        outputUnit.appendChild(option2);
    });

    if (units.length >= 2) {
        inputUnit.value = '0';
        outputUnit.value = '1';
    } else if (units.length === 1) {
        inputUnit.value = '0';
        outputUnit.value = '0';
    }
}

/**
 * Atualiza o campo de saída com base no valor e nas unidades selecionadas.
 */
function updateConversion() {
    const validatedInput = validateAndLimitInputString(inputValue.value);
    if (inputValue.value !== validatedInput) {
        inputValue.value = validatedInput;
    }

    if (!validatedInput || validatedInput === '') {
        outputValue.value = '';
        return;
    }

    const value = parseFloat(validatedInput);
    const fromIndex = parseInt(inputUnit.value, 10);
    const toIndex = parseInt(outputUnit.value, 10);

    const result = convertValueFn(value, fromIndex, toIndex, currentCategory);
    const roundedResult = roundConversionResult(result);
    outputValue.value = limitOutputSize(roundedResult);
    scheduleConverterHistoryEntry();
}

/**
 * Records a conversion line after input/units stabilize (debounced).
 */
function scheduleConverterHistoryEntry() {
    clearTimeout(historyDebounceTimer);
    historyDebounceTimer = setTimeout(() => {
        historyDebounceTimer = null;
        const validatedInput = validateAndLimitInputString(inputValue.value);
        if (!validatedInput || validatedInput === '') return;

        const out = outputValue.value;
        if (!out || out === '') return;

        const units = UNIT_DEFINITIONS[currentCategory];
        if (!units) return;

        const fromIndex = parseInt(inputUnit.value, 10);
        const toIndex = parseInt(outputUnit.value, 10);
        const fromUnit = units[fromIndex];
        const toUnit = units[toIndex];
        if (!fromUnit || !toUnit) return;

        const catLabel = CATEGORY_LABELS[currentCategory] || currentCategory;
        const line = `[${catLabel}] ${validatedInput} ${fromUnit.abbr} → ${out} ${toUnit.abbr}`;
        addConverterHistoryEntry(line);
    }, CONVERTER_HISTORY_DEBOUNCE_MS);
}

/**
 * Handler de mudança de categoria: atualiza unidades e limpa campos.
 */
function handleCategoryChange() {
    clearTimeout(historyDebounceTimer);
    historyDebounceTimer = null;
    currentCategory = categorySelect.value;
    populateUnitSelectors();
    inputValue.value = '';
    outputValue.value = '';
}

/**
 * Configura o campo de saída como somente leitura e bloqueia foco/edição.
 */
function setupOutputFieldReadOnly() {
    outputValue.setAttribute('readonly', 'readonly');
    outputValue.setAttribute('tabindex', '-1');

    outputValue.addEventListener('keydown', (e) => {
        e.preventDefault();
        return false;
    });
    outputValue.addEventListener('focus', () => outputValue.blur());
    outputValue.addEventListener('mousedown', (e) => {
        e.preventDefault();
        return false;
    });
}

/**
 * Configura listeners do campo de entrada (input, keydown, keyup, change).
 */
function setupInputFieldListeners() {
    inputValue.addEventListener('input', () => {
        const validated = validateAndLimitInputString(inputValue.value);
        if (inputValue.value !== validated) {
            inputValue.value = validated;
        }
        updateConversion();
    });

    inputValue.addEventListener('keydown', (e) => {
        const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
            'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End',
        ];
        if (allowedKeys.includes(e.key)) return;

        const currentValue = inputValue.value;
        const start = inputValue.selectionStart ?? 0;
        const end = inputValue.selectionEnd ?? 0;
        const testValue = currentValue.substring(0, start) + e.key + currentValue.substring(end);
        const { allowed } = wouldExceedByteLimit(testValue);
        if (!allowed) {
            e.preventDefault();
            return false;
        }
    });

    inputValue.addEventListener('keyup', updateConversion);
    inputValue.addEventListener('change', updateConversion);
}

/**
 * Inicializa o componente de conversão: resolve elementos, preenche unidades e registra eventos.
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

    populateUnitSelectors();

    inputValue.removeAttribute('readonly');
    inputValue.removeAttribute('disabled');
    inputValue.setAttribute('tabindex', '0');

    setupOutputFieldReadOnly();
    setupInputFieldListeners();

    categorySelect.addEventListener('change', handleCategoryChange);
    inputUnit.addEventListener('change', updateConversion);
    outputUnit.addEventListener('change', updateConversion);
}
