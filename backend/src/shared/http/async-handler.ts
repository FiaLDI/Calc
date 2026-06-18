import type { RequestHandler } from "express";

export const asyncHandler =
  <
    Params = unknown,
    ResponseBody = unknown,
    RequestBody = unknown,
    RequestQuery = unknown,
    Locals extends Record<string, unknown> = Record<string, unknown>,
  >(
    handler: RequestHandler<
      Params,
      ResponseBody,
      RequestBody,
      RequestQuery,
      Locals
    >
  ): RequestHandler<Params, ResponseBody, RequestBody, RequestQuery, Locals> =>
  (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
