"use client";

import { observer } from "mobx-react-lite";

import { useAuthStore } from "@/entities/auth";
import { DataTransferActions } from "@/features/data-transfer";
import { Modal, useModal } from "@/shared/ui/modal";

const formatCreatedAt = (value: string | undefined) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const UserProfile = observer(() => {
  const authStore = useAuthStore();
  const profileModal = useModal();
  const user = authStore.user;

  if (!user) {
    return null;
  }

  const initial = user.username.trim().slice(0, 1).toUpperCase() || "U";

  return (
    <>
      <button
        className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
        onClick={profileModal.open}
        type="button"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden sm:inline">Профиль</span>
      </button>

      <Modal
        isOpen={profileModal.isOpen}
        labelledBy="user-profile-title"
        maxWidthClassName="max-w-lg"
        onClose={profileModal.close}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-5 sm:p-6">
          <div>
            <p className="text-sm text-zinc-400">Личный кабинет</p>
            <h2 id="user-profile-title" className="text-2xl font-bold text-zinc-900">
              Профиль
            </h2>
          </div>
          <button
            aria-label="Закрыть профиль"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xl text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
            onClick={profileModal.close}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <div className="mb-6 flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-emerald-500 text-2xl font-black text-white shadow-lg shadow-emerald-500/20">
              {initial}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xl font-bold text-zinc-900">
                {user.username}
              </h3>
              <p className="truncate text-sm text-zinc-500">{user.email}</p>
              <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Аккаунт активен
              </span>
            </div>
          </div>

          <dl className="grid gap-3 rounded-3xl border border-zinc-100 bg-zinc-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-zinc-500">Имя</dt>
              <dd className="min-w-0 break-words text-right text-sm font-medium text-zinc-900">
                {user.username}
              </dd>
            </div>
            <div className="h-px bg-zinc-200/70" />
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-zinc-500">Email</dt>
              <dd className="min-w-0 break-all text-right text-sm font-medium text-zinc-900">
                {user.email}
              </dd>
            </div>
            <div className="h-px bg-zinc-200/70" />
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-zinc-500">Дата регистрации</dt>
              <dd className="text-right text-sm font-medium text-zinc-900">
                {formatCreatedAt(user.createdAt)}
              </dd>
            </div>
          </dl>

          <section className="mt-6 rounded-3xl border border-zinc-100 p-4">
            <h3 className="font-semibold text-zinc-900">Мои данные</h3>
            <p className="mb-4 mt-1 text-sm leading-5 text-zinc-500">
              Сохраните дневник и личные продукты в XML или восстановите их из файла.
            </p>
            <div className="flex justify-start [&>div]:items-start">
              <DataTransferActions />
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            className="rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
            onClick={profileModal.close}
            type="button"
          >
            Закрыть
          </button>
          <button
            className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
            disabled={authStore.isSubmitting}
            onClick={() => void authStore.logout()}
            type="button"
          >
            Выйти из аккаунта
          </button>
        </div>
      </Modal>
    </>
  );
});
