"use client";

import { observer } from "mobx-react-lite";
import {
  Area,
  AreaChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useNutritionStore } from "@/entities/nutrition";
import { useElementSize } from "@/shared/lib/use-element-size";

export const WeeklyCaloriesWidget = observer(() => {
  const nutritionStore = useNutritionStore();
  const { hasSize, height, ref, width } = useElementSize<HTMLDivElement>();

  return (
    <div className="min-w-0 w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">Последние 7 дней</p>
          <h2 className="text-2xl font-bold">Калории</h2>
        </div>

        <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-right">
          <p className="text-xs text-emerald-600">Цель</p>
          <p className="font-bold text-emerald-700">
            {nutritionStore.targetCalories}
          </p>
        </div>
      </div>

      <div ref={ref} className="h-56 min-w-0">
        {hasSize ? (
          <AreaChart width={width} height={height} data={nutritionStore.weeklyCalories}>
            <defs>
              <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#a1a1aa" }}
            />

            <YAxis hide />

            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
              formatter={(value) => [`${value} ккал`, "Калории"]}
            />

            <ReferenceLine
              y={nutritionStore.targetCalories}
              stroke="#d4d4d8"
              strokeDasharray="5 5"
            />

            <Area
              type="monotone"
              dataKey="calories"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#caloriesGradient)"
            />
          </AreaChart>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-zinc-100 p-3 text-center">
          <p className="text-xs text-zinc-400">Среднее</p>
          <p className="font-bold">{nutritionStore.weeklyCaloriesStats.average}</p>
        </div>

        <div className="rounded-2xl bg-zinc-100 p-3 text-center">
          <p className="text-xs text-zinc-400">Макс</p>
          <p className="font-bold">{nutritionStore.weeklyCaloriesStats.max}</p>
        </div>

        <div className="rounded-2xl bg-zinc-100 p-3 text-center">
          <p className="text-xs text-zinc-400">Мин</p>
          <p className="font-bold">{nutritionStore.weeklyCaloriesStats.min}</p>
        </div>
      </div>
    </div>
  );
});
