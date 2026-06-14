"use client";

import { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { useModal } from "@/shared/ui/modal";
import { useDateStore } from "@/entities/date";
import { useProductsStore } from "@/entities/products";
import { FindProductForm } from "@/features/find-product";
import { AddProductEntryForm } from "@/features/add-product-entry";


export const DiaryAdder = observer(() => {
  const productsStore = useProductsStore();
  const dateStore = useDateStore();
  
  const [selectedProductId, setSelectedProductId] = useState("");

  const addProductModal = useModal();
  const productPickerModal = useModal();

  const products = productsStore.products;
  const productsSignature = products.map((product) => product.id).join("|");

  useEffect(() => {
    const productIds = productsSignature ? productsSignature.split("|") : [];
    const firstProductId = productIds[0] || "";

    if (!firstProductId) {
      setSelectedProductId("");
      return;
    }

    setSelectedProductId((currentId) => {
      if (currentId && productIds.includes(currentId)) {
        return currentId;
      }

      return firstProductId;
    });
  }, [productsSignature]);

  return (
    <div className="w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5">
        <p className="text-sm text-zinc-400">Дневник питания</p>
        <h2 className="text-2xl font-bold">Добавить прием пищи</h2>
      </div>

      <AddProductEntryForm 
        productPickerModal={productPickerModal} 
        selectedProductId={selectedProductId} 
        productsStore={productsStore} 
        dateStore={dateStore} 
        products={products} /> 

      <FindProductForm 
        productPickerModal={productPickerModal}
        addProductModal={addProductModal}
        products={products} 
        selectedProductId={selectedProductId} 
        setSelectedProductId={setSelectedProductId} 
        removeProduct={productsStore.removeProduct} />

    </div>
  );
});
