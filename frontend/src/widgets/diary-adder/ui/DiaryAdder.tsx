"use client";

import { useState } from "react";

import { useDateStore } from "@/entities/date";
import { useDiaryEntriesStore } from "@/entities/entries";
import { useProductsStore } from "@/entities/products";
import { AddProductEntryForm } from "@/features/add-product-entry";
import { FindProductForm } from "@/features/find-product";
import { useModal } from "@/shared/ui/modal";
import { observer } from "mobx-react-lite";

export const DiaryAdder = observer(() => {
  const productsStore = useProductsStore();
  const diaryEntriesStore = useDiaryEntriesStore();
  const dateStore = useDateStore();
  const [selectedProductId, setSelectedProductId] = useState("");
  const addProductModal = useModal();
  const productPickerModal = useModal();
  const products = productsStore.products;
  const productIds = products.map((product) => product.id);
  const selectedProductExists =
    selectedProductId && productIds.includes(selectedProductId);
  const effectiveSelectedProductId = selectedProductExists
    ? selectedProductId
    : productIds[0] || "";

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-4xl bg-white p-4 shadow-xl sm:p-6">
      <div className="mb-5">
        <p className="text-sm text-zinc-400">Дневник питания</p>
        <h2 className="text-2xl font-bold">Добавить прием пищи</h2>
      </div>

      <AddProductEntryForm
        dateStore={dateStore}
        diaryEntriesStore={diaryEntriesStore}
        productPickerModal={productPickerModal}
        products={products}
        selectedProductId={effectiveSelectedProductId}
      />

      <FindProductForm
        addProductModal={addProductModal}
        productPickerModal={productPickerModal}
        products={products}
        removeProduct={productsStore.removeProduct}
        selectedProductId={effectiveSelectedProductId}
        setSelectedProductId={setSelectedProductId}
      />
    </div>
  );
});
