import { ProductsController } from "./api/products.controller.js";
import { createProductsRouter } from "./api/products.routes.js";
import { ProductsService } from "./application/products.service.js";
import { env } from "../../config/env.js";
import { CatalogRegistry } from "./infrastructure/catalogs/catalog.registry.js";
import { OpenFoodFactsCatalogProvider } from "./infrastructure/catalogs/open-food-facts/off.provider.js";
import { ProductsRepository } from "./infrastructure/products.repository.js";

const productsRepository = new ProductsRepository();
const catalogRegistry = new CatalogRegistry([
  new OpenFoodFactsCatalogProvider(),
]);
const productsService = new ProductsService(
  productsRepository,
  catalogRegistry,
  env.openFoodFacts.timeoutMs
);
const productsController = new ProductsController(productsService);

export const productsRouter = createProductsRouter(productsController);
