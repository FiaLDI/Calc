import "dotenv/config";

const normalizePositiveInteger = (
  value: string | undefined,
  fallback: number
) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
};

export const env = {
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  maxImageSizeBytes: normalizePositiveInteger(
    process.env.MAX_IMAGE_SIZE_BYTES,
    5 * 1024 * 1024
  ),
  port: normalizePositiveInteger(process.env.PORT, 4001),
  publicUrl: process.env.PUBLIC_URL || "http://localhost:4001",
  uploadDir: process.env.UPLOAD_DIR || "uploads/images",
};
