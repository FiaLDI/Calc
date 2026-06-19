import {
  isValidDateKey,
  normalizeNonNegative,
  normalizePositive,
  normalizeTimestamp,
} from "@/shared/lib/format";
import { createId } from "@/shared/lib/utils";
import { PRODUCT_UNITS, type ProductUnit } from "@/entities/products";

import { MEAL_TYPES, type DiaryEntry, type MealType } from "../model/types";

const DEFAULT_PRODUCT_UNIT: ProductUnit = "г";
const DEFAULT_MEAL_TYPE: MealType = "Завтрак";

const isProductUnit = (value: unknown): value is ProductUnit =>
  typeof value === "string" &&
  (PRODUCT_UNITS as readonly string[]).includes(value);

const isMealType = (value: unknown): value is MealType =>
  typeof value === "string" && (MEAL_TYPES as readonly string[]).includes(value);

const normalizeOptionalString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export const sanitizeEntry = (value: unknown): DiaryEntry | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<DiaryEntry>;
  const productName =
    typeof candidate.productName === "string" ? candidate.productName.trim() : "";

  if (!productName || !isValidDateKey(candidate.date)) {
    return null;
  }

  return {
    id:
      typeof candidate.id === "string" && candidate.id.trim()
        ? candidate.id
        : createId(),
    productId:
      typeof candidate.productId === "string" ? candidate.productId : "",
    productName,
    productImageAlt:
      normalizeOptionalString(candidate.productImageAlt) || productName,
    productImageUrl: normalizeOptionalString(candidate.productImageUrl),
    amountValue: normalizePositive(candidate.amountValue ?? 0, 100),
    amountUnit: isProductUnit(candidate.amountUnit)
      ? candidate.amountUnit
      : DEFAULT_PRODUCT_UNIT,
    servings: normalizePositive(candidate.servings ?? 0, 1),
    mealType: isMealType(candidate.mealType)
      ? candidate.mealType
      : DEFAULT_MEAL_TYPE,
    date: candidate.date,
    calories: normalizeNonNegative(candidate.calories ?? 0),
    protein: normalizeNonNegative(candidate.protein ?? 0),
    carbs: normalizeNonNegative(candidate.carbs ?? 0),
    fat: normalizeNonNegative(candidate.fat ?? 0),
    createdAt: normalizeTimestamp(candidate.createdAt),
  };
};
