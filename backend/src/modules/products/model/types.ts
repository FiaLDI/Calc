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

export type ProductDto = {
  amountUnit: ProductUnit;
  amountValue: number;
  calories: number;
  carbs: number;
  category: ProductCategory;
  createdAt: string;
  fat: number;
  id: string;
  imageAlt: string;
  imageUrl: string;
  isReadonly: true;
  name: string;
  protein: number;
  sourceKey: string;
  sourceLabel: string;
};

export type ProductSourceMeta = {
  description: string;
  key: string;
  label: string;
};

export type ProductListQuery = {
  limit: number;
  offset: number;
  search: string;
  sourceKeys: string[];
};

export type ProductsListResponse = {
  data: ProductDto[];
  meta: {
    limit: number;
    offset: number;
    search: string | null;
    selectedSources: string[];
    total: number;
  };
};

export type ProductSourcesResponse = {
  data: ProductSourceMeta[];
};

export type ProductResponse = {
  data: ProductDto;
};
