import type { CookieOptions } from "express";

import { env } from "../../../config/env.js";

export const AUTH_COOKIE_NAME = "auth";
export const AUTH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export const getAuthCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  maxAge: AUTH_TOKEN_TTL_SECONDS * 1000,
  path: "/",
  sameSite: "lax",
  secure: env.isProduction,
});

export const getAuthCookieClearOptions = (): CookieOptions => ({
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: env.isProduction,
});
