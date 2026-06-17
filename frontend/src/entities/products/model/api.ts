import { fetchFromApi } from "@/shared/api/client";

import type { Product, ProductCategory, ProductUnit } from "./types";

export type ProductApiProduct = Omit<Product, "amountUnit" | "category"> & {
  amountUnit: ProductUnit;
  category: ProductCategory;
};

type ProductsApiMeta = {
  limit: number;
  offset: number;
  search: null | string;
  selectedSources: string[];
  total: number;
};

type ProductsApiResponse = {
  data: ProductApiProduct[];
  meta: ProductsApiMeta;
};

export const ProductApi = {
  async fetchProducts(): Promise<ProductApiProduct[]> {
    const response = await fetchFromApi<ProductsApiResponse>("products");

    return response.data;
  },
};
