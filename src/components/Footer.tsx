"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import EnglishLink from "next/link";
import { site, waLink } from "@/lib/config";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();
  const locale = useLocale();

  return (
    <footer className="bg-brand-indigo py-14 text-paper/75">
      <div className="wrap">
        <div className="grid gap-10 border-b border-white/10 pb-9 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold text-white">
              {site.name}
            </p>
            <p className="mt-2 max-w-[26em] text-sm">
              {t("description", { year: site.established })}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
              {t("exploreHeading")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link prefetch={false} href="/#services" className="hover:text-white">{nav("services")}</Link></li>
              <li><Link prefetch={false} href="/projects" className="hover:text-white">{nav("projects")}</Link></li>
              <li><Link prefetch={false} href="/blog" className="hover:text-white">{nav("blog")}</Link></li>
              {/* About exists only in English. Rendered through the locale aware
                  Link it became /hi/about, /mr/about and /gu/about, all of which
                  404, on every page of those three languages. */}
              <li><EnglishLink prefetch={false} href="/about" className="hover:text-white">{nav("about")}</EnglishLink></li>
              <li><EnglishLink prefetch={false} href="/contact" className="hover:text-white">Contact us</EnglishLink></li>
              {/* The English only sections, linked from every page so none of
                  them sits more than one click from anywhere. English labels on
                  purpose: the pages behind them are in English. */}
              <li><EnglishLink prefetch={false} href="/areas" className="hover:text-white">Area guides</EnglishLink></li>
              <li><EnglishLink prefetch={false} href="/tools" className="hover:text-white">Calculators</EnglishLink></li>
              <li><EnglishLink prefetch={false} href="/guides" className="hover:text-white">Guides</EnglishLink></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
              {t("contactHeading")}
            </h4>
            {/* The NAP exactly as on the Google Business Profile, on every
                page. The same string feeds the business markup. */}
            <address className="mb-4 text-sm not-italic">
              {site.address}
              {locale === "en" && <span className="mt-1 block text-paper/60">Open {site.hours.label}</span>}
            </address>
            <ul className="space-y-2.5 text-sm">
              <li><a href={`tel:${site.phonePrimary}`} className="hover:text-white">{site.phonePrimary}</a></li>
              <li><a href={`tel:${site.phoneSecondary}`} className="hover:text-white">{site.phoneSecondary}</a></li>
              <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
              <li>
                <a href={waLink(t("whatsappMessage"))} target="_blank" rel="noopener" className="hover:text-white">
                  {t("whatsappUs")}
                </a>
              </li>
            </ul>
            {/* The profiles the owner confirmed on 16 September 2026. The same
                four URLs feed sameAs in the business markup (config.ts). */}
            <h4 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
              {t("followHeading")}
            </h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <li><a href={site.social.instagram} target="_blank" rel="noopener" className="hover:text-white">Instagram</a></li>
              <li><a href={site.social.facebook} target="_blank" rel="noopener" className="hover:text-white">Facebook</a></li>
              <li><a href={site.social.google} target="_blank" rel="noopener" className="hover:text-white">Google</a></li>
              <li><a href={site.social.justdial} target="_blank" rel="noopener" className="hover:text-white">JustDial</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <span>{t("copyright", { year, name: site.name })}</span>
          {/* Plain links to the three translated home pages. The language
              switcher in the header is a script driven menu, so until these
              existed no crawlable link on the site led to /hi, /mr or /gu. */}
          <nav aria-label="Languages" className="flex gap-3">
            <a href="/hi" hrefLang="hi" lang="hi" className="hover:text-white">हिंदी</a>
            <a href="/mr" hrefLang="mr" lang="mr" className="hover:text-white">मराठी</a>
            <a href="/gu" hrefLang="gu" lang="gu" className="hover:text-white">ગુજરાતી</a>
          </nav>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {t("rera", { number: site.rera })}
          </span>
        </div>
      </div>
    </footer>
  );
}
