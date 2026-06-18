import recipeProducts from "./data/sources/recipe-products.json" with { type: "json" };
import type {
  ProductCategory,
  ProductDto,
  ProductSourceMeta,
  ProductSourceRepository,
  ProductUnit,
} from "../domain/products.types.js";

type RecipeProductRecord = {
  category: ProductCategory;
  code: string;
  created: string;
  imageAlt: string;
  imageUrl: string;
  macrosPerPortion: {
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
    servingAmount: number;
    servingUnit: ProductUnit;
  };
  name: string;
};

const META: ProductSourceMeta = {
  description: "Prepared meal base with full ready-to-eat dishes.",
  key: "recipes",
  label: "Recipe DB",
};

export class RecipeProductsRepository implements ProductSourceRepository {
  getMeta() {
    return META;
  }

  async listProducts(): Promise<ProductDto[]> {
    return (recipeProducts as RecipeProductRecord[]).map((product) => ({
      amountUnit: product.macrosPerPortion.servingUnit,
      amountValue: product.macrosPerPortion.servingAmount,
      calories: product.macrosPerPortion.calories,
      carbs: product.macrosPerPortion.carbs,
      category: product.category,
      createdAt: product.created,
      fat: product.macrosPerPortion.fat,
      id: `${META.key}:${product.code}`,
      imageAlt: product.imageAlt,
      imageUrl: product.imageUrl,
      isReadonly: true as const,
      name: product.name,
      protein: product.macrosPerPortion.protein,
      sourceKey: META.key,
      sourceLabel: META.label,
    }));
  }
}
