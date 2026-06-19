export const NUTRITION_GOALS = ["Сушка", "Поддержание", "Набор"] as const;
export type NutritionGoal = (typeof NUTRITION_GOALS)[number];

export type SettingsSnapshot = {
  nutritionGoal: NutritionGoal;
  targetCarbs: number;
  targetCalories: number;
  targetFat: number;
  targetProtein: number;
  targetWeightKg: number;
};
