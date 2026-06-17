"use client";

import { DateStoreProvider } from "@/entities/date";
import { DiaryEntriesProvider } from "@/entities/entries";
import { ProductStoreProvider } from "@/entities/products";
import { SettingsStoreProvider } from "@/entities/settings";
import type { PropsWithChildren } from "react";

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
          <DiaryEntriesProvider>
            {children}
          </DiaryEntriesProvider>
        </ProductStoreProvider>
      </DateStoreProvider>
    </SettingsStoreProvider>
  );
};
