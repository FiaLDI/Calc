import { useState } from "react";

import type { createDateStore } from "@/entities/date";
import {
  MEAL_TYPES,
  type DiaryEntriesInstance,
  type MealType,
} from "@/entities/entries";
import type { Product } from "@/entities/products";
import { roundToOneDecimal } from "@/shared/lib/format";
import { useModal } from "@/shared/ui/modal";
import Image from "next/image";

type AddProductEntryFormProps = {
  dateStore: ReturnType<typeof createDateStore>;
  diaryEntriesStore: DiaryEntriesInstance;
  productPickerModal: ReturnType<typeof useModal>;
  products: Product[];
  selectedProductId: string;
};

export const AddProductEntryForm = ({
  dateStore,
  diaryEntriesStore,
  productPickerModal,
  products,
  selectedProductId,
}: AddProductEntryFormProps) => {
  const [mealType, setMealType] = useState<MealType>("Завтрак");
  const [amountState, setAmountState] = useState({
    productId: "",
    value: "100",
  });

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );
  const amountValue =
    amountState.productId === selectedProductId
      ? amountState.value
      : String(selectedProduct?.amountValue ?? 100);
  const parsedAmountValue = Math.max(
    0.1,
    Number(amountValue) || selectedProduct?.amountValue || 1
  );
  const amountMultiplier = selectedProduct
    ? parsedAmountValue / selectedProduct.amountValue
    : 1;
  const previewCalories = selectedProduct
    ? Math.round(selectedProduct.calories * amountMultiplier)
    : 0;
  const previewProtein = selectedProduct
    ? roundToOneDecimal(selectedProduct.protein * amountMultiplier)
    : 0;
  const previewCarbs = selectedProduct
    ? roundToOneDecimal(selectedProduct.carbs * amountMultiplier)
    : 0;
  const previewFat = selectedProduct
    ? roundToOneDecimal(selectedProduct.fat * amountMultiplier)
    : 0;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (!selectedProduct) {
          return;
        }

        diaryEntriesStore.addEntry(
          selectedProduct,
          amountMultiplier,
          mealType,
          dateStore.selectedDate
        );
      }}
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Продукт
        </label>

        <button
          type="button"
          onClick={productPickerModal.open}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:border-emerald-300 hover:bg-white"
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
              Открыть каталог или добавить продукт
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
            Количество
          </label>

          <div className="grid grid-cols-[minmax(0,1fr)_56px] gap-2">
            <input
              type="number"
              min={0.1}
              step="0.1"
              value={amountValue}
              onChange={(event) =>
                setAmountState({
                  productId: selectedProductId,
                  value: event.target.value,
                })
              }
              placeholder="100"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            />
            <div className="flex items-center justify-center rounded-2xl bg-zinc-100 text-sm font-semibold text-zinc-600">
              {selectedProduct?.amountUnit || "г"}
            </div>
          </div>
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
                    {parsedAmountValue} {selectedProduct.amountUnit} · {mealType}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-zinc-900">{previewCalories}</p>
                <p className="text-xs text-zinc-500">ккал</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                Б {previewProtein}г
              </span>

              <span className="rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-700">
                У {previewCarbs}г
              </span>

              <span className="rounded-full bg-rose-100 px-2.5 py-1 font-medium text-rose-700">
                Ж {previewFat}г
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
  );
};
