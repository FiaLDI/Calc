export const PRODUCT_UNITS = ["г", "мл", "шт", "порция"] as const;
export const PRODUCT_CATEGORIES = [
  "Крупы",
  "Молочные",
  "Фрукты",
  "Орехи и пасты",
  "Готовые блюда",
  "Другое",
] as const;

export type ProductUnit = (typeof PRODUCT_UNITS)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  amountValue: number;
  amountUnit: ProductUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  imageAlt: string;
  imageUrl: string;
  sourceKey: string;
  sourceLabel: string;
  isReadonly: boolean;
};
