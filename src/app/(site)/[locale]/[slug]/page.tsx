import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { pageBySlugQuery, pageLocaleIndexQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import {
  getLocalizedField,
  getLocalizedBody,
  availableLocales,
  type Locale,
  type LocalizedValue,
} from "@/lib/i18n-content";
import { buildAlternates, SERVICE_SLUGS } from "@/lib/seo";

export const revalidate = 60;

type LocaleIndexRow = { slug: string; locales: Locale[] };


type Page = {
  title: string;
  heroHeading?: LocalizedValue<string>;
  heroSubheading?: LocalizedValue<string>;
  body?: LocalizedValue<any>;
  seoDescription?: string;
};

// Reserved top-level routes that must NOT be handled by this catch-all.
// "studio" no longer needs to be listed here: it now lives outside the
// [locale] segment entirely (see src/app/studio/layout.tsx), so a request
// for /studio never reaches this route in the first place.
// Section prefixes the flexible route does not own, plus the six service
// slugs. The service pages are `page` documents but they are rendered by
// /services/[slug], so without this they would ALSO resolve at /resale-flats
// and every other bare slug, giving the same content two self canonicalising
// URLs in every locale. That is duplicate content the site creates against
// itself. Bare slugs 301 to the canonical path, see next.config.mjs.
const RESERVED = new Set([
  "about",
  "areas",
  "blog",
  "contact",
  "guides",
  "tools",
  "projects",
  "services",
  ...SERVICE_SLUGS,
]);

/** Only emit a locale route where the page genuinely has a body in that locale. */
export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  try {
    const rows = await client.fetch<LocaleIndexRow[]>(pageLocaleIndexQuery);
    return (rows || [])
      .filter((r) => !RESERVED.has(r.slug))
      .filter((r) => (r.locales ?? []).includes(params.locale as Locale))
      .map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: params.slug });
  if (!page) return {};
  const locales = availableLocales(page.body);
  if (!locales.includes(params.locale as Locale)) return { robots: { index: false } };
  return {
    alternates: buildAlternates(params.locale, `/${params.slug}`, locales),
    title: page.title,
    description: page.seoDescription,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (RESERVED.has(params.slug)) notFound();

  const locale = params.locale as Locale;
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: params.slug });
  if (!page) notFound();

  const heroHeading = getLocalizedField(page.heroHeading, locale) || page.title;
  const heroSubheading = getLocalizedField(page.heroSubheading, locale);
  // No fallback here. A page with no body in this locale is not a page in this
  // locale, and serving the English one under a translated URL is duplication.
  const body = getLocalizedBody(page.body, locale);
  if (!body) notFound();

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <h1 className="text-4xl md:text-5xl">{heroHeading}</h1>
          {heroSubheading && (
            <p className="mt-4 max-w-[42em] text-lg text-paper/75">{heroSubheading}</p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <PortableTextBody value={body} />
        </div>
      </section>
    </>
  );
}
