export const PRODUCT_UNITS = ["г", "мл", "шт", "порция"] as const;
export const MEAL_TYPES = ["Завтрак", "Обед", "Ужин", "Перекус"] as const;
export const PRODUCT_CATEGORIES = [
  "Крупы",
  "Молочные",
  "Фрукты",
  "Орехи и пасты",
  "Готовые блюда",
  "Другое",
] as const;

export type ProductUnit = (typeof PRODUCT_UNITS)[number];
export type MealType = (typeof MEAL_TYPES)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MacroTargets = Pick<NutritionTotals, "protein" | "carbs" | "fat">;

export type MacroProgressItem = {
  title: string;
  consumed: number;
  target: number;
  percentage: number;
  colorClass: string;
};

export type WeeklyDay = {
  dateKey: string;
  day: string;
};

export type WeeklyCaloriesPoint = {
  day: string;
  calories: number;
};

export type WeeklyKbjuPoint = NutritionTotals & {
  day: string;
};

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

export type DiaryEntry = {
  id: string;
  productId: string;
  productName: string;
  productImageAlt: string;
  productImageUrl: string;
  amountValue: Product["amountValue"];
  amountUnit: ProductUnit;
  servings: number;
  mealType: MealType;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
};
