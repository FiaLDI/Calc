import type { PropsWithChildren } from "react";

import { ModalProvider } from "@/shared/ui/modal";

import { StoreProvider } from "./store.provider";

type AppProvidersProps = PropsWithChildren<{
  initialDateKey: string;
}>;

export const AppProviders = ({
  children,
  initialDateKey,
}: AppProvidersProps) => {
  return (
    <StoreProvider initialDateKey={initialDateKey}>
      <ModalProvider>{children}</ModalProvider>
    </StoreProvider>
  );
};
