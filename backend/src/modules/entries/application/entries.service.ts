import { HttpError } from "../../../shared/http/http-error.js";
import type { EntryListQuery, EntryPayload } from "../domain/entries.types.js";
import { mapEntryDocumentToDto } from "../infrastructure/entries.mapper.js";
import type { EntriesRepository } from "../infrastructure/entries.repository.js";

export class EntriesService {
  constructor(private readonly entriesRepository: EntriesRepository) {}

  async listEntries(query: EntryListQuery) {
    const [entries, total] = await Promise.all([
      this.entriesRepository.listEntries(query),
      this.entriesRepository.countEntries(query),
    ]);

    return {
      items: entries.map(mapEntryDocumentToDto),
      total,
    };
  }

  async getEntryById(userId: string, entryId: string) {
    const entry = await this.entriesRepository.getEntryById(userId, entryId);

    if (!entry) {
      throw new HttpError(404, "Entry not found.");
    }

    return mapEntryDocumentToDto(entry);
  }

  async createEntry(userId: string, payload: EntryPayload) {
    const entry = await this.entriesRepository.createEntry(userId, payload);
    return mapEntryDocumentToDto(entry);
  }

  async updateEntry(userId: string, entryId: string, payload: EntryPayload) {
    const entry = await this.entriesRepository.updateEntry(
      userId,
      entryId,
      payload
    );

    if (!entry) {
      throw new HttpError(404, "Entry not found.");
    }

    return mapEntryDocumentToDto(entry);
  }

  async deleteEntry(userId: string, entryId: string) {
    const isDeleted = await this.entriesRepository.deleteEntry(userId, entryId);

    if (!isDeleted) {
      throw new HttpError(404, "Entry not found.");
    }
  }
}
