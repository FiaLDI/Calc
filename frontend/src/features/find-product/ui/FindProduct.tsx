import { Product, PRODUCT_CATEGORIES, ProductCategory } from "@/entities/products/model/types";
import { AddProductForm } from "@/features/add-product";
import { Modal } from "@/shared/ui/modal";
import { useMemo, useState } from "react";
import Image from "next/image";

const ALL_CATEGORIES = "all";
const ALL_SOURCES = "all";

export const FindProductForm = ({
    productPickerModal, 
    addProductModal, 
    products, 
    selectedProductId, 
    setSelectedProductId, 
    removeProduct
}: {
    productPickerModal: any, 
    addProductModal: any, 
    products: Product[], 
    selectedProductId: string, 
    setSelectedProductId: (id: string) => void, 
    removeProduct: (id: string) => void
}) => {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<
        ProductCategory | typeof ALL_CATEGORIES
    >(ALL_CATEGORIES);
    const [sourceFilter, setSourceFilter] = useState(ALL_SOURCES);

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

    const selectProduct = (productId: string) => {
        setSelectedProductId(productId);
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
                        <div
                            key={product.id}
                            className={`rounded-3xl border p-3 transition ${
                            isSelected
                                ? "border-emerald-300 bg-emerald-50 shadow-md"
                                : "border-zinc-100 bg-zinc-50 hover:border-emerald-200 hover:bg-white hover:shadow-md"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => selectProduct(product.id)}
                                className="flex w-full min-h-[88px] items-start gap-3 text-left"
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

                            {!product.isReadonly ? (
                            <button
                                type="button"
                                onClick={() => {
                                const shouldRemove = window.confirm(
                                    "Удалить продукт из личной базы? История в дневнике сохранится."
                                );

                                if (shouldRemove) {
                                    removeProduct(product.id);
                                }
                                }}
                                className="mt-3 rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-900 hover:text-white"
                            >
                                Удалить
                            </button>
                            ) : null}
                        </div>
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
    )
}