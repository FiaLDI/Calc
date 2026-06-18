import mongoose from "mongoose";
import type { Model, Types } from "mongoose";

import type { EntryPayload } from "../domain/entries.types.js";

export type DiaryEntryProductSnapshot = Pick<
  EntryPayload,
  | "amountUnit"
  | "amountValue"
  | "calories"
  | "carbs"
  | "fat"
  | "productId"
  | "productImageAlt"
  | "productImageUrl"
  | "productName"
  | "protein"
>;

export type DiaryEntryDocument = {
  _id: Types.ObjectId;
  createdAt: Date;
  date: string;
  mealType: EntryPayload["mealType"];
  productSnapshot: DiaryEntryProductSnapshot;
  servings: number;
  updatedAt: Date;
  userId: string;
};

const productSnapshotSchema = new mongoose.Schema<DiaryEntryProductSnapshot>(
  {
    amountUnit: {
      required: true,
      trim: true,
      type: String,
    },
    amountValue: {
      min: 0,
      required: true,
      type: Number,
    },
    calories: {
      min: 0,
      required: true,
      type: Number,
    },
    carbs: {
      min: 0,
      required: true,
      type: Number,
    },
    fat: {
      min: 0,
      required: true,
      type: Number,
    },
    productId: {
      required: true,
      trim: true,
      type: String,
    },
    productImageAlt: {
      default: "",
      trim: true,
      type: String,
    },
    productImageUrl: {
      default: "",
      trim: true,
      type: String,
    },
    productName: {
      required: true,
      trim: true,
      type: String,
    },
    protein: {
      min: 0,
      required: true,
      type: Number,
    },
  },
  {
    _id: false,
  }
);

const diaryEntrySchema = new mongoose.Schema<DiaryEntryDocument>(
  {
    date: {
      index: true,
      required: true,
      trim: true,
      type: String,
    },
    mealType: {
      required: true,
      trim: true,
      type: String,
    },
    productSnapshot: {
      required: true,
      type: productSnapshotSchema,
    },
    servings: {
      min: 0,
      required: true,
      type: Number,
    },
    userId: {
      index: true,
      required: true,
      trim: true,
      type: String,
    },
  },
  {
    collection: "diary_entries",
    timestamps: true,
  }
);

diaryEntrySchema.index({ userId: 1, date: -1, mealType: 1, createdAt: -1 });

export const DiaryEntryModel =
  (mongoose.models.DiaryEntry as Model<DiaryEntryDocument> | undefined) ||
  mongoose.model<DiaryEntryDocument>("DiaryEntry", diaryEntrySchema);
