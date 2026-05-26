"use client";

import { observer } from "mobx-react-lite";

import { useNutritionStore } from "@/entities/nutrition";

export const DayCalendarWidget = observer(() => {
  const nutritionStore = useNutritionStore();
  const isTodaySelected =
    nutritionStore.selectedDate === nutritionStore.todayDateKey;

  return (
    <div className="w-full rounded-4xl bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Выберите день</h2>
          <p className="text-sm text-zinc-400">
            {isTodaySelected
              ? "Сегодня выбрано"
              : "Выбран прошлый день, можно быстро вернуться назад"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={nutritionStore.selectPreviousDay}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-lg font-semibold text-zinc-700 transition hover:bg-zinc-200"
            aria-label="Предыдущий день"
          >
            {"<"}
          </button>

          <button
            type="button"
            onClick={nutritionStore.selectNextDay}
            disabled={!nutritionStore.canSelectNextDay}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-semibold transition ${
              nutritionStore.canSelectNextDay
                ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300"
            }`}
            aria-label="Следующий день"
          >
            {">"}
          </button>
        </div>
      </div>

      {!isTodaySelected ? (
        <button
          type="button"
          onClick={nutritionStore.selectToday}
          className="mb-4 w-full rounded-3xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Вернуться к текущему дню
        </button>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {nutritionStore.calendarDays.map((day) => {
          const isActive = day.dateKey === nutritionStore.selectedDate;

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => nutritionStore.setSelectedDate(day.dateKey)}
              className={`rounded-3xl p-3 text-left transition ${
                isActive
                  ? "bg-zinc-900 text-white shadow-lg"
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              }`}
            >
              <p
                className={`text-xs ${
                  isActive ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                {day.shortLabel}
              </p>
              <p className="mt-1 text-sm font-bold">{day.longLabel}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
});
