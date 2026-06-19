"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createDiaryEntriesStore } from "./store";

export type DiaryEntriesInstance = ReturnType<typeof createDiaryEntriesStore>;

const DiaryEntriesContext = createContext<DiaryEntriesInstance | null>(null);

type DiaryEntriesProviderProps = PropsWithChildren<{ userId: string }>;

export const DiaryEntriesProvider = ({
  children,
  userId,
}: DiaryEntriesProviderProps) => {
  const [store] = useState(() => createDiaryEntriesStore(userId));

  useEffect(() => {
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
