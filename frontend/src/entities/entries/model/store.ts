import { makeAutoObservable, runInAction } from "mobx";

import {
  calculateEntryNutrition,
  normalizeServings,
} from "../lib/calculate-entry-nutrition";
import { sanitizeEntry } from "../lib/sanitize";
import { EntriesApi, type EntryApiPayload } from "./api";
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
  isRemoteEntriesLoading = false;
  remoteEntriesError = "";

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

    void this.loadEntries();
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

  async loadEntries() {
    if (typeof window === "undefined" || this.isRemoteEntriesLoading) {
      return;
    }

    this.isRemoteEntriesLoading = true;
    this.remoteEntriesError = "";

    try {
      const entries = await EntriesApi.fetchEntries({
        limit: 1000,
        offset: 0,
      });
      const sanitizedEntries = entries
        .map((entry) => sanitizeEntry(entry))
        .filter((entry): entry is DiaryEntry => entry !== null);

      runInAction(() => {
        this.entries = sanitizedEntries;
        this.persist();
      });
    } catch (error) {
      runInAction(() => {
        this.remoteEntriesError =
          error instanceof Error
            ? error.message
            : "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РґРЅРµРІРЅРёРє.";
      });
    } finally {
      runInAction(() => {
        this.isRemoteEntriesLoading = false;
      });
    }
  }

  private buildEntryPayload(
    product: EntryProduct,
    servings: number,
    mealType: MealType,
    date: string
  ): EntryApiPayload {
    const normalizedServings = normalizeServings(servings);
    const nutrition = calculateEntryNutrition(product, normalizedServings);

    return {
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
    };
  }

  async addEntry(
    product: EntryProduct,
    servings: number,
    mealType: MealType,
    date: string
  ) {
    this.ensureHydrated();

    const entry = await EntriesApi.createEntry(
      this.buildEntryPayload(product, servings, mealType, date)
    );

    runInAction(() => {
      this.entries.unshift(entry);
      this.persist();
    });
  }

  async updateEntry(
    entryId: string,
    product: EntryProduct,
    servings: number,
    mealType: MealType
  ) {
    this.ensureHydrated();

    const currentEntry = this.entries.find((entry) => entry.id === entryId);

    if (!currentEntry) {
      return;
    }

    const updatedEntry = await EntriesApi.updateEntry(
      entryId,
      this.buildEntryPayload(
        product,
        servings,
        mealType,
        currentEntry.date
      )
    );

    runInAction(() => {
      this.entries = this.entries.map((entry) =>
        entry.id === entryId ? updatedEntry : entry
      );
      this.persist();
    });
  }

  async removeEntry(entryId: string) {
    this.ensureHydrated();

    await EntriesApi.removeEntry(entryId);

    runInAction(() => {
      this.entries = this.entries.filter((entry) => entry.id !== entryId);
      this.persist();
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

export const createDiaryEntriesStore = () => new DiaryEntriesStore();
