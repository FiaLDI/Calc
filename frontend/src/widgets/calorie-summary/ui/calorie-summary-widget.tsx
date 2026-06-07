"use client";

import { useMemo, useState } from "react";

import { observer } from "mobx-react-lite";

import {
  NUTRITION_GOALS,
  type NutritionGoal,
  useNutritionStore,
} from "@/entities/nutrition";
import { Modal, useModal } from "@/shared/ui/modal";

type TargetFormState = {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  goal: NutritionGoal;
  weightKg: string;
};

const FALLBACK_TARGET_WEIGHT_KG = 70;
const FALLBACK_NUTRITION_GOAL: NutritionGoal = "Поддержание";
const FALLBACK_TARGET_PROTEIN = 150;
const FALLBACK_TARGET_CARBS = 200;
const FALLBACK_TARGET_FAT = 67;

const GOAL_SETTINGS: Record<
  NutritionGoal,
  {
    caloriesPerKg: number;
    fatPerKg: number;
    proteinPerKg: number;
  }
> = {
  Сушка: {
    caloriesPerKg: 28,
    fatPerKg: 0.8,
    proteinPerKg: 2.1,
  },
  Поддержание: {
    caloriesPerKg: 32,
    fatPerKg: 0.9,
    proteinPerKg: 1.7,
  },
  Набор: {
    caloriesPerKg: 36,
    fatPerKg: 1,
    proteinPerKg: 1.9,
  },
};

const calculateNutritionTargets = (weightKg: number, goal: NutritionGoal) => {
  const normalizedWeight =
    Number.isFinite(weightKg) && weightKg > 0
      ? weightKg
      : FALLBACK_TARGET_WEIGHT_KG;
  const settings = GOAL_SETTINGS[goal];
  const calories = Math.round(normalizedWeight * settings.caloriesPerKg);
  const protein = Math.round(normalizedWeight * settings.proteinPerKg);
  const fat = Math.round(normalizedWeight * settings.fatPerKg);
  const carbs = Math.max(
    1,
    Math.round((calories - protein * 4 - fat * 9) / 4)
  );

  return {
    calories,
    protein,
    carbs,
    fat,
  };
};

type NutritionStoreWithOptionalTargets = ReturnType<typeof useNutritionStore> & {
  setNutritionTargets?: (targets: {
    calories: number;
    carbs: number;
    fat: number;
    goal?: NutritionGoal;
    protein: number;
    weightKg?: number;
  }) => void;
};

export const CalorieSummaryWidget = observer(() => {
  const nutritionStore =
    useNutritionStore() as NutritionStoreWithOptionalTargets;
  const targetProtein =
    nutritionStore.targetProtein ?? FALLBACK_TARGET_PROTEIN;
  const targetCarbs = nutritionStore.targetCarbs ?? FALLBACK_TARGET_CARBS;
  const targetFat = nutritionStore.targetFat ?? FALLBACK_TARGET_FAT;
  const targetWeightKg =
    nutritionStore.targetWeightKg ?? FALLBACK_TARGET_WEIGHT_KG;
  const nutritionGoal =
    nutritionStore.nutritionGoal ?? FALLBACK_NUTRITION_GOAL;
  const targetsModal = useModal();
  const [formState, setFormState] = useState<TargetFormState>({
    calories: String(nutritionStore.targetCalories),
    protein: String(targetProtein),
    carbs: String(targetCarbs),
    fat: String(targetFat),
    goal: nutritionGoal,
    weightKg: String(targetWeightKg),
  });

  const openTargetsModal = () => {
    setFormState({
      calories: String(nutritionStore.targetCalories),
      protein: String(targetProtein),
      carbs: String(targetCarbs),
      fat: String(targetFat),
      goal: nutritionGoal,
      weightKg: String(targetWeightKg),
    });
    targetsModal.open();
  };

  const parsedTargets = useMemo(
    () => ({
      calories: Number(formState.calories) || 0,
      protein: Number(formState.protein) || 0,
      carbs: Number(formState.carbs) || 0,
      fat: Number(formState.fat) || 0,
      goal: formState.goal,
      weightKg: Number(formState.weightKg) || 0,
    }),
    [formState]
  );
  const macroCalories = Math.round(
    parsedTargets.protein * 4 + parsedTargets.carbs * 4 + parsedTargets.fat * 9
  );
  const targetDelta = macroCalories - parsedTargets.calories;
  const caloriesPercent = Math.round(
    (nutritionStore.selectedDayTotals.calories / nutritionStore.targetCalories) *
      100
  );
  const targetSummary = [
    {
      label: nutritionGoal,
      value: `${targetWeightKg}кг`,
      className: "bg-zinc-100 text-zinc-700",
    },
    {
      label: "Белки",
      value: `${targetProtein}г`,
      className: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Жиры",
      value: `${targetFat}г`,
      className: "bg-rose-100 text-rose-700",
    },
    {
      label: "Углеводы",
      value: `${targetCarbs}г`,
      className: "bg-orange-100 text-orange-700",
    },
  ];

  const applyAutoTargets = () => {
    const nextTargets = calculateNutritionTargets(
      parsedTargets.weightKg,
      parsedTargets.goal
    );

    setFormState((currentState) => ({
      ...currentState,
      calories: String(nextTargets.calories),
      protein: String(nextTargets.protein),
      carbs: String(nextTargets.carbs),
      fat: String(nextTargets.fat),
    }));
  };

  return (
    <div className="w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-zinc-400">Калории за день</p>

          <div className="mt-1 flex flex-wrap items-end gap-2">
            <h2 className="text-3xl font-bold">
              {nutritionStore.selectedDayTotals.calories}
            </h2>
            <span className="pb-1 text-sm text-zinc-400">
              / {nutritionStore.targetCalories} ккал
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

          <button
            type="button"
            onClick={openTargetsModal}
            className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
          >
            Цели
          </button>
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

      <Modal
        isOpen={targetsModal.isOpen}
        labelledBy="targets-modal-title"
        onClose={targetsModal.close}
      >
            <div className="border-b border-zinc-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Целевые показатели</p>
                  <h3 id="targets-modal-title" className="text-2xl font-bold">
                    Настроить цели
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={targetsModal.close}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xl font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-white"
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>
            </div>

            <form
              className="p-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (nutritionStore.setNutritionTargets) {
                  nutritionStore.setNutritionTargets({
                    ...parsedTargets,
                    goal: parsedTargets.goal,
                    weightKg: parsedTargets.weightKg,
                  });
                } else {
                  nutritionStore.setTargetCalories(parsedTargets.calories);
                }
                targetsModal.close();
              }}
            >
              <div className="mb-4 grid gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-zinc-600">
                    Вес, кг
                  </span>
                  <input
                    type="number"
                    min={1}
                    step="0.1"
                    value={formState.weightKg}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        weightKg: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <div>
                  <span className="mb-2 block text-sm font-medium text-zinc-600">
                    Цель
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {NUTRITION_GOALS.map((goal) => {
                      const isActive = formState.goal === goal;

                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() =>
                            setFormState((currentState) => ({
                              ...currentState,
                              goal,
                            }))
                          }
                          className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                            isActive
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                          }`}
                        >
                          {goal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyAutoTargets}
                  className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Рассчитать КБЖУ по весу и цели
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-zinc-600">
                    Калории
                  </span>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={formState.calories}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        calories: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-zinc-600">
                    Белки, г
                  </span>
                  <input
                    type="number"
                    min={1}
                    step="0.1"
                    value={formState.protein}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        protein: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-emerald-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-zinc-600">
                    Жиры, г
                  </span>
                  <input
                    type="number"
                    min={1}
                    step="0.1"
                    value={formState.fat}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        fat: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-rose-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-zinc-600">
                    Углеводы, г
                  </span>
                  <input
                    type="number"
                    min={1}
                    step="0.1"
                    value={formState.carbs}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        carbs: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-orange-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
                  />
                </label>
              </div>

              <div className="mt-4 rounded-3xl bg-zinc-50 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-zinc-700">
                    Калории из БЖУ
                  </span>
                  <span className="font-bold text-zinc-900">
                    {macroCalories} ккал
                  </span>
                </div>
                <p
                  className={`mt-1 text-xs ${
                    Math.abs(targetDelta) <= 50
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {targetDelta === 0
                    ? "БЖУ совпадают с целью по калориям."
                    : `${targetDelta > 0 ? "+" : ""}${targetDelta} ккал относительно цели.`}
                </p>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Сохранить цели
                </button>
                <button
                  type="button"
                  onClick={targetsModal.close}
                  className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
                >
                  Отмена
                </button>
              </div>
            </form>
      </Modal>
    </div>
  );
});
