import { XMLBuilder, XMLParser, XMLValidator } from "fast-xml-parser";

import { parseEntryPayload } from "../../entries/api/entries.validation.js";
import { parseProductCreatePayload } from "../../products/api/products.validation.js";
import { HttpError } from "../../../shared/http/http-error.js";
import type { ImportData } from "../domain/data-transfer.types.js";
import type { DataTransferRepository } from "../infrastructure/data-transfer.repository.js";

const MAX_ENTRIES = 5_000;
const MAX_PRODUCTS = 1_000;

type XmlRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is XmlRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asArray = (value: unknown) =>
  value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];

const getString = (record: XmlRecord, key: string) => {
  const value = record[key];

  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `Invalid XML: ${key} is required.`);
  }

  return value.trim();
};

const getOptionalString = (record: XmlRecord, key: string) => {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
};

const getNumber = (record: XmlRecord, key: string) => {
  const value = Number(getString(record, key));

  if (!Number.isFinite(value) || value < 0) {
    throw new HttpError(400, `Invalid XML: ${key} must be non-negative.`);
  }

  return value;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  processEntities: false,
  trimValues: true,
  isArray: (_tagName, path) =>
    path === "calcData.products.product" || path === "calcData.entries.entry",
});

const builder = new XMLBuilder({
  format: true,
  ignoreAttributes: false,
  suppressEmptyNode: false,
});

export const buildUserDataXml = async (
  userId: string,
  repository: DataTransferRepository
) => {
  const { entries, products } = await repository.getUserData(userId);
  const data = {
    calcData: {
      "@_version": "1",
      exportedAt: new Date().toISOString(),
      products: {
        product: products.map((product) => ({
          id: product.externalId,
          name: product.name,
          category: product.category,
          amountValue: product.amountValue,
          amountUnit: product.amountUnit,
          calories: product.calories,
          protein: product.protein,
          carbs: product.carbs,
          fat: product.fat,
          imageAlt: product.imageAlt,
          imageUrl: product.imageUrl,
          visibility: product.isPublic ? "public" : "private",
        })),
      },
      entries: {
        entry: entries.map((entry) => ({
          date: entry.date,
          mealType: entry.mealType,
          productId: entry.productSnapshot.productId,
          productName: entry.productSnapshot.productName,
          productImageAlt: entry.productSnapshot.productImageAlt,
          productImageUrl: entry.productSnapshot.productImageUrl,
          amountValue: entry.productSnapshot.amountValue,
          amountUnit: entry.productSnapshot.amountUnit,
          servings: entry.servings,
          calories: entry.productSnapshot.calories,
          protein: entry.productSnapshot.protein,
          carbs: entry.productSnapshot.carbs,
          fat: entry.productSnapshot.fat,
        })),
      },
    },
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n${builder.build(data)}`;
};

export const parseUserDataXml = (xml: string): ImportData => {
  if (!xml.trim()) {
    throw new HttpError(400, "XML file is empty.");
  }

  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) {
    throw new HttpError(400, "DOCTYPE and ENTITY declarations are not allowed.");
  }

  const validationResult = XMLValidator.validate(xml);
  if (validationResult !== true) {
    throw new HttpError(400, "XML document is malformed.");
  }

  const parsed = parser.parse(xml) as unknown;
  if (!isRecord(parsed) || !isRecord(parsed.calcData)) {
    throw new HttpError(400, "Invalid XML: calcData root element is required.");
  }

  const root = parsed.calcData;
  if (root["@_version"] !== "1") {
    throw new HttpError(400, "Unsupported XML data version.");
  }

  const productsNode = isRecord(root.products) ? root.products : {};
  const entriesNode = isRecord(root.entries) ? root.entries : {};
  const productRecords = asArray(productsNode.product);
  const entryRecords = asArray(entriesNode.entry);

  if (productRecords.length > MAX_PRODUCTS || entryRecords.length > MAX_ENTRIES) {
    throw new HttpError(400, "XML file contains too many records.");
  }

  const products = productRecords.map((value) => {
    if (!isRecord(value)) {
      throw new HttpError(400, "Invalid XML product record.");
    }

    const originalId = getString(value, "id");
    const product = parseProductCreatePayload({
      amountUnit: getString(value, "amountUnit"),
      amountValue: getNumber(value, "amountValue"),
      calories: getNumber(value, "calories"),
      carbs: getNumber(value, "carbs"),
      category: getString(value, "category"),
      fat: getNumber(value, "fat"),
      imageAlt: getOptionalString(value, "imageAlt"),
      imageUrl: getOptionalString(value, "imageUrl"),
      name: getString(value, "name"),
      protein: getNumber(value, "protein"),
      visibility: getString(value, "visibility"),
    });

    return { ...product, originalId };
  });

  const entries = entryRecords.map((value) => {
    if (!isRecord(value)) {
      throw new HttpError(400, "Invalid XML entry record.");
    }

    return parseEntryPayload({
      amountUnit: getString(value, "amountUnit"),
      amountValue: getNumber(value, "amountValue"),
      calories: getNumber(value, "calories"),
      carbs: getNumber(value, "carbs"),
      date: getString(value, "date"),
      fat: getNumber(value, "fat"),
      mealType: getString(value, "mealType"),
      productId: getString(value, "productId"),
      productImageAlt: getOptionalString(value, "productImageAlt"),
      productImageUrl: getOptionalString(value, "productImageUrl"),
      productName: getString(value, "productName"),
      protein: getNumber(value, "protein"),
      servings: getNumber(value, "servings"),
    });
  });

  return { entries, products };
};
