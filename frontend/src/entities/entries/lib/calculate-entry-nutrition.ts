import { roundToOneDecimal } from "@/shared/lib/format";

import type { EntryProduct, NutritionTotals } from "../model/types";

export const normalizeServings = (servings: number) =>
  Math.max(0.1, roundToOneDecimal(servings || 1));

export const calculateEntryNutrition = (
  product: EntryProduct,
  servings: number
): NutritionTotals => ({
  calories: Math.round(product.calories * servings),
  protein: roundToOneDecimal(product.protein * servings),
  carbs: roundToOneDecimal(product.carbs * servings),
  fat: roundToOneDecimal(product.fat * servings),
});
