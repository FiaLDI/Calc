import { CatalogProductsRepository } from "./catalog-products.repository.js";
import { ProductModel } from "./products.schema.js";
import { RecipeProductsRepository } from "./recipe-products.repository.js";
import { WarehouseProductsRepository } from "./warehouse-products.repository.js";

const seedRepositories = [
  new WarehouseProductsRepository(),
  new CatalogProductsRepository(),
  new RecipeProductsRepository(),
];

const parseDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export const seedProducts = async () => {
  const products = (await Promise.all(
    seedRepositories.map((repository) => repository.listProducts())
  )).flat();

  if (products.length === 0) {
    return;
  }

  const result = await ProductModel.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: {
          externalId: product.id,
        },
        update: {
          $setOnInsert: {
            amountUnit: product.amountUnit,
            amountValue: product.amountValue,
            calories: product.calories,
            carbs: product.carbs,
            category: product.category,
            createdAt: parseDate(product.createdAt),
            externalId: product.id,
            fat: product.fat,
            imageAlt: product.imageAlt,
            imageUrl: product.imageUrl,
            isReadonly: product.isReadonly,
            name: product.name,
            protein: product.protein,
            sourceKey: product.sourceKey,
            sourceLabel: product.sourceLabel,
            userId: null,
          },
        },
        upsert: true,
      },
    }))
  );

  if (result.upsertedCount > 0) {
    console.log(`Products seeded: ${result.upsertedCount}`);
  }
};
