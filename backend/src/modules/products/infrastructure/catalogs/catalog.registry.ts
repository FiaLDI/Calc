import type { ProductCatalogProvider } from "../../domain/products.types.js";

export class CatalogRegistry {
  private readonly providersByKey: Map<string, ProductCatalogProvider>;

  constructor(providers: ProductCatalogProvider[]) {
    this.providersByKey = new Map(
      providers.map((provider) => [provider.meta.key, provider])
    );
  }

  get(sourceKey: string) {
    return this.providersByKey.get(sourceKey);
  }

  list() {
    return Array.from(this.providersByKey.values());
  }

  listMeta() {
    return this.list().map((provider) => provider.meta);
  }

  resolve(sourceKeys: string[]) {
    if (sourceKeys.length === 0) {
      return this.list();
    }

    return sourceKeys
      .map((sourceKey) => this.providersByKey.get(sourceKey))
      .filter((provider): provider is ProductCatalogProvider => Boolean(provider));
  }
}
