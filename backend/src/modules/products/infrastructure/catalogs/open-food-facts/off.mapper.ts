import type {
  ProductCategory,
  ProductDto,
} from "../../../domain/products.types.js";
import { OPEN_FOOD_FACTS_SOURCE_KEY } from "../../../domain/products.sources.js";

type OffNutriments = Record<string, number | string | undefined>;

export type OffProductRecord = {
  categories_tags?: string[];
  code?: string;
  image_front_small_url?: string;
  image_front_url?: string;
  last_modified_t?: number;
  nutriments?: OffNutriments;
  product_name?: string;
  product_name_en?: string;
  product_name_ru?: string;
};

const CATEGORY_RULES: Array<{ category: ProductCategory; tags: string[] }> = [
  {
    category: "Молочные",
    tags: ["en:dairies", "en:milks", "en:yogurts", "en:cheeses"],
  },
  {
    category: "Фрукты",
    tags: ["en:fruits", "en:fresh-fruits", "en:dried-fruits"],
  },
  {
    category: "Крупы",
    tags: ["en:cereals", "en:breakfast-cereals", "en:pastas", "en:rices"],
  },
  {
    category: "Орехи и пасты",
    tags: ["en:nuts", "en:nut-butters", "en:spreads", "en:seed-butters"],
  },
  {
    category: "Готовые блюда",
    tags: ["en:meals", "en:prepared-meals", "en:pizza"],
  },
];

const toFiniteNumber = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const pickNutriment = (nutriments: OffNutriments | undefined, keys: string[]) => {
  if (!nutriments) {
    return 0;
  }

  for (const key of keys) {
    if (nutriments[key] !== undefined) {
      return toFiniteNumber(nutriments[key]);
    }
  }

  return 0;
};

export const mapOffCategory = (tags: string[] | undefined): ProductCategory => {
  const normalizedTags = new Set((tags || []).map((tag) => tag.toLowerCase()));

  for (const rule of CATEGORY_RULES) {
    if (rule.tags.some((tag) => normalizedTags.has(tag))) {
      return rule.category;
    }
  }

  return "Другое";
};

export const mapOffProductToDto = (
  product: OffProductRecord,
  sourceLabel: string
): ProductDto | null => {
  const code = product.code?.trim();
  const name = (
    product.product_name_ru ||
    product.product_name ||
    product.product_name_en ||
    ""
  ).trim();

  if (!code || !name) {
    return null;
  }

  const calories = pickNutriment(product.nutriments, [
    "energy-kcal_100g",
    "energy-kcal",
    "energy-kcal_value",
  ]);
  const protein = pickNutriment(product.nutriments, [
    "proteins_100g",
    "proteins",
  ]);
  const carbs = pickNutriment(product.nutriments, [
    "carbohydrates_100g",
    "carbohydrates",
  ]);
  const fat = pickNutriment(product.nutriments, ["fat_100g", "fat"]);
  const imageUrl =
    product.image_front_small_url?.trim() ||
    product.image_front_url?.trim() ||
    "";
  const createdAt = product.last_modified_t
    ? new Date(product.last_modified_t * 1000).toISOString()
    : new Date().toISOString();

  return {
    amountUnit: "г",
    amountValue: 100,
    calories: Math.round(calories),
    carbs: Math.round(carbs * 10) / 10,
    category: mapOffCategory(product.categories_tags),
    createdAt,
    fat: Math.round(fat * 10) / 10,
    id: `${OPEN_FOOD_FACTS_SOURCE_KEY}:${code}`,
    imageAlt: name,
    imageUrl,
    isReadonly: true,
    name,
    protein: Math.round(protein * 10) / 10,
    sourceKey: OPEN_FOOD_FACTS_SOURCE_KEY,
    sourceLabel,
    visibility: "public",
  };
};
