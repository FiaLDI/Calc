import { fetchFromApi } from "@/shared/api/client";

import type { DiaryEntry } from "./types";

export type EntryApiEntry = DiaryEntry;

export type EntryApiPayload = Omit<DiaryEntry, "createdAt" | "id">;

type EntriesApiResponse = {
  data: EntryApiEntry[];
};

type EntryApiResponse = {
  data: EntryApiEntry;
};

type FetchEntriesParams = {
  date?: string;
};

const buildEntriesEndpoint = (params?: FetchEntriesParams) => {
  if (!params?.date) {
    return "entries";
  }

  const searchParams = new URLSearchParams({
    date: params.date,
  });

  return `entries?${searchParams.toString()}`;
};

export const EntriesApi = {
  async fetchEntries(params?: FetchEntriesParams): Promise<EntryApiEntry[]> {
    const response = await fetchFromApi<EntriesApiResponse>(
      buildEntriesEndpoint(params)
    );

    return response.data;
  },

  async createEntry(entryData: EntryApiPayload): Promise<EntryApiEntry> {
    const response = await fetchFromApi<EntryApiResponse, EntryApiPayload>(
      "entries",
      {
        body: entryData,
        method: "POST",
      }
    );

    return response.data;
  },

  async updateEntry(
    id: string,
    entryData: EntryApiPayload
  ): Promise<EntryApiEntry> {
    const response = await fetchFromApi<EntryApiResponse, EntryApiPayload>(
      `entries/${id}`,
      {
        body: entryData,
        method: "PUT",
      }
    );

    return response.data;
  },

  async removeEntry(id: string): Promise<void> {
    await fetchFromApi<void>(`entries/${id}`, {
      method: "DELETE",
    });
  },
};
