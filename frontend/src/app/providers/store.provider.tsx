"use client";

import type { PropsWithChildren } from "react";

import { NutritionStoreProvider } from "@/entities/nutrition";

type StoreProviderProps = PropsWithChildren<{
  initialDateKey: string;
}>;

export const StoreProvider = ({
  children,
  initialDateKey,
}: StoreProviderProps) => {
  return (
    <NutritionStoreProvider initialDateKey={initialDateKey}>
      {children}
    </NutritionStoreProvider>
  );
};
