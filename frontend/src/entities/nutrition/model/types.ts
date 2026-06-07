export const PRODUCT_UNITS = ["г", "мл", "шт", "порция"] as const;
export const MEAL_TYPES = ["Завтрак", "Обед", "Ужин", "Перекус"] as const;

export type ProductUnit = (typeof PRODUCT_UNITS)[number];
export type MealType = (typeof MEAL_TYPES)[number];

export type Product = {
  id: string;
  name: string;
  amountValue: number;
  amountUnit: ProductUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  sourceKey: string;
  sourceLabel: string;
  isReadonly: boolean;
};

export type DiaryEntry = {
  id: string;
  productId: string;
  productName: string;
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
