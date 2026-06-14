import type { NutritionGoal } from "./types";

export const STORAGE_KEY = "calc:settings-store";
export const DEFAULT_TARGET_CALORIES = 2000;
export const DEFAULT_TARGET_PROTEIN = 150;
export const DEFAULT_TARGET_CARBS = 200;
export const DEFAULT_TARGET_FAT = 67;
export const DEFAULT_TARGET_WEIGHT_KG = 70;
export const DEFAULT_NUTRITION_GOAL: NutritionGoal = "Поддержание";
export const NUTRITION_GOAL_SETTINGS: Record<
  NutritionGoal,
  {
    caloriesPerKg: number;
    fatPerKg: number;
    proteinPerKg: number;
  }
> = {
  Сушка: {
    caloriesPerKg: 28,
    fatPerKg: 0.8,
    proteinPerKg: 2.1,
  },
  Поддержание: {
    caloriesPerKg: 32,
    fatPerKg: 0.9,
    proteinPerKg: 1.7,
  },
  Набор: {
    caloriesPerKg: 36,
    fatPerKg: 1,
    proteinPerKg: 1.9,
  },
};
