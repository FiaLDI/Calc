"use client";

import type { PropsWithChildren } from "react";
import { DateStoreProvider } from "@/entities/date";
import { ProductStoreProvider } from "@/entities/products";
import { SettingsStoreProvider } from "@/entities/settings";

type StoreProviderProps = PropsWithChildren<{
  initialDateKey: string;
}>;

export const StoreProvider = ({
  children,
  initialDateKey,
}: StoreProviderProps) => {
  return (
      <SettingsStoreProvider>
      <DateStoreProvider initialDateKey={initialDateKey}>
        <ProductStoreProvider>
          {children}
        </ProductStoreProvider>
      </DateStoreProvider>
      </SettingsStoreProvider>
  );
};
