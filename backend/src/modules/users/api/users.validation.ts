import { HttpError } from "../../../shared/http/http-error.js";
import type {
  LoginUserPayload,
  RegisterUserPayload,
} from "../domain/users.types.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getString = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];

  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${key} is required.`);
  }

  return value.trim();
};

const getPassword = (payload: Record<string, unknown>) => {
  const value = payload.password;

  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, "password is required.");
  }

  return value;
};

const parseCredentials = (value: unknown): LoginUserPayload => {
  if (!isRecord(value)) {
    throw new HttpError(400, "User payload must be an object.");
  }

  const email = getString(value, "email").toLowerCase();
  const password = getPassword(value);

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    throw new HttpError(400, "email must be a valid email address.");
  }

  return { email, password };
};

export const parseLoginUserPayload = (value: unknown): LoginUserPayload =>
  parseCredentials(value);

export const parseRegisterUserPayload = (
  value: unknown
): RegisterUserPayload => {
  const credentials = parseCredentials(value);

  if (!isRecord(value)) {
    throw new HttpError(400, "User payload must be an object.");
  }

  const username = getString(value, "username");

  if (username.length < 2 || username.length > 50) {
    throw new HttpError(400, "username must contain between 2 and 50 characters.");
  }

  if (
    credentials.password.length < 8 ||
    Buffer.byteLength(credentials.password, "utf8") > 72
  ) {
    throw new HttpError(400, "password must contain between 8 and 72 bytes.");
  }

  return {
    ...credentials,
    username,
  };
};
