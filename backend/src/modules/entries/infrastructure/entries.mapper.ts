import type { DiaryEntryDto } from "../domain/entries.types.js";
import type { DiaryEntryDocument } from "./entries.schema.js";

export const mapEntryDocumentToDto = (
  entry: DiaryEntryDocument
): DiaryEntryDto => ({
  amountUnit: entry.productSnapshot.amountUnit,
  amountValue: entry.productSnapshot.amountValue,
  calories: entry.productSnapshot.calories,
  carbs: entry.productSnapshot.carbs,
  createdAt: entry.createdAt.toISOString(),
  date: entry.date,
  fat: entry.productSnapshot.fat,
  id: entry._id.toString(),
  mealType: entry.mealType,
  productId: entry.productSnapshot.productId,
  productImageAlt: entry.productSnapshot.productImageAlt,
  productImageUrl: entry.productSnapshot.productImageUrl,
  productName: entry.productSnapshot.productName,
  protein: entry.productSnapshot.protein,
  servings: entry.servings,
});
