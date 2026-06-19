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
export type ProductVisibility = "private" | "public";

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
  isReadonly: boolean;
  name: string;
  protein: number;
  sourceKey: string;
  sourceLabel: string;
  visibility: ProductVisibility;
};

export type ProductCreatePayload = {
  amountUnit: ProductUnit;
  amountValue: number;
  calories: number;
  carbs: number;
  category: ProductCategory;
  fat: number;
  imageAlt: string;
  imageUrl: string;
  name: string;
  protein: number;
  visibility: ProductVisibility;
};

export type ProductSourceMeta = {
  description: string;
  key: string;
  label: string;
};

export interface ProductSourceRepository {
  getMeta(): ProductSourceMeta;
  listProducts(): Promise<ProductDto[]>;
}

export interface ProductsRepositoryContract {
  createProduct(userId: string, payload: ProductCreatePayload): Promise<ProductDto>;
  deleteProduct(userId: string, productId: string): Promise<boolean>;
  getProductById(userId: string, productId: string): Promise<ProductDto | null>;
  listProducts(query: ProductListQuery): Promise<{
    items: ProductDto[];
    selectedSources: string[];
    total: number;
  }>;
  listSources(userId: string): Promise<ProductSourceMeta[]>;
}

export type ProductListQuery = {
  limit: number;
  offset: number;
  search: string;
  sourceKeys: string[];
  userId: string;
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
