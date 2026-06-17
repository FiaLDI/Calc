import { makeAutoObservable, runInAction } from "mobx";

import { normalizeNonNegative, normalizePositive } from "@/shared/lib/format";
import { createId } from "@/shared/lib/utils";

import {
  isProductCategory,
  isProductUnit,
  sanitizeProduct,
} from "../lib/sanitize";
import { CUSTOM_SOURCE_KEY, CUSTOM_SOURCE_LABEL, STORAGE_KEY } from "./constants";
import { ProductApi } from "./api";
import type { Product } from "./types";

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
  isHydrated = false;
  isRemoteProductsLoading = false;
  remoteProductsError = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  hydrate() {
    if (this.isHydrated || typeof window === "undefined") {
      return;
    }

    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);

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

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  async loadRemoteProducts() {
    if (typeof window === "undefined" || this.isRemoteProductsLoading) {
      return;
    }

    this.isRemoteProductsLoading = true;
    this.remoteProductsError = "";

    try {
      const products = await ProductApi.fetchProducts();
      const remoteProducts = products
        .map((product) => sanitizeProduct({ ...product, isReadonly: true }))
        .filter((product): product is Product => product !== null);

      runInAction(() => {
        this.remoteProducts = remoteProducts;
      });
    } catch (error) {
      runInAction(() => {
        this.remoteProductsError =
          error instanceof Error
            ? error.message
            : "Не удалось загрузить каталог продуктов.";
      });
    } finally {
      runInAction(() => {
        this.isRemoteProductsLoading = false;
      });
    }
  }

  ensureHydrated() {
    if (!this.isHydrated) {
      this.hydrate();
    }
  }

  addProduct(draft: ProductDraft) {
    this.ensureHydrated();

    const name = draft.name.trim();

    if (!name) {
      return;
    }

    const product: Product = {
      ...draft,
      id: createId(),
      name,
      category: isProductCategory(draft.category) ? draft.category : "Другое",
      amountValue: normalizePositive(draft.amountValue, 100),
      amountUnit: isProductUnit(draft.amountUnit) ? draft.amountUnit : "г",
      calories: normalizeNonNegative(draft.calories),
      protein: normalizeNonNegative(draft.protein),
      carbs: normalizeNonNegative(draft.carbs),
      fat: normalizeNonNegative(draft.fat),
      createdAt: new Date().toISOString(),
      imageAlt: draft.imageAlt.trim() || name,
      imageUrl: draft.imageUrl.trim(),
      sourceKey: CUSTOM_SOURCE_KEY,
      sourceLabel: CUSTOM_SOURCE_LABEL,
      isReadonly: false,
    };

    this.customProducts.unshift(product);
    this.persist();
  }

  removeProduct(productId: string) {
    this.ensureHydrated();
    this.customProducts = this.customProducts.filter(
      (product) => product.id !== productId
    );
    this.persist();
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

export const createProductsStore = () => new ProductsStore();
