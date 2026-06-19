import { Router, type RequestHandler } from "express";

import { asyncHandler } from "../../../shared/http/async-handler.js";
import type { UsersController } from "./users.controller.js";

export const createUsersRouter = (
  usersController: UsersController,
  requireUser: RequestHandler
) => {
  const router = Router();

  router.post("/login", asyncHandler(usersController.loginUser));
  router.post("/register", asyncHandler(usersController.registerUser));
  router.post("/logout", asyncHandler(usersController.logoutUser));
  router.get(
    "/me",
    requireUser,
    asyncHandler(usersController.getCurrentUser)
  );

  return router;
};
