"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import {
  ProductCard,
  type Product,
  type ProductCategoryFilter,
  useProductFilters,
  useProductsStore,
} from "@/entities/products";
import { AddProductForm } from "@/features/add-product";
import { Modal, useModal } from "@/shared/ui/modal";

type FindProductFormProps = {
  addProductModal: ReturnType<typeof useModal>;
  productPickerModal: ReturnType<typeof useModal>;
  products: Product[];
  removeProduct: (id: string) => Promise<void>;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
};

export const FindProductForm = observer(
  ({
    addProductModal,
    productPickerModal,
    products,
    removeProduct,
    selectedProductId,
    setSelectedProductId,
  }: FindProductFormProps) => {
    const productsStore = useProductsStore();
    const [searchInput, setSearchInput] = useState("");
    const [importingId, setImportingId] = useState<string | null>(null);
    const searchTimerRef = useRef<number | null>(null);
    const {
      allCategoriesValue,
      allSourcesValue,
      categories,
      categoryFilter,
      filteredProducts,
      setCategoryFilter,
      setSearch,
      setSourceFilter,
      sourceFilter,
      sourceFilters,
    } = useProductFilters(products, {
      sources: productsStore.remoteProductSources,
    });

    const runSearch = (rawSearch: string, source: string) => {
      const trimmed = rawSearch.trim();
      void productsStore.loadRemoteProducts({
        search: trimmed.length >= 2 ? trimmed : undefined,
        sources: source === allSourcesValue ? undefined : [source],
      });
    };

    useEffect(() => {
      if (!productPickerModal.isOpen) {
        return;
      }

      runSearch(searchInput, sourceFilter);
      // Only re-run when modal opens or source filter changes — typing uses onChange debounce.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productPickerModal.isOpen, sourceFilter]);

    useEffect(() => {
      return () => {
        if (searchTimerRef.current !== null) {
          window.clearTimeout(searchTimerRef.current);
        }
      };
    }, []);

    const handleSearchChange = (value: string) => {
      setSearchInput(value);
      setSearch(value);

      if (searchTimerRef.current !== null) {
        window.clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = window.setTimeout(() => {
        runSearch(value, sourceFilter);
      }, 350);
    };

    const removeCustomProduct = (productId: string) => {
      const shouldRemove = window.confirm(
        "Удалить продукт из личной базы? История в дневнике сохранится."
      );

      if (shouldRemove) {
        void removeProduct(productId);
      }
    };

    const importCatalogProduct = async (productId: string) => {
      const product = products.find((item) => item.id === productId);

      if (!product) {
        return;
      }

      setImportingId(productId);

      try {
        const imported = await productsStore.importFromCatalog(product);

        if (imported) {
          setSelectedProductId(imported.id);
        }
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : "Не удалось добавить продукт из каталога."
        );
      } finally {
        setImportingId(null);
      }
    };

    return (
      <>
        <Modal
          isOpen={productPickerModal.isOpen}
          labelledBy="product-picker-title"
          maxWidthClassName="max-w-3xl"
          onClose={productPickerModal.close}
        >
          <div className="border-b border-zinc-100 p-4 sm:p-5">
            <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="text-sm text-zinc-400">Каталог продуктов</p>
                <h3 id="product-picker-title" className="text-2xl font-bold">
                  Выбрать продукт
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Введите от 2 символов — запрос уйдёт на сервер и в Open Food
                  Facts. Нужен вход в аккаунт (не локальный режим).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
                <button
                  type="button"
                  onClick={addProductModal.open}
                  className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800"
                >
                  Добавить продукт
                </button>

                <button
                  type="button"
                  onClick={productPickerModal.close}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xl font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-white"
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Поиск: молоко или штрихкод"
                autoFocus
                className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              />

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

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
            {productsStore.remoteProductsError ? (
              <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {productsStore.remoteProductsError}
              </div>
            ) : null}
            {productsStore.isRemoteProductsLoading ? (
              <div className="mb-3 text-sm text-zinc-500">Ищем продукты…</div>
            ) : null}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    isImporting={importingId === product.id}
                    isSelected={product.id === selectedProductId}
                    onImport={importCatalogProduct}
                    onRemove={removeCustomProduct}
                    onSelect={setSelectedProductId}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
                По этим фильтрам ничего не найдено.
              </div>
            )}
          </div>
        </Modal>

        <Modal
          isOpen={addProductModal.isOpen}
          labelledBy="add-product-from-picker-title"
          onClose={addProductModal.close}
        >
          <div className="border-b border-zinc-100 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">Новый продукт</p>
                <h3
                  id="add-product-from-picker-title"
                  className="text-2xl font-bold"
                >
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
      </>
    );
  }
);
