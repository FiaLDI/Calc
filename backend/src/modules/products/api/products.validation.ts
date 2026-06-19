import { HttpError } from "../../../shared/http/http-error.js";
import type { ProductCreatePayload } from "../domain/products.types.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getString = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];

  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${key} is required.`);
  }

  return value.trim();
};

const getOptionalString = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];

  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${key} must be a string.`);
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

const getVisibility = (
  payload: Record<string, unknown>
): ProductCreatePayload["visibility"] => {
  const value = payload.visibility;

  if (value !== "private" && value !== "public") {
    throw new HttpError(400, "visibility must be either private or public.");
  }

  return value;
};

export const parseProductCreatePayload = (
  value: unknown
): ProductCreatePayload => {
  if (!isRecord(value)) {
    throw new HttpError(400, "Product payload must be an object.");
  }

  const name = getString(value, "name");

  return {
    amountUnit: getString(value, "amountUnit") as ProductCreatePayload["amountUnit"],
    amountValue: getNumber(value, "amountValue"),
    calories: getNumber(value, "calories"),
    carbs: getNumber(value, "carbs"),
    category: getString(value, "category") as ProductCreatePayload["category"],
    fat: getNumber(value, "fat"),
    imageAlt: getOptionalString(value, "imageAlt") || name,
    imageUrl: getOptionalString(value, "imageUrl"),
    name,
    protein: getNumber(value, "protein"),
    visibility: getVisibility(value),
  };
};
