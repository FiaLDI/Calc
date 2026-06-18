"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createProductsStore } from "./store";

export type ProductsStoreInstance = ReturnType<typeof createProductsStore>;

const ProductsStoreContext = createContext<ProductsStoreInstance | null>(null);

export const ProductStoreProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() => createProductsStore());

  useEffect(() => {
    store.hydrate();
  }, [store]);

  useEffect(() => {
    void store.loadRemoteProducts();
  }, [store]);

  return (
    <ProductsStoreContext.Provider value={store}>
      {children}
    </ProductsStoreContext.Provider>
  );
};

export const useProductsStore = () => {
  const store = useContext(ProductsStoreContext);

  if (!store) {
    throw new Error("useProductsStore must be used inside ProductsStoreProvider");
  }

  return store;
};
