import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { asyncHandler } from "./shared/http/async-handler.js";
import { errorHandler } from "./shared/http/error-handler.js";
import { HttpError } from "./shared/http/http-error.js";
import { notFoundHandler } from "./shared/http/not-found-handler.js";

const IMAGE_CONTENT_TYPES = new Map([
  ["image/gif", "gif"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const uploadDir = path.resolve(process.cwd(), env.uploadDir);

const getImageExtension = (contentType: string) => {
  const normalizedContentType = contentType.split(";")[0]?.trim().toLowerCase();
  return normalizedContentType
    ? IMAGE_CONTENT_TYPES.get(normalizedContentType)
    : undefined;
};

export const app = express();

app.use(
  cors({
    credentials: true,
    origin: env.frontendOrigin,
  })
);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/images", express.static(uploadDir));

app.post(
  "/images",
  express.raw({
    limit: env.maxImageSizeBytes,
    type: Array.from(IMAGE_CONTENT_TYPES.keys()),
  }),
  asyncHandler(async (request, response) => {
    const contentType = request.headers["content-type"] || "";
    const extension = getImageExtension(contentType);

    if (!extension) {
      throw new HttpError(415, "Unsupported image type.");
    }

    if (!Buffer.isBuffer(request.body) || request.body.length === 0) {
      throw new HttpError(400, "Image file is required.");
    }

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, request.body);

    response.status(201).json({
      data: {
        contentType,
        path: `/images/${fileName}`,
        size: request.body.length,
        url: `${env.publicUrl.replace(/\/$/, "")}/images/${fileName}`,
      },
    });
  })
);

app.use(notFoundHandler);
app.use(errorHandler);
