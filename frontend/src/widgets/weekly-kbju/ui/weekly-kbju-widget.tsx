"use client";

import { useDateStore } from "@/entities/date";
import { type WeeklyKbjuPoint, useDiaryEntriesStore } from "@/entities/entries";
import { observer } from "mobx-react-lite";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const WeeklyKbjuWidget = observer(() => {
  const diaryEntriesStore = useDiaryEntriesStore();
  const dateStore = useDateStore();
  const weeklyKbju = diaryEntriesStore.weeklyKbju(dateStore.weeklyDays);
  const hasNutritionData = weeklyKbju.some(
    ({ carbs, fat, protein }) => carbs > 0 || fat > 0 || protein > 0
  );

  return (
    <section className="flex min-h-[360px] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-4xl bg-white p-4 shadow-xl sm:p-6 xl:h-full xl:min-h-0">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-zinc-400">Статистика за неделю</p>
          <h2 className="text-xl font-bold sm:text-2xl">КБЖУ по дням</h2>
        </div>

        <div className="shrink-0 rounded-2xl bg-zinc-100 px-3 py-2 text-right sm:px-4">
          <p className="text-xs text-zinc-400">Период</p>
          <p className="text-sm font-bold sm:text-base">7 дней</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
          Белки
        </span>
        <span className="rounded-full bg-rose-100 px-3 py-1 font-medium text-rose-700">
          Жиры
        </span>
        <span className="rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-700">
          Углеводы
        </span>
      </div>

      <div className="min-h-[210px] w-full min-w-0 max-w-full flex-1 overflow-hidden rounded-3xl bg-zinc-50/80 px-1 py-3 sm:px-3">
        {hasNutritionData ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ height: 190, width: 320 }}
            minHeight={190}
            minWidth={0}
          >
            <BarChart
              data={weeklyKbju}
              barGap={3}
              barCategoryGap="24%"
              margin={{ bottom: 0, left: 0, right: 8, top: 8 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#e4e4e7"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#71717a" }}
                tickMargin={10}
              />

              <YAxis hide domain={[0, "auto"]} />

              <Tooltip
                cursor={{ fill: "rgba(16, 185, 129, 0.06)" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e4e4e7",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                }}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    protein: "Белки",
                    fat: "Жиры",
                    carbs: "Углеводы",
                  };

                  return [`${value} г`, labels[String(name)]];
                }}
                labelFormatter={(day) => {
                  const currentDay = weeklyKbju.find(
                    (item: WeeklyKbjuPoint) => item.day === day
                  );

                  return `${day} · ${currentDay?.calories ?? 0} ккал`;
                }}
              />

              <Bar
                dataKey="protein"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={14}
              />
              <Bar
                dataKey="fat"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={14}
              />
              <Bar
                dataKey="carbs"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
                maxBarSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full min-h-[190px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-11 w-11 items-end justify-center gap-1 rounded-2xl bg-white p-2 shadow-sm">
              <span className="h-3 w-1.5 rounded-full bg-emerald-400" />
              <span className="h-6 w-1.5 rounded-full bg-rose-400" />
              <span className="h-4 w-1.5 rounded-full bg-orange-400" />
            </div>
            <p className="font-medium text-zinc-700">Пока нет данных за неделю</p>
            <p className="mt-1 max-w-xs text-sm text-zinc-400">
              Добавьте запись в дневник — график появится автоматически.
            </p>
          </div>
        )}
      </div>
    </section>
  );
});
