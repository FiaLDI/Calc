import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { env } from "../../../config/env.js";
import { HttpError } from "../../../shared/http/http-error.js";
import { AUTH_COOKIE_NAME } from "../domain/users.auth.js";

type AuthenticatedRequest = Request & {
  userId?: string;
};

const getCookie = (request: Request, name: string) => {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [cookieName, ...cookieValueParts] = cookie.trim().split("=");

    if (cookieName === name) {
      return decodeURIComponent(cookieValueParts.join("="));
    }
  }

  return undefined;
};

export const requireUser: RequestHandler = (request, _response, next) => {
  try {
    const token = getCookie(request, AUTH_COOKIE_NAME);

    if (!token) {
      throw new HttpError(401, "Authentication required.");
    }

    const payload = jwt.verify(token, env.jwtToken);

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      throw new HttpError(401, "Invalid authentication token.");
    }

    (request as AuthenticatedRequest).userId = payload.sub;
    next();
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
      return;
    }

    next(new HttpError(401, "Invalid or expired authentication token."));
  }
};
