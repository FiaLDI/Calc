"use client";

import { observer } from "mobx-react-lite";

import { useNutritionStore } from "@/entities/nutrition";

export const ProductLibraryWidget = observer(() => {
  const nutritionStore = useNutritionStore();
  const hasProducts = nutritionStore.products.length > 0;

  return (
    <div className="w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">База продуктов</p>
          <h2 className="text-2xl font-bold">Каталог и мои продукты</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Серверные продукты приходят из нескольких баз, а вручную добавленные
            остаются только твоими.
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-600">
          {nutritionStore.products.length}
        </div>
      </div>

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

      {hasProducts ? (
        <div className="space-y-3">
          {nutritionStore.products.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl border border-zinc-100 bg-zinc-50 p-4 transition hover:bg-white hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
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
                    {product.amountValue} {product.amountUnit}
                  </p>
                </div>

                <div className="flex items-start gap-3">
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
    </div>
  );
});
