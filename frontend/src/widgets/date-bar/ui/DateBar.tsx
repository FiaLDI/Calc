"use client";

import { useEffect, useState } from "react";

import { useDateStore } from "@/entities/date";
import { formatLongDay } from "@/shared/lib/format";
import { Modal, useModal } from "@/shared/ui/modal";
import { DayCalendarWidget } from "@/widgets/day-calendar";
import { observer } from "mobx-react-lite";

export const DateBar = observer(() => {
  const dateStore = useDateStore();
  const calendarModal = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const isTodaySelected = dateStore.selectedDate === dateStore.todayDateKey;
  const canSelectNextDay = isMounted && dateStore.canSelectNextDay;
  const dateLabel = isTodaySelected
    ? `Сегодня · ${formatLongDay(dateStore.selectedDate)}`
    : formatLongDay(dateStore.selectedDate);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="mb-4 flex items-center gap-1 rounded-2xl border border-zinc-200/80 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={dateStore.selectPreviousDay}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-zinc-700 transition hover:bg-zinc-100"
          aria-label="Предыдущий день"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={calendarModal.open}
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          aria-label="Открыть календарь"
        >
          <svg
            className="h-4 w-4 shrink-0 text-zinc-500"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <rect
              x="3"
              y="5"
              width="18"
              height="16"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M3 10h18M8 3v4M16 3v4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="truncate">{dateLabel}</span>
        </button>

        <button
          type="button"
          onClick={dateStore.selectNextDay}
          disabled={!canSelectNextDay}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold transition ${
            canSelectNextDay
              ? "text-zinc-700 hover:bg-zinc-100"
              : "cursor-not-allowed text-zinc-300"
          }`}
          aria-label="Следующий день"
        >
          ›
        </button>
      </div>

      <Modal
        isOpen={calendarModal.isOpen}
        labelledBy="calendar-modal-title"
        maxWidthClassName="max-w-lg"
        onClose={calendarModal.close}
      >
        <div className="border-b border-zinc-100 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-400">Дата</p>
              <h2 id="calendar-modal-title" className="text-xl font-bold">
                Выберите день
              </h2>
            </div>
            <button
              type="button"
              onClick={calendarModal.close}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xl font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-white"
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        </div>
        <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
          <DayCalendarWidget
            framed={false}
            onDaySelected={calendarModal.close}
          />
        </div>
      </Modal>
    </>
  );
});
