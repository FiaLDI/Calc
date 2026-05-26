import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { formatDateKey } from "@/entities/nutrition/lib/date";

import { AppProviders } from "./providers";
import "./globals.css";

const robotoMono = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"]
})

export const metadata: Metadata = {
  title: "Calc - Твой помощник в мире калорий",
  description: "Calc - это современное приложение для отслеживания калорий и макронутриентов, которое поможет тебе достичь своих фитнес-целей. С нашим удобным интерфейсом ты сможешь легко добавлять продукты, планировать питание и анализировать свою диету. Независимо от того, хочешь ли ты похудеть, набрать массу или просто поддерживать здоровый образ жизни, Calc станет твоим надежным партнером на пути к успеху.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialDateKey = formatDateKey(new Date());

  return (
    <html
      lang="ru"
      className={`${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders initialDateKey={initialDateKey}>{children}</AppProviders>
      </body>
    </html>
  );
}
