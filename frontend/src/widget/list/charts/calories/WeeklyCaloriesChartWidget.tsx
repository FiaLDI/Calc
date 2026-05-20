"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

const weeklyCalories = [
  { day: "Пн", calories: 1820 },
  { day: "Вт", calories: 1960 },
  { day: "Ср", calories: 1640 },
  { day: "Чт", calories: 2100 },
  { day: "Пт", calories: 1880 },
  { day: "Сб", calories: 2350 },
  { day: "Вс", calories: 1720 },
];

export const WeeklyCaloriesChartWidget = () => {
  const targetCalories = 2000;

  return (
    <div className="max-w-sm rounded-[2rem] bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">Неделя</p>
          <h2 className="text-2xl font-bold">Калории</h2>
        </div>

        <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-right">
          <p className="text-xs text-emerald-600">Цель</p>
          <p className="font-bold text-emerald-700">{targetCalories}</p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyCalories}>
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

            <YAxis hide domain={[1200, 2600]} />

            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
              formatter={(value) => [`${value} ккал`, "Калории"]}
            />

            <ReferenceLine
              y={targetCalories}
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
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-zinc-100 p-3 text-center">
          <p className="text-xs text-zinc-400">Среднее</p>
          <p className="font-bold">1924</p>
        </div>

        <div className="rounded-2xl bg-zinc-100 p-3 text-center">
          <p className="text-xs text-zinc-400">Макс</p>
          <p className="font-bold">2350</p>
        </div>

        <div className="rounded-2xl bg-zinc-100 p-3 text-center">
          <p className="text-xs text-zinc-400">Мин</p>
          <p className="font-bold">1640</p>
        </div>
      </div>
    </div>
  );
};
