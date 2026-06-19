"use client";

import { observer } from "mobx-react-lite";

import { useAuthStore } from "@/entities/auth";
import { UserProfile } from "@/features/user-profile";
import { CalorieSummaryWidget } from "@/widgets/calorie-summary";
import { DayCalendarWidget } from "@/widgets/day-calendar";
import { DiaryAdder } from "@/widgets/diary-adder";
import { DiaryEntriesWidget } from "@/widgets/diary-entries";
import { WeeklyKbjuWidget } from "@/widgets/weekly-kbju";
import { Header } from "@/widgets/header";

export const HomePage = observer(() => {

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl overflow-x-clip px-3 py-4 sm:px-6 sm:py-6">
      <Header />

      <div className="grid gap-4 xl:h-[calc(100vh-8rem)] xl:min-h-[720px] xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-4 self-start">
          <CalorieSummaryWidget />
          <DayCalendarWidget />
          <DiaryAdder />
        </div>

        <div className="grid w-full min-w-0 max-w-full gap-4 overflow-hidden xl:h-full xl:min-h-0 xl:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <DiaryEntriesWidget />
          <WeeklyKbjuWidget />
        </div>
      </div>
    </div>
  );
});
