import { Router } from "express";

import { ProductsController } from "../controllers/products.controller.js";
import { CatalogProductsRepository } from "../repositories/catalog-products.repository.js";
import { RecipeProductsRepository } from "../repositories/recipe-products.repository.js";
import { WarehouseProductsRepository } from "../repositories/warehouse-products.repository.js";
import { ProductsService } from "../services/products.service.js";

const repositories = [
  new WarehouseProductsRepository(),
  new CatalogProductsRepository(),
  new RecipeProductsRepository(),
];

const productsService = new ProductsService(repositories);
const productsController = new ProductsController(productsService);

export const productsRouter = Router();

productsRouter.get("/products", productsController.getProducts);
productsRouter.get("/products/:id", productsController.getProductById);
productsRouter.get("/product-sources", productsController.getSources);
