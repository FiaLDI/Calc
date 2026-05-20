"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const weeklyKbju = [
  { day: "Пн", calories: 1820, protein: 120, fat: 58, carbs: 210 },
  { day: "Вт", calories: 1960, protein: 135, fat: 64, carbs: 230 },
  { day: "Ср", calories: 1640, protein: 105, fat: 50, carbs: 190 },
  { day: "Чт", calories: 2100, protein: 142, fat: 70, carbs: 250 },
  { day: "Пт", calories: 1880, protein: 128, fat: 62, carbs: 215 },
  { day: "Сб", calories: 2350, protein: 150, fat: 82, carbs: 290 },
  { day: "Вс", calories: 1720, protein: 112, fat: 55, carbs: 205 },
];

export const WeeklyKbjuHistogramWidget = () => {
  return (
    <div className="max-w-xl rounded-4xl bg-white p-6 shadow-xl">
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

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyKbju} barGap={4} barCategoryGap={18}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#a1a1aa" }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#a1a1aa" }}

              hide 
            />

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

                return [`${value} г`, labels[name as string]];
              }}
              labelFormatter={(day) => {
                const currentDay = weeklyKbju.find((item) => item.day === day);

                return `${day} · ${currentDay?.calories} ккал`;
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
        </ResponsiveContainer>
      </div>
    </div>
  );
};