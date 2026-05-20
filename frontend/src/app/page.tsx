import { AddProductFormFeatures } from "@/feature/product";
import { AddMealFormWidget } from "@/feature/product/eat/ui/product.eat.form.feature";
import { CounterWidget } from "@/widget/counter";
import { AddedProductsWidget, ProductListWidget } from "@/widget/list";
import { WeeklyCaloriesChartWidget } from "@/widget/list/charts/calories/WeeklyCaloriesChartWidget";
import { WeeklyKbjuHistogramWidget } from "@/widget/list/charts/kbju/WeeklyKbjuHistogramWidget";
import { CalendarPickerWidget } from "@/widget/list/switchday/ui/switch.day.widget";

export default function Home() {
  return (
    <div className="mx-auto max-w-9/12 w-full h-screen flex items-center p-5">
      <div className="flex w-full h-full gap-3 justify-center">
        <div className="flex flex-col gap-3 h-full">
          <CounterWidget />
          <CalendarPickerWidget />
        </div>
        <div className="flex gap-3">
          <ProductListWidget />
          <WeeklyCaloriesChartWidget />
          <WeeklyKbjuHistogramWidget />
        </div>

         
        {/*<AddedProductsWidget/>
        <AddProductFormFeatures />
        <AddMealFormWidget /> */}
      </div>
    </div>
      
  );
}
