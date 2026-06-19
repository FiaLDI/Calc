import type { UserDto } from "../domain/users.types.js";
import type { UserDocument } from "./users.schema.js";

export const mapUserDocumentToDto = (user: UserDocument): UserDto => ({
  createdAt: user.createdAt.toISOString(),
  email: user.email,
  id: user._id.toString(),
  username: user.username,
});
