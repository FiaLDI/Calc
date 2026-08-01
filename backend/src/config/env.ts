import "dotenv/config";

const normalizePort = (value: string | undefined) => {
  const parsedPort = Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    return 4000;
  }

  return parsedPort;
};

const getRequiredEnvironmentVariable = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }

  return value;
};

const getJwtToken = () => {
  const value = getRequiredEnvironmentVariable("JWT_TOKEN");

  if (value.length < 32) {
    throw new Error("JWT_TOKEN must contain at least 32 characters.");
  }

  return value;
};

const frontendOrigin =
  process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const normalizeTimeoutMs = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

export const env = {
  cookieSecure:
    process.env.COOKIE_SECURE === undefined
      ? frontendOrigin.startsWith("https://")
      : process.env.COOKIE_SECURE === "true",
  frontendOrigin,
  jwtToken: getJwtToken(),
  mongo: {
    dbName: process.env.MONGO_DB_NAME || "calc",
    uri:
      process.env.MONGO_URI ||
      "mongodb://calc:calc-password@localhost:27017/calc?authSource=admin",
  },
  openFoodFacts: {
    baseUrl: (
      process.env.OPEN_FOOD_FACTS_BASE_URL || "https://world.openfoodfacts.org"
    ).replace(/\/$/, ""),
    timeoutMs: normalizeTimeoutMs(process.env.OPEN_FOOD_FACTS_TIMEOUT_MS, 8_000),
    userAgent:
      process.env.OPEN_FOOD_FACTS_USER_AGENT ||
      "Calc/0.1.0 (https://github.com/FiaLDI/Calc)",
  },
  port: normalizePort(process.env.PORT),
};
