import type { NutritionGoal } from "@/entities/settings";

export type TargetFormState = {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  goal: NutritionGoal;
  weightKg: string;
};
