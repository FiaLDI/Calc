import mongoose from "mongoose";
import type { Model, Types } from "mongoose";

import type { ProductCategory, ProductUnit } from "../domain/products.types.js";

export type ProductRecord = {
  _id: Types.ObjectId;
  amountUnit: ProductUnit;
  amountValue: number;
  calories: number;
  carbs: number;
  category: ProductCategory;
  createdAt: Date;
  externalId: string;
  fat: number;
  imageAlt: string;
  imageUrl: string;
  isReadonly: boolean;
  name: string;
  protein: number;
  sourceKey: string;
  sourceLabel: string;
  updatedAt: Date;
  userId?: string | null;
};

const productSchema = new mongoose.Schema<ProductRecord>(
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
    category: {
      index: true,
      required: true,
      trim: true,
      type: String,
    },
    externalId: {
      index: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    fat: {
      min: 0,
      required: true,
      type: Number,
    },
    imageAlt: {
      default: "",
      trim: true,
      type: String,
    },
    imageUrl: {
      default: "",
      trim: true,
      type: String,
    },
    isReadonly: {
      default: true,
      required: true,
      type: Boolean,
    },
    name: {
      index: true,
      required: true,
      trim: true,
      type: String,
    },
    protein: {
      min: 0,
      required: true,
      type: Number,
    },
    sourceKey: {
      index: true,
      required: true,
      trim: true,
      type: String,
    },
    sourceLabel: {
      required: true,
      trim: true,
      type: String,
    },
    userId: {
      default: null,
      index: true,
      trim: true,
      type: String,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

productSchema.index({ sourceKey: 1, name: 1 });
productSchema.index({ userId: 1, sourceKey: 1, name: 1 });

export const ProductModel =
  (mongoose.models.Product as Model<ProductRecord> | undefined) ||
  mongoose.model<ProductRecord>("Product", productSchema);
