/**
 * @fileoverview Validação e limite de tamanho em bytes para entradas/saídas do conversor.
 * @module components/converter/validation
 */

const MAX_BYTES = 8;

/**
 * Retorna o tamanho em bytes de uma string (UTF-8).
 * @param {string} str - String a medir
 * @returns {number} Tamanho em bytes
 */
export function getByteSize(str) {
    return new Blob([str]).size;
}

/**
 * Formata um valor numérico para string com no máximo MAX_BYTES bytes.
 * Reduz casas decimais ou usa notação científica se necessário.
 *
 * @param {number} value - Valor numérico
 * @returns {string} String formatada limitada a MAX_BYTES bytes
 */
export function limitOutputSize(value) {
    if (isNaN(value) || value === null || value === undefined) {
        return '';
    }

    let valueString = value.toString();
    let byteSize = getByteSize(valueString);

    if (byteSize <= MAX_BYTES) {
        return valueString;
    }

    valueString = truncateToMaxBytes(value, valueString, byteSize);
    return valueString;
}

/**
 * Valida e limita uma string de entrada (valor digitado).
 * Permite entrada parcial (ex.: "12.") e trunca se exceder MAX_BYTES.
 *
 * @param {string} inputString - Texto atual do campo de entrada
 * @returns {string} Valor validado (pode ser o mesmo ou truncado/vazio)
 */
export function validateAndLimitInputString(inputString) {
    const trimmed = inputString.trim();

    if (!trimmed || trimmed === '' || trimmed === '-' || trimmed === '.') {
        return trimmed;
    }

    const numValue = parseFloat(trimmed);

    if (isNaN(numValue)) {
        return getByteSize(trimmed) <= MAX_BYTES ? trimmed : '';
    }

    let numString = numValue.toString();
    let byteSize = getByteSize(numString);

    if (byteSize > MAX_BYTES) {
        numString = truncateToMaxBytes(numValue, numString, byteSize);
    }

    return numString;
}

/**
 * Reduz a representação numérica até caber em MAX_BYTES.
 * @param {number} numValue - Valor numérico
 * @param {string} numString - Representação atual
 * @param {number} byteSize - Tamanho atual em bytes
 * @returns {string}
 */
function truncateToMaxBytes(numValue, numString, byteSize) {
    let precision = 10;
    while (byteSize > MAX_BYTES && precision >= 0) {
        numString = numValue.toFixed(precision);
        numString = parseFloat(numString).toString();
        byteSize = getByteSize(numString);
        precision--;
    }

    if (byteSize > MAX_BYTES) {
        numString = numValue.toExponential(2);
        byteSize = getByteSize(numString);
        if (byteSize > MAX_BYTES) {
            numString = numString.substring(0, 7);
        }
    }

    return numString;
}

/**
 * Verifica se a string resultante de uma tecla digitada caberia em MAX_BYTES.
 * @param {string} testValue - String que seria o novo valor do input
 * @returns {{ allowed: boolean, numByteSizeExceeded?: boolean }}
 */
export function wouldExceedByteLimit(testValue) {
    const rawByteSize = getByteSize(testValue);
    if (rawByteSize > MAX_BYTES) {
        return { allowed: false };
    }

    const testNum = parseFloat(testValue);
    if (!isNaN(testNum)) {
        const numByteSize = getByteSize(testNum.toString());
        if (numByteSize > MAX_BYTES) {
            return { allowed: false, numByteSizeExceeded: true };
        }
    }

    return { allowed: true };
}
