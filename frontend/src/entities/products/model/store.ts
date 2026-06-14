import { makeAutoObservable, runInAction } from "mobx";
import { fetchProductsFromApi } from "@/shared/api/products";

import {
  isValidDateKey,
  normalizeNonNegative,
  normalizePositive,
  roundToOneDecimal,
  normalizeTimestamp,
} from "@/shared/lib/format";
import {
  MEAL_TYPES,
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  type DiaryEntry,
  type MealType,
  type Product,
  type ProductCategory,
  type ProductUnit,
} from "./types";
import { createId } from "@/shared/lib/utils";
import { STORAGE_KEY } from "./constants";

type StoreSnapshot = {
  entries: DiaryEntry[];
  products: Product[];
};

type ProductDraft = Omit<
  Product,
  "createdAt" | "id" | "isReadonly" | "sourceKey" | "sourceLabel"
>;

const CUSTOM_SOURCE_KEY = "custom";
const CUSTOM_SOURCE_LABEL = "Мои продукты";
const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "Другое";
const DEFAULT_PRODUCT_UNIT: ProductUnit = "г";
const DEFAULT_MEAL_TYPE: MealType = "Завтрак";


const isProductUnit = (value: unknown): value is ProductUnit =>
  typeof value === "string" &&
  (PRODUCT_UNITS as readonly string[]).includes(value);

const isProductCategory = (value: unknown): value is ProductCategory =>
  typeof value === "string" &&
  (PRODUCT_CATEGORIES as readonly string[]).includes(value);

const isMealType = (value: unknown): value is MealType =>
  typeof value === "string" && (MEAL_TYPES as readonly string[]).includes(value);

const normalizeOptionalString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const sanitizeProduct = (value: unknown): Product | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Product>;
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";

  if (!name) {
    return null;
  }

  return {
    id:
      typeof candidate.id === "string" && candidate.id.trim()
        ? candidate.id
        : createId(),
    name,
    category: isProductCategory(candidate.category)
      ? candidate.category
      : DEFAULT_PRODUCT_CATEGORY,
    amountValue: normalizePositive(candidate.amountValue ?? 0, 100),
    amountUnit: isProductUnit(candidate.amountUnit)
      ? candidate.amountUnit
      : DEFAULT_PRODUCT_UNIT,
    calories: normalizeNonNegative(candidate.calories ?? 0),
    protein: normalizeNonNegative(candidate.protein ?? 0),
    carbs: normalizeNonNegative(candidate.carbs ?? 0),
    fat: normalizeNonNegative(candidate.fat ?? 0),
    createdAt: normalizeTimestamp(candidate.createdAt),
    imageAlt: normalizeOptionalString(candidate.imageAlt) || name,
    imageUrl: normalizeOptionalString(candidate.imageUrl),
    sourceKey:
      typeof candidate.sourceKey === "string" && candidate.sourceKey.trim()
        ? candidate.sourceKey
        : CUSTOM_SOURCE_KEY,
    sourceLabel:
      typeof candidate.sourceLabel === "string" && candidate.sourceLabel.trim()
        ? candidate.sourceLabel
        : CUSTOM_SOURCE_LABEL,
    isReadonly: candidate.isReadonly === true,
  };
};

const sanitizeEntry = (value: unknown): DiaryEntry | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<DiaryEntry>;
  const productName =
    typeof candidate.productName === "string" ? candidate.productName.trim() : "";

  if (!productName || !isValidDateKey(candidate.date)) {
    return null;
  }

  return {
    id:
      typeof candidate.id === "string" && candidate.id.trim()
        ? candidate.id
        : createId(),
    productId:
      typeof candidate.productId === "string" ? candidate.productId : "",
    productName,
    productImageAlt:
      normalizeOptionalString(candidate.productImageAlt) || productName,
    productImageUrl: normalizeOptionalString(candidate.productImageUrl),
    amountValue: normalizePositive(candidate.amountValue ?? 0, 100),
    amountUnit: isProductUnit(candidate.amountUnit)
      ? candidate.amountUnit
      : DEFAULT_PRODUCT_UNIT,
    servings: normalizePositive(candidate.servings ?? 0, 1),
    mealType: isMealType(candidate.mealType)
      ? candidate.mealType
      : DEFAULT_MEAL_TYPE,
    date: candidate.date,
    calories: normalizeNonNegative(candidate.calories ?? 0),
    protein: normalizeNonNegative(candidate.protein ?? 0),
    carbs: normalizeNonNegative(candidate.carbs ?? 0),
    fat: normalizeNonNegative(candidate.fat ?? 0),
    createdAt: normalizeTimestamp(candidate.createdAt),
  };
};

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
        .map((product) =>
          sanitizeProduct({
            ...product,
            isReadonly: true,
          })
        )
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
    const product: Product = {
      ...draft,
      id: createId(),
      name: draft.name.trim(),
      category: isProductCategory(draft.category)
        ? draft.category
        : DEFAULT_PRODUCT_CATEGORY,
      amountValue: normalizePositive(draft.amountValue, 100),
      calories: normalizeNonNegative(draft.calories),
      protein: normalizeNonNegative(draft.protein),
      carbs: normalizeNonNegative(draft.carbs),
      fat: normalizeNonNegative(draft.fat),
      createdAt: new Date().toISOString(),
      imageAlt: draft.imageAlt.trim() || draft.name.trim(),
      imageUrl: draft.imageUrl.trim(),
      sourceKey: CUSTOM_SOURCE_KEY,
      sourceLabel: CUSTOM_SOURCE_LABEL,
      isReadonly: false,
    };

    if (!product.name) {
      return;
    }

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

    const normalizedServings = Math.max(
      0.1,
      roundToOneDecimal(servings || 1)
    );

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
      date: date,
      calories: Math.round(product.calories * normalizedServings),
      protein: roundToOneDecimal(product.protein * normalizedServings),
      carbs: roundToOneDecimal(product.carbs * normalizedServings),
      fat: roundToOneDecimal(product.fat * normalizedServings),
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

    const normalizedServings = Math.max(
      0.1,
      roundToOneDecimal(servings || 1)
    );

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
            calories: Math.round(product.calories * normalizedServings),
            protein: roundToOneDecimal(product.protein * normalizedServings),
            carbs: roundToOneDecimal(product.carbs * normalizedServings),
            fat: roundToOneDecimal(product.fat * normalizedServings),
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
    return this.entries
      .filter((entry) => entry.date === date)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  selectedDayTotals(date: string): {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
  } {
    return this.selectedEntries(date).reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        protein: totals.protein + entry.protein,
        carbs: totals.carbs + entry.carbs,
        fat: totals.fat + entry.fat,
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );
  }

  macroProgress(macroTargets:  {
        protein: number;
        carbs: number;
        fat: number;
    }, date: string) {
    const targets = macroTargets;
    const totals = this.selectedDayTotals(date);

    return [
      {
        title: "Белки",
        consumed: totals.protein,
        target: targets.protein,
        percentage: Math.min(
          100,
          Math.round((totals.protein / targets.protein) * 100) || 0
        ),
        colorClass: "bg-emerald-500",
      },
      {
        title: "Углеводы",
        consumed: totals.carbs,
        target: targets.carbs,
        percentage: Math.min(
          100,
          Math.round((totals.carbs / targets.carbs) * 100) || 0
        ),
        colorClass: "bg-orange-500",
      },
      {
        title: "Жиры",
        consumed: totals.fat,
        target: targets.fat,
        percentage: Math.min(
          100,
          Math.round((totals.fat / targets.fat) * 100) || 0
        ),
        colorClass: "bg-rose-500",
      },
    ];
  }

  weeklyCalories(weeklyDays: any) {
    return weeklyDays.map(({ dateKey, day } : any) => {
      const dayCalories = this.entries
        .filter((entry) => entry.date === dateKey)
        .reduce((sum, entry) => sum + entry.calories, 0);

      return {
        day,
        calories: dayCalories,
      };
    });
  }

  weeklyKbju(weeklyDays: any) {
    return weeklyDays.map(({ dateKey, day } : any) => {
      const totals = this.entries
        .filter((entry) => entry.date === dateKey)
        .reduce(
          (sum, entry) => ({
            calories: sum.calories + entry.calories,
            protein: sum.protein + entry.protein,
            fat: sum.fat + entry.fat,
            carbs: sum.carbs + entry.carbs,
          }),
          {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
          }
        );

      return {
        day,
        ...totals,
      };
    });
  }

  weeklyCaloriesStats(weeklyDays: any) {
    const calories = this.weeklyCalories(weeklyDays).map((item: any) => item.calories);

    return {
      average: calories.length
        ? Math.round(
            calories.reduce((sum: any, value: any) => sum + value, 0) / calories.length
          )
        : 0,
      max: calories.length ? Math.max(...calories) : 0,
      min: calories.length ? Math.min(...calories) : 0,
    };
  }
}

export const createProductsStore = () =>
  new ProductsStore();
