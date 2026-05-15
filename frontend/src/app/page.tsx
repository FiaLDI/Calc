import { AddProductFormFeatures } from "@/feature/product";
import { AddMealFormWidget } from "@/feature/product/eat/ui/product.eat.form.feature";
import { CounterWidget } from "@/widget/counter";
import { AddedProductsWidget, ProductListWidget } from "@/widget/list";

export default function Home() {
  return (
    <div className="mx-auto max-w-6/12">
      <div className="grid gap-6 md:grid-cols-2">
        <CounterWidget />
        <ProductListWidget />
        <AddedProductsWidget/>
        <AddProductFormFeatures />
        <AddMealFormWidget />
      </div>
    </div>
      
  );
}
