import { fetchFromApi } from "@/shared/api/client";

import type { Product, ProductCategory, ProductUnit } from "./types";

export type ProductApiProduct = Omit<Product, "amountUnit" | "category"> & {
  amountUnit: ProductUnit;
  category: ProductCategory;
};

export type ProductApiPayload = Omit<
  ProductApiProduct,
  "createdAt" | "id" | "isReadonly" | "sourceKey" | "sourceLabel"
>;

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

export type ProductSourceApiItem = {
  description: string;
  key: string;
  label: string;
};

type ProductApiResponse = {
  data: ProductApiProduct;
};

type ProductSourcesApiResponse = {
  data: ProductSourceApiItem[];
};

type FetchProductsParams = {
  limit?: number;
  offset?: number;
  search?: string;
  sources?: string[];
};

const buildProductsEndpoint = (params?: FetchProductsParams) => {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (params?.sources?.length) {
    searchParams.set("sources", params.sources.join(","));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.offset !== undefined) {
    searchParams.set("offset", String(params.offset));
  }

  const queryString = searchParams.toString();
  return queryString ? `products?${queryString}` : "products";
};

export const ProductApi = {
  async fetchProducts(params?: FetchProductsParams): Promise<ProductApiProduct[]> {
    const response = await fetchFromApi<ProductsApiResponse>(
      buildProductsEndpoint(params)
    );

    return response.data;
  },

  async fetchProductById(productId: string): Promise<ProductApiProduct> {
    const response = await fetchFromApi<ProductApiResponse>(
      `products/${encodeURIComponent(productId)}`
    );

    return response.data;
  },

  async fetchProductSources(): Promise<ProductSourceApiItem[]> {
    const response =
      await fetchFromApi<ProductSourcesApiResponse>("product-sources");

    return response.data;
  },

  async createProduct(productData: ProductApiPayload): Promise<ProductApiProduct> {
    const response = await fetchFromApi<ProductApiResponse, ProductApiPayload>(
      "products",
      {
        body: productData,
        method: "POST",
      }
    );

    return response.data;
  },

  async removeProduct(productId: string): Promise<void> {
    await fetchFromApi<void>(`products/${encodeURIComponent(productId)}`, {
      method: "DELETE",
    });
  },
};
