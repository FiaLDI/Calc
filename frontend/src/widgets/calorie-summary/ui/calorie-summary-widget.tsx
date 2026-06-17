"use client";

import { useDateStore } from "@/entities/date";
import { useDiaryEntriesStore } from "@/entities/entries";
import { useSettingsStore } from "@/entities/settings";
import { SetSettingsModal } from "@/features/set-settings";
import { observer } from "mobx-react-lite";

export const CalorieSummaryWidget = observer(() => {
  const settingsStore = useSettingsStore();
  const diaryEntriesStore = useDiaryEntriesStore();
  const dateStore = useDateStore();
  const selectedDayTotals = diaryEntriesStore.selectedDayTotals(
    dateStore.selectedDate
  );
  const macroProgress = diaryEntriesStore.macroProgress(
    settingsStore.macroTargets,
    dateStore.selectedDate
  );
  const caloriesPercent = Math.round(
    (selectedDayTotals.calories / settingsStore.targetCalories) * 100
  );
  const targetSummary = [
    {
      label: settingsStore.nutritionGoal,
      value: `${settingsStore.targetWeightKg}кг`,
      className: "bg-zinc-100 text-zinc-700",
    },
    {
      label: "Белки",
      value: `${settingsStore.targetProtein}г`,
      className: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Жиры",
      value: `${settingsStore.targetFat}г`,
      className: "bg-rose-100 text-rose-700",
    },
    {
      label: "Углеводы",
      value: `${settingsStore.targetCarbs}г`,
      className: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-zinc-400">Калории за день</p>

          <div className="mt-1 flex flex-wrap items-end gap-2">
            <h2 className="text-3xl font-bold">
              {selectedDayTotals.calories}
            </h2>
            <span className="pb-1 text-sm text-zinc-400">
              / {settingsStore.targetCalories} ккал
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {targetSummary.map((item) => (
              <span
                key={item.label}
                className={`rounded-full px-2.5 py-1 font-medium ${item.className}`}
              >
                {item.label} {item.value}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <span className="text-sm font-bold text-emerald-600">
              {Number.isFinite(caloriesPercent) ? caloriesPercent : 0}%
            </span>
          </div>

          <SetSettingsModal settingsStore={settingsStore} />
        </div>
      </div>

      <div className="space-y-4">
        {macroProgress.map((item) => (
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
