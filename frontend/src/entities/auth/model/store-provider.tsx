"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createAuthStore } from "./store";

export type AuthStoreInstance = ReturnType<typeof createAuthStore>;

const AuthStoreContext = createContext<AuthStoreInstance | null>(null);

export const AuthStoreProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() => createAuthStore());

  useEffect(() => {
    void store.checkSession();

    const handleUnauthorized = () => store.clearSession();
    window.addEventListener("calc:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("calc:unauthorized", handleUnauthorized);
  }, [store]);

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = () => {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error("useAuthStore must be used inside AuthStoreProvider");
  }

  return store;
};
