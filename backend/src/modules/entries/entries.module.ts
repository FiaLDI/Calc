import { EntriesController } from "./api/entries.controller.js";
import { createEntriesRouter } from "./api/entries.routes.js";
import { EntriesService } from "./application/entries.service.js";
import { EntriesRepository } from "./infrastructure/entries.repository.js";

const entriesRepository = new EntriesRepository();
const entriesService = new EntriesService(entriesRepository);
const entriesController = new EntriesController(entriesService);

export const entriesRouter = createEntriesRouter(entriesController);
