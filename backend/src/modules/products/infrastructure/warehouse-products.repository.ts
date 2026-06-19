import warehouseProducts from "./data/sources/warehouse-products.json" with { type: "json" };
import type {
  ProductCategory,
  ProductDto,
  ProductSourceMeta,
  ProductSourceRepository,
  ProductUnit,
} from "../domain/products.types.js";

type WarehouseProductRecord = {
  carbGrams: number;
  category: ProductCategory;
  fatGrams: number;
  imageDescription: string;
  imagePath: string;
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
      category: product.category,
      createdAt: product.insertedAt,
      fat: product.fatGrams,
      id: `${META.key}:${product.warehouseId}`,
      imageAlt: product.imageDescription,
      imageUrl: product.imagePath,
      isReadonly: true as const,
      name: product.title,
      protein: product.proteinGrams,
      sourceKey: META.key,
      sourceLabel: META.label,
      visibility: "public" as const,
    }));
  }
}
