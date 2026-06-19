import type { Metadata } from "next";

import { formatDateKey } from "@/shared/lib/format";

import { AppProviders } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calc — дневник питания",
  description:
    "Calc помогает считать калории, отслеживать макронутриенты и вести личный дневник питания.",
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
