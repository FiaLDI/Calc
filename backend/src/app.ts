import cors from "cors";
import express from "express";

import { getDbConnectionState } from "./config/db.js";
import { env } from "./config/env.js";
import { entriesRouter } from "./modules/entries/entries.module.js";
import { dataTransferRouter } from "./modules/data-transfer/data-transfer.module.js";
import { productsRouter } from "./modules/products/products.module.js";
import {
  usersAuthMiddleware,
  usersRouter,
} from "./modules/users/users.module.js";
import { errorHandler } from "./shared/http/error-handler.js";
import { notFoundHandler } from "./shared/http/not-found-handler.js";

export const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    database: getDbConnectionState(),
    status: "ok",
  });
});

app.use("/api/v1", usersRouter);
app.use("/api/v1", usersAuthMiddleware);
app.use("/api/v1", productsRouter);
app.use("/api/v1", entriesRouter);
app.use("/api/v1", dataTransferRouter);
app.use(notFoundHandler);
app.use(errorHandler);
