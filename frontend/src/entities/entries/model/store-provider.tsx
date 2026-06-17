"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createDiaryEntriesStore } from "./store";

export type DiaryEntriesInstance = ReturnType<typeof createDiaryEntriesStore>;

const DiaryEntriesContext = createContext<DiaryEntriesInstance | null>(null);

export const DiaryEntriesProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() => createDiaryEntriesStore());

  useLayoutEffect(() => {
    store.hydrate();
  }, [store]);

  return (
    <DiaryEntriesContext.Provider value={store}>
      {children}
    </DiaryEntriesContext.Provider>
  );
};

export const useDiaryEntriesStore = () => {
  const store = useContext(DiaryEntriesContext);

  if (!store) {
    throw new Error("useDiaryEntries must be used inside DiaryEntriesProvider");
  }

  return store;
};
