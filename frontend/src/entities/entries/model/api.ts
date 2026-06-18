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
  limit?: number;
  offset?: number;
};

const buildEntriesEndpoint = (params?: FetchEntriesParams) => {
  const searchParams = new URLSearchParams();

  if (params?.date) {
    searchParams.set("date", params.date);
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.offset !== undefined) {
    searchParams.set("offset", String(params.offset));
  }

  const queryString = searchParams.toString();
  return queryString ? `entries?${queryString}` : "entries";
};

export const EntriesApi = {
  async fetchEntries(params?: FetchEntriesParams): Promise<EntryApiEntry[]> {
    const response = await fetchFromApi<EntriesApiResponse>(
      buildEntriesEndpoint(params)
    );

    return response.data;
  },

  async fetchEntryById(id: string): Promise<EntryApiEntry> {
    const response = await fetchFromApi<EntryApiResponse>(
      `entries/${encodeURIComponent(id)}`
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
      `entries/${encodeURIComponent(id)}`,
      {
        body: entryData,
        method: "PUT",
      }
    );

    return response.data;
  },

  async removeEntry(id: string): Promise<void> {
    await fetchFromApi<void>(`entries/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
