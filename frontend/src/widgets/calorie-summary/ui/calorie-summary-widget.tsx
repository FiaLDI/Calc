"use client";

import { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";

import { useNutritionStore } from "@/entities/nutrition";

export const CalorieSummaryWidget = observer(() => {
  const nutritionStore = useNutritionStore();
  const [targetCaloriesInput, setTargetCaloriesInput] = useState(
    String(nutritionStore.targetCalories)
  );

  useEffect(() => {
    setTargetCaloriesInput(String(nutritionStore.targetCalories));
  }, [nutritionStore.targetCalories]);

  const caloriesPercent = Math.round(
    (nutritionStore.selectedDayTotals.calories / nutritionStore.targetCalories) *
      100
  );

  return (
    <div className="w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">Калории за день</p>

          <div className="mt-1 flex items-end gap-2">
            <h2 className="text-3xl font-bold">
              {nutritionStore.selectedDayTotals.calories}
            </h2>
            <span className="pb-1 text-sm text-zinc-400">
              / {nutritionStore.targetCalories} ккал
            </span>
          </div>

          <div className="flex gap-3">
            <label className="mt-3 block text-xs text-zinc-400">
              Цель на день
            </label>

            <input
              type="number"
              value={targetCaloriesInput}
              min={1}
              inputMode="numeric"
              onBlur={() => {
                if (!targetCaloriesInput.trim()) {
                  setTargetCaloriesInput(String(nutritionStore.targetCalories));
                }
              }}
              onChange={(event) => {
                const nextValue = event.target.value;
                setTargetCaloriesInput(nextValue);

                if (!nextValue.trim()) {
                  return;
                }

                nutritionStore.setTargetCalories(Number(nextValue));
              }}
              className="mt-1 w-28 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-emerald-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="absolute right-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-sm font-bold text-emerald-600">
            {Number.isFinite(caloriesPercent) ? caloriesPercent : 0}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {nutritionStore.macroProgress.map((item) => (
          <div key={item.title}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{item.title}</span>
              <span className="text-zinc-500">
                {item.consumed} / {item.target} г
              </span>
            </div>

            <div className="h-2 rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full ${item.colorClass}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
