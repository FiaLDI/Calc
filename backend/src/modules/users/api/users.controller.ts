import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../../../config/env.js";
import { getRequestUserId } from "../../../shared/auth/request-user.js";
import type { UsersService } from "../application/users.service.js";
import {
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_TTL_SECONDS,
  getAuthCookieClearOptions,
  getAuthCookieOptions,
} from "../domain/users.auth.js";
import type { UserResponse } from "../domain/users.types.js";
import {
  parseLoginUserPayload,
  parseRegisterUserPayload,
} from "./users.validation.js";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private setAuthCookie(response: Response, userId: string) {
    const token = jwt.sign({}, env.jwtToken, {
      expiresIn: AUTH_TOKEN_TTL_SECONDS,
      subject: userId,
    });

    response.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
  }

  loginUser = async (request: Request, response: Response<UserResponse>) => {
    const user = await this.usersService.loginUser(
      parseLoginUserPayload(request.body)
    );
    this.setAuthCookie(response, user.id);
    response.json({ data: user });
  };

  registerUser = async (request: Request, response: Response<UserResponse>) => {
    const user = await this.usersService.registerUser(
      parseRegisterUserPayload(request.body)
    );

    this.setAuthCookie(response, user.id);
    response.status(201).json({ data: user });
  };

  getCurrentUser = async (
    request: Request,
    response: Response<UserResponse>
  ) => {
    const user = await this.usersService.getUserById(getRequestUserId(request));
    response.json({ data: user });
  };

  logoutUser = async (_request: Request, response: Response) => {
    response.clearCookie(AUTH_COOKIE_NAME, getAuthCookieClearOptions());
    response.status(204).send();
  };
}
