import { UsersController } from "./api/users.controller.js";
import { createUsersRouter } from "./api/users.routes.js";
import { UsersService } from "./application/users.service.js";
import { UsersRepository } from "./infrastructure/users.repository.js";
import { requireUser } from "./middleware/users.middleware.js";

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

export const usersRouter = createUsersRouter(usersController, requireUser);
export const usersAuthMiddleware = requireUser;
