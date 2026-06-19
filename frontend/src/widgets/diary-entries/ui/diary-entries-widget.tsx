"use client";

import { useMemo, useState } from "react";

import { useDateStore } from "@/entities/date";
import { MEAL_TYPES, type MealType, useDiaryEntriesStore } from "@/entities/entries";
import { useProductsStore } from "@/entities/products";
import { formatLongDay } from "@/shared/lib/format";
import { observer } from "mobx-react-lite";
import Image from "next/image";

export const DiaryEntriesWidget = observer(() => {
  const productsStore = useProductsStore();
  const diaryEntriesStore = useDiaryEntriesStore();
  const dateStore = useDateStore();
  const entries = diaryEntriesStore.selectedEntries(dateStore.selectedDate);
  const products = productsStore.products;
  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );
  const selectedDayTotals = diaryEntriesStore.selectedDayTotals(
    dateStore.selectedDate
  );
  const [editingEntryId, setEditingEntryId] = useState("");
  const [editProductId, setEditProductId] = useState("");
  const [editAmountValue, setEditAmountValue] = useState("100");
  const [editMealType, setEditMealType] = useState<MealType>("Завтрак");

  return (
    <section className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col overflow-hidden rounded-4xl bg-white p-4 shadow-xl sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm text-zinc-400">Дневник питания</p>
          <h2 className="text-2xl font-bold">
            {formatLongDay(dateStore.selectedDate)}
          </h2>
        </div>

        <div className="w-fit shrink-0 rounded-2xl bg-zinc-100 px-4 py-2 text-left sm:text-right">
          <p className="text-xs text-zinc-400">Всего</p>
          <p className="font-bold">{selectedDayTotals.calories} ккал</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="min-h-0 flex-1 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          Пока нет записей за этот день. Добавь прием пищи слева, и статистика
          обновится автоматически.
        </div>
      ) : (
        <div className="min-h-0 min-w-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden pr-1">
          {entries.map((entry) => {
            const isEditing = editingEntryId === entry.id;

            return (
              <div
                key={entry.id}
                className="min-w-0 max-w-full rounded-3xl border border-zinc-100 bg-zinc-50 p-3 transition hover:bg-white hover:shadow-md"
              >
                {isEditing ? (
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();

                      const editProduct = productsById.get(editProductId);

                      if (!editProduct) {
                        return;
                      }

                      const editMultiplier =
                        Number(editAmountValue) / editProduct.amountValue;

                      void diaryEntriesStore
                        .updateEntry(
                          entry.id,
                          editProduct,
                          editMultiplier,
                          editMealType
                        )
                        .then(() => setEditingEntryId(""));
                    }}
                  >
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_96px]">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">
                          Продукт
                        </label>
                        <select
                          value={editProductId}
                          onChange={(event) => {
                            const nextProductId = event.target.value;
                            const nextProduct = productsById.get(nextProductId);

                            setEditProductId(nextProductId);

                            if (nextProduct) {
                              setEditAmountValue(
                                String(nextProduct.amountValue)
                              );
                            }
                          }}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400"
                        >
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} · {product.sourceLabel}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">
                          Количество
                        </label>
                        <div className="grid grid-cols-[minmax(0,1fr)_44px] gap-2">
                          <input
                            type="number"
                            min={0.1}
                            step="0.1"
                            value={editAmountValue}
                            onChange={(event) =>
                              setEditAmountValue(event.target.value)
                            }
                            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400"
                          />
                          <div className="flex items-center justify-center rounded-2xl bg-zinc-100 text-xs font-semibold text-zinc-600">
                            {productsById.get(editProductId)?.amountUnit ||
                              entry.amountUnit}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-500">
                        Прием пищи
                      </label>
                      <select
                        value={editMealType}
                        onChange={(event) =>
                          setEditMealType(event.target.value as MealType)
                        }
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400"
                      >
                        {MEAL_TYPES.map((mealType) => (
                          <option key={mealType} value={mealType}>
                            {mealType}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={!editProductId}
                        className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEntryId("")}
                        className="rounded-full bg-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-300"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-2 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 max-w-full items-start gap-3">
                        {entry.productImageUrl ? (
                          <Image
                            src={entry.productImageUrl}
                            alt={entry.productImageAlt}
                            width={56}
                            height={56}
                            className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-emerald-700">
                            {entry.productName.slice(0, 1).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-xs text-zinc-400">
                            {entry.mealType}
                          </p>
                          <h3 className="break-words font-semibold text-zinc-900">
                            {entry.productName}
                          </h3>
                          <p className="text-xs text-zinc-500">
                            {Math.round(entry.amountValue * entry.servings * 10) /
                              10}{" "}
                            {entry.amountUnit}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
                        <div className="mr-auto sm:mr-0 sm:text-right">
                          <p className="font-semibold">{entry.calories} ккал</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const fallbackProductId = products[0]?.id || "";
                            const editableProductId = productsById.has(
                              entry.productId
                            )
                              ? entry.productId
                              : fallbackProductId;

                            setEditingEntryId(entry.id);
                            setEditProductId(editableProductId);
                            setEditAmountValue(
                              String(
                                Math.round(
                                  entry.amountValue * entry.servings * 10
                                ) / 10
                              )
                            );
                            setEditMealType(entry.mealType);
                          }}
                          className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-300"
                        >
                          Изменить
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void diaryEntriesStore.removeEntry(entry.id)
                          }
                          className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-900 hover:text-white"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                        Б {entry.protein}г
                      </span>
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-700">
                        У {entry.carbs}г
                      </span>
                      <span className="rounded-full bg-rose-100 px-2.5 py-1 font-medium text-rose-700">
                        Ж {entry.fat}г
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
});
