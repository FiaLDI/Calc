"use client";

import { useMemo, useState } from "react";

import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "./types";

export const ALL_PRODUCT_CATEGORIES = "all";
export const ALL_PRODUCT_SOURCES = "all";

export type ProductCategoryFilter =
  | ProductCategory
  | typeof ALL_PRODUCT_CATEGORIES;

export const useProductFilters = (products: Product[]) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategoryFilter>(
    ALL_PRODUCT_CATEGORIES
  );
  const [sourceFilter, setSourceFilter] = useState(ALL_PRODUCT_SOURCES);

  const sourceFilters = useMemo(
    () =>
      Array.from(
        new Map(products.map((product) => [product.sourceKey, product.sourceLabel]))
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLocaleLowerCase().includes(normalizedSearch);
      const matchesCategory =
        categoryFilter === ALL_PRODUCT_CATEGORIES ||
        product.category === categoryFilter;
      const matchesSource =
        sourceFilter === ALL_PRODUCT_SOURCES ||
        product.sourceKey === sourceFilter;

      return matchesSearch && matchesCategory && matchesSource;
    });
  }, [categoryFilter, products, search, sourceFilter]);

  return {
    allCategoriesValue: ALL_PRODUCT_CATEGORIES,
    allSourcesValue: ALL_PRODUCT_SOURCES,
    categories: PRODUCT_CATEGORIES,
    categoryFilter,
    filteredProducts,
    search,
    setCategoryFilter,
    setSearch,
    setSourceFilter,
    sourceFilter,
    sourceFilters,
  };
};
