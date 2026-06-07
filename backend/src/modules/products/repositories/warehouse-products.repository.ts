import warehouseProducts from "../data/sources/warehouse-products.json" with { type: "json" };
import type { ProductDto, ProductSourceMeta, ProductUnit } from "../model/types.js";
import type { ProductSourceRepository } from "./product-source.repository.js";

type WarehouseProductRecord = {
  carbGrams: number;
  fatGrams: number;
  insertedAt: string;
  kcal: number;
  portionSize: number;
  portionUnit: ProductUnit;
  proteinGrams: number;
  title: string;
  warehouseId: string;
};

const META: ProductSourceMeta = {
  description: "Warehouse catalog with staple grocery items.",
  key: "warehouse",
  label: "Warehouse DB",
};

export class WarehouseProductsRepository implements ProductSourceRepository {
  getMeta() {
    return META;
  }

  async listProducts(): Promise<ProductDto[]> {
    return (warehouseProducts as WarehouseProductRecord[]).map((product) => ({
      amountUnit: product.portionUnit,
      amountValue: product.portionSize,
      calories: product.kcal,
      carbs: product.carbGrams,
      createdAt: product.insertedAt,
      fat: product.fatGrams,
      id: `${META.key}:${product.warehouseId}`,
      isReadonly: true as const,
      name: product.title,
      protein: product.proteinGrams,
      sourceKey: META.key,
      sourceLabel: META.label,
    }));
  }
}
