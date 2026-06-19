import crypto from "node:crypto";
import mongoose from "mongoose";

import { DiaryEntryModel } from "../../entries/infrastructure/entries.schema.js";
import { ProductModel } from "../../products/infrastructure/products.schema.js";
import type {
  ImportData,
  ImportResult,
} from "../domain/data-transfer.types.js";

export class DataTransferRepository {
  async getUserData(userId: string) {
    const [entries, products] = await Promise.all([
      DiaryEntryModel.find({ userId }).sort({ createdAt: 1 }).lean().exec(),
      ProductModel.find({ isReadonly: false, userId })
        .sort({ createdAt: 1 })
        .lean()
        .exec(),
    ]);

    return { entries, products };
  }

  async replaceUserData(userId: string, data: ImportData): Promise<ImportResult> {
    const productIdMap = new Map<string, string>();
    const productDocumentIds = data.products.map(() => new mongoose.Types.ObjectId());
    const entryDocumentIds = data.entries.map(() => new mongoose.Types.ObjectId());

    const products = data.products.map((product, index) => {
      const externalId = `custom:${userId}:${crypto.randomUUID()}`;
      productIdMap.set(product.originalId, externalId);

      return {
        _id: productDocumentIds[index],
        ...product,
        externalId,
        isPublic: product.visibility === "public",
        isReadonly: false,
        sourceKey: "custom",
        sourceLabel: "Custom products",
        userId,
      };
    });

    const entries = data.entries.map((entry, index) => ({
      _id: entryDocumentIds[index],
      date: entry.date,
      mealType: entry.mealType,
      productSnapshot: {
        amountUnit: entry.amountUnit,
        amountValue: entry.amountValue,
        calories: entry.calories,
        carbs: entry.carbs,
        fat: entry.fat,
        productId: productIdMap.get(entry.productId) || entry.productId,
        productImageAlt: entry.productImageAlt,
        productImageUrl: entry.productImageUrl,
        productName: entry.productName,
        protein: entry.protein,
      },
      servings: entry.servings,
      userId,
    }));

    try {
      if (products.length > 0) {
        await ProductModel.insertMany(products);
      }

      if (entries.length > 0) {
        await DiaryEntryModel.insertMany(entries);
      }
    } catch (error) {
      await Promise.all([
        ProductModel.deleteMany({ _id: { $in: productDocumentIds } }).exec(),
        DiaryEntryModel.deleteMany({ _id: { $in: entryDocumentIds } }).exec(),
      ]);
      throw error;
    }

    await Promise.all([
      ProductModel.deleteMany({
        _id: { $nin: productDocumentIds },
        isReadonly: false,
        userId,
      }).exec(),
      DiaryEntryModel.deleteMany({
        _id: { $nin: entryDocumentIds },
        userId,
      }).exec(),
    ]);

    return {
      entries: entries.length,
      products: products.length,
    };
  }
}
