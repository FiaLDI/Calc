import { Router } from "express";

import { asyncHandler } from "../../../shared/http/async-handler.js";
import type { ProductsController } from "./products.controller.js";

export const createProductsRouter = (productsController: ProductsController) => {
  const router = Router();

  router.get("/products", asyncHandler(productsController.getProducts));
  router.post("/products", asyncHandler(productsController.createProduct));
  router.get<{ id: string }>(
    "/products/:id",
    asyncHandler(productsController.getProductById)
  );
  router.delete<{ id: string }>(
    "/products/:id",
    asyncHandler(productsController.deleteProduct)
  );
  router.get("/product-sources", asyncHandler(productsController.getSources));

  return router;
};
