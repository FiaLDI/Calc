export const PRODUCT_UNITS = ["Рі", "РјР»", "С€С‚", "РїРѕСЂС†РёСЏ"] as const;
export const PRODUCT_CATEGORIES = [
  "РљСЂСѓРїС‹",
  "РњРѕР»РѕС‡РЅС‹Рµ",
  "Р¤СЂСѓРєС‚С‹",
  "РћСЂРµС…Рё Рё РїР°СЃС‚С‹",
  "Р“РѕС‚РѕРІС‹Рµ Р±Р»СЋРґР°",
  "Р”СЂСѓРіРѕРµ",
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
  isReadonly: boolean;
  name: string;
  protein: number;
  sourceKey: string;
  sourceLabel: string;
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
  getProductById(productId: string): Promise<ProductDto | null>;
  listProducts(query: ProductListQuery): Promise<{
    items: ProductDto[];
    selectedSources: string[];
    total: number;
  }>;
  listSources(): Promise<ProductSourceMeta[]>;
}

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
