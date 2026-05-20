"use client";
import { useState } from "react";

export const CounterWidget = () => {
  const [targetCalories, setTargetCalories] = useState(2000);

  const currentCalories = 1640;

  const caloriesPercent = 
    Math.round((currentCalories / targetCalories) * 100);

  return (
    <div className="w-full h-h-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-start justify-between gap-4 relative">
        <div>
          <p className="text-sm text-zinc-400">Калории сегодня</p>

          <div className="mt-1 flex items-end gap-2">
            <h2 className="text-3xl font-bold">{currentCalories}</h2>
            <span className="pb-1 text-sm text-zinc-400">
              / {targetCalories} ккал
            </span>
          </div>
          <div className="flex gap-3">
            <label className="mt-3 block text-xs text-zinc-400">
              Цель на день
            </label>

            <input
              type="number"
              value={targetCalories}
              min={1}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              className="mt-1 w-28 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-emerald-400 focus:bg-white"
            />
          </div>
          
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 absolute right-0">
          <span className="text-sm font-bold text-emerald-600">
            {caloriesPercent}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {[
          ["Белки", "120 / 160 г", "w-[75%]", "bg-emerald-500"],
          ["Углеводы", "210 / 320 г", "w-[65%]", "bg-orange-500"],
          ["Жиры", "40 / 90 г", "w-[45%]", "bg-rose-500"],
        ].map(([title, value, width, color]) => (
          <div key={title}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{title}</span>
              <span className="text-zinc-500">{value}</span>
            </div>

            <div className="h-2 rounded-full bg-zinc-100">
              <div className={`h-full rounded-full ${width} ${color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};