import { Router } from "express";

import { asyncHandler } from "../../../shared/http/async-handler.js";
import type { EntriesController } from "./entries.controller.js";

export const createEntriesRouter = (entriesController: EntriesController) => {
  const router = Router();

  router.get("/entries", asyncHandler(entriesController.getEntries));
  router.post("/entries", asyncHandler(entriesController.createEntry));
  router.get<{ id: string }>(
    "/entries/:id",
    asyncHandler(entriesController.getEntryById)
  );
  router.put<{ id: string }>(
    "/entries/:id",
    asyncHandler(entriesController.updateEntry)
  );
  router.delete<{ id: string }>(
    "/entries/:id",
    asyncHandler(entriesController.deleteEntry)
  );

  return router;
};
