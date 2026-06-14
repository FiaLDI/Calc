
import { NutritionGoal } from "@/entities/settings/model/types";

export type TargetFormState = {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  goal: NutritionGoal;
  weightKg: string;
};
