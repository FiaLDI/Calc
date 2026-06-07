"use client";

import { useEffect, useMemo, useState } from "react";

import { observer } from "mobx-react-lite";
import Image from "next/image";

import {
  MEAL_TYPES,
  PRODUCT_CATEGORIES,
  type MealType,
  type ProductCategory,
  useNutritionStore,
} from "@/entities/nutrition";
import { Modal, useModal } from "@/shared/ui/modal";

const ALL_CATEGORIES = "all";
const ALL_SOURCES = "all";

export const AddDiaryEntryForm = observer(() => {
  const nutritionStore = useNutritionStore();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [servings, setServings] = useState("1");
  const [mealType, setMealType] = useState<MealType>("Завтрак");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    ProductCategory | typeof ALL_CATEGORIES
  >(ALL_CATEGORIES);
  const [sourceFilter, setSourceFilter] = useState(ALL_SOURCES);
  const productPickerModal = useModal();

  const products = nutritionStore.products;
  const productsSignature = products.map((product) => product.id).join("|");

  useEffect(() => {
    const productIds = productsSignature ? productsSignature.split("|") : [];
    const firstProductId = productIds[0] || "";

    if (!firstProductId) {
      setSelectedProductId("");
      return;
    }

    setSelectedProductId((currentId) => {
      if (currentId && productIds.includes(currentId)) {
        return currentId;
      }

      return firstProductId;
    });
  }, [productsSignature]);

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );
  const sourceFilters = useMemo(
    () =>
      Array.from(
        new Map(
          products.map((product) => [product.sourceKey, product.sourceLabel])
        )
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
        categoryFilter === ALL_CATEGORIES || product.category === categoryFilter;
      const matchesSource =
        sourceFilter === ALL_SOURCES || product.sourceKey === sourceFilter;

      return matchesSearch && matchesCategory && matchesSource;
    });
  }, [categoryFilter, products, search, sourceFilter]);

  const parsedServings = Math.max(0.1, Number(servings) || 1);

  const selectProduct = (productId: string) => {
    setSelectedProductId(productId);
    productPickerModal.close();
  };

  return (
    <div className="w-full rounded-[2rem] bg-white p-6 shadow-xl">
      <div className="mb-5">
        <p className="text-sm text-zinc-400">Дневник питания</p>
        <h2 className="text-2xl font-bold">Добавить прием пищи</h2>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();

          if (!selectedProductId) {
            return;
          }

          nutritionStore.addEntry(selectedProductId, parsedServings, mealType);
          setServings("1");
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Продукт
          </label>

          <button
            type="button"
            onClick={productPickerModal.open}
            disabled={products.length === 0}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:border-emerald-300 hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
          >
            {selectedProduct ? (
              <span className="flex min-w-0 items-center gap-3">
                {selectedProduct.imageUrl ? (
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.imageAlt}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-emerald-700">
                    {selectedProduct.name.slice(0, 1).toUpperCase()}
                  </span>
                )}

                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-zinc-900">
                    {selectedProduct.name}
                  </span>
                  <span className="mt-1 block truncate text-xs text-zinc-500">
                    {selectedProduct.category} · {selectedProduct.sourceLabel}
                  </span>
                </span>
              </span>
            ) : (
              <span className="py-3 text-sm text-zinc-500">
                Каталог загружается
              </span>
            )}

            <span className="shrink-0 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">
              Выбрать
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Порций
            </label>

            <input
              type="number"
              min={0.1}
              step="0.1"
              value={servings}
              onChange={(event) => setServings(event.target.value)}
              placeholder="1"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Прием пищи
            </label>

            <select
              value={mealType}
              onChange={(event) => setMealType(event.target.value as MealType)}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            >
              {MEAL_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-3xl bg-emerald-50 p-4">
          <p className="mb-3 text-sm font-semibold text-emerald-800">
            Предпросмотр
          </p>

          {selectedProduct ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {selectedProduct.imageUrl ? (
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.imageAlt}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-emerald-700">
                      {selectedProduct.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-zinc-900">
                        {selectedProduct.name}
                      </h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                        {selectedProduct.sourceLabel}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-500">
                      {parsedServings} x {selectedProduct.amountValue}{" "}
                      {selectedProduct.amountUnit} · {mealType}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-zinc-900">
                    {Math.round(selectedProduct.calories * parsedServings)}
                  </p>
                  <p className="text-xs text-zinc-500">ккал</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                  Б{" "}
                  {Math.round(selectedProduct.protein * parsedServings * 10) /
                    10}
                  г
                </span>

                <span className="rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-700">
                  У{" "}
                  {Math.round(selectedProduct.carbs * parsedServings * 10) / 10}
                  г
                </span>

                <span className="rounded-full bg-rose-100 px-2.5 py-1 font-medium text-rose-700">
                  Ж {Math.round(selectedProduct.fat * parsedServings * 10) / 10}г
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              Когда в каталоге появится хотя бы один продукт, здесь появится
              расчет записи.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!selectedProduct}
          className="w-full rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Добавить в дневник
        </button>
      </form>

      <Modal
        isOpen={productPickerModal.isOpen}
        labelledBy="product-picker-title"
        maxWidthClassName="max-w-3xl"
        onClose={productPickerModal.close}
      >
            <div className="border-b border-zinc-100 p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Каталог продуктов</p>
                  <h3 id="product-picker-title" className="text-2xl font-bold">
                    Выбрать продукт
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={productPickerModal.close}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xl font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-white"
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Поиск продукта"
                  autoFocus
                  className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                />

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value as
                        | ProductCategory
                        | typeof ALL_CATEGORIES
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

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {filteredProducts.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredProducts.map((product) => {
                    const isSelected = product.id === selectedProductId;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => selectProduct(product.id)}
                        className={`flex min-h-[112px] items-start gap-3 rounded-3xl border p-3 text-left transition ${
                          isSelected
                            ? "border-emerald-300 bg-emerald-50 shadow-md"
                            : "border-zinc-100 bg-zinc-50 hover:border-emerald-200 hover:bg-white hover:shadow-md"
                        }`}
                      >
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.imageAlt}
                            width={80}
                            height={80}
                            className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                          />
                        ) : (
                          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-bold text-emerald-700">
                            {product.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}

                        <span className="min-w-0 flex-1">
                          <span className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-zinc-900">
                              {product.name}
                            </span>
                            {isSelected ? (
                              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                                Выбран
                              </span>
                            ) : null}
                          </span>

                          <span className="block text-xs text-zinc-500">
                            {product.category} · {product.sourceLabel}
                          </span>
                          <span className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                            <span className="rounded-full bg-white px-2 py-1 font-medium text-zinc-700">
                              {product.calories} ккал
                            </span>
                            <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
                              Б {product.protein}г
                            </span>
                            <span className="rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-700">
                              У {product.carbs}г
                            </span>
                            <span className="rounded-full bg-rose-100 px-2 py-1 font-medium text-rose-700">
                              Ж {product.fat}г
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
                  По этим фильтрам ничего не найдено.
                </div>
              )}
            </div>
      </Modal>
    </div>
  );
});
