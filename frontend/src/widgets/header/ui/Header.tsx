"use client";

import { observer } from "mobx-react-lite";

import { useAuthStore } from "@/entities/auth";
import { UserProfile } from "@/features/user-profile";

export const Header = observer(() => {
  const authStore = useAuthStore();

    return (
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-black text-white">
            C
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900">
              {authStore.user?.username}
            </p>
            <p className="truncate text-xs text-zinc-500">{authStore.user?.email}</p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-start justify-end gap-2">
          <UserProfile />
          <button
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-60"
            disabled={authStore.isSubmitting}
            onClick={() => void authStore.logout()}
            type="button"
          >
            Выйти
          </button>
        </div>
      </header>
    );
});
