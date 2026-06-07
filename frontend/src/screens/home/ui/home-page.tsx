import { AddDiaryEntryForm } from "@/features/add-diary-entry";
import { CalorieSummaryWidget } from "@/widgets/calorie-summary";
import { DayCalendarWidget } from "@/widgets/day-calendar";
import { DiaryEntriesWidget } from "@/widgets/diary-entries";
import { ProductLibraryWidget } from "@/widgets/product-library";
import { WeeklyCaloriesWidget } from "@/widgets/weekly-calories";
import { WeeklyKbjuWidget } from "@/widgets/weekly-kbju";

export const HomePage = () => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid gap-4 2xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-4 self-start">
          <CalorieSummaryWidget />
          <DayCalendarWidget />
          <AddDiaryEntryForm />
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <DiaryEntriesWidget />
          <WeeklyCaloriesWidget />
          <div className="min-w-0 lg:col-span-2">
            <WeeklyKbjuWidget />
          </div>
        </div>

        <div className="grid min-w-0 gap-4 self-start">
          <ProductLibraryWidget />
        </div>
      </div>
    </div>
  );
};
