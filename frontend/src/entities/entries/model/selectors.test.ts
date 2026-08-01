import { describe, expect, it } from "vitest";

import type { DiaryEntry } from "./types";
import {
  getDayTotals,
  getEntriesByDate,
  getMacroProgress,
  getNutritionTotals,
  getWeeklyCalories,
  getWeeklyCaloriesStats,
  getWeeklyKbju,
} from "./selectors";

const entry = (
  overrides: Partial<DiaryEntry> & Pick<DiaryEntry, "id" | "date" | "createdAt">
): DiaryEntry => ({
  amountUnit: "г",
  amountValue: 100,
  calories: 100,
  carbs: 10,
  fat: 5,
  mealType: "Завтрак",
  productId: "p1",
  productImageAlt: "Oatmeal",
  productImageUrl: "/products/oatmeal.png",
  productName: "Oatmeal",
  protein: 12,
  servings: 1,
  ...overrides,
});

describe("selectors", () => {
  const entries = [
    entry({
      id: "1",
      date: "2026-08-01",
      createdAt: "2026-08-01T10:00:00.000Z",
      calories: 200,
      protein: 20,
      carbs: 15,
      fat: 8,
    }),
    entry({
      id: "2",
      date: "2026-08-01",
      createdAt: "2026-08-01T12:00:00.000Z",
      calories: 300,
      protein: 10,
      carbs: 40,
      fat: 12,
    }),
    entry({
      id: "3",
      date: "2026-08-02",
      createdAt: "2026-08-02T09:00:00.000Z",
      calories: 500,
    }),
  ];

  it("filters and sorts entries by date descending createdAt", () => {
    expect(getEntriesByDate(entries, "2026-08-01").map((item) => item.id)).toEqual([
      "2",
      "1",
    ]);
  });

  it("aggregates nutrition totals", () => {
    expect(getNutritionTotals(entries)).toEqual({
      calories: 1000,
      protein: 42,
      carbs: 65,
      fat: 25,
    });
    expect(getDayTotals(entries, "2026-08-01")).toEqual({
      calories: 500,
      protein: 30,
      carbs: 55,
      fat: 20,
    });
  });

  it("builds macro progress clamped to 100%", () => {
    const progress = getMacroProgress(
      entries,
      { protein: 20, carbs: 50, fat: 10 },
      "2026-08-01"
    );

    expect(progress).toEqual([
      {
        title: "Белки",
        consumed: 30,
        target: 20,
        percentage: 100,
        colorClass: "bg-emerald-500",
      },
      {
        title: "Углеводы",
        consumed: 55,
        target: 50,
        percentage: 100,
        colorClass: "bg-orange-500",
      },
      {
        title: "Жиры",
        consumed: 20,
        target: 10,
        percentage: 100,
        colorClass: "bg-rose-500",
      },
    ]);
  });

  it("caps percentage at 100 when target is zero and consumed > 0", () => {
    // division by zero → Infinity → Math.min(100, Infinity) === 100
    const progress = getMacroProgress(
      entries,
      { protein: 0, carbs: 0, fat: 0 },
      "2026-08-01"
    );
    expect(progress.every((item) => item.percentage === 100)).toBe(true);
  });

  it("builds weekly series and stats", () => {
    const weeklyDays = [
      { dateKey: "2026-08-01", day: "сб" },
      { dateKey: "2026-08-02", day: "вс" },
      { dateKey: "2026-08-03", day: "пн" },
    ];

    expect(getWeeklyCalories(entries, weeklyDays)).toEqual([
      { day: "сб", calories: 500 },
      { day: "вс", calories: 500 },
      { day: "пн", calories: 0 },
    ]);
    expect(getWeeklyKbju(entries, weeklyDays)[0]).toMatchObject({
      day: "сб",
      calories: 500,
      protein: 30,
    });
    expect(getWeeklyCaloriesStats(entries, weeklyDays)).toEqual({
      average: 333,
      max: 500,
      min: 0,
    });
  });
});
