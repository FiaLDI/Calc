import crypto from "node:crypto";

import { mapProductRecordToDto } from "./products.mapper.js";
import { ProductModel } from "./products.schema.js";
import {
  getProductSourceMeta,
  PRODUCT_SOURCE_META,
} from "../domain/products.sources.js";
import type {
  ProductCreatePayload,
  ProductListQuery,
} from "../domain/products.types.js";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sortSourceKeys = (sourceKeys: string[]) => {
  const sourceKeySet = new Set(sourceKeys);
  const knownSourceKeys = PRODUCT_SOURCE_META.map((source) => source.key).filter(
    (sourceKey) => sourceKeySet.has(sourceKey)
  );
  const unknownSourceKeys = sourceKeys
    .filter(
      (sourceKey) =>
        !PRODUCT_SOURCE_META.some((source) => source.key === sourceKey)
    )
    .sort();

  return [...knownSourceKeys, ...unknownSourceKeys];
};

const getSourceKeysForQuery = async (sourceKeys: string[]) => {
  const availableSourceKeys = await ProductModel.distinct("sourceKey").exec();

  if (sourceKeys.length === 0) {
    return sortSourceKeys(availableSourceKeys);
  }

  const requestedSourceKeys = new Set(sourceKeys);
  return sortSourceKeys(
    availableSourceKeys.filter((sourceKey) => requestedSourceKeys.has(sourceKey))
  );
};

export class ProductsRepository {
  async createProduct(userId: string, payload: ProductCreatePayload) {
    const product = await ProductModel.create({
      ...payload,
      externalId: `custom:${userId}:${crypto.randomUUID()}`,
      isReadonly: false,
      sourceKey: "custom",
      sourceLabel: "Custom products",
      userId,
    });

    return mapProductRecordToDto(product);
  }

  async deleteProduct(userId: string, productId: string) {
    const result = await ProductModel.deleteOne({
      externalId: productId,
      isReadonly: false,
      userId,
    }).exec();

    return result.deletedCount > 0;
  }

  async listProducts(query: ProductListQuery) {
    const selectedSources = await getSourceKeysForQuery(query.sourceKeys);
    const filter: Record<string, unknown> = {};

    if (selectedSources.length > 0) {
      filter.sourceKey = {
        $in: selectedSources,
      };
    }

    if (query.sourceKeys.length > 0 && selectedSources.length === 0) {
      return {
        items: [],
        selectedSources,
        total: 0,
      };
    }

    if (query.search) {
      filter.name = {
        $options: "i",
        $regex: escapeRegExp(query.search.trim()),
      };
    }

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .sort({ name: 1 })
        .skip(query.offset)
        .limit(query.limit)
        .exec(),
      ProductModel.countDocuments(filter).exec(),
    ]);

    return {
      items: products.map(mapProductRecordToDto),
      selectedSources,
      total,
    };
  }

  async getProductById(productId: string) {
    const product = await ProductModel.findOne({
      externalId: productId,
    }).exec();

    return product ? mapProductRecordToDto(product) : null;
  }

  async listSources() {
    const sourceKeys = await ProductModel.distinct("sourceKey").exec();
    return sortSourceKeys(sourceKeys).map(getProductSourceMeta);
  }
}
