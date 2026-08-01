import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CalorieSummaryWidget } from "./calorie-summary-widget";

vi.mock("@/entities/settings", () => ({
  useSettingsStore: () => ({
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFat: 67,
    targetWeightKg: 70,
    nutritionGoal: "Поддержание",
    macroTargets: { protein: 150, carbs: 200, fat: 67 },
  }),
}));

vi.mock("@/entities/entries", () => ({
  useDiaryEntriesStore: () => ({
    selectedDayTotals: () => ({
      calories: 500,
      protein: 40,
      carbs: 50,
      fat: 20,
    }),
    macroProgress: () => [
      {
        title: "Белки",
        consumed: 40,
        target: 150,
        percentage: 27,
        colorClass: "bg-emerald-500",
      },
      {
        title: "Углеводы",
        consumed: 50,
        target: 200,
        percentage: 25,
        colorClass: "bg-orange-500",
      },
      {
        title: "Жиры",
        consumed: 20,
        target: 67,
        percentage: 30,
        colorClass: "bg-rose-500",
      },
    ],
  }),
}));

vi.mock("@/entities/date", () => ({
  useDateStore: () => ({
    selectedDate: "2026-08-01",
  }),
}));

vi.mock("@/features/set-settings", () => ({
  SetSettingsModal: () => <button type="button">Цели</button>,
}));

describe("CalorieSummaryWidget", () => {
  it("renders day calories, target and macro progress", () => {
    render(<CalorieSummaryWidget />);

    expect(screen.getByText("Калории за день")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText(/\/ 2000 ккал/)).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("Поддержание 70кг")).toBeInTheDocument();
    expect(screen.getByText("Белки")).toBeInTheDocument();
    expect(screen.getByText("40 / 150 г")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Цели" })).toBeInTheDocument();
  });
});
