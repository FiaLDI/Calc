import type { PropsWithChildren } from "react";

import { StoreProvider } from "./store.provider";

type AppProvidersProps = PropsWithChildren<{
  initialDateKey: string;
}>;

export const AppProviders = ({
  children,
  initialDateKey,
}: AppProvidersProps) => {
  return <StoreProvider initialDateKey={initialDateKey}>{children}</StoreProvider>;
};
