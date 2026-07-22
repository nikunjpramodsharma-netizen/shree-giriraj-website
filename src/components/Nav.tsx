"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site, waLink } from "@/lib/config";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#services", label: t("services") },
    { href: "/projects", label: t("projects") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-indigo/10 bg-paper/85 backdrop-blur">
      <div className="wrap flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Shree Giriraj Real Estate" width={40} height={40} className="h-10 w-10" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold text-brand-indigo">
              Shree Giriraj
            </span>
            <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              {t("brandTagline", { year: site.established })}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-brand-indigo/80 transition hover:text-brand-indigo"
            >
              {l.label}
            </Link>
          ))}
          <LanguageToggle />
          <a
            href={waLink(t("whatsappGenericMessage"))}
            target="_blank"
            rel="noopener"
            className="btn btn-wa"
          >
            {t("enquireNow")}
          </a>
        </nav>

        <button
          className="p-2 md:hidden"
          aria-label={t("menuLabel")}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-brand-indigo" />
            <span className="block h-0.5 w-6 bg-brand-indigo" />
            <span className="block h-0.5 w-6 bg-brand-indigo" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-b border-brand-indigo/10 bg-paper px-6 py-5 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-brand-indigo"
            >
              {l.label}
            </Link>
          ))}
          <LanguageToggle />
          <a
            href={waLink(t("whatsappEnquireMessage"))}
            target="_blank"
            rel="noopener"
            className="btn btn-wa w-fit"
          >
            {t("enquireNow")}
          </a>
        </nav>
      )}
    </header>
  );
}
