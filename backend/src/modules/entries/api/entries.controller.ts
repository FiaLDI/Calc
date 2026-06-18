import type { Request, Response } from "express";

import { getRequestUserId } from "../../../shared/auth/request-user.js";
import {
  getSingleQueryValue,
  normalizeNonNegativeInteger,
  normalizePositiveInteger,
} from "../../../shared/http/query.js";
import type { EntriesService } from "../application/entries.service.js";
import type {
  EntriesListResponse,
  EntryListQuery,
  EntryResponse,
} from "../domain/entries.types.js";
import { parseEntryPayload } from "./entries.validation.js";

export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  getEntries = async (
    request: Request,
    response: Response<EntriesListResponse>
  ) => {
    const query: EntryListQuery = {
      date: getSingleQueryValue(request.query.date),
      limit: normalizePositiveInteger(getSingleQueryValue(request.query.limit), 50),
      offset: normalizeNonNegativeInteger(
        getSingleQueryValue(request.query.offset),
        0
      ),
      userId: getRequestUserId(request),
    };
    const result = await this.entriesService.listEntries(query);

    response.json({
      data: result.items,
      meta: {
        date: query.date || null,
        limit: query.limit,
        offset: query.offset,
        total: result.total,
      },
    });
  };

  getEntryById = async (
    request: Request<{ id: string }>,
    response: Response<EntryResponse>
  ) => {
    const entry = await this.entriesService.getEntryById(
      getRequestUserId(request),
      request.params.id
    );

    response.json({
      data: entry,
    });
  };

  createEntry = async (request: Request, response: Response<EntryResponse>) => {
    const payload = parseEntryPayload(request.body);
    const entry = await this.entriesService.createEntry(
      getRequestUserId(request),
      payload
    );

    response.status(201).json({
      data: entry,
    });
  };

  updateEntry = async (
    request: Request<{ id: string }>,
    response: Response<EntryResponse>
  ) => {
    const payload = parseEntryPayload(request.body);
    const entry = await this.entriesService.updateEntry(
      getRequestUserId(request),
      request.params.id,
      payload
    );

    response.json({
      data: entry,
    });
  };

  deleteEntry = async (
    request: Request<{ id: string }>,
    response: Response
  ) => {
    await this.entriesService.deleteEntry(
      getRequestUserId(request),
      request.params.id
    );
    response.status(204).send();
  };
}
