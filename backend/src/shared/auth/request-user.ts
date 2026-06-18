import type { Request } from "express";

export const getRequestUserId = (_request: Request) => "local-user";
