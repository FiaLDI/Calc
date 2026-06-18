import { ProductsController } from "./api/products.controller.js";
import { createProductsRouter } from "./api/products.routes.js";
import { ProductsService } from "./application/products.service.js";
import { ProductsRepository } from "./infrastructure/products.repository.js";

const productsRepository = new ProductsRepository();
const productsService = new ProductsService(productsRepository);
const productsController = new ProductsController(productsService);

export const productsRouter = createProductsRouter(productsController);
