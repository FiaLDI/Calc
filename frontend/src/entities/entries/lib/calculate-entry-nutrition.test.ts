import { describe, expect, it } from "vitest";

import {
  calculateEntryNutrition,
  normalizeServings,
} from "./calculate-entry-nutrition";

const product = {
  amountUnit: "г" as const,
  amountValue: 100,
  calories: 100,
  carbs: 10,
  fat: 5,
  id: "p1",
  imageAlt: "Oatmeal",
  imageUrl: "/products/oatmeal.png",
  name: "Oatmeal",
  protein: 12.5,
};

describe("normalizeServings", () => {
  it("falls back to 1 for falsy servings, then clamps below 0.1", () => {
    // `servings || 1` turns 0/NaN into 1 before Math.max(0.1, ...)
    expect(normalizeServings(0)).toBe(1);
    expect(normalizeServings(Number.NaN)).toBe(1);
    expect(normalizeServings(0.05)).toBe(0.1);
  });

  it("rounds to one decimal", () => {
    expect(normalizeServings(1.25)).toBe(1.3);
    expect(normalizeServings(2)).toBe(2);
  });
});

describe("calculateEntryNutrition", () => {
  it("scales macros by servings", () => {
    expect(calculateEntryNutrition(product, 1.5)).toEqual({
      calories: 150,
      protein: 18.8,
      carbs: 15,
      fat: 7.5,
    });
  });

  it("rounds calories to integer and macros to one decimal", () => {
    expect(
      calculateEntryNutrition(
        { ...product, calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
        0.5
      )
    ).toEqual({
      calories: 45,
      protein: 0.6,
      carbs: 11.4,
      fat: 0.2,
    });
  });
});
