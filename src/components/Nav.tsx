"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { site, waLink } from "@/lib/config";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  /** True when the page opens on a dark banner the bar can sit over. */
  const [overHero, setOverHero] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /**
   * The bar is fixed, and `main` carries 72px of top padding to make room for
   * it. When the page opens on a dark banner (told by a light coloured h1 in
   * a header or section that starts at the very top), that padding moves from
   * `main` onto the banner itself, so the banner's picture runs up behind the
   * bar and nothing on the page shifts. On any other page the bar stays solid.
   */
  useEffect(() => {
    const root = document.documentElement;
    let hero: HTMLElement | null = null;
    const detect = () => {
      const h1 = document.querySelector<HTMLElement>("main h1");
      if (!h1) return null;
      const rgb = getComputedStyle(h1).color.match(/\d+(\.\d+)?/g)?.map(Number) ?? [0, 0, 0];
      const light = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255 > 0.7;
      if (!light) return null;
      const shift = root.hasAttribute("data-nav-over") ? 0 : 72;
      let el: HTMLElement | null = h1.parentElement;
      while (el && el.tagName !== "MAIN") {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if ((el.tagName === "HEADER" || el.tagName === "SECTION") && top <= shift + 4) return el;
        el = el.parentElement;
      }
      return null;
    };
    // Route changes swap the page under the bar; wait a frame for it to land.
    const id = window.setTimeout(() => {
      hero = detect();
      if (hero) {
        hero.style.paddingTop = "72px";
        root.setAttribute("data-nav-over", "1");
        setOverHero(true);
      } else {
        root.removeAttribute("data-nav-over");
        setOverHero(false);
      }
    }, 0);
    return () => {
      window.clearTimeout(id);
      if (hero) hero.style.paddingTop = "";
      root.removeAttribute("data-nav-over");
    };
  }, [pathname, locale]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const clear = overHero && !scrolled && !open;

  /**
   * The 2026 pages (areas, guides, about, contact) are English only routes and
   * return notFound in hi, mr and gu. So they are only linked in English,
   * rather than translating four labels into a link that would 404.
   *
   * Contact is deliberately not in the bar (owner's call, 20 September 2026):
   * the Enquire Now button does that job, and the page stays linked from the
   * footer and the sitemap.
   */
  const links = [
    { href: "/#services", label: t("services") },
    { href: "/projects", label: t("projects") },
    { href: "/blog", label: t("blog") },
    ...(locale === "en"
      ? [
          { href: "/areas", label: "Areas" },
          { href: "/guides", label: "Guides" },
          { href: "/tools", label: "Tools" },
          { href: "/about", label: t("about") },
        ]
      : []),
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        clear
          ? "border-transparent bg-gradient-to-b from-black/55 via-black/25 to-transparent"
          : "border-brand-indigo/10 bg-paper/90 shadow-sm backdrop-blur"
      }`}
    >
      <div className="wrap flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className={`rounded-xl transition-colors duration-300 ${clear ? "bg-white/95 p-1 shadow-sm" : "p-1"}`}>
            <Image src="/logo.png" alt="Shree Giriraj Real Estate" width={40} height={40} className="h-9 w-9" />
          </span>
          <span className="flex flex-col leading-none">
            <span className={`font-display text-lg font-semibold transition-colors duration-300 ${clear ? "text-white" : "text-brand-indigo"}`}>
              Shree Giriraj
            </span>
            <span className={`mt-0.5 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.2em] transition-colors duration-300 ${clear ? "text-white/80" : "text-muted"}`}>
              {t("brandTagline", { year: site.established })}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex lg:gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                clear ? "text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,.45)] hover:text-white" : "text-brand-indigo/80 hover:text-brand-indigo"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className={clear ? "[&_button[aria-haspopup]]:bg-white/15 [&_button[aria-haspopup]]:ring-1 [&_button[aria-haspopup]]:ring-white/60" : ""}>
            <LanguageToggle />
          </span>
          <a
            href={waLink(t("whatsappGenericMessage"))}
            target="_blank"
            rel="noopener"
            className="btn btn-bronze whitespace-nowrap"
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
            {[0, 1, 2].map((k) => (
              <span key={k} className={`block h-0.5 w-6 transition-colors duration-300 ${clear ? "bg-white" : "bg-brand-indigo"}`} />
            ))}
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
            className="btn btn-bronze w-fit"
          >
            {t("enquireNow")}
          </a>
        </nav>
      )}
    </header>
  );
}
