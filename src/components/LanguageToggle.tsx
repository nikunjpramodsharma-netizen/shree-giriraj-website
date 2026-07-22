"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "en" as const, label: "EN" },
  { code: "hi" as const, label: "हिंदी" },
  { code: "mr" as const, label: "मराठी" },
];

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          aria-current={locale === l.code}
          onClick={() => router.replace(pathname, { locale: l.code })}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === l.code
              ? "bg-brand-indigo text-white"
              : "text-brand-indigo/70 hover:text-brand-indigo"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
