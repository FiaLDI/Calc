import type { ProductListQuery, ProductSourceMeta } from "../model/types.js";
import type { ProductSourceRepository } from "../repositories/product-source.repository.js";

const normalizeSearch = (value: string) => value.trim().toLocaleLowerCase();

export class ProductsService {
  constructor(private readonly repositories: ProductSourceRepository[]) {}

  async listProducts(query: ProductListQuery) {
    const repositories = this.getRepositoriesForQuery(query.sourceKeys);
    const products = (await Promise.all(
      repositories.map((repository) => repository.listProducts())
    ))
      .flat()
      .sort((left, right) => left.name.localeCompare(right.name));

    const filteredProducts = query.search
      ? products.filter((product) =>
          normalizeSearch(product.name).includes(normalizeSearch(query.search))
        )
      : products;

    return {
      selectedSources: repositories.map((repository) => repository.getMeta().key),
      total: filteredProducts.length,
      items: filteredProducts.slice(query.offset, query.offset + query.limit),
    };
  }

  async getProductById(productId: string) {
    const products = await Promise.all(
      this.repositories.map((repository) => repository.listProducts())
    );

    return products.flat().find((product) => product.id === productId) || null;
  }

  listSources(): ProductSourceMeta[] {
    return this.repositories.map((repository) => repository.getMeta());
  }

  private getRepositoriesForQuery(sourceKeys: string[]) {
    if (sourceKeys.length === 0) {
      return this.repositories;
    }

    const selectedSourceKeys = new Set(sourceKeys);

    return this.repositories.filter((repository) =>
      selectedSourceKeys.has(repository.getMeta().key)
    );
  }
}
