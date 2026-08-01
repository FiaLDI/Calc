"use client";

import Link from "next/link";
import { observer } from "mobx-react-lite";

import { useAuthStore } from "@/entities/auth";
import { UserProfile } from "@/features/user-profile";

export const Header = observer(() => {
  const authStore = useAuthStore();

  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 shadow-sm">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-black text-white">
          C
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-zinc-900">
              {authStore.user?.username}
            </p>
            {authStore.isLocal ? (
              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200/80">
                Локально
              </span>
            ) : null}
          </div>
          <p className="truncate text-xs text-zinc-500">
            {authStore.isLocal
              ? "Данные только в этом браузере"
              : authStore.user?.email}
          </p>
        </div>
      </Link>
      <div className="ml-auto flex flex-wrap items-start justify-end gap-2">
        <UserProfile />
        <button
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-60"
          disabled={authStore.isSubmitting}
          onClick={() => void authStore.logout()}
          type="button"
        >
          {authStore.isLocal ? "К входу" : "Выйти"}
        </button>
      </div>
    </header>
  );
});
