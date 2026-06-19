"use client";

import { observer } from "mobx-react-lite";
import { useState, type FormEvent } from "react";

import { useAuthStore } from "@/entities/auth";

type AuthMode = "login" | "register";

export const AuthForm = observer(() => {
  const authStore = useAuthStore();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    authStore.clearError();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (mode === "register") {
        await authStore.register({ email, password, username });
      } else {
        await authStore.login({ email, password });
      }
    } catch {
      // The store exposes the server error next to the form.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#dcfce7_0,transparent_42%),radial-gradient(circle_at_bottom_right,#fef3c7_0,transparent_40%)] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-9">
        <div className="mb-8">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-white">
            C
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Calc</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Дневник питания, продукты и цели — в одном личном пространстве.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-zinc-100 p-1 text-sm font-medium">
          <button
            className={`rounded-lg px-3 py-2 transition ${mode === "login" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
            onClick={() => switchMode("login")}
            type="button"
          >
            Вход
          </button>
          <button
            className={`rounded-lg px-3 py-2 transition ${mode === "register" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
            onClick={() => switchMode("register")}
            type="button"
          >
            Регистрация
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
              Имя
              <input
                autoComplete="name"
                className="rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                maxLength={50}
                minLength={2}
                onChange={(event) => setUsername(event.target.value)}
                required
                value={username}
              />
            </label>
          )}

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
            Email
            <input
              autoComplete="email"
              className="rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
            Пароль
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              minLength={mode === "register" ? 8 : undefined}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {authStore.error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {authStore.error}
            </p>
          )}

          <button
            className="mt-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={authStore.isSubmitting}
            type="submit"
          >
            {authStore.isSubmitting
              ? "Подождите…"
              : mode === "login"
                ? "Войти"
                : "Создать аккаунт"}
          </button>
        </form>
      </section>
    </main>
  );
});
