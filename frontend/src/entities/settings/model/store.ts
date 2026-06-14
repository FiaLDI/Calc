import { makeAutoObservable, runInAction } from "mobx";
import { 
    DEFAULT_NUTRITION_GOAL,
    DEFAULT_TARGET_CALORIES, 
    DEFAULT_TARGET_CARBS, 
    DEFAULT_TARGET_FAT, 
    DEFAULT_TARGET_PROTEIN, 
    DEFAULT_TARGET_WEIGHT_KG, 
    NUTRITION_GOAL_SETTINGS, 
    STORAGE_KEY
} from "./constants";
import { normalizePositive } from "@/shared/lib/format";
import { NUTRITION_GOALS, NutritionGoal } from "./types";

type StoreSnapshot = {
  nutritionGoal: NutritionGoal;
  targetCarbs: number;
  targetCalories: number;
  targetFat: number;
  targetProtein: number;
  targetWeightKg: number;
};

const isNutritionGoal = (value: unknown): value is NutritionGoal =>
  typeof value === "string" &&
  (NUTRITION_GOALS as readonly string[]).includes(value);

class SettingsStore {
  targetCalories = DEFAULT_TARGET_CALORIES;
  targetProtein = DEFAULT_TARGET_PROTEIN;
  targetCarbs = DEFAULT_TARGET_CARBS;
  targetFat = DEFAULT_TARGET_FAT;
  targetWeightKg = DEFAULT_TARGET_WEIGHT_KG;
  nutritionGoal = DEFAULT_NUTRITION_GOAL;
  isHydrated = false;;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  hydrate() {
    if (this.isHydrated || typeof window === "undefined") {
      return;
    }

    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);

      if (!rawState) {
        return;
      }

      const parsedState = JSON.parse(rawState) as Partial<StoreSnapshot>;

      this.targetCalories = normalizePositive(
        parsedState.targetCalories ?? 0,
        DEFAULT_TARGET_CALORIES
      );
      this.targetProtein = normalizePositive(
        parsedState.targetProtein ?? 0,
        DEFAULT_TARGET_PROTEIN
      );
      this.targetCarbs = normalizePositive(
        parsedState.targetCarbs ?? 0,
        DEFAULT_TARGET_CARBS
      );
      this.targetFat = normalizePositive(
        parsedState.targetFat ?? 0,
        DEFAULT_TARGET_FAT
      );
      this.targetWeightKg = normalizePositive(
        parsedState.targetWeightKg ?? 0,
        DEFAULT_TARGET_WEIGHT_KG
      );
      this.nutritionGoal = isNutritionGoal(parsedState.nutritionGoal)
        ? parsedState.nutritionGoal
        : DEFAULT_NUTRITION_GOAL;

    } catch {
      this.targetCalories = DEFAULT_TARGET_CALORIES;
      this.targetProtein = DEFAULT_TARGET_PROTEIN;
      this.targetCarbs = DEFAULT_TARGET_CARBS;
      this.targetFat = DEFAULT_TARGET_FAT;
      this.targetWeightKg = DEFAULT_TARGET_WEIGHT_KG;
      this.nutritionGoal = DEFAULT_NUTRITION_GOAL;
    } finally {
      this.isHydrated = true;
    }
  }

  persist() {
    if (!this.isHydrated || typeof window === "undefined") {
      return;
    }

    const snapshot: StoreSnapshot = {
      nutritionGoal: this.nutritionGoal as NutritionGoal,
      targetCarbs: this.targetCarbs,
      targetCalories: this.targetCalories,
      targetFat: this.targetFat,
      targetProtein: this.targetProtein,
      targetWeightKg: this.targetWeightKg,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  ensureHydrated() {
    if (!this.isHydrated) {
      this.hydrate();
    }
  }

  setTargetCalories(value: number) {
    this.ensureHydrated();
    this.targetCalories = normalizePositive(Math.round(value), 1);
    this.persist();
  }

  setNutritionTargets(targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    goal?: NutritionGoal;
    weightKg?: number;
  }) {
    this.ensureHydrated();
    this.targetCalories = normalizePositive(Math.round(targets.calories), 1);
    this.targetProtein = normalizePositive(targets.protein, 1);
    this.targetCarbs = normalizePositive(targets.carbs, 1);
    this.targetFat = normalizePositive(targets.fat, 1);
    this.targetWeightKg = normalizePositive(
      targets.weightKg ?? this.targetWeightKg,
      DEFAULT_TARGET_WEIGHT_KG
    );
    this.nutritionGoal = isNutritionGoal(targets.goal)
      ? targets.goal
      : this.nutritionGoal;
    this.persist();
  }

  calculateNutritionTargets(weightKg: number, goal: NutritionGoal) {
    const normalizedWeight = normalizePositive(weightKg, DEFAULT_TARGET_WEIGHT_KG);
    const settings = NUTRITION_GOAL_SETTINGS[goal];
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
  }

  get macroTargets() {
    return {
      protein: this.targetProtein,
      carbs: this.targetCarbs,
      fat: this.targetFat,
    };
  }
}

export const createSettingsStore = () =>
  new SettingsStore();
