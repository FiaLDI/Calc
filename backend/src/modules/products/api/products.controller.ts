import type { Request, Response } from "express";

import { getRequestUserId } from "../../../shared/auth/request-user.js";
import { HttpError } from "../../../shared/http/http-error.js";
import {
  getSingleQueryValue,
  getStringListQuery,
  normalizeNonNegativeInteger,
  normalizePositiveInteger,
} from "../../../shared/http/query.js";
import { ProductsService } from "../application/products.service.js";
import type {
  ProductListQuery,
  ProductResponse,
  ProductsListResponse,
  ProductSourcesResponse,
} from "../domain/products.types.js";
import { parseProductCreatePayload } from "./products.validation.js";

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  getProducts = async (
    request: Request,
    response: Response<ProductsListResponse>
  ) => {
    const query: ProductListQuery = {
      limit: normalizePositiveInteger(getSingleQueryValue(request.query.limit), 50),
      offset: normalizeNonNegativeInteger(
        getSingleQueryValue(request.query.offset),
        0
      ),
      search:
        getSingleQueryValue(request.query.search) ||
        getSingleQueryValue(request.query.q),
      sourceKeys: getStringListQuery(request.query.sources || request.query.source),
    };

    const result = await this.productsService.listProducts(query);

    response.json({
      data: result.items,
      meta: {
        limit: query.limit,
        offset: query.offset,
        search: query.search || null,
        selectedSources: result.selectedSources,
        total: result.total,
      },
    });
  };

  getProductById = async (
    request: Request<{ id: string }>,
    response: Response<ProductResponse>
  ) => {
    const product = await this.productsService.getProductById(request.params.id);

    if (!product) {
      throw new HttpError(404, "Product not found.");
    }

    response.json({
      data: product,
    });
  };

  createProduct = async (request: Request, response: Response<ProductResponse>) => {
    const product = await this.productsService.createProduct(
      getRequestUserId(request),
      parseProductCreatePayload(request.body)
    );

    response.status(201).json({
      data: product,
    });
  };

  deleteProduct = async (
    request: Request<{ id: string }>,
    response: Response
  ) => {
    await this.productsService.deleteProduct(
      getRequestUserId(request),
      request.params.id
    );

    response.status(204).send();
  };

  getSources = async (
    _request: Request,
    response: Response<ProductSourcesResponse>
  ) => {
    response.json({
      data: await this.productsService.listSources(),
    });
  };
}
