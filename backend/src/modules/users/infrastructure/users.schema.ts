import mongoose from "mongoose";
import type { Model, Types } from "mongoose";

export type UserDocument = {
  _id: Types.ObjectId;
  createdAt: Date;
  email: string;
  passwordHash: string;
  updatedAt: Date;
  username: string;
};

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      index: true,
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    passwordHash: {
      required: true,
      type: String,
    },
    username: {
      maxlength: 50,
      minlength: 2,
      required: true,
      trim: true,
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export const UserModel =
  (mongoose.models.User as Model<UserDocument> | undefined) ||
  mongoose.model<UserDocument>("User", userSchema);
