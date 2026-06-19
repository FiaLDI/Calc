import {
  normalizeNonNegative,
  normalizePositive,
  normalizeTimestamp,
} from "@/shared/lib/format";
import { createId } from "@/shared/lib/utils";

import { CUSTOM_SOURCE_KEY, CUSTOM_SOURCE_LABEL } from "../model/constants";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  type Product,
  type ProductCategory,
  type ProductUnit,
} from "../model/types";

const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "Другое";
const DEFAULT_PRODUCT_UNIT: ProductUnit = "г";

export const isProductUnit = (value: unknown): value is ProductUnit =>
  typeof value === "string" &&
  (PRODUCT_UNITS as readonly string[]).includes(value);

export const isProductCategory = (value: unknown): value is ProductCategory =>
  typeof value === "string" &&
  (PRODUCT_CATEGORIES as readonly string[]).includes(value);

const normalizeOptionalString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export const sanitizeProduct = (value: unknown): Product | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Product>;
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";

  if (!name) {
    return null;
  }

  return {
    id:
      typeof candidate.id === "string" && candidate.id.trim()
        ? candidate.id
        : createId(),
    name,
    category: isProductCategory(candidate.category)
      ? candidate.category
      : DEFAULT_PRODUCT_CATEGORY,
    amountValue: normalizePositive(candidate.amountValue ?? 0, 100),
    amountUnit: isProductUnit(candidate.amountUnit)
      ? candidate.amountUnit
      : DEFAULT_PRODUCT_UNIT,
    calories: normalizeNonNegative(candidate.calories ?? 0),
    protein: normalizeNonNegative(candidate.protein ?? 0),
    carbs: normalizeNonNegative(candidate.carbs ?? 0),
    fat: normalizeNonNegative(candidate.fat ?? 0),
    createdAt: normalizeTimestamp(candidate.createdAt),
    imageAlt: normalizeOptionalString(candidate.imageAlt) || name,
    imageUrl: normalizeOptionalString(candidate.imageUrl),
    sourceKey:
      typeof candidate.sourceKey === "string" && candidate.sourceKey.trim()
        ? candidate.sourceKey
        : CUSTOM_SOURCE_KEY,
    sourceLabel:
      typeof candidate.sourceLabel === "string" && candidate.sourceLabel.trim()
        ? candidate.sourceLabel
        : CUSTOM_SOURCE_LABEL,
    isReadonly: candidate.isReadonly === true,
    visibility:
      candidate.visibility === "public" || candidate.isReadonly === true
        ? "public"
        : "private",
  };
};
