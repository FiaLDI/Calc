"use client";

import { observer } from "mobx-react-lite";

import { useAuthStore } from "@/entities/auth";
import { DataTransferActions } from "@/features/data-transfer";
import { CalorieSummaryWidget } from "@/widgets/calorie-summary";
import { DayCalendarWidget } from "@/widgets/day-calendar";
import { DiaryAdder } from "@/widgets/diary-adder";
import { DiaryEntriesWidget } from "@/widgets/diary-entries";
import { WeeklyKbjuWidget } from "@/widgets/weekly-kbju";

export const HomePage = observer(() => {
  const authStore = useAuthStore();

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl overflow-x-clip px-3 py-4 sm:px-6 sm:py-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-black text-white">
            C
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900">
              {authStore.user?.username}
            </p>
            <p className="truncate text-xs text-zinc-500">{authStore.user?.email}</p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-start justify-end gap-2">
          <DataTransferActions />
          <button
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-60"
            disabled={authStore.isSubmitting}
            onClick={() => void authStore.logout()}
            type="button"
          >
            Выйти
          </button>
        </div>
      </header>

      <div className="grid gap-4 xl:h-[calc(100vh-8rem)] xl:min-h-[720px] xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-4 self-start">
          <CalorieSummaryWidget />
          <DayCalendarWidget />
          <DiaryAdder />
        </div>

        <div className="grid w-full min-w-0 max-w-full gap-4 overflow-hidden xl:h-full xl:min-h-0 xl:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <DiaryEntriesWidget />
          <WeeklyKbjuWidget />
        </div>
      </div>
    </div>
  );
});
