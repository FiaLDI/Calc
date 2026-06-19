import type { Request } from "express";

import { HttpError } from "../http/http-error.js";

type AuthenticatedRequest = Request & {
  userId?: string;
};

export const getRequestUserId = (request: Request) => {
  const userId = (request as AuthenticatedRequest).userId;

  if (!userId) {
    throw new HttpError(401, "Authentication required.");
  }

  return userId;
};
