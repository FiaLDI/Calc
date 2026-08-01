"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const iconClassName = "h-5 w-5 shrink-0";

const SummaryIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 19V5M4 19h16M8 15V9M12 15v-4M16 15V7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AddIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const EntriesIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const ProductsIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 7h16l-1.2 12.2A2 2 0 0 1 16.81 21H7.19a2 2 0 0 1-1.99-1.8L4 7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 7a3 3 0 0 1 6 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const WeekIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M3 10h18M8 3v4M16 3v4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const NAV_ITEMS: Array<{
  href: string;
  label: string;
  icon: ReactNode;
}> = [
  { href: "/", label: "Итоги", icon: <SummaryIcon /> },
  { href: "/add", label: "Добавить", icon: <AddIcon /> },
  { href: "/entries", label: "Записи", icon: <EntriesIcon /> },
  { href: "/products", label: "Продукты", icon: <ProductsIcon /> },
  { href: "/week", label: "Неделя", icon: <WeekIcon /> },
];

export const AppNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Разделы"
      className="mb-4 rounded-2xl border border-zinc-200/80 bg-white p-1 shadow-sm"
    >
      <ul className="grid grid-cols-5 gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                title={item.label}
                className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-center transition ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {item.icon}
                <span className="w-full truncate text-[10px] font-semibold leading-tight sm:text-xs">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
