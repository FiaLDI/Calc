"use client";

import { useDateStore } from "@/entities/date";
import { type WeeklyKbjuPoint, useDiaryEntriesStore } from "@/entities/entries";
import { useElementSize } from "@/shared/lib/use-element-size";
import { observer } from "mobx-react-lite";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const WeeklyKbjuWidget = observer(() => {
  const diaryEntriesStore = useDiaryEntriesStore();
  const dateStore = useDateStore();
  const weeklyKbju = diaryEntriesStore.weeklyKbju(dateStore.weeklyDays);
  const { hasSize, height, ref, width } = useElementSize<HTMLDivElement>();

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">Статистика за неделю</p>
          <h2 className="text-2xl font-bold">КБЖУ по дням</h2>
        </div>

        <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-right">
          <p className="text-xs text-zinc-400">Период</p>
          <p className="font-bold">7 дней</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2 text-xs">
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

      <div ref={ref} className="min-h-[180px] min-w-0 flex-1">
        {hasSize ? (
          <BarChart
            width={width}
            height={height}
            data={weeklyKbju}
            barGap={4}
            barCategoryGap={18}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#a1a1aa" }}
            />

            <YAxis hide />

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
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
              radius={[10, 10, 10, 10]}
              barSize={10}
            />

            <Bar
              dataKey="fat"
              fill="#f43f5e"
              radius={[10, 10, 10, 10]}
              barSize={10}
            />

            <Bar
              dataKey="carbs"
              fill="#f97316"
              radius={[10, 10, 10, 10]}
              barSize={10}
            />
          </BarChart>
        ) : null}
      </div>
    </div>
  );
});
