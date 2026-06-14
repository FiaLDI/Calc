export const PRODUCT_UNITS = ["г", "мл", "шт", "порция"] as const;
export const MEAL_TYPES = ["Завтрак", "Обед", "Ужин", "Перекус"] as const;
export const NUTRITION_GOALS = ["Сушка", "Поддержание", "Набор"] as const;
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
export type NutritionGoal = (typeof NUTRITION_GOALS)[number];
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

export type DiaryEntry = {
  id: string;
  productId: string;
  productName: string;
  productImageAlt: string;
  productImageUrl: string;
  amountValue: number;
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
