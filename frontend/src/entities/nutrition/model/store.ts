import { makeAutoObservable } from "mobx";

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
import { DEFAULT_TARGET_CALORIES, STORAGE_KEY } from "./constants";
import type { DiaryEntry, MealType, Product } from "./types";

type StoreSnapshot = {
  entries: DiaryEntry[];
  products: Product[];
  selectedDate: string;
  targetCalories: number;
};

type ProductDraft = Omit<Product, "createdAt" | "id">;

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
    amountValue: normalizePositive(candidate.amountValue ?? 0, 100),
    amountUnit:
      candidate.amountUnit === "г" ||
      candidate.amountUnit === "мл" ||
      candidate.amountUnit === "шт" ||
      candidate.amountUnit === "порция"
        ? candidate.amountUnit
        : "г",
    calories: normalizeNonNegative(candidate.calories ?? 0),
    protein: normalizeNonNegative(candidate.protein ?? 0),
    carbs: normalizeNonNegative(candidate.carbs ?? 0),
    fat: normalizeNonNegative(candidate.fat ?? 0),
    createdAt: normalizeTimestamp(candidate.createdAt),
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
    amountValue: normalizePositive(candidate.amountValue ?? 0, 100),
    amountUnit:
      candidate.amountUnit === "г" ||
      candidate.amountUnit === "мл" ||
      candidate.amountUnit === "шт" ||
      candidate.amountUnit === "порция"
        ? candidate.amountUnit
        : "г",
    servings: normalizePositive(candidate.servings ?? 0, 1),
    mealType:
      candidate.mealType === "Завтрак" ||
      candidate.mealType === "Обед" ||
      candidate.mealType === "Ужин" ||
      candidate.mealType === "Перекус"
        ? candidate.mealType
        : "Завтрак",
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
  products: Product[] = [];
  selectedDate: string;
  targetCalories = DEFAULT_TARGET_CALORIES;
  isHydrated = false;

  constructor(initialDateKey = formatDateKey(new Date())) {
    this.selectedDate = initialDateKey;
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
      this.products = Array.isArray(parsedState.products)
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
    } catch {
      this.entries = [];
      this.products = [];
      this.selectedDate = formatDateKey(new Date());
      this.targetCalories = DEFAULT_TARGET_CALORIES;
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
      products: this.products,
      selectedDate: this.selectedDate,
      targetCalories: this.targetCalories,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
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

  addProduct(draft: ProductDraft) {
    this.ensureHydrated();
    const product: Product = {
      ...draft,
      id: createId(),
      name: draft.name.trim(),
      amountValue: normalizePositive(draft.amountValue, 100),
      calories: normalizeNonNegative(draft.calories),
      protein: normalizeNonNegative(draft.protein),
      carbs: normalizeNonNegative(draft.carbs),
      fat: normalizeNonNegative(draft.fat),
      createdAt: new Date().toISOString(),
    };

    if (!product.name) {
      return;
    }

    this.products.unshift(product);
    this.persist();
  }

  removeProduct(productId: string) {
    this.ensureHydrated();
    this.products = this.products.filter((product) => product.id !== productId);
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

  removeEntry(entryId: string) {
    this.ensureHydrated();
    this.entries = this.entries.filter((entry) => entry.id !== entryId);
    this.persist();
  }

  get todayDateKey() {
    return formatDateKey(new Date());
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
      protein: Math.round((this.targetCalories * 0.3) / 4),
      carbs: Math.round((this.targetCalories * 0.4) / 4),
      fat: Math.round((this.targetCalories * 0.3) / 9),
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
