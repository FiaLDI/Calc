"use client";

import { observer } from "mobx-react-lite";

import {
  ProductCard,
  type ProductCategoryFilter,
  useProductFilters,
  useProductsStore,
} from "@/entities/products";
import { AddProductForm } from "@/features/add-product";
import { Modal, useModal } from "@/shared/ui/modal";

export const ProductLibraryWidget = observer(() => {
  const productsStore = useProductsStore();
  const addProductModal = useModal();
  const products = productsStore.products;
  const hasProducts = products.length > 0;
  const {
    allCategoriesValue,
    allSourcesValue,
    categories,
    categoryFilter,
    filteredProducts,
    search,
    setCategoryFilter,
    setSearch,
    setSourceFilter,
    sourceFilter,
    sourceFilters,
  } = useProductFilters(products);

  const removeCustomProduct = (productId: string) => {
    const shouldRemove = window.confirm(
      "Удалить продукт из личной базы? История в дневнике сохранится."
    );

    if (shouldRemove) {
      void productsStore.removeProduct(productId);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-4xl bg-white p-4 shadow-xl sm:p-6">
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
                setCategoryFilter(event.target.value as ProductCategoryFilter)
              }
              className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            >
              <option value={allCategoriesValue}>Все категории</option>
              {categories.map((category) => (
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
              <option value={allSourcesValue}>Все источники</option>
              {sourceFilters.map(([sourceKey, sourceLabel]) => (
                <option key={sourceKey} value={sourceKey}>
                  {sourceLabel}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {productsStore.remoteProductsError ? (
        <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {productsStore.remoteProductsError}
        </div>
      ) : null}

      {!hasProducts && productsStore.isRemoteProductsLoading ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          Загружаем продукты с сервера...
        </div>
      ) : null}

      {!hasProducts && !productsStore.isRemoteProductsLoading ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          Каталог пока пуст. Проверь backend или добавь продукт вручную через
          форму выше.
        </div>
      ) : null}

      {hasProducts && filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          По этим фильтрам ничего не найдено.
        </div>
      ) : null}

      {filteredProducts.length > 0 ? (
        <div className="h-50 space-y-3 overflow-auto rounded-2xl border border-zinc-200 p-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              onRemove={removeCustomProduct}
              product={product}
            />
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
