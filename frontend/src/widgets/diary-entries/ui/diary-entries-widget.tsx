"use client";

import { observer } from "mobx-react-lite";

import { formatLongDay, useNutritionStore } from "@/entities/nutrition";

export const DiaryEntriesWidget = observer(() => {
  const nutritionStore = useNutritionStore();
  const entries = nutritionStore.selectedEntries;

  return (
    <div className="w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">Дневник питания</p>
          <h2 className="text-2xl font-bold">
            {formatLongDay(nutritionStore.selectedDate)}
          </h2>
        </div>

        <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-right">
          <p className="text-xs text-zinc-400">Всего</p>
          <p className="font-bold">
            {nutritionStore.selectedDayTotals.calories} ккал
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          Пока нет записей за этот день. Добавь прием пищи слева, и статистика
          обновится автоматически.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-3xl border border-zinc-100 bg-zinc-50 p-3 transition hover:bg-white hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-400">{entry.mealType}</p>
                  <h3 className="font-semibold text-zinc-900">
                    {entry.productName}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {entry.servings} x {entry.amountValue} {entry.amountUnit}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <p className="font-semibold">{entry.calories} ккал</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => nutritionStore.removeEntry(entry.id)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
