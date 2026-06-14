import catalogProducts from "../data/sources/catalog-products.json" with { type: "json" };
import type {
  ProductCategory,
  ProductDto,
  ProductSourceMeta,
  ProductUnit,
} from "../model/types.js";
import type { ProductSourceRepository } from "./product-source.repository.js";

type CatalogProductRecord = {
  categoryLabel: ProductCategory;
  displayName: string;
  media: {
    alt: string;
    thumbnailUrl: string;
  };
  nutrition: {
    carbohydrates: number;
    energyKcal: number;
    fats: number;
    proteins: number;
  };
  serving: {
    unit: ProductUnit;
    value: number;
  };
  syncedAt: string;
  uid: string;
};

const META: ProductSourceMeta = {
  description: "External nutrition catalog synced from partner data.",
  key: "catalog",
  label: "Catalog DB",
};

export class CatalogProductsRepository implements ProductSourceRepository {
  getMeta() {
    return META;
  }

  async listProducts(): Promise<ProductDto[]> {
    return (catalogProducts as CatalogProductRecord[]).map((product) => ({
      amountUnit: product.serving.unit,
      amountValue: product.serving.value,
      calories: product.nutrition.energyKcal,
      carbs: product.nutrition.carbohydrates,
      category: product.categoryLabel,
      createdAt: product.syncedAt,
      fat: product.nutrition.fats,
      id: `${META.key}:${product.uid}`,
      imageAlt: product.media.alt,
      imageUrl: product.media.thumbnailUrl,
      isReadonly: true as const,
      name: product.displayName,
      protein: product.nutrition.proteins,
      sourceKey: META.key,
      sourceLabel: META.label,
    }));
  }
}
