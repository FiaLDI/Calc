import type { ProductRecord } from "./products.schema.js";
import type { ProductDto } from "../domain/products.types.js";

export const mapProductRecordToDto = (
  product: ProductRecord,
  viewerUserId?: string
): ProductDto => ({
  amountUnit: product.amountUnit,
  amountValue: product.amountValue,
  calories: product.calories,
  carbs: product.carbs,
  category: product.category,
  createdAt: product.createdAt.toISOString(),
  fat: product.fat,
  id: product.externalId,
  imageAlt: product.imageAlt,
  imageUrl: product.imageUrl,
  isReadonly:
    product.isReadonly ||
    (Boolean(product.userId) && product.userId !== viewerUserId),
  name: product.name,
  protein: product.protein,
  sourceKey: product.sourceKey,
  sourceLabel: product.sourceLabel,
  visibility: product.isReadonly || product.isPublic ? "public" : "private",
});
