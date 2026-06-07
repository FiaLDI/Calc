"use client";

import { useState } from "react";

import { observer } from "mobx-react-lite";
import Image from "next/image";

import { AddProductForm } from "@/features/add-product";
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
  useNutritionStore,
} from "@/entities/nutrition";
import { Modal, useModal } from "@/shared/ui/modal";

const ALL_CATEGORIES = "all";
const ALL_SOURCES = "all";

export const ProductLibraryWidget = observer(() => {
  const nutritionStore = useNutritionStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    ProductCategory | typeof ALL_CATEGORIES
  >(ALL_CATEGORIES);
  const [sourceFilter, setSourceFilter] = useState(ALL_SOURCES);
  const addProductModal = useModal();

  const products = nutritionStore.products;
  const hasProducts = products.length > 0;
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const sourceFilters = Array.from(
    new Map(products.map((product) => [product.sourceKey, product.sourceLabel]))
  );
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLocaleLowerCase().includes(normalizedSearch);
    const matchesCategory =
      categoryFilter === ALL_CATEGORIES || product.category === categoryFilter;
    const matchesSource =
      sourceFilter === ALL_SOURCES || product.sourceKey === sourceFilter;

    return matchesSearch && matchesCategory && matchesSource;
  });

  return (
    <div className="w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">База продуктов</p>
          <h2 className="text-2xl font-bold">Каталог и мои продукты</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Серверные продукты приходят из нескольких баз, а вручную добавленные
            остаются только твоими.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-600">
            {products.length}
          </div>

          <button
            type="button"
            onClick={addProductModal.open}
            className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
          >
            Добавить
          </button>
        </div>
      </div>

      {hasProducts ? (
        <div className="mb-4 grid gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск продукта"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as ProductCategory | typeof ALL_CATEGORIES
                )
              }
              className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            >
              <option value={ALL_CATEGORIES}>Все категории</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            >
              <option value={ALL_SOURCES}>Все источники</option>
              {sourceFilters.map(([sourceKey, sourceLabel]) => (
                <option key={sourceKey} value={sourceKey}>
                  {sourceLabel}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {nutritionStore.remoteProductsError ? (
        <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {nutritionStore.remoteProductsError}
        </div>
      ) : null}

      {!hasProducts && nutritionStore.isRemoteProductsLoading ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          Загружаем продукты с сервера...
        </div>
      ) : null}

      {!hasProducts && !nutritionStore.isRemoteProductsLoading ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          Каталог пока пуст. Проверь backend или добавь продукт вручную через форму
          выше.
        </div>
      ) : null}

      {hasProducts && filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          По этим фильтрам ничего не найдено.
        </div>
      ) : null}

      {filteredProducts.length > 0 ? (
        <div className="space-y-3 h-50 overflow-auto rounded-2xl border border-zinc-200 p-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl border border-zinc-100 bg-zinc-50 p-4 transition hover:bg-white hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      width={72}
                      height={72}
                      className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-bold text-emerald-700">
                      {product.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          product.isReadonly
                            ? "bg-sky-100 text-sky-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {product.sourceLabel}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-400">
                      {product.category} · {product.amountValue}{" "}
                      {product.amountUnit}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-start gap-3">
                  <div className="text-right">
                    <p className="font-bold">{product.calories}</p>
                    <p className="text-xs text-zinc-400">ккал</p>
                  </div>

                  {!product.isReadonly ? (
                    <button
                      type="button"
                      onClick={() => {
                        const shouldRemove = window.confirm(
                          "Удалить продукт из личной базы? История в дневнике сохранится."
                        );

                        if (shouldRemove) {
                          nutritionStore.removeProduct(product.id);
                        }
                      }}
                      className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-900 hover:text-white"
                    >
                      Удалить
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                  Б {product.protein}г
                </span>

                <span className="rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-700">
                  У {product.carbs}г
                </span>

                <span className="rounded-full bg-rose-100 px-2.5 py-1 font-medium text-rose-700">
                  Ж {product.fat}г
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Modal
        isOpen={addProductModal.isOpen}
        labelledBy="add-product-title"
        onClose={addProductModal.close}
      >
        <div className="border-b border-zinc-100 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400">Новый продукт</p>
              <h3 id="add-product-title" className="text-2xl font-bold">
                Добавить в базу
              </h3>
            </div>

            <button
              type="button"
              onClick={addProductModal.close}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xl font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-white"
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <AddProductForm
            framed={false}
            onCancel={addProductModal.close}
            onSuccess={addProductModal.close}
          />
        </div>
      </Modal>
    </div>
  );
});
