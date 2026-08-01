import { env } from "../../../../../config/env.js";
import type { OffProductRecord } from "./off.mapper.js";

const PRODUCT_FIELDS = [
  "code",
  "product_name",
  "product_name_ru",
  "product_name_en",
  "nutriments",
  "image_front_small_url",
  "image_front_url",
  "categories_tags",
  "last_modified_t",
].join(",");

type OffProductResponse = {
  product?: OffProductRecord;
  status?: number;
};

type OffSearchResponse = {
  count?: number;
  products?: OffProductRecord[];
};

export class OpenFoodFactsClient {
  constructor(
    private readonly baseUrl = env.openFoodFacts.baseUrl,
    private readonly userAgent = env.openFoodFacts.userAgent,
    private readonly timeoutMs = env.openFoodFacts.timeoutMs
  ) {}

  async getProductByBarcode(barcode: string): Promise<OffProductRecord | null> {
    const normalizedBarcode = barcode.trim();

    if (!normalizedBarcode) {
      return null;
    }

    const url = new URL(
      `/api/v2/product/${encodeURIComponent(normalizedBarcode)}.json`,
      this.baseUrl
    );
    url.searchParams.set("fields", PRODUCT_FIELDS);

    const payload = await this.fetchJson<OffProductResponse>(url);

    if (!payload || payload.status !== 1 || !payload.product) {
      return null;
    }

    return {
      ...payload.product,
      code: payload.product.code || normalizedBarcode,
    };
  }

  async searchProducts(query: {
    limit: number;
    offset: number;
    q: string;
  }): Promise<{ count: number; products: OffProductRecord[] }> {
    const normalizedQuery = query.q.trim();

    if (!normalizedQuery) {
      return { count: 0, products: [] };
    }

    if (/^\d{8,14}$/.test(normalizedQuery)) {
      const product = await this.getProductByBarcode(normalizedQuery);
      return {
        count: product ? 1 : 0,
        products: product ? [product] : [],
      };
    }

    const pageSize = Math.min(Math.max(query.limit, 1), 50);
    const page = Math.floor(query.offset / pageSize) + 1;
    const url = new URL("/cgi/search.pl", this.baseUrl);
    url.searchParams.set("search_terms", normalizedQuery);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page", String(page));
    url.searchParams.set("page_size", String(pageSize));
    url.searchParams.set("fields", PRODUCT_FIELDS);

    const payload = await this.fetchJson<OffSearchResponse>(url);

    return {
      count: typeof payload?.count === "number" ? payload.count : 0,
      products: Array.isArray(payload?.products) ? payload.products : [],
    };
  }

  private async fetchJson<T>(url: URL): Promise<T | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": this.userAgent,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as T;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
}
