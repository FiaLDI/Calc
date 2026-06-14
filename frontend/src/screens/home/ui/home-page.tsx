
import { CalorieSummaryWidget } from "@/widgets/calorie-summary";
import { DayCalendarWidget } from "@/widgets/day-calendar";
import { DiaryAdder } from "@/widgets/diary-adder";
import { DiaryEntriesWidget } from "@/widgets/diary-entries";
import { WeeklyKbjuWidget } from "@/widgets/weekly-kbju";

export const HomePage = () => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid h-[calc(100vh-3rem)] min-h-[720px] gap-4 2xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-4 self-start">
          <CalorieSummaryWidget />
          <DayCalendarWidget />
          <DiaryAdder />
        </div>

        <div className="grid h-full min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
          <DiaryEntriesWidget />
          <WeeklyKbjuWidget />
        </div>
      </div>
    </div>
  );
};
