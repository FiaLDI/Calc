"use client";

import { observer } from "mobx-react-lite";
import type { PropsWithChildren } from "react";

import { useAuthStore } from "@/entities/auth";
import { AuthForm } from "@/features/auth-form";

import { StoreProvider } from "./store.provider";

type AuthBoundaryProps = PropsWithChildren<{
  initialDateKey: string;
}>;

export const AuthBoundary = observer(
  ({ children, initialDateKey }: AuthBoundaryProps) => {
    const authStore = useAuthStore();

    if (authStore.status === "loading") {
      return (
        <main className="flex min-h-screen items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" aria-label="Загрузка" />
        </main>
      );
    }

    if (!authStore.user) {
      return <AuthForm />;
    }

    return (
      <StoreProvider
        initialDateKey={initialDateKey}
        key={authStore.user.id}
        userId={authStore.user.id}
      >
        {children}
      </StoreProvider>
    );
  }
);
