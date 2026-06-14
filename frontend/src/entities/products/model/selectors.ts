import type {
  DiaryEntry,
  MacroProgressItem,
  MacroTargets,
  NutritionTotals,
  WeeklyCaloriesPoint,
  WeeklyDay,
  WeeklyKbjuPoint,
} from "./types";

const emptyTotals: NutritionTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

export const getEntriesByDate = (entries: DiaryEntry[], date: string) =>
  entries
    .filter((entry) => entry.date === date)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

export const getNutritionTotals = (
  entries: DiaryEntry[]
): NutritionTotals =>
  entries.reduce<NutritionTotals>(
    (totals, entry) => ({
      calories: totals.calories + entry.calories,
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat,
    }),
    emptyTotals
  );

export const getDayTotals = (entries: DiaryEntry[], date: string) =>
  getNutritionTotals(getEntriesByDate(entries, date));

export const getMacroProgress = (
  entries: DiaryEntry[],
  macroTargets: MacroTargets,
  date: string
): MacroProgressItem[] => {
  const totals = getDayTotals(entries, date);

  return [
    {
      title: "Белки",
      consumed: totals.protein,
      target: macroTargets.protein,
      percentage: Math.min(
        100,
        Math.round((totals.protein / macroTargets.protein) * 100) || 0
      ),
      colorClass: "bg-emerald-500",
    },
    {
      title: "Углеводы",
      consumed: totals.carbs,
      target: macroTargets.carbs,
      percentage: Math.min(
        100,
        Math.round((totals.carbs / macroTargets.carbs) * 100) || 0
      ),
      colorClass: "bg-orange-500",
    },
    {
      title: "Жиры",
      consumed: totals.fat,
      target: macroTargets.fat,
      percentage: Math.min(
        100,
        Math.round((totals.fat / macroTargets.fat) * 100) || 0
      ),
      colorClass: "bg-rose-500",
    },
  ];
};

export const getWeeklyCalories = (
  entries: DiaryEntry[],
  weeklyDays: WeeklyDay[]
): WeeklyCaloriesPoint[] =>
  weeklyDays.map(({ dateKey, day }) => ({
    day,
    calories: getDayTotals(entries, dateKey).calories,
  }));

export const getWeeklyKbju = (
  entries: DiaryEntry[],
  weeklyDays: WeeklyDay[]
): WeeklyKbjuPoint[] =>
  weeklyDays.map(({ dateKey, day }) => ({
    day,
    ...getDayTotals(entries, dateKey),
  }));

export const getWeeklyCaloriesStats = (
  entries: DiaryEntry[],
  weeklyDays: WeeklyDay[]
) => {
  const calories = getWeeklyCalories(entries, weeklyDays).map(
    (item) => item.calories
  );

  return {
    average: calories.length
      ? Math.round(calories.reduce((sum, value) => sum + value, 0) / calories.length)
      : 0,
    max: calories.length ? Math.max(...calories) : 0,
    min: calories.length ? Math.min(...calories) : 0,
  };
};
