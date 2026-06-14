import { useMemo, useState } from "react";

import type { SettingsStoreInstance } from "@/entities/settings";
import { useModal } from "@/shared/ui/modal";

import type { TargetFormState } from "./types";

export const useSetSettings = (settingsStore: SettingsStoreInstance) => {
  const targetsModal = useModal();
  const [formState, setFormState] = useState<TargetFormState>({
    calories: String(settingsStore.targetCalories),
    protein: String(settingsStore.targetProtein),
    carbs: String(settingsStore.targetCarbs),
    fat: String(settingsStore.targetFat),
    goal: settingsStore.nutritionGoal,
    weightKg: String(settingsStore.targetWeightKg),
  });

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

  const openTargetsModal = () => {
    setFormState({
      calories: String(settingsStore.targetCalories),
      protein: String(settingsStore.targetProtein),
      carbs: String(settingsStore.targetCarbs),
      fat: String(settingsStore.targetFat),
      goal: settingsStore.nutritionGoal,
      weightKg: String(settingsStore.targetWeightKg),
    });
    targetsModal.open();
  };

  const applyAutoTargets = () => {
    const nextTargets = settingsStore.calculateNutritionTargets(
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

  return {
    applyAutoTargets,
    formState,
    macroCalories,
    openTargetsModal,
    parsedTargets,
    setFormState,
    targetDelta,
    targetsModal,
  };
};
