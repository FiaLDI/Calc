"use client";

import { useEffect, useMemo, useState } from "react";

import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "./types";
import type { ProductSourceApiItem } from "./api";

export const ALL_PRODUCT_CATEGORIES = "all";
export const ALL_PRODUCT_SOURCES = "all";

export type ProductCategoryFilter =
  | ProductCategory
  | typeof ALL_PRODUCT_CATEGORIES;

type UseProductFiltersOptions = {
  onSearchChange?: (search: string) => void;
  sources?: ProductSourceApiItem[];
};

export const useProductFilters = (
  products: Product[],
  options?: UseProductFiltersOptions
) => {
  const [search, setSearchState] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategoryFilter>(
    ALL_PRODUCT_CATEGORIES
  );
  const [sourceFilter, setSourceFilter] = useState(ALL_PRODUCT_SOURCES);

  const setSearch = (value: string) => {
    setSearchState(value);
    options?.onSearchChange?.(value);
  };

  const sourceFilters = useMemo(() => {
    if (options?.sources?.length) {
      return options.sources.map(
        (source) => [source.key, source.label] as [string, string]
      );
    }

    return Array.from(
      new Map(products.map((product) => [product.sourceKey, product.sourceLabel]))
    );
  }, [options, products]);

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

export const useDebouncedValue = <T,>(value: T, delayMs: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debounced;
};
