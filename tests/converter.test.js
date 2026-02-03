/**
 * Unit tests for converter component logic
 */

import { describe, it, expect } from "./test-runner.js";
import {
  UNIT_DEFINITIONS,
  convertValue,
  getByteSize,
  limitOutputSize,
} from "../js/components/converter.js";

describe("getByteSize", () => {
  it("returns byte size of string", () => {
    expect(getByteSize("")).toBe(0);
    expect(getByteSize("a")).toBe(1);
    expect(getByteSize("123")).toBe(3);
    expect(getByteSize("0")).toBe(1);
  });

  it("counts UTF-8 bytes for multi-byte characters", () => {
    expect(getByteSize("°")).toBeGreaterThanOrEqual(1);
    expect(getByteSize("m³")).toBeGreaterThanOrEqual(2);
  });
});

describe("convertValue - length", () => {
  const category = "length";

  it("converts within metric system", () => {
    expect(convertValue(1, 3, 0, category)).toBe(1000);
    expect(convertValue(1000, 0, 3, category)).toBe(1);
    expect(convertValue(1, 6, 3, category)).toBe(1000);
  });

  it("converts meters to feet", () => {
    const result = convertValue(1, 3, 8, category);
    expect(result).toBeCloseTo(3.28084, 4);
  });

  it("returns 0 for invalid value", () => {
    expect(convertValue(NaN, 0, 1, category)).toBe(0);
    expect(convertValue("", 0, 1, category)).toBe(0);
  });
});

describe("convertValue - mass", () => {
  const category = "mass";

  it("converts within metric system", () => {
    expect(convertValue(1, 6, 3, category)).toBe(1000);
    expect(convertValue(500, 3, 6, category)).toBe(0.5);
  });

  it("converts grams to ounces", () => {
    const result = convertValue(28.3495, 3, 8, category);
    expect(result).toBeCloseTo(1, 2);
  });
});

describe("convertValue - temperature", () => {
  const category = "temperature";

  it("converts Celsius to Fahrenheit", () => {
    expect(convertValue(0, 0, 1, category)).toBe(32);
    expect(convertValue(100, 0, 1, category)).toBe(212);
    expect(convertValue(-40, 0, 1, category)).toBe(-40);
  });

  it("converts Celsius to Kelvin", () => {
    expect(convertValue(0, 0, 2, category)).toBe(273.15);
    expect(convertValue(100, 0, 2, category)).toBe(373.15);
  });

  it("converts Fahrenheit to Celsius", () => {
    expect(convertValue(32, 1, 0, category)).toBeCloseTo(0, 2);
    expect(convertValue(212, 1, 0, category)).toBeCloseTo(100, 2);
  });

  it("converts Kelvin to Celsius", () => {
    expect(convertValue(273.15, 2, 0, category)).toBeCloseTo(0, 2);
  });
});

describe("convertValue - volume", () => {
  const category = "volume";

  it("converts within metric system", () => {
    expect(convertValue(1, 3, 0, category)).toBe(1000);
    expect(convertValue(500, 0, 3, category)).toBe(0.5);
  });
});

describe("convertValue - time", () => {
  const category = "time";

  it("converts seconds to minutes", () => {
    expect(convertValue(60, 3, 4, category)).toBe(1);
    expect(convertValue(1, 4, 3, category)).toBe(60);
  });

  it("converts hours to seconds", () => {
    expect(convertValue(1, 5, 3, category)).toBe(3600);
  });
});

describe("limitOutputSize", () => {
  it("returns empty string for invalid input", () => {
    expect(limitOutputSize(NaN)).toBe("");
    expect(limitOutputSize(null)).toBe("");
    expect(limitOutputSize(undefined)).toBe("");
  });

  it("returns string representation for small numbers", () => {
    expect(limitOutputSize(0)).toBe("0");
    expect(limitOutputSize(42)).toBe("42");
    expect(limitOutputSize(3.14)).toBe("3.14");
  });

  it("limits output to 8 bytes for large numbers", () => {
    const bigNumber = 123456789012345;
    const result = limitOutputSize(bigNumber);
    expect(getByteSize(result)).toBeLessThanOrEqual(8);
  });
});

describe("UNIT_DEFINITIONS", () => {
  it("has all five categories", () => {
    expect(UNIT_DEFINITIONS).toHaveProperty("length");
    expect(UNIT_DEFINITIONS).toHaveProperty("mass");
    expect(UNIT_DEFINITIONS).toHaveProperty("temperature");
    expect(UNIT_DEFINITIONS).toHaveProperty("volume");
    expect(UNIT_DEFINITIONS).toHaveProperty("time");
  });

  it("each unit has name and abbr", () => {
    for (const category of Object.keys(UNIT_DEFINITIONS)) {
      const units = UNIT_DEFINITIONS[category];
      expect(Array.isArray(units)).toBe(true);
      for (const unit of units) {
        expect(unit).toHaveProperty("name");
        expect(unit).toHaveProperty("abbr");
        if (category !== "temperature") {
          expect(unit).toHaveProperty("factor");
        }
      }
    }
  });
});
