import { makeAutoObservable } from "mobx";

import {
  addDays,
  formatDateKey,
  formatLongDay,
  formatShortDay,
  isValidDateKey,
  parseDateKey,
} from "@/shared/lib/format";

import { STORAGE_KEY } from "./constants";
import type { CalendarDay, WeeklyDay } from "./types";

type StoreSnapshot = {
  selectedDate: string;
};

class DateStore {
  selectedDate: string;
  todayDateKey: string;
  isHydrated = false;
  private readonly storageKey: string;

  constructor(userId: string, initialDateKey = formatDateKey(new Date())) {
    this.storageKey = `${STORAGE_KEY}:${userId}`;
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
      const rawState = window.localStorage.getItem(this.storageKey);

      if (!rawState) {
        return;
      }

      const parsedState = JSON.parse(rawState) as Partial<StoreSnapshot>;

      this.selectedDate = isValidDateKey(parsedState.selectedDate)
        ? parsedState.selectedDate
        : this.selectedDate;
    } catch {
      this.todayDateKey = formatDateKey(new Date());
      this.selectedDate = this.todayDateKey;
    } finally {
      this.isHydrated = true;
    }
  }

  persist() {
    if (!this.isHydrated || typeof window === "undefined") {
      return;
    }

    const snapshot: StoreSnapshot = {
      selectedDate: this.selectedDate,
    };

    window.localStorage.setItem(this.storageKey, JSON.stringify(snapshot));
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

  get canSelectNextDay() {
    return (
      parseDateKey(this.selectedDate).getTime() <
      parseDateKey(this.todayDateKey).getTime()
    );
  }

  get calendarDays(): CalendarDay[] {
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

  get weeklyDays(): WeeklyDay[] {
    return this.calendarDays.map(({ dateKey, shortLabel }) => ({
      dateKey,
      day: shortLabel,
    }));
  }
}

export const createDateStore = (userId: string, initialDateKey?: string) =>
  new DateStore(userId, initialDateKey);
