/**
 * Unit tests for calculator component logic
 */

import { describe, it, expect } from "./test-runner.js";
import {
  evaluateOperation,
  mapKeyToValue,
} from "../js/components/calculator.js";

describe("evaluateOperation", () => {
  it("adds two numbers", () => {
    expect(evaluateOperation(2, "+", 3)).toBe(5);
    expect(evaluateOperation(-1, "+", 1)).toBe(0);
    expect(evaluateOperation(0.1, "+", 0.2)).toBeCloseTo(0.3, 10);
  });

  it("subtracts two numbers", () => {
    expect(evaluateOperation(5, "-", 3)).toBe(2);
    expect(evaluateOperation(0, "-", 5)).toBe(-5);
    expect(evaluateOperation(10, "-", 10)).toBe(0);
  });

  it("multiplies two numbers", () => {
    expect(evaluateOperation(4, "×", 5)).toBe(20);
    expect(evaluateOperation(-2, "×", 3)).toBe(-6);
    expect(evaluateOperation(0, "×", 100)).toBe(0);
  });

  it("divides two numbers", () => {
    expect(evaluateOperation(10, "÷", 2)).toBe(5);
    expect(evaluateOperation(7, "÷", 2)).toBe(3.5);
    expect(evaluateOperation(1, "÷", 3)).toBeCloseTo(0.333333333, 6);
  });

  it('returns "Error" for division by zero', () => {
    expect(evaluateOperation(10, "÷", 0)).toBe("Error");
    expect(evaluateOperation(0, "÷", 0)).toBe("Error");
  });

  it("returns NaN for unknown operator", () => {
    expect(evaluateOperation(1, "%", 2)).toBeNaN();
    expect(evaluateOperation(1, "x", 2)).toBeNaN();
  });
});

describe("mapKeyToValue", () => {
  it("maps number keys to string values", () => {
    expect(mapKeyToValue("0")).toBe("0");
    expect(mapKeyToValue("5")).toBe("5");
    expect(mapKeyToValue("9")).toBe("9");
  });

  it("maps operator keys", () => {
    expect(mapKeyToValue("+")).toBe("+");
    expect(mapKeyToValue("-")).toBe("-");
    expect(mapKeyToValue("*")).toBe("×");
    expect(mapKeyToValue("/")).toBe("÷");
  });

  it("maps comma to decimal point", () => {
    expect(mapKeyToValue(",")).toBe(".");
  });

  it("maps Enter and = to equals", () => {
    expect(mapKeyToValue("Enter")).toBe("=");
    expect(mapKeyToValue("=")).toBe("=");
  });

  it("maps Escape, C, Delete to clear", () => {
    expect(mapKeyToValue("Escape")).toBe("C");
    expect(mapKeyToValue("c")).toBe("C");
    expect(mapKeyToValue("C")).toBe("C");
    expect(mapKeyToValue("Delete")).toBe("C");
  });

  it("maps Backspace", () => {
    expect(mapKeyToValue("Backspace")).toBe("Backspace");
  });

  it("maps x and X to multiplication", () => {
    expect(mapKeyToValue("x")).toBe("×");
    expect(mapKeyToValue("X")).toBe("×");
  });

  it("returns null for unmapped keys", () => {
    expect(mapKeyToValue("a")).toBeNull();
    expect(mapKeyToValue("F1")).toBeNull();
    expect(mapKeyToValue(" ")).toBeNull();
  });
});
