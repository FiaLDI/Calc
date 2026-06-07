import type { ProductDto, ProductSourceMeta } from "../model/types.js";

export interface ProductSourceRepository {
  getMeta(): ProductSourceMeta;
  listProducts(): Promise<ProductDto[]>;
}
