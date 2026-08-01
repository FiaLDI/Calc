"use client";

import type { PropsWithChildren } from "react";

import { AppShell } from "@/widgets/app-shell";

export default function AppLayout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}
