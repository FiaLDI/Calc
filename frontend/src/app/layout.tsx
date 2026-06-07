import type { Metadata } from "next";

import { formatDateKey } from "@/entities/nutrition/lib/date";

import { AppProviders } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calc - твой помощник в мире калорий",
  description:
    "Calc помогает считать калории, отслеживать макронутриенты и собирать удобную базу продуктов на каждый день.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialDateKey = formatDateKey(new Date());

  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AppProviders initialDateKey={initialDateKey}>{children}</AppProviders>
      </body>
    </html>
  );
}
