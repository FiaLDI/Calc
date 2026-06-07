import type { Request, Response } from "express";

import type {
  ProductListQuery,
  ProductResponse,
  ProductsListResponse,
  ProductSourcesResponse,
} from "../model/types.js";
import { ProductsService } from "../services/products.service.js";

const getSingleQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    const firstValue = value[0];
    return typeof firstValue === "string" ? firstValue : "";
  }

  return typeof value === "string" ? value : "";
};

const getStringListQuery = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return (typeof value === "string" ? value : "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizePositiveInteger = (value: string, fallback: number) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    return fallback;
  }

  return parsedValue;
};

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  getProducts = async (request: Request, response: Response<ProductsListResponse>) => {
    const query: ProductListQuery = {
      limit: normalizePositiveInteger(getSingleQueryValue(request.query.limit), 50),
      offset: normalizePositiveInteger(getSingleQueryValue(request.query.offset), 0),
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
    response: Response<ProductResponse | { error: string }>
  ) => {
    const product = await this.productsService.getProductById(request.params.id);

    if (!product) {
      response.status(404).json({
        error: "Product not found.",
      });
      return;
    }

    response.json({
      data: product,
    });
  };

  getSources = (_request: Request, response: Response<ProductSourcesResponse>) => {
    response.json({
      data: this.productsService.listSources(),
    });
  };
}
