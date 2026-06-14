
export const NUTRITION_GOALS = ["Сушка", "Поддержание", "Набор"] as const;
export type NutritionGoal = (typeof NUTRITION_GOALS)[number];