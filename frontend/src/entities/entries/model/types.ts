import type { ProductUnit } from "@/entities/products";

export const MEAL_TYPES = ["Завтрак", "Обед", "Ужин", "Перекус"] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export type EntryProduct = {
  id: string;
  name: string;
  amountValue: number;
  amountUnit: ProductUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageAlt: string;
  imageUrl: string;
};

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
