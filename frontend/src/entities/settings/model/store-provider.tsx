"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createSettingsStore } from "./store";

export type SettingsStoreInstance = ReturnType<typeof createSettingsStore>;

const SettingsStoreContext = createContext<SettingsStoreInstance | null>(null);

type SettingsStoreProviderProps = PropsWithChildren<{ userId: string }>;

export const SettingsStoreProvider = ({
  children,
  userId,
}: SettingsStoreProviderProps) => {
  const [store] = useState(() => createSettingsStore(userId));

  useEffect(() => {
    store.hydrate();
  }, [store]);

  return (
    <SettingsStoreContext.Provider value={store}>
      {children}
    </SettingsStoreContext.Provider>
  );
};

export const useSettingsStore = () => {
  const store = useContext(SettingsStoreContext);

  if (!store) {
    throw new Error("useSettingsStore must be used inside SettingsStoreProvider");
  }

  return store;
};
