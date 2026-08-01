import { describe, expect, it, vi } from "vitest";

import { ProductsService } from "../../application/products.service.js";
import type {
  ProductCatalogProvider,
  ProductDto,
  ProductsRepositoryContract,
} from "../../domain/products.types.js";
import { CatalogRegistry } from "./catalog.registry.js";

const sampleCustom: ProductDto = {
  amountUnit: "г",
  amountValue: 100,
  calories: 100,
  carbs: 10,
  category: "Другое",
  createdAt: "2026-08-01T00:00:00.000Z",
  fat: 1,
  id: "custom:1",
  imageAlt: "Bar",
  imageUrl: "",
  isReadonly: false,
  name: "Custom Bar",
  protein: 20,
  sourceKey: "custom",
  sourceLabel: "Мои продукты",
  visibility: "private",
};

const sampleOff: ProductDto = {
  ...sampleCustom,
  id: "off:123",
  isReadonly: true,
  name: "OFF Yogurt",
  sourceKey: "off",
  sourceLabel: "Open Food Facts",
  visibility: "public",
};

describe("ProductsService catalog merge", () => {
  it("merges mongo and catalog search results", async () => {
    const repository = {
      listProducts: vi.fn(async () => ({
        items: [sampleCustom],
        selectedSources: ["custom"],
        total: 1,
      })),
      listSources: vi.fn(async () => [
        {
          description: "",
          key: "custom",
          label: "Мои продукты",
        },
      ]),
      createProduct: vi.fn(),
      deleteProduct: vi.fn(),
      getProductById: vi.fn(),
    } as unknown as ProductsRepositoryContract;

    const provider: ProductCatalogProvider = {
      meta: {
        description: "OFF",
        key: "off",
        label: "Open Food Facts",
      },
      getByExternalId: vi.fn(async () => sampleOff),
      search: vi.fn(async () => ({ items: [sampleOff], total: 1 })),
    };

    const service = new ProductsService(
      repository,
      new CatalogRegistry([provider]),
      1_000
    );

    const result = await service.listProducts({
      limit: 20,
      offset: 0,
      search: "yo",
      sourceKeys: [],
      userId: "user-1",
    });

    expect(result.items.map((item) => item.id).sort()).toEqual([
      "custom:1",
      "off:123",
    ]);
    expect(provider.search).toHaveBeenCalled();
  });

  it("imports catalog product into custom", async () => {
    const repository = {
      createProduct: vi.fn(async (_userId, payload) => ({
        ...sampleCustom,
        ...payload,
        id: "custom:imported",
      })),
      deleteProduct: vi.fn(),
      getProductById: vi.fn(),
      listProducts: vi.fn(),
      listSources: vi.fn(),
    } as unknown as ProductsRepositoryContract;

    const provider: ProductCatalogProvider = {
      meta: {
        description: "OFF",
        key: "off",
        label: "Open Food Facts",
      },
      getByExternalId: vi.fn(async () => sampleOff),
      search: vi.fn(),
    };

    const service = new ProductsService(
      repository,
      new CatalogRegistry([provider]),
      1_000
    );

    const imported = await service.importFromCatalog("user-1", "off", "123");

    expect(provider.getByExternalId).toHaveBeenCalledWith("123");
    expect(repository.createProduct).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({
        name: "OFF Yogurt",
        visibility: "private",
      })
    );
    expect(imported.id).toBe("custom:imported");
  });
});
