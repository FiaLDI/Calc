"use client";

import { NUTRITION_GOALS, type SettingsStoreInstance } from "@/entities/settings";
import { Modal } from "@/shared/ui/modal";

import { useSetSettings } from "../model/useSetSettings";

type SetSettingsModalProps = {
  settingsStore: SettingsStoreInstance;
};

export const SetSettingsModal = ({ settingsStore }: SetSettingsModalProps) => {
  const {
    applyAutoTargets,
    formState,
    macroCalories,
    openTargetsModal,
    parsedTargets,
    setFormState,
    targetDelta,
    targetsModal,
  } = useSetSettings(settingsStore);

  return (
    <>
      <button
        type="button"
        onClick={openTargetsModal}
        className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
      >
        Цели
      </button>
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
            settingsStore.setNutritionTargets({
              ...parsedTargets,
              goal: parsedTargets.goal,
              weightKg: parsedTargets.weightKg,
            });
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
              <span className="font-medium text-zinc-700">Калории из БЖУ</span>
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
    </>
  );
};
