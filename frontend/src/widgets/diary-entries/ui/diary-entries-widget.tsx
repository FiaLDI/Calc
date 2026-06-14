"use client";

import { useState } from "react";

import { observer } from "mobx-react-lite";
import Image from "next/image";

import { useDateStore } from "@/entities/date";
import { MEAL_TYPES, type MealType, useProductsStore } from "@/entities/products";
import { formatLongDay } from "@/shared/lib/format";

export const DiaryEntriesWidget = observer(() => {
  const productsStore = useProductsStore();
  const dateStore = useDateStore();
  const entries = productsStore.selectedEntries(dateStore.selectedDate);
  const products = productsStore.products;
  const selectedDayTotals = productsStore.selectedDayTotals(
    dateStore.selectedDate
  );
  const [editingEntryId, setEditingEntryId] = useState("");
  const [editProductId, setEditProductId] = useState("");
  const [editAmountValue, setEditAmountValue] = useState("100");
  const [editMealType, setEditMealType] = useState<MealType>("Завтрак");

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">Дневник питания</p>
          <h2 className="text-2xl font-bold">
            {formatLongDay(dateStore.selectedDate)}
          </h2>
        </div>

        <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-right">
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
        <div className="min-h-0 flex-1 space-y-3 overflow-auto pr-1">
          {entries.map((entry) => {
            const isEditing = editingEntryId === entry.id;

            return (
              <div
                key={entry.id}
                className="rounded-3xl border border-zinc-100 bg-zinc-50 p-3 transition hover:bg-white hover:shadow-md"
              >
                {isEditing ? (
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();

                      if (!editProductId) {
                        return;
                      }

                      const editProduct = products.find(
                        (product) => product.id === editProductId
                      );
                      const editMultiplier = editProduct
                        ? Number(editAmountValue) / editProduct.amountValue
                        : Number(editAmountValue);

                      productsStore.updateEntry(
                        entry.id,
                        editProductId,
                        editMultiplier,
                        editMealType
                      );
                      setEditingEntryId("");
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
                            const nextProduct = products.find(
                              (product) => product.id === nextProductId
                            );

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
                            {products.find(
                              (product) => product.id === editProductId
                            )?.amountUnit || entry.amountUnit}
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
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
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
                          <h3 className="font-semibold text-zinc-900">
                            {entry.productName}
                          </h3>
                          <p className="text-xs text-zinc-500">
                            {Math.round(entry.amountValue * entry.servings * 10) /
                              10}{" "}
                            {entry.amountUnit}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-start gap-2">
                        <div className="text-right">
                          <p className="font-semibold">{entry.calories} ккал</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const productExists = products.some(
                              (product) => product.id === entry.productId
                            );

                            setEditingEntryId(entry.id);
                            setEditProductId(
                              productExists
                                ? entry.productId
                                : products[0]?.id || ""
                            );
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
                          onClick={() => productsStore.removeEntry(entry.id)}
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
    </div>
  );
});
