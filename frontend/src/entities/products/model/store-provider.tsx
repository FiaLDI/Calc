"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createProductsStore } from "./store";

type ProductsStoreInstance = ReturnType<typeof createProductsStore>;

const ProductsStoreContext = createContext<ProductsStoreInstance | null>(null);


export const ProductStoreProvider = ({
  children,
}: {children: ReactNode}) => {
  const [store] = useState(() => createProductsStore());

  useLayoutEffect(() => {
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
