"use client";

import { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";

import {
  MEAL_TYPES,
  type MealType,
  useNutritionStore,
} from "@/entities/nutrition";

export const AddDiaryEntryForm = observer(() => {
  const nutritionStore = useNutritionStore();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [servings, setServings] = useState("1");
  const [mealType, setMealType] = useState<MealType>("Завтрак");

  useEffect(() => {
    if (!nutritionStore.products.length) {
      setSelectedProductId("");
      return;
    }

    setSelectedProductId((currentId) => {
      if (
        currentId &&
        nutritionStore.products.some((product) => product.id === currentId)
      ) {
        return currentId;
      }

      return nutritionStore.products[0].id;
    });
  }, [nutritionStore.products.length]);

  const selectedProduct = nutritionStore.products.find(
    (product) => product.id === selectedProductId
  );

  const parsedServings = Math.max(0.1, Number(servings) || 1);

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

          <select
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
          >
            {nutritionStore.products.length === 0 ? (
              <option value="">Сначала добавь продукт в базу</option>
            ) : null}

            {nutritionStore.products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
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
                <div>
                  <h3 className="font-semibold text-zinc-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {parsedServings} x {selectedProduct.amountValue}{" "}
                    {selectedProduct.amountUnit} · {mealType}
                  </p>
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
                  Б {Math.round(selectedProduct.protein * parsedServings * 10) / 10}г
                </span>

                <span className="rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-700">
                  У {Math.round(selectedProduct.carbs * parsedServings * 10) / 10}г
                </span>

                <span className="rounded-full bg-rose-100 px-2.5 py-1 font-medium text-rose-700">
                  Ж {Math.round(selectedProduct.fat * parsedServings * 10) / 10}г
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              Когда в базе появится хотя бы один продукт, здесь появится расчет
              записи.
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
    </div>
  );
});
