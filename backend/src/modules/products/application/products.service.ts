import { HttpError } from "../../../shared/http/http-error.js";
import {
  CUSTOM_SOURCE_KEY,
  getProductSourceMeta,
} from "../domain/products.sources.js";
import type {
  ProductCreatePayload,
  ProductDto,
  ProductListQuery,
  ProductsRepositoryContract,
} from "../domain/products.types.js";
import type { CatalogRegistry } from "../infrastructure/catalogs/catalog.registry.js";

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T | null> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<null>((resolve) => {
        timeoutId = setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

const dedupeProducts = (products: ProductDto[]) => {
  const seen = new Set<string>();

  return products.filter((product) => {
    if (seen.has(product.id)) {
      return false;
    }

    seen.add(product.id);
    return true;
  });
};

const includesCustomSource = (sourceKeys: string[]) =>
  sourceKeys.length === 0 || sourceKeys.includes(CUSTOM_SOURCE_KEY);

export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepositoryContract,
    private readonly catalogRegistry: CatalogRegistry,
    private readonly catalogTimeoutMs = 8_000
  ) {}

  async listProducts(query: ProductListQuery) {
    const includeCustom = includesCustomSource(query.sourceKeys);
    const catalogProviders = this.catalogRegistry.resolve(query.sourceKeys);
    const search = query.search.trim();

    const mongoPromise = includeCustom
      ? this.productsRepository.listProducts({
          ...query,
          // When catalogs are also queried, fetch a wider custom window then merge.
          limit: catalogProviders.length > 0 && search ? 100 : query.limit,
          offset: catalogProviders.length > 0 && search ? 0 : query.offset,
          sourceKeys: query.sourceKeys.filter(
            (sourceKey) => sourceKey === CUSTOM_SOURCE_KEY
          ),
        })
      : Promise.resolve({
          items: [] as ProductDto[],
          selectedSources: [] as string[],
          total: 0,
        });

    const catalogPromises =
      search && catalogProviders.length > 0
        ? catalogProviders.map(async (provider) => {
            const result = await withTimeout(
              provider.search({
                limit: query.limit,
                offset: 0,
                q: search,
              }),
              this.catalogTimeoutMs
            );

            return {
              items: result?.items || [],
              sourceKey: provider.meta.key,
            };
          })
        : [];

    const [mongoResult, ...catalogResults] = await Promise.all([
      mongoPromise,
      ...catalogPromises,
    ]);

    if (!search || catalogProviders.length === 0) {
      const selectedSources = [
        ...mongoResult.selectedSources,
        ...this.catalogRegistry.listMeta().map((meta) => meta.key),
      ];

      return {
        items: mongoResult.items,
        selectedSources: Array.from(new Set(selectedSources)),
        total: mongoResult.total,
      };
    }

    const catalogItems = catalogResults.flatMap((result) => result.items);
    const merged = dedupeProducts([...mongoResult.items, ...catalogItems]).sort(
      (left, right) => left.name.localeCompare(right.name, "ru")
    );
    const paged = merged.slice(query.offset, query.offset + query.limit);
    const selectedSources = Array.from(
      new Set([
        ...mongoResult.selectedSources,
        ...catalogResults.map((result) => result.sourceKey),
      ])
    );

    return {
      items: paged,
      selectedSources,
      total: merged.length,
    };
  }

  async getProductById(userId: string, productId: string) {
    const separatorIndex = productId.indexOf(":");

    if (separatorIndex > 0) {
      const sourceKey = productId.slice(0, separatorIndex);
      const externalId = productId.slice(separatorIndex + 1);
      const provider = this.catalogRegistry.get(sourceKey);

      if (provider) {
        const catalogProduct = await withTimeout(
          provider.getByExternalId(externalId),
          this.catalogTimeoutMs
        );

        if (catalogProduct) {
          return catalogProduct;
        }
      }
    }

    return this.productsRepository.getProductById(userId, productId);
  }

  async createProduct(userId: string, payload: ProductCreatePayload) {
    return this.productsRepository.createProduct(userId, payload);
  }

  async importFromCatalog(
    userId: string,
    sourceKey: string,
    externalId: string
  ) {
    const provider = this.catalogRegistry.get(sourceKey);

    if (!provider) {
      throw new HttpError(400, `Unknown catalog source: ${sourceKey}`);
    }

    const catalogProduct = await withTimeout(
      provider.getByExternalId(externalId),
      this.catalogTimeoutMs
    );

    if (!catalogProduct) {
      throw new HttpError(404, "Catalog product not found.");
    }

    return this.productsRepository.createProduct(userId, {
      amountUnit: catalogProduct.amountUnit,
      amountValue: catalogProduct.amountValue,
      calories: catalogProduct.calories,
      carbs: catalogProduct.carbs,
      category: catalogProduct.category,
      fat: catalogProduct.fat,
      imageAlt: catalogProduct.imageAlt,
      imageUrl: catalogProduct.imageUrl,
      name: catalogProduct.name,
      protein: catalogProduct.protein,
      visibility: "private",
    });
  }

  async deleteProduct(userId: string, productId: string) {
    const isDeleted = await this.productsRepository.deleteProduct(
      userId,
      productId
    );

    if (!isDeleted) {
      throw new HttpError(404, "Product not found.");
    }
  }

  async listSources(userId: string) {
    const storedSources = await this.productsRepository.listSources(userId);
    const catalogSources = this.catalogRegistry.listMeta();
    const byKey = new Map(
      [...storedSources, ...catalogSources].map((source) => [source.key, source])
    );

    // Prefer known meta order, then extras.
    const orderedKeys = [
      CUSTOM_SOURCE_KEY,
      ...catalogSources.map((source) => source.key),
    ];

    for (const key of orderedKeys) {
      if (!byKey.has(key)) {
        byKey.set(key, getProductSourceMeta(key));
      }
    }

    return Array.from(byKey.values());
  }
}
