/**
 * @fileoverview Definições de unidades por categoria de conversão.
 * @description Cada unidade possui name, abbr e, quando aplicável, factor para a unidade base.
 * @module components/converter/units
 */

/** @type {Object<string, Array<{name: string, abbr: string, factor?: number}>>} */
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

/** @type {ReadonlyArray<string>} */
export const CONVERSION_CATEGORIES = Object.keys(UNIT_DEFINITIONS);
