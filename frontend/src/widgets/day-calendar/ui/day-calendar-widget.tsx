"use client";

import { useEffect, useState } from "react";

import { useDateStore } from "@/entities/date";
import { observer } from "mobx-react-lite";

export const DayCalendarWidget = observer(() => {
  const dateStore = useDateStore();
  const [isMounted, setIsMounted] = useState(false);
  const isTodaySelected = dateStore.selectedDate === dateStore.todayDateKey;
  const canSelectNextDay = isMounted && dateStore.canSelectNextDay;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-4xl bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Выберите день</h2>
          <p className="text-sm text-zinc-400">
            {isTodaySelected ? "Сегодня выбрано" : "Прошлый день"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={dateStore.selectPreviousDay}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-lg font-semibold text-zinc-700 transition hover:bg-zinc-200"
            aria-label="Предыдущий день"
          >
            {"<"}
          </button>

          <button
            type="button"
            onClick={dateStore.selectNextDay}
            disabled={!canSelectNextDay}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-semibold transition ${
              canSelectNextDay
                ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300"
            }`}
            aria-label="Следующий день"
          >
            {">"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {dateStore.calendarDays.map((day) => {
          const isActive = day.dateKey === dateStore.selectedDate;

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => dateStore.setSelectedDate(day.dateKey)}
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
              <p className="mt-1 break-words text-sm font-bold">{day.longLabel}</p>
            </button>
          );
        })}
        {!isTodaySelected ? (
          <button
            type="button"
            onClick={dateStore.selectToday}
            className="col-span-2 h-full w-full rounded-3xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Вернуться к сегодня
          </button>
        ) : null}
      </div>
    </div>
  );
});
