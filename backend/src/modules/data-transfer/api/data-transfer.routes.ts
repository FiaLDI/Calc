import express, { Router } from "express";

import { asyncHandler } from "../../../shared/http/async-handler.js";
import type { DataTransferController } from "./data-transfer.controller.js";

export const createDataTransferRouter = (
  controller: DataTransferController
) => {
  const router = Router();

  router.get("/data/export", asyncHandler(controller.exportData));
  router.post(
    "/data/import",
    express.text({ limit: "5mb", type: ["application/xml", "text/xml"] }),
    asyncHandler(controller.importData)
  );

  return router;
};
