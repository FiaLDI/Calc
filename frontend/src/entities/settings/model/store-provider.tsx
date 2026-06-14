"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

import { createSettingsStore } from "./store";

type SettingsStoreInstance = ReturnType<typeof createSettingsStore>;

const SettingsStoreContext = createContext<SettingsStoreInstance | null>(null);

export const SettingsStoreProvider = ({
  children
}: {children: ReactNode}) => {
  const [store] = useState(() => createSettingsStore());

  useLayoutEffect(() => {
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
