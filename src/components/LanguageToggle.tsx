"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "en" as const, label: "EN" },
  { code: "hi" as const, label: "हिंदी" },
  { code: "mr" as const, label: "मराठी" },
  { code: "gu" as const, label: "ગુજરાતી" },
];

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectLocale(code: string) {
    setOpen(false);
    router.replace(pathname, { locale: code });
  }

  return (
    <div ref={containerRef} className="relative text-xs font-semibold">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-brand-indigo px-3 py-1.5 text-white transition"
      >
        {current.label}
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1.5 min-w-[7.5rem] overflow-hidden rounded-xl border border-brand-indigo/10 bg-white py-1 shadow-lg"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="option" aria-selected={locale === l.code}>
              <button
                type="button"
                onClick={() => selectLocale(l.code)}
                className={`block w-full px-3.5 py-2 text-left transition ${
                  locale === l.code
                    ? "bg-brand-indigo/10 text-brand-indigo"
                    : "text-brand-indigo/70 hover:bg-brand-indigo/5 hover:text-brand-indigo"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
