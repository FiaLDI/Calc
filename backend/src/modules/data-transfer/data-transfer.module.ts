import { DataTransferController } from "./api/data-transfer.controller.js";
import { createDataTransferRouter } from "./api/data-transfer.routes.js";
import { DataTransferService } from "./application/data-transfer.service.js";
import { DataTransferRepository } from "./infrastructure/data-transfer.repository.js";

const repository = new DataTransferRepository();
const service = new DataTransferService(repository);
const controller = new DataTransferController(service);

export const dataTransferRouter = createDataTransferRouter(controller);
