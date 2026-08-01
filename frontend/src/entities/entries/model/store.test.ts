import { afterEach, describe, expect, it, vi } from "vitest";

import { EntriesApi } from "./api";
import { STORAGE_KEY } from "./constants";
import { createDiaryEntriesStore } from "./store";

vi.mock("./api", () => ({
  EntriesApi: {
    fetchEntries: vi.fn(),
    createEntry: vi.fn(),
    updateEntry: vi.fn(),
    removeEntry: vi.fn(),
  },
}));

const remoteEntry = {
  id: "server-1",
  productId: "p1",
  productName: "Овсянка",
  productImageAlt: "Овсянка",
  productImageUrl: "",
  amountValue: 100,
  amountUnit: "г" as const,
  servings: 1,
  mealType: "Завтрак" as const,
  date: "2026-08-01",
  calories: 350,
  protein: 12,
  fat: 7,
  carbs: 60,
  createdAt: "2026-08-01T08:00:00.000Z",
};

describe("DiaryEntriesStore hydrate sync", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("loads remote entries when localStorage is empty", async () => {
    vi.mocked(EntriesApi.fetchEntries).mockResolvedValue([remoteEntry]);

    const store = createDiaryEntriesStore("user-1");
    store.hydrate();

    await vi.waitFor(() => {
      expect(EntriesApi.fetchEntries).toHaveBeenCalled();
      expect(store.entries).toHaveLength(1);
      expect(store.entries[0]?.id).toBe("server-1");
    });
  });

  it("replaces stale local cache with remote entries", async () => {
    localStorage.setItem(
      `${STORAGE_KEY}:user-1`,
      JSON.stringify({
        entries: [
          {
            ...remoteEntry,
            id: "stale-local",
            productName: "Старая запись",
            calories: 1,
          },
        ],
      })
    );
    vi.mocked(EntriesApi.fetchEntries).mockResolvedValue([remoteEntry]);

    const store = createDiaryEntriesStore("user-1");
    store.hydrate();

    expect(store.entries[0]?.id).toBe("stale-local");

    await vi.waitFor(() => {
      expect(store.entries).toHaveLength(1);
      expect(store.entries[0]?.id).toBe("server-1");
      expect(store.entries[0]?.calories).toBe(350);
    });
  });

  it("does not call API in local mode", async () => {
    const store = createDiaryEntriesStore("local");
    store.hydrate();

    await Promise.resolve();

    expect(EntriesApi.fetchEntries).not.toHaveBeenCalled();
    expect(store.entries).toEqual([]);
  });
});
