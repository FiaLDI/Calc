import type { PropsWithChildren } from "react";

import { AuthStoreProvider } from "@/entities/auth";
import { ModalProvider } from "@/shared/ui/modal";

import { AuthBoundary } from "./auth-boundary";

type AppProvidersProps = PropsWithChildren<{
  initialDateKey: string;
}>;

export const AppProviders = ({
  children,
  initialDateKey,
}: AppProvidersProps) => {
  return (
    <AuthStoreProvider>
      <AuthBoundary initialDateKey={initialDateKey}>
        <ModalProvider>{children}</ModalProvider>
      </AuthBoundary>
    </AuthStoreProvider>
  );
};
