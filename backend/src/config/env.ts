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
  port: normalizePort(process.env.PORT),
};
