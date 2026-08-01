"use client";

import { observer } from "mobx-react-lite";

import { useAuthStore } from "@/entities/auth";

type ContinueLocallyButtonProps = {
  className?: string;
};

export const ContinueLocallyButton = observer(
  ({ className }: ContinueLocallyButtonProps) => {
    const authStore = useAuthStore();

    return (
      <button
        className={
          className ||
          "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
        }
        disabled={authStore.isSubmitting}
        onClick={() => authStore.enterLocalSession()}
        type="button"
      >
        Продолжить без аккаунта
      </button>
    );
  }
);
