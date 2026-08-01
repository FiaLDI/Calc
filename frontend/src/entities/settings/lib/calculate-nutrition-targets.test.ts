import { describe, expect, it } from "vitest";

import { calculateNutritionTargets } from "./calculate-nutrition-targets";

describe("calculateNutritionTargets", () => {
  it("computes Поддержание targets for 70kg", () => {
    expect(calculateNutritionTargets(70, "Поддержание")).toEqual({
      calories: 2240,
      protein: 119,
      fat: 63,
      carbs: 299,
    });
  });

  it("computes Сушка and Набор with different multipliers", () => {
    expect(calculateNutritionTargets(70, "Сушка")).toEqual({
      calories: 1960,
      protein: 147,
      fat: 56,
      carbs: 217,
    });
    expect(calculateNutritionTargets(70, "Набор")).toEqual({
      calories: 2520,
      protein: 133,
      fat: 70,
      carbs: 340,
    });
  });

  it("falls back to default weight for non-positive input", () => {
    expect(calculateNutritionTargets(0, "Поддержание")).toEqual(
      calculateNutritionTargets(70, "Поддержание")
    );
  });

  it("keeps carbs at least 1", () => {
    const result = calculateNutritionTargets(1, "Сушка");
    expect(result.carbs).toBeGreaterThanOrEqual(1);
  });
});
