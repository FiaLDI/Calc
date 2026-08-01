"use client";

import type { PropsWithChildren } from "react";

import { AppNav } from "@/widgets/app-nav";
import { DayCalendarWidget } from "@/widgets/day-calendar";
import { Header } from "@/widgets/header";

export const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col overflow-x-clip px-3 py-4 sm:px-6 sm:py-6">
      <Header />
      <AppNav />
      <div className="mb-4">
        <DayCalendarWidget />
      </div>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
};
