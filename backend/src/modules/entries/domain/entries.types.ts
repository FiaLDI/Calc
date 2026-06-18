import type { ProductUnit } from "../../products/domain/products.types.js";

export type MealType = string;

export type EntryPayload = {
  amountUnit: ProductUnit;
  amountValue: number;
  calories: number;
  carbs: number;
  date: string;
  fat: number;
  mealType: MealType;
  productId: string;
  productImageAlt: string;
  productImageUrl: string;
  productName: string;
  protein: number;
  servings: number;
};

export type DiaryEntryDto = EntryPayload & {
  createdAt: string;
  id: string;
};

export type EntryListQuery = {
  date: string;
  limit: number;
  offset: number;
  userId: string;
};

export type EntriesListResponse = {
  data: DiaryEntryDto[];
  meta: {
    date: string | null;
    limit: number;
    offset: number;
    total: number;
  };
};

export type EntryResponse = {
  data: DiaryEntryDto;
};
