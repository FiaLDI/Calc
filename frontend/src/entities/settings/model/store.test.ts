import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSettingsStore } from "./store";

describe("SettingsStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hydrates defaults when storage is empty", () => {
    const store = createSettingsStore("user-1");
    store.hydrate();

    expect(store.isHydrated).toBe(true);
    expect(store.targetCalories).toBe(2000);
    expect(store.nutritionGoal).toBe("Поддержание");
    expect(store.targetWeightKg).toBe(70);
  });

  it("hydrates and persists a valid snapshot", () => {
    localStorage.setItem(
      "calc:settings-store:user-1",
      JSON.stringify({
        nutritionGoal: "Набор",
        targetCalories: 2500,
        targetProtein: 140,
        targetCarbs: 300,
        targetFat: 80,
        targetWeightKg: 75,
      })
    );

    const store = createSettingsStore("user-1");
    store.hydrate();

    expect(store.nutritionGoal).toBe("Набор");
    expect(store.targetCalories).toBe(2500);
    expect(store.macroTargets).toEqual({
      protein: 140,
      carbs: 300,
      fat: 80,
    });

    store.setTargetCalories(2600);
    expect(JSON.parse(localStorage.getItem("calc:settings-store:user-1")!)).toMatchObject({
      targetCalories: 2600,
      nutritionGoal: "Набор",
    });
  });

  it("falls back to defaults on broken JSON", () => {
    localStorage.setItem("calc:settings-store:user-1", "{bad");
    const store = createSettingsStore("user-1");
    store.hydrate();

    expect(store.targetCalories).toBe(2000);
    expect(store.isHydrated).toBe(true);
  });

  it("recalculates nutrition targets via helper", () => {
    const store = createSettingsStore("user-1");
    store.hydrate();

    const targets = store.calculateNutritionTargets(70, "Поддержание");
    expect(targets).toEqual({
      calories: 2240,
      protein: 119,
      fat: 63,
      carbs: 299,
    });

    store.setNutritionTargets({ ...targets, goal: "Поддержание", weightKg: 70 });
    expect(store.targetCalories).toBe(2240);
    expect(store.nutritionGoal).toBe("Поддержание");
  });

  it("does not hydrate twice", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    const store = createSettingsStore("user-1");
    store.hydrate();
    store.hydrate();
    expect(getItem).toHaveBeenCalledTimes(1);
  });
});
