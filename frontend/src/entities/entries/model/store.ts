import { makeAutoObservable } from "mobx";

import { createId } from "@/shared/lib/utils";

import {
  calculateEntryNutrition,
  normalizeServings,
} from "../lib/calculate-entry-nutrition";
import { sanitizeEntry } from "../lib/sanitize";
import { STORAGE_KEY } from "./constants";
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
  EntryProduct,
  MacroTargets,
  MealType,
  WeeklyDay,
} from "./types";

type StoreSnapshot = {
  entries: DiaryEntry[];
};

class DiaryEntriesStore {
  entries: DiaryEntry[] = [];
  isHydrated = false;

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
    } catch {
      this.entries = [];
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
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  ensureHydrated() {
    if (!this.isHydrated) {
      this.hydrate();
    }
  }

  addEntry(
    product: EntryProduct,
    servings: number,
    mealType: MealType,
    date: string
  ) {
    this.ensureHydrated();

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
    product: EntryProduct,
    servings: number,
    mealType: MealType
  ) {
    this.ensureHydrated();

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

export const createDiaryEntriesStore = () => new DiaryEntriesStore();
