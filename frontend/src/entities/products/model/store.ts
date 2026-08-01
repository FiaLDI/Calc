import { makeAutoObservable, runInAction } from "mobx";

import { normalizeNonNegative, normalizePositive } from "@/shared/lib/format";
import { isLocalUserId } from "@/shared/config/local-mode";
import { createId } from "@/shared/lib/utils";

import {
  isProductCategory,
  isProductUnit,
  sanitizeProduct,
} from "../lib/sanitize";
import { CUSTOM_SOURCE_KEY, CUSTOM_SOURCE_LABEL, STORAGE_KEY } from "./constants";
import {
  ProductApi,
  type ProductApiPayload,
  type ProductSourceApiItem,
} from "./api";
import { PRODUCT_CATEGORIES, PRODUCT_UNITS, type Product } from "./types";

type StoreSnapshot = {
  products: Product[];
};

export type ProductDraft = Omit<
  Product,
  "createdAt" | "id" | "isReadonly" | "sourceKey" | "sourceLabel"
>;

class ProductsStore {
  customProducts: Product[] = [];
  remoteProducts: Product[] = [];
  remoteProductSources: ProductSourceApiItem[] = [];
  isHydrated = false;
  isRemoteProductsLoading = false;
  remoteProductsError = "";
  private readonly storageKey: string;
  private readonly userId: string;
  private loadRequestId = 0;

  constructor(userId: string) {
    this.userId = userId;
    this.storageKey = `${STORAGE_KEY}:${userId}`;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get isLocal() {
    return isLocalUserId(this.userId);
  }

  hydrate() {
    if (this.isHydrated || typeof window === "undefined") {
      return;
    }

    try {
      const rawState = window.localStorage.getItem(this.storageKey);

      if (!rawState) {
        return;
      }

      const parsedState = JSON.parse(rawState) as Partial<StoreSnapshot>;

      this.customProducts = Array.isArray(parsedState.products)
        ? parsedState.products
            .map((product) => sanitizeProduct(product))
            .filter((product): product is Product => product !== null)
        : [];
    } catch {
      this.customProducts = [];
    } finally {
      this.isHydrated = true;
    }
  }

  persist() {
    if (!this.isHydrated || typeof window === "undefined") {
      return;
    }

    const snapshot: StoreSnapshot = {
      products: this.customProducts,
    };

    window.localStorage.setItem(this.storageKey, JSON.stringify(snapshot));
  }

  async loadRemoteProducts(params?: {
    search?: string;
    sources?: string[];
  }) {
    if (typeof window === "undefined") {
      return;
    }

    if (this.isLocal) {
      this.remoteProductsError =
        "В локальном режиме каталог Open Food Facts недоступен. Войдите в аккаунт.";
      this.isRemoteProductsLoading = false;
      return;
    }

    const requestId = ++this.loadRequestId;
    this.isRemoteProductsLoading = true;
    this.remoteProductsError = "";

    try {
      const [products, productSources] = await Promise.all([
        ProductApi.fetchProducts({
          limit: 50,
          search: params?.search,
          sources: params?.sources,
        }),
        ProductApi.fetchProductSources(),
      ]);

      if (requestId !== this.loadRequestId) {
        return;
      }

      const remoteProducts = products
        .map((product) => sanitizeProduct(product))
        .filter((product): product is Product => product !== null);

      runInAction(() => {
        this.remoteProducts = remoteProducts;
        this.remoteProductSources = productSources;
      });
    } catch (error) {
      if (requestId !== this.loadRequestId) {
        return;
      }

      runInAction(() => {
        this.remoteProductsError =
          error instanceof Error
            ? error.message
            : "Failed to load product catalog.";
      });
    } finally {
      if (requestId === this.loadRequestId) {
        runInAction(() => {
          this.isRemoteProductsLoading = false;
        });
      }
    }
  }

  async importFromCatalog(product: Product) {
    this.ensureHydrated();

    if (this.isLocal || product.sourceKey === CUSTOM_SOURCE_KEY) {
      return null;
    }

    const separatorIndex = product.id.indexOf(":");
    const externalId =
      separatorIndex > 0 ? product.id.slice(separatorIndex + 1) : product.id;

    const imported = await ProductApi.importProduct({
      externalId,
      sourceKey: product.sourceKey,
    });
    const sanitizedProduct = sanitizeProduct(imported);

    if (!sanitizedProduct) {
      return null;
    }

    runInAction(() => {
      this.remoteProducts = [
        sanitizedProduct,
        ...this.remoteProducts.filter((item) => item.id !== product.id),
      ];
    });

    return sanitizedProduct;
  }

  ensureHydrated() {
    if (!this.isHydrated) {
      this.hydrate();
    }
  }

  private buildProductPayload(draft: ProductDraft): ProductApiPayload | null {
    this.ensureHydrated();

    const name = draft.name.trim();

    if (!name) {
      return null;
    }

    return {
      amountUnit: isProductUnit(draft.amountUnit)
        ? draft.amountUnit
        : PRODUCT_UNITS[0],
      amountValue: normalizePositive(draft.amountValue, 100),
      calories: normalizeNonNegative(draft.calories),
      carbs: normalizeNonNegative(draft.carbs),
      category: isProductCategory(draft.category)
        ? draft.category
        : PRODUCT_CATEGORIES[PRODUCT_CATEGORIES.length - 1],
      fat: normalizeNonNegative(draft.fat),
      imageAlt: draft.imageAlt.trim() || name,
      imageUrl: draft.imageUrl.trim(),
      name,
      protein: normalizeNonNegative(draft.protein),
      visibility: draft.visibility === "public" ? "public" : "private",
    };
  }

  async addProduct(draft: ProductDraft) {
    const payload = this.buildProductPayload(draft);

    if (!payload) {
      return null;
    }

    if (this.isLocal) {
      const product = sanitizeProduct({
        ...payload,
        createdAt: new Date().toISOString(),
        id: createId(),
        isReadonly: false,
        sourceKey: CUSTOM_SOURCE_KEY,
        sourceLabel: CUSTOM_SOURCE_LABEL,
      });

      if (!product) {
        return null;
      }

      runInAction(() => {
        this.customProducts.unshift(product);
        this.persist();
      });

      return product;
    }

    const product = await ProductApi.createProduct(payload);
    const sanitizedProduct = sanitizeProduct(product);

    if (!sanitizedProduct) {
      return null;
    }

    runInAction(() => {
      this.remoteProducts.unshift(sanitizedProduct);
    });

    return sanitizedProduct;
  }

  async removeProduct(productId: string) {
    this.ensureHydrated();

    if (!this.isLocal) {
      const isRemoteProduct = this.remoteProducts.some(
        (product) => product.id === productId
      );
      const product = this.products.find((item) => item.id === productId);

      if (isRemoteProduct && product?.sourceKey === CUSTOM_SOURCE_KEY) {
        await ProductApi.removeProduct(productId);
      }
    }

    runInAction(() => {
      this.customProducts = this.customProducts.filter(
        (item) => item.id !== productId
      );
      this.remoteProducts = this.remoteProducts.filter(
        (item) => item.id !== productId
      );
      this.persist();
    });
  }

  get products() {
    const seenProductIds = new Set<string>();

    return [...this.customProducts, ...this.remoteProducts].filter((product) => {
      if (seenProductIds.has(product.id)) {
        return false;
      }

      seenProductIds.add(product.id);
      return true;
    });
  }
}

export const createProductsStore = (userId: string) => new ProductsStore(userId);
