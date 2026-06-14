import { normalizePositive } from "@/shared/lib/format";

import {
  DEFAULT_TARGET_WEIGHT_KG,
  NUTRITION_GOAL_SETTINGS,
} from "../model/constants";
import type { NutritionGoal } from "../model/types";

export const calculateNutritionTargets = (
  weightKg: number,
  goal: NutritionGoal
) => {
  const normalizedWeight = normalizePositive(weightKg, DEFAULT_TARGET_WEIGHT_KG);
  const settings = NUTRITION_GOAL_SETTINGS[goal];
  const calories = Math.round(normalizedWeight * settings.caloriesPerKg);
  const protein = Math.round(normalizedWeight * settings.proteinPerKg);
  const fat = Math.round(normalizedWeight * settings.fatPerKg);
  const carbs = Math.max(
    1,
    Math.round((calories - protein * 4 - fat * 9) / 4)
  );

  return {
    calories,
    protein,
    carbs,
    fat,
  };
};
