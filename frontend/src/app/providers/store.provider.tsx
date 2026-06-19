"use client";

import { DateStoreProvider } from "@/entities/date";
import { DiaryEntriesProvider } from "@/entities/entries";
import { ProductStoreProvider } from "@/entities/products";
import { SettingsStoreProvider } from "@/entities/settings";
import type { PropsWithChildren } from "react";

type StoreProviderProps = PropsWithChildren<{
  initialDateKey: string;
  userId: string;
}>;

export const StoreProvider = ({
  children,
  initialDateKey,
  userId,
}: StoreProviderProps) => {
  return (
    <SettingsStoreProvider userId={userId}>
      <DateStoreProvider initialDateKey={initialDateKey} userId={userId}>
        <ProductStoreProvider userId={userId}>
          <DiaryEntriesProvider userId={userId}>
            {children}
          </DiaryEntriesProvider>
        </ProductStoreProvider>
      </DateStoreProvider>
    </SettingsStoreProvider>
  );
};
