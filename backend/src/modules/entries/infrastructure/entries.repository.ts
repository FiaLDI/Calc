import mongoose from "mongoose";

import { DiaryEntryModel, type DiaryEntryDocument } from "./entries.schema.js";
import type { EntryListQuery, EntryPayload } from "../domain/entries.types.js";

type EntryListFilter = {
  date?: string;
  userId: string;
};

const getListFilter = (query: EntryListQuery): EntryListFilter => {
  const filter: EntryListFilter = {
    userId: query.userId,
  };

  if (query.date) {
    filter.date = query.date;
  }

  return filter;
};

const getEntryFields = (payload: EntryPayload) => ({
  date: payload.date,
  mealType: payload.mealType,
  productSnapshot: {
    amountUnit: payload.amountUnit,
    amountValue: payload.amountValue,
    calories: payload.calories,
    carbs: payload.carbs,
    fat: payload.fat,
    productId: payload.productId,
    productImageAlt: payload.productImageAlt,
    productImageUrl: payload.productImageUrl,
    productName: payload.productName,
    protein: payload.protein,
  },
  servings: payload.servings,
});

export class EntriesRepository {
  async listEntries(query: EntryListQuery) {
    return DiaryEntryModel.find(getListFilter(query))
      .sort({ createdAt: -1 })
      .skip(query.offset)
      .limit(query.limit)
      .exec();
  }

  async countEntries(query: EntryListQuery) {
    return DiaryEntryModel.countDocuments(getListFilter(query)).exec();
  }

  async getEntryById(userId: string, entryId: string) {
    if (!mongoose.isValidObjectId(entryId)) {
      return null;
    }

    return DiaryEntryModel.findOne({
      _id: entryId,
      userId,
    }).exec();
  }

  async createEntry(userId: string, payload: EntryPayload) {
    return DiaryEntryModel.create({
      ...getEntryFields(payload),
      userId,
    });
  }

  async updateEntry(userId: string, entryId: string, payload: EntryPayload) {
    if (!mongoose.isValidObjectId(entryId)) {
      return null;
    }

    return DiaryEntryModel.findOneAndUpdate(
      {
        _id: entryId,
        userId,
      },
      {
        $set: getEntryFields(payload),
      },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  async deleteEntry(userId: string, entryId: string) {
    if (!mongoose.isValidObjectId(entryId)) {
      return false;
    }

    const result = await DiaryEntryModel.deleteOne({
      _id: entryId,
      userId,
    }).exec();

    return result.deletedCount > 0;
  }
}
