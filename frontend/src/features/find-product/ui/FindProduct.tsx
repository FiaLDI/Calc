import {
  ProductCard,
  type Product,
  type ProductCategoryFilter,
  useProductFilters,
} from "@/entities/products";
import { AddProductForm } from "@/features/add-product";
import { Modal, useModal } from "@/shared/ui/modal";

type FindProductFormProps = {
  addProductModal: ReturnType<typeof useModal>;
  productPickerModal: ReturnType<typeof useModal>;
  products: Product[];
  removeProduct: (id: string) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
};

export const FindProductForm = ({
  addProductModal,
  productPickerModal,
  products,
  removeProduct,
  selectedProductId,
  setSelectedProductId,
}: FindProductFormProps) => {
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
      removeProduct(productId);
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
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400">Каталог продуктов</p>
              <h3 id="product-picker-title" className="text-2xl font-bold">
                Выбрать продукт
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Серверные продукты приходят из нескольких баз, а вручную
                добавленные остаются только твоими.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
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
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск продукта"
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
          {filteredProducts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  isSelected={product.id === selectedProductId}
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
};
