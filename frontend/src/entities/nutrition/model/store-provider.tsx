"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createNutritionStore } from "./store";

type NutritionStoreInstance = ReturnType<typeof createNutritionStore>;

const NutritionStoreContext = createContext<NutritionStoreInstance | null>(null);

type NutritionStoreProviderProps = PropsWithChildren<{
  initialDateKey: string;
}>;

export const NutritionStoreProvider = ({
  children,
  initialDateKey,
}: NutritionStoreProviderProps) => {
  const [store] = useState(() => createNutritionStore(initialDateKey));

  useLayoutEffect(() => {
    store.hydrate();
  }, [store]);

  return (
    <NutritionStoreContext.Provider value={store}>
      {children}
    </NutritionStoreContext.Provider>
  );
};

export const useNutritionStore = () => {
  const store = useContext(NutritionStoreContext);

  if (!store) {
    throw new Error("useNutritionStore must be used inside NutritionStoreProvider");
  }

  return store;
};
