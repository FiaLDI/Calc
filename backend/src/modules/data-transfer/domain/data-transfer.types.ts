import type { EntryPayload } from "../../entries/domain/entries.types.js";
import type { ProductCreatePayload } from "../../products/domain/products.types.js";

export type ImportedProduct = ProductCreatePayload & {
  originalId: string;
};

export type ImportedEntry = EntryPayload;

export type ImportData = {
  entries: ImportedEntry[];
  products: ImportedProduct[];
};

export type ImportResult = {
  entries: number;
  products: number;
};
