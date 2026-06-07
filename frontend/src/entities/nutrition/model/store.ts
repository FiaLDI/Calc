import { makeAutoObservable, runInAction } from "mobx";
import { fetchProductsFromApi } from "@/shared/api/products";

import {
  addDays,
  formatDateKey,
  formatLongDay,
  formatShortDay,
  isValidDateKey,
  parseDateKey,
} from "../lib/date";
import {
  normalizeNonNegative,
  normalizePositive,
  roundToOneDecimal,
} from "../lib/number";
import {
  DEFAULT_NUTRITION_GOAL,
  DEFAULT_TARGET_CALORIES,
  DEFAULT_TARGET_CARBS,
  DEFAULT_TARGET_FAT,
  DEFAULT_TARGET_PROTEIN,
  DEFAULT_TARGET_WEIGHT_KG,
  STORAGE_KEY,
} from "./constants";
import {
  MEAL_TYPES,
  NUTRITION_GOALS,
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  type DiaryEntry,
  type MealType,
  type NutritionGoal,
  type Product,
  type ProductCategory,
  type ProductUnit,
} from "./types";

type StoreSnapshot = {
  entries: DiaryEntry[];
  products: Product[];
  selectedDate: string;
  nutritionGoal: NutritionGoal;
  targetCarbs: number;
  targetCalories: number;
  targetFat: number;
  targetProtein: number;
  targetWeightKg: number;
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
const DEFAULT_GOAL = DEFAULT_NUTRITION_GOAL as NutritionGoal;
const NUTRITION_GOAL_SETTINGS: Record<
  NutritionGoal,
  {
    caloriesPerKg: number;
    fatPerKg: number;
    proteinPerKg: number;
  }
> = {
  Сушка: {
    caloriesPerKg: 28,
    fatPerKg: 0.8,
    proteinPerKg: 2.1,
  },
  Поддержание: {
    caloriesPerKg: 32,
    fatPerKg: 0.9,
    proteinPerKg: 1.7,
  },
  Набор: {
    caloriesPerKg: 36,
    fatPerKg: 1,
    proteinPerKg: 1.9,
  },
};

const isProductUnit = (value: unknown): value is ProductUnit =>
  typeof value === "string" &&
  (PRODUCT_UNITS as readonly string[]).includes(value);

const isProductCategory = (value: unknown): value is ProductCategory =>
  typeof value === "string" &&
  (PRODUCT_CATEGORIES as readonly string[]).includes(value);

const isMealType = (value: unknown): value is MealType =>
  typeof value === "string" && (MEAL_TYPES as readonly string[]).includes(value);

const isNutritionGoal = (value: unknown): value is NutritionGoal =>
  typeof value === "string" &&
  (NUTRITION_GOALS as readonly string[]).includes(value);

const normalizeOptionalString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const normalizeTimestamp = (value: unknown) =>
  typeof value === "string" && !Number.isNaN(Date.parse(value))
    ? value
    : new Date().toISOString();

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

class NutritionStore {
  entries: DiaryEntry[] = [];
  customProducts: Product[] = [];
  remoteProducts: Product[] = [];
  selectedDate: string;
  todayDateKey: string;
  targetCalories = DEFAULT_TARGET_CALORIES;
  targetProtein = DEFAULT_TARGET_PROTEIN;
  targetCarbs = DEFAULT_TARGET_CARBS;
  targetFat = DEFAULT_TARGET_FAT;
  targetWeightKg = DEFAULT_TARGET_WEIGHT_KG;
  nutritionGoal = DEFAULT_GOAL;
  isHydrated = false;
  isRemoteProductsLoading = false;
  remoteProductsError = "";

  constructor(initialDateKey = formatDateKey(new Date())) {
    this.selectedDate = initialDateKey;
    this.todayDateKey = initialDateKey;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  hydrate() {
    if (this.isHydrated || typeof window === "undefined") {
      return;
    }

    try {
      this.todayDateKey = formatDateKey(new Date());
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
      this.selectedDate = isValidDateKey(parsedState.selectedDate)
        ? parsedState.selectedDate
        : this.selectedDate;
      this.targetCalories = normalizePositive(
        parsedState.targetCalories ?? 0,
        DEFAULT_TARGET_CALORIES
      );
      this.targetProtein = normalizePositive(
        parsedState.targetProtein ?? 0,
        DEFAULT_TARGET_PROTEIN
      );
      this.targetCarbs = normalizePositive(
        parsedState.targetCarbs ?? 0,
        DEFAULT_TARGET_CARBS
      );
      this.targetFat = normalizePositive(
        parsedState.targetFat ?? 0,
        DEFAULT_TARGET_FAT
      );
      this.targetWeightKg = normalizePositive(
        parsedState.targetWeightKg ?? 0,
        DEFAULT_TARGET_WEIGHT_KG
      );
      this.nutritionGoal = isNutritionGoal(parsedState.nutritionGoal)
        ? parsedState.nutritionGoal
        : DEFAULT_GOAL;
    } catch {
      this.entries = [];
      this.customProducts = [];
      this.todayDateKey = formatDateKey(new Date());
      this.selectedDate = this.todayDateKey;
      this.targetCalories = DEFAULT_TARGET_CALORIES;
      this.targetProtein = DEFAULT_TARGET_PROTEIN;
      this.targetCarbs = DEFAULT_TARGET_CARBS;
      this.targetFat = DEFAULT_TARGET_FAT;
      this.targetWeightKg = DEFAULT_TARGET_WEIGHT_KG;
      this.nutritionGoal = DEFAULT_GOAL;
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
      nutritionGoal: this.nutritionGoal,
      products: this.customProducts,
      selectedDate: this.selectedDate,
      targetCarbs: this.targetCarbs,
      targetCalories: this.targetCalories,
      targetFat: this.targetFat,
      targetProtein: this.targetProtein,
      targetWeightKg: this.targetWeightKg,
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

  setSelectedDate(dateKey: string) {
    this.ensureHydrated();

    if (!isValidDateKey(dateKey)) {
      return;
    }

    const normalizedDateKey =
      parseDateKey(dateKey).getTime() > parseDateKey(this.todayDateKey).getTime()
        ? this.todayDateKey
        : dateKey;

    this.selectedDate = normalizedDateKey;
    this.persist();
  }

  selectPreviousDay() {
    this.ensureHydrated();
    this.setSelectedDate(
      formatDateKey(addDays(parseDateKey(this.selectedDate), -1))
    );
  }

  selectNextDay() {
    this.ensureHydrated();
    if (!this.canSelectNextDay) {
      return;
    }

    this.setSelectedDate(
      formatDateKey(addDays(parseDateKey(this.selectedDate), 1))
    );
  }

  selectToday() {
    this.ensureHydrated();
    this.setSelectedDate(this.todayDateKey);
  }

  setTargetCalories(value: number) {
    this.ensureHydrated();
    this.targetCalories = normalizePositive(Math.round(value), 1);
    this.persist();
  }

  setNutritionTargets(targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    goal?: NutritionGoal;
    weightKg?: number;
  }) {
    this.ensureHydrated();
    this.targetCalories = normalizePositive(Math.round(targets.calories), 1);
    this.targetProtein = normalizePositive(targets.protein, 1);
    this.targetCarbs = normalizePositive(targets.carbs, 1);
    this.targetFat = normalizePositive(targets.fat, 1);
    this.targetWeightKg = normalizePositive(
      targets.weightKg ?? this.targetWeightKg,
      DEFAULT_TARGET_WEIGHT_KG
    );
    this.nutritionGoal = isNutritionGoal(targets.goal)
      ? targets.goal
      : this.nutritionGoal;
    this.persist();
  }

  calculateNutritionTargets(weightKg: number, goal: NutritionGoal) {
    const normalizedWeight = normalizePositive(weightKg, DEFAULT_TARGET_WEIGHT_KG);
    const settings = NUTRITION_GOAL_SETTINGS[goal];
    const calories = Math.round(normalizedWeight * settings.caloriesPerKg);
    const protein = Math.round(normalizedWeight * settings.proteinPerKg);
    const fat = Math.round(normalizedWeight * settings.fatPerKg);
    const carbs = Math.max(
      1,
      Math.round((calories - protein * 4 - fat * 9) / 4)
    );

    return {
      calories,
      protein,
      carbs,
      fat,
    };
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

  addEntry(productId: string, servings: number, mealType: MealType) {
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
      date: this.selectedDate,
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

  get canSelectNextDay() {
    return (
      parseDateKey(this.selectedDate).getTime() <
      parseDateKey(this.todayDateKey).getTime()
    );
  }

  get calendarDays() {
    const selectedDate = parseDateKey(this.selectedDate);
    const today = parseDateKey(this.todayDateKey);
    const suggestedEndDate = addDays(selectedDate, 3);
    const endDate =
      suggestedEndDate.getTime() > today.getTime() ? today : suggestedEndDate;

    return Array.from({ length: 7 }, (_, index) => {
      const dateKey = formatDateKey(addDays(endDate, index - 6));

      return {
        dateKey,
        shortLabel: formatShortDay(dateKey),
        longLabel: formatLongDay(dateKey),
      };
    });
  }

  get selectedEntries() {
    return this.entries
      .filter((entry) => entry.date === this.selectedDate)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  get selectedDayTotals() {
    return this.selectedEntries.reduce(
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

  get macroTargets() {
    return {
      protein: this.targetProtein,
      carbs: this.targetCarbs,
      fat: this.targetFat,
    };
  }

  get macroProgress() {
    const targets = this.macroTargets;
    const totals = this.selectedDayTotals;

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

  get weeklyDays() {
    return this.calendarDays.map(({ dateKey, shortLabel }) => ({
      dateKey,
      day: shortLabel,
    }));
  }

  get weeklyCalories() {
    return this.weeklyDays.map(({ dateKey, day }) => {
      const dayCalories = this.entries
        .filter((entry) => entry.date === dateKey)
        .reduce((sum, entry) => sum + entry.calories, 0);

      return {
        day,
        calories: dayCalories,
      };
    });
  }

  get weeklyKbju() {
    return this.weeklyDays.map(({ dateKey, day }) => {
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

  get weeklyCaloriesStats() {
    const calories = this.weeklyCalories.map((item) => item.calories);

    return {
      average: calories.length
        ? Math.round(
            calories.reduce((sum, value) => sum + value, 0) / calories.length
          )
        : 0,
      max: calories.length ? Math.max(...calories) : 0,
      min: calories.length ? Math.min(...calories) : 0,
    };
  }
}

export const createNutritionStore = (initialDateKey?: string) =>
  new NutritionStore(initialDateKey);
