import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { projectBySlugQuery, projectLocaleIndexQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { waLink } from "@/lib/config";
import {
  getLocalizedField,
  getLocalizedBody,
  availableLocales,
  type Locale,
  type LocalizedValue,
} from "@/lib/i18n-content";
import { pageUrls } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { graph, residenceNode, breadcrumbNode } from "@/lib/schema";

export const revalidate = 60;

type LocaleIndexRow = { slug: string; locales: Locale[] };


type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type Project = {
  name: string;
  developer?: string;
  status?: string;
  location?: string;
  rera?: string;
  coverImage?: any;
  gallery?: any[];
  summary?: LocalizedValue<string>;
  configurations?: Config[];
  amenities?: string[];
  body?: LocalizedValue<any>;
};

/** Only emit a locale route where the project has a summary in that locale. */
export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  try {
    const rows = await client.fetch<LocaleIndexRow[]>(projectLocaleIndexQuery);
    return (rows || [])
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
  const project = await client.fetch<Project>(projectBySlugQuery, {
    slug: params.slug,
  });
  if (!project) return {};
  const locales = availableLocales(project.summary);
  if (!locales.includes(params.locale as Locale)) return { robots: { index: false } };
  const urls = pageUrls(params.locale, `/projects/${params.slug}`, locales);
  return {
    ...urls,
    title: project.name,
    description: getLocalizedField(project.summary, params.locale as Locale),
    // Falling back to `undefined` here used to wipe og:url as well as the
    // image. Spreading urls.openGraph keeps the URL and lets the layout's
    // default card fill in when a project has no cover of its own.
    openGraph: {
      ...urls.openGraph,
      ...(project.coverImage
        ? { images: [urlFor(project.coverImage).width(1200).height(630).url()] }
        : {}),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  const [project, t] = await Promise.all([
    client.fetch<Project>(projectBySlugQuery, { slug: params.slug }),
    getTranslations({ locale, namespace: "projectDetail" }),
  ]);
  if (!project) notFound();

  // No summary in this locale means no genuinely localized page. 404 rather
  // than serve the English text under a Marathi URL.
  if (!getLocalizedBody(project.summary, locale)) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.name, path: `/projects/${params.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          residenceNode({
            locale,
            name: project.name,
            slug: params.slug,
            description: getLocalizedField(project.summary, locale),
            image: project.coverImage
              ? urlFor(project.coverImage).width(1200).height(630).url()
              : undefined,
            location: project.location,
            // Only emitted when the project's own MahaRERA number exists. The
            // agent registration is not a substitute for it.
            rera: project.rera,
          }),
          breadcrumbNode(locale, trail),
        )}
      />
      {/*
        Full bleed hero using the project's own cover image, matching the
        homepage and the service pages.

        The cover was already in Sanity and was only being shown as a card
        beside the text. A project is the most visual page on the site and it
        had the least visual opening.
      */}
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        {/*
          No project in the CMS carries a cover image yet, so without a
          fallback every project hero rendered as a flat dark band. The real
          cover wins the moment one is uploaded, and nothing here needs
          changing when that happens.
        */}
        {true && (
          <>
            <Image
              src={
                project.coverImage
                  ? urlFor(project.coverImage).width(2000).height(1200).url()
                  : "/architecture-facade-2.jpg"
              }
              alt={
                project.coverImage?.alt ||
                `${project.name}${project.location ? `, ${project.location}` : ""}`
              }
              fill
              priority
              sizes="100vw"
              className="hero-kenburns object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(100deg, rgba(21,27,61,.92) 0%, rgba(21,27,61,.74) 45%, rgba(21,27,61,.34) 78%, rgba(21,27,61,.55) 100%), linear-gradient(180deg, rgba(21,27,61,.5) 0%, rgba(21,27,61,0) 32%, rgba(21,27,61,.85) 100%)" }}
            />
          </>
        )}
        <div className="wrap relative z-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <Link href="/projects" className="text-sm text-paper/60 hover:text-white">
              {t("backLink")}
            </Link>
            <h1 className="mt-5 max-w-[20ch] text-4xl text-white md:text-6xl">{project.name}</h1>
            {project.location && (
              <p className="mt-2 text-paper/70">{project.location}</p>
            )}
            {project.developer && (
              <p className="mt-1 text-sm text-paper/60">
                {t("developerLabel")}{project.developer}
              </p>
            )}
            {project.summary && (
              <p className="mt-5 max-w-[40em] text-paper/80">
                {getLocalizedField(project.summary, locale)}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3.5">
              <a
                href={waLink(t("whatsappSiteVisit", { name: project.name }))}
                target="_blank"
                rel="noopener"
                className="btn btn-brass"
              >
                {t("ctaPrice")}
              </a>
            </div>
            {project.rera && (
              <p className="mt-6 text-xs text-paper/50">
                {t("reraLabel")}{project.rera}
              </p>
            )}
          </div>

        </div>
      </section>

      {/* Configurations */}
      {project.configurations && project.configurations.length > 0 && (
        <section className="py-16">
          <div className="wrap">
            <div className="eyebrow">{t("configEyebrow")}</div>
            <h2 className="mt-3 text-3xl text-brand-indigo">
              {t("configHeading", { name: project.name })}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.configurations.map((c, i) => (
                <div key={i} className="rounded-2xl border border-brand-indigo/10 bg-white p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brass">
                    {c.type}
                  </div>
                  <div className="my-2 font-display text-2xl text-brand-indigo">
                    {c.displayPrice}
                  </div>
                  <div className="text-sm text-muted">{getLocalizedField(c.note, locale)}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">
              {t("priceSheetNote")}
              <a
                href={waLink(t("whatsappPriceSheet", { name: project.name }))}
                target="_blank"
                rel="noopener"
                className="font-medium text-brand-blue underline"
              >
                {t("priceSheetLink")}
              </a>
              .
            </p>
          </div>
        </section>
      )}

      {/* Amenities */}
      {project.amenities && project.amenities.length > 0 && (
        <section className="bg-paper-alt py-16">
          <div className="wrap">
            <div className="eyebrow">{t("amenitiesEyebrow")}</div>
            <h2 className="mt-3 text-3xl text-brand-indigo">
              {t("amenitiesHeading", { name: project.name })}
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {project.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-brand-indigo/15 bg-white px-4 py-2 text-sm text-brand-indigo"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      {project.body && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <PortableTextBody value={getLocalizedField(project.body, locale)} />
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="pb-20">
          <div className="wrap">
            <div className="eyebrow">{t("galleryEyebrow")}</div>
            <h2 className="mt-3 mb-8 text-3xl text-brand-indigo">{t("galleryHeading")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((img, i) => (
                <Image
                  key={i}
                  src={urlFor(img).width(600).height(450).url()}
                  alt={img?.alt || `${project.name} photo ${i + 1}`}
                  width={600}
                  height={450}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
