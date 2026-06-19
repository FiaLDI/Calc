import bcrypt from "bcrypt";

import { HttpError } from "../../../shared/http/http-error.js";
import type {
  LoginUserPayload,
  RegisterUserPayload,
} from "../domain/users.types.js";
import { mapUserDocumentToDto } from "../infrastructure/users.mapper.js";
import type { UsersRepository } from "../infrastructure/users.repository.js";

const PASSWORD_SALT_ROUNDS = 10;

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async registerUser(payload: RegisterUserPayload) {
    const existingUser = await this.usersRepository.findUserByEmail(payload.email);

    if (existingUser) {
      throw new HttpError(409, "A user with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(
      payload.password,
      PASSWORD_SALT_ROUNDS
    );

    try {
      const user = await this.usersRepository.createUser(
        payload.username,
        payload.email,
        passwordHash
      );

      return mapUserDocumentToDto(user);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new HttpError(409, "A user with this email already exists.");
      }

      throw error;
    }
  }

  async loginUser(payload: LoginUserPayload) {
    const user = await this.usersRepository.findUserByEmail(payload.email);

    if (!user || !(await bcrypt.compare(payload.password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password.");
    }

    return mapUserDocumentToDto(user);
  }

  async getUserById(userId: string) {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new HttpError(401, "Authenticated user no longer exists.");
    }

    return mapUserDocumentToDto(user);
  }
}
