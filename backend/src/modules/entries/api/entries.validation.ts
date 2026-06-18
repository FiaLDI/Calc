import { HttpError } from "../../../shared/http/http-error.js";
import type { EntryPayload } from "../domain/entries.types.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getString = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];

  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${key} is required.`);
  }

  return value.trim();
};

const getNumber = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new HttpError(400, `${key} must be a non-negative number.`);
  }

  return value;
};

export const parseEntryPayload = (value: unknown): EntryPayload => {
  if (!isRecord(value)) {
    throw new HttpError(400, "Entry payload must be an object.");
  }

  const mealType = getString(value, "mealType");

  return {
    amountUnit: getString(value, "amountUnit") as EntryPayload["amountUnit"],
    amountValue: getNumber(value, "amountValue"),
    calories: getNumber(value, "calories"),
    carbs: getNumber(value, "carbs"),
    date: getString(value, "date"),
    fat: getNumber(value, "fat"),
    mealType: mealType as EntryPayload["mealType"],
    productId: getString(value, "productId"),
    productImageAlt: getString(value, "productImageAlt"),
    productImageUrl: getString(value, "productImageUrl"),
    productName: getString(value, "productName"),
    protein: getNumber(value, "protein"),
    servings: getNumber(value, "servings"),
  };
};
