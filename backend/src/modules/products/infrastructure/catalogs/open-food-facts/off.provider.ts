import { getProductSourceMeta } from "../../../domain/products.sources.js";
import type {
  CatalogSearchQuery,
  ProductCatalogProvider,
  ProductDto,
} from "../../../domain/products.types.js";
import { OpenFoodFactsClient } from "./off.client.js";
import { mapOffProductToDto } from "./off.mapper.js";

export class OpenFoodFactsCatalogProvider implements ProductCatalogProvider {
  readonly meta = getProductSourceMeta("off");

  constructor(private readonly client = new OpenFoodFactsClient()) {}

  async getByExternalId(externalId: string): Promise<ProductDto | null> {
    const product = await this.client.getProductByBarcode(externalId);
    return product ? mapOffProductToDto(product, this.meta.label) : null;
  }

  async search(query: CatalogSearchQuery) {
    const result = await this.client.searchProducts({
      limit: query.limit,
      offset: query.offset,
      q: query.q,
    });
    const items = result.products
      .map((product) => mapOffProductToDto(product, this.meta.label))
      .filter((product): product is ProductDto => product !== null);

    return {
      items,
      total: result.count,
    };
  }
}
