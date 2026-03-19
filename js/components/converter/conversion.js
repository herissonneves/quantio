/**
 * @fileoverview Lógica de conversão entre unidades.
 * @description Funções puras para conversão; temperatura tem tratamento especial.
 * @module components/converter/conversion
 */

import { UNIT_DEFINITIONS } from './units.js';

const MAX_BYTES = 8;
const ROUND_PRECISION = 1e9;

/**
 * Converte valor de uma unidade para outra (função pura).
 * Trata temperatura com fórmulas específicas; demais categorias usam factor.
 *
 * @param {number} value - Valor a converter
 * @param {number} fromIndex - Índice da unidade de origem em UNIT_DEFINITIONS[category]
 * @param {number} toIndex - Índice da unidade de destino
 * @param {string} category - Categoria (length, mass, temperature, volume, time)
 * @returns {number} Valor convertido
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

    if (category === 'temperature') {
        return convertTemperature(value, fromUnit.abbr, toUnit.abbr);
    }

    const baseValue = value * fromUnit.factor;
    return baseValue / toUnit.factor;
}

/**
 * Converte temperatura entre Celsius, Fahrenheit e Kelvin.
 * @param {number} value - Valor na unidade de origem
 * @param {string} fromAbbr - Abreviatura da unidade de origem
 * @param {string} toAbbr - Abreviatura da unidade de destino
 * @returns {number}
 */
function convertTemperature(value, fromAbbr, toAbbr) {
    let celsius;
    if (fromAbbr === '°C') {
        celsius = value;
    } else if (fromAbbr === '°F') {
        celsius = (value - 32) * 5 / 9;
    } else if (fromAbbr === 'K') {
        celsius = value - 273.15;
    } else {
        return 0;
    }

    if (toAbbr === '°C') return celsius;
    if (toAbbr === '°F') return (celsius * 9 / 5) + 32;
    if (toAbbr === 'K') return celsius + 273.15;
    return 0;
}

/**
 * Arredonda o resultado para evitar ruído de ponto flutuante.
 * @param {number} value
 * @returns {number}
 */
export function roundConversionResult(value) {
    return Math.round(value * ROUND_PRECISION) / ROUND_PRECISION;
}
