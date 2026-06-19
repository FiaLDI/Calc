import { UserModel } from "./users.schema.js";
import mongoose from "mongoose";

export class UsersRepository {
  async createUser(username: string, email: string, passwordHash: string) {
    return UserModel.create({
      email,
      passwordHash,
      username,
    });
  }

  async findUserByEmail(email: string) {
    return UserModel.findOne({ email }).exec();
  }

  async findUserById(userId: string) {
    if (!mongoose.isValidObjectId(userId)) {
      return null;
    }

    return UserModel.findById(userId).exec();
  }
}
