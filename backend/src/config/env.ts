import "dotenv/config";

const normalizePort = (value: string | undefined) => {
  const parsedPort = Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    return 4000;
  }

  return parsedPort;
};

export const env = {
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  mongo: {
    dbName: process.env.MONGO_DB_NAME || "calc",
    uri:
      process.env.MONGO_URI ||
      "mongodb://calc:calc-password@localhost:27017/calc?authSource=admin",
  },
  port: normalizePort(process.env.PORT),
};
