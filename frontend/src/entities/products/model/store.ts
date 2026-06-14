import { makeAutoObservable, runInAction } from "mobx";

import { fetchProductsFromApi } from "@/shared/api/products";
import { normalizeNonNegative, normalizePositive } from "@/shared/lib/format";
import { createId } from "@/shared/lib/utils";

import {
  calculateEntryNutrition,
  normalizeServings,
} from "../lib/calculate-entry-nutrition";
import {
  isProductCategory,
  isProductUnit,
  sanitizeEntry,
  sanitizeProduct,
} from "../lib/sanitize";
import { CUSTOM_SOURCE_KEY, CUSTOM_SOURCE_LABEL, STORAGE_KEY } from "./constants";
import {
  getDayTotals,
  getEntriesByDate,
  getMacroProgress,
  getWeeklyCalories,
  getWeeklyCaloriesStats,
  getWeeklyKbju,
} from "./selectors";
import type {
  DiaryEntry,
  MacroTargets,
  MealType,
  Product,
  WeeklyDay,
} from "./types";

type StoreSnapshot = {
  entries: DiaryEntry[];
  products: Product[];
};

export type ProductDraft = Omit<
  Product,
  "createdAt" | "id" | "isReadonly" | "sourceKey" | "sourceLabel"
>;

class ProductsStore {
  entries: DiaryEntry[] = [];
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

      this.entries = Array.isArray(parsedState.entries)
        ? parsedState.entries
            .map((entry) => sanitizeEntry(entry))
            .filter((entry): entry is DiaryEntry => entry !== null)
        : [];
      this.customProducts = Array.isArray(parsedState.products)
        ? parsedState.products
            .map((product) => sanitizeProduct(product))
            .filter((product): product is Product => product !== null)
        : [];
    } catch {
      this.entries = [];
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
      entries: this.entries,
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
      const products = await fetchProductsFromApi();
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

  addEntry(productId: string, servings: number, mealType: MealType, date: string) {
    this.ensureHydrated();
    const product = this.products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const normalizedServings = normalizeServings(servings);
    const nutrition = calculateEntryNutrition(product, normalizedServings);
    const entry: DiaryEntry = {
      id: createId(),
      productId: product.id,
      productName: product.name,
      productImageAlt: product.imageAlt || product.name,
      productImageUrl: product.imageUrl,
      amountValue: product.amountValue,
      amountUnit: product.amountUnit,
      servings: normalizedServings,
      mealType,
      date,
      ...nutrition,
      createdAt: new Date().toISOString(),
    };

    this.entries.unshift(entry);
    this.persist();
  }

  updateEntry(
    entryId: string,
    productId: string,
    servings: number,
    mealType: MealType
  ) {
    this.ensureHydrated();
    const product = this.products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const normalizedServings = normalizeServings(servings);
    const nutrition = calculateEntryNutrition(product, normalizedServings);

    this.entries = this.entries.map((entry) =>
      entry.id === entryId
        ? {
            ...entry,
            productId: product.id,
            productName: product.name,
            productImageAlt: product.imageAlt || product.name,
            productImageUrl: product.imageUrl,
            amountValue: product.amountValue,
            amountUnit: product.amountUnit,
            servings: normalizedServings,
            mealType,
            ...nutrition,
          }
        : entry
    );
    this.persist();
  }

  removeEntry(entryId: string) {
    this.ensureHydrated();
    this.entries = this.entries.filter((entry) => entry.id !== entryId);
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

  selectedEntries(date: string) {
    return getEntriesByDate(this.entries, date);
  }

  selectedDayTotals(date: string) {
    return getDayTotals(this.entries, date);
  }

  macroProgress(macroTargets: MacroTargets, date: string) {
    return getMacroProgress(this.entries, macroTargets, date);
  }

  weeklyCalories(weeklyDays: WeeklyDay[]) {
    return getWeeklyCalories(this.entries, weeklyDays);
  }

  weeklyKbju(weeklyDays: WeeklyDay[]) {
    return getWeeklyKbju(this.entries, weeklyDays);
  }

  weeklyCaloriesStats(weeklyDays: WeeklyDay[]) {
    return getWeeklyCaloriesStats(this.entries, weeklyDays);
  }
}

export const createProductsStore = () => new ProductsStore();
