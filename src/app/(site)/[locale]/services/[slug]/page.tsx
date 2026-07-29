import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { pageBySlugQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

export const revalidate = 60;

const SERVICE_SLUGS = [
  "resale-flats",
  "rentals",
  "new-project-bookings",
  "redevelopment",
  "shops-plots",
  "interiors",
];

type ServicePage = {
  title: string;
  heroHeading?: LocalizedValue<string>;
  heroSubheading?: LocalizedValue<string>;
  body?: LocalizedValue<any>;
  seoDescription?: string;
};

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const page = await client.fetch<ServicePage>(pageBySlugQuery, { slug: params.slug });
  if (!page) return {};
  return {
    title: page.title,
    description: page.seoDescription,
  };
}

export default async function ServicePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!SERVICE_SLUGS.includes(params.slug)) notFound();

  const locale = params.locale as Locale;
  const page = await client.fetch<ServicePage>(pageBySlugQuery, { slug: params.slug });
  if (!page) notFound();

  const heroHeading = getLocalizedField(page.heroHeading, locale) || page.title;
  const heroSubheading = getLocalizedField(page.heroSubheading, locale);
  const body = getLocalizedField(page.body, locale);

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
