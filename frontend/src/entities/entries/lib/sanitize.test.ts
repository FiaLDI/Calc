import { describe, expect, it } from "vitest";

import { sanitizeEntry } from "./sanitize";

describe("sanitizeEntry", () => {
  it("returns null for missing product name or invalid date", () => {
    expect(sanitizeEntry({ productName: "Oatmeal" })).toBeNull();
    expect(
      sanitizeEntry({ productName: "Oatmeal", date: "01-08-2026" })
    ).toBeNull();
  });

  it("normalizes a valid entry", () => {
    const entry = sanitizeEntry({
      productName: "  Oatmeal  ",
      date: "2026-08-01",
      calories: 200,
      servings: 0,
      mealType: "Unknown",
      amountUnit: "kg",
    });

    expect(entry).toMatchObject({
      productName: "Oatmeal",
      date: "2026-08-01",
      calories: 200,
      servings: 1,
      mealType: "Завтрак",
      amountUnit: "г",
      amountValue: 100,
    });
  });
});
