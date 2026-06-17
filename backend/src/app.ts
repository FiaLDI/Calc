import cors from "cors";
import express from "express";

import { getDbConnectionState } from "./config/db.js";
import { env } from "./config/env.js";
import { productsRouter } from "./modules/products/routes/products.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    database: getDbConnectionState(),
    status: "ok",
  });
});

app.use("/api/v1", productsRouter);
