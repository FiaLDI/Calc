import { HttpError } from "../../../shared/http/http-error.js";
import type {
  ProductCreatePayload,
  ProductListQuery,
  ProductsRepositoryContract,
} from "../domain/products.types.js";

export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepositoryContract) {}

  async listProducts(query: ProductListQuery) {
    return this.productsRepository.listProducts(query);
  }

  async getProductById(userId: string, productId: string) {
    return this.productsRepository.getProductById(userId, productId);
  }

  async createProduct(userId: string, payload: ProductCreatePayload) {
    return this.productsRepository.createProduct(userId, payload);
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

  listSources(userId: string) {
    return this.productsRepository.listSources(userId);
  }
}
