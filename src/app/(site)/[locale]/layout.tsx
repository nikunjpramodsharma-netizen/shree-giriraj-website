import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

/**
 * Geist, Vercel's typeface, across the whole site.
 *
 * This replaces Fraunces for headings and Inter for body. Worth knowing what
 * changed: Fraunces is a serif and gave the site an editorial, established
 * feel that suited a business trading since 1996. Geist is a neutral modern
 * sans and reads as precise and contemporary instead. Both are defensible,
 * they are just different characters.
 *
 * Geist ships as a package rather than through next/font/google, so it is self
 * hosted with no request to a third party font CDN, which is also better for
 * both privacy and Core Web Vitals.
 */

/**
 * metadataBase MUST use the same origin resolver as canonicals and JSON-LD.
 *
 * This previously had its own fallback to shreegiriraj.in, which is not a
 * registered domain, so on a Vercel deployment with no explicit site URL it
 * resolved every relative metadata URL against a host that does not exist.
 * Nothing leaked yet only because no relative OG image is emitted. It would
 * have broken silently the moment one was added.
 */
const siteUrl = SITE_URL;

const ogLocaleMap: Record<string, string> = { en: "en_IN", hi: "hi_IN", mr: "mr_IN", gu: "gu_IN" };

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "metadata" });
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("siteTitle"),
      template: t("titleTemplate"),
    },
    description: t("siteDescription"),
    openGraph: {
      type: "website",
      locale: ogLocaleMap[params.locale] || "en_IN",
      siteName: "Shree Giriraj Real Estate",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="pb-[52px] md:pb-0">
        <NextIntlClientProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
          <StickyMobileCTA locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
