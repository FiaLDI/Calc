"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createDateStore } from "./store";

type DateStoreInstance = ReturnType<typeof createDateStore>;

const DateStoreContext = createContext<DateStoreInstance | null>(null);

type DateStoreProviderProps = PropsWithChildren<{
  initialDateKey: string;
}>;

export const DateStoreProvider = ({
  children,
  initialDateKey,
}: DateStoreProviderProps) => {
  const [store] = useState(() => createDateStore(initialDateKey));

  useLayoutEffect(() => {
    store.hydrate();
  }, [store]);

  return (
    <DateStoreContext.Provider value={store}>
      {children}
    </DateStoreContext.Provider>
  );
};

export const useDateStore = () => {
  const store = useContext(DateStoreContext);

  if (!store) {
    throw new Error("useDateStore must be used inside DateStoreProvider");
  }

  return store;
};
