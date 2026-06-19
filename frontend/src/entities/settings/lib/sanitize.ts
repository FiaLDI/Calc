import { NUTRITION_GOALS, NutritionGoal } from "../model/types";


export const isNutritionGoal = (value: unknown): value is NutritionGoal =>
  typeof value === "string" &&
  (NUTRITION_GOALS as readonly string[]).includes(value);
  