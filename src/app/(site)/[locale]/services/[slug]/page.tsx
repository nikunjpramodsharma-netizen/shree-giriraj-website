import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { pageBySlugQuery, featuredProjectsGridQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { site, waLink } from "@/lib/config";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";
import { getLowestPriceConfig } from "@/lib/project-helpers";
import { buildAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ContactCTA } from "@/components/ContactCTA";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { graph, serviceNode, breadcrumbNode } from "@/lib/schema";

export const revalidate = 60;

const SERVICE_SLUGS = [
  "resale-flats",
  "rentals",
  "new-project-bookings",
  "redevelopment",
  "shops-plots",
  "interiors",
] as const;

// Maps each service slug to its messages key (services.json uses camelCase, slugs use kebab-case).
const STEPS_KEY: Record<(typeof SERVICE_SLUGS)[number], string> = {
  "resale-flats": "resaleFlats",
  rentals: "rentals",
  "new-project-bookings": "newProjectBookings",
  redevelopment: "redevelopment",
  "shops-plots": "shopsPlots",
  interiors: "interiors",
};

/**
 * One image per service, and each one is now genuinely its own.
 *
 * Previously rentals and shops-plots shared a residential facade, which was
 * both a duplicate and wrong: a commercial unit is not a block of flats.
 * Redevelopment and interiors were both handover shots of keys, which says
 * nothing about either service.
 *
 * All six are wide enough for a full bleed hero. The svc-*.jpg files used by
 * the homepage panel track are only 760px across and would upscale badly here.
 */
const HERO_IMAGE: Record<(typeof SERVICE_SLUGS)[number], string> = {
  "resale-flats": "/architecture-facade-1.jpg",
  rentals: "/moment-keys-1.jpg",
  "new-project-bookings": "/hero-skyline.jpg",
  redevelopment: "/services/hero-redevelopment.jpg",
  "shops-plots": "/services/hero-shops.jpg",
  interiors: "/services/hero-interiors.jpg",
};

/** Alt text per service. A hero image is content, not decoration. */
const HERO_ALT: Record<(typeof SERVICE_SLUGS)[number], string> = {
  "resale-flats": "The facade of a residential building",
  rentals: "Keys being handed across a desk",
  "new-project-bookings": "New residential towers on the Mumbai skyline",
  redevelopment: "A high rise under construction with a crane against the sky",
  "shops-plots": "An empty commercial floor with city views through full height windows",
  interiors: "A finished living room with wooden furniture and daylight",
};

type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type GridProject = {
  _id: string;
  name: string;
  slug: { current: string };
  location?: string;
  coverImage?: any;
  configurations?: Config[];
};

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
    alternates: buildAlternates(params.locale, `/services/${params.slug}`),
    title: page.title,
    description: page.seoDescription,
  };
}

/**
 * Prefill for the enquiry form, as translation keys so it works in every
 * locale. Interiors and shops have no matching option in the existing intent
 * list, so they are left at the default rather than prefilled with something
 * close but wrong.
 */
const SERVICE_INTENT: Record<
  string,
  "intentBuy" | "intentSell" | "intentRent" | "intentNewProject" | "intentRedevelopment" | undefined
> = {
  "resale-flats": "intentBuy",
  rentals: "intentRent",
  "new-project-bookings": "intentNewProject",
  redevelopment: "intentRedevelopment",
  "shops-plots": undefined,
  interiors: undefined,
};

export default async function ServicePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!SERVICE_SLUGS.includes(params.slug as (typeof SERVICE_SLUGS)[number])) notFound();

  const locale = params.locale as Locale;
  const slug = params.slug as (typeof SERVICE_SLUGS)[number];

  const [page, projects, tHero, tServiceCta, tServiceSteps, tProjectsGrid] = await Promise.all([
    client.fetch<ServicePage>(pageBySlugQuery, { slug: params.slug }),
    client.fetch<GridProject[]>(featuredProjectsGridQuery),
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "serviceCta" }),
    getTranslations({ locale, namespace: "serviceSteps" }),
    getTranslations({ locale, namespace: "projectsGrid" }),
  ]);
  if (!page) notFound();

  const heroHeading = getLocalizedField(page.heroHeading, locale) || page.title;
  const heroSubheading = getLocalizedField(page.heroSubheading, locale);
  const body = getLocalizedField(page.body, locale);
  const steps = tServiceSteps.raw(STEPS_KEY[slug]) as string[];

  // Literal class names so Tailwind's build-time scanner can find them (dynamic template strings won't work).
  const revealDelays = ["delay-0", "delay-100", "delay-200"];

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: heroHeading, path: `/services/${slug}` },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            locale,
            name: heroHeading,
            description: heroSubheading,
            slug,
          }),
          breadcrumbNode(locale, trail),
        )}
      />

      {/* HERO */}
      {/*
        Full bleed hero, built the same way as the homepage: photograph, a two
        stop gradient for legibility, then content on top.

        It replaces a split card layout where the image sat in a box beside the
        text. That read as a section rather than as an opening, and it gave a
        service page a much weaker entrance than the homepage.

        The outline button becomes a light variant here, because the original
        was indigo on indigo and would have been close to invisible.
      */}
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src={HERO_IMAGE[slug]}
          alt={HERO_ALT[slug]}
          fill
          priority
          sizes="100vw"
          className="hero-kenburns object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(21,27,61,.92) 0%, rgba(21,27,61,.74) 45%, rgba(21,27,61,.34) 78%, rgba(21,27,61,.55) 100%), linear-gradient(180deg, rgba(21,27,61,.5) 0%, rgba(21,27,61,0) 32%, rgba(21,27,61,.85) 100%)",
          }}
        />
        <div className="wrap relative z-10 py-20 md:py-28">
          <Breadcrumbs trail={trail} tone="dark" />
          <Reveal>
            <div className="mt-6 max-w-3xl">
              <div className="eyebrow text-brass-bright">
                {site.areas.join(" \u00b7 ")}
              </div>
              <h1 className="mt-3.5 max-w-[20ch] text-4xl text-white md:text-6xl">
                {heroHeading}
              </h1>
              {heroSubheading && (
                <p className="mt-5 max-w-[38em] text-lg text-paper/80">
                  {heroSubheading}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3.5">
                <a href="#enquire" className="btn btn-brass">
                  {tHero("ctaBook")}
                </a>
                <a
                  href={waLink(tHero("whatsappMessage"))}
                  target="_blank"
                  rel="noopener"
                  className="btn border-white/70 text-white hover:border-black hover:bg-white hover:text-black"
                >
                  {tHero("ctaWhatsapp")}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-paper-alt py-16 md:py-20">
        <Reveal>
          <div className="wrap">
            <ProcessTimeline steps={steps} />
          </div>
        </Reveal>
      </section>

      {/* BODY */}
      <section className="pb-16">
        <Reveal>
          <div className="mx-auto max-w-3xl px-6">
            <PortableTextBody value={body} />
          </div>
        </Reveal>
      </section>

      {/* PROJECTS CROSS-SELL */}
      {projects && projects.length > 0 && (
        <section className="bg-paper-alt py-20">
          <div className="wrap">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="eyebrow">{tProjectsGrid("eyebrow")}</div>
                <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
                  {tProjectsGrid("heading")}
                </h2>
              </div>
              <Link href="/projects" className="text-sm font-semibold text-brand-blue">
                {tProjectsGrid("viewAll")}
              </Link>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-3">
              {projects.map((project, i) => {
                const lowest = getLowestPriceConfig(project.configurations);
                return (
                  <Reveal key={project._id} className={revealDelays[i % 3]}>
                    <Link
                      href={`/projects/${project.slug.current}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      {project.coverImage && (
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={urlFor(project.coverImage).width(700).height(525).url()}
                            alt={project.coverImage?.alt || project.name}
                            width={700}
                            height={525}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl text-brand-indigo">{project.name}</h3>
                        {project.location && (
                          <p className="mt-1 text-sm text-muted">{project.location}</p>
                        )}
                        {lowest?.displayPrice && (
                          <p className="mt-3 font-display text-lg text-brand-indigo">
                            {lowest.displayPrice}
                          </p>
                        )}
                        <span className="mt-4 text-sm font-semibold text-brand-blue">
                          {tProjectsGrid("viewDetails")}
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA. Two routes, both explicit: WhatsApp for speed, a form for
          everyone who would rather not hand over a WhatsApp number. */}
      <section id="enquire" className="bg-brand-indigo-deep py-20 text-paper">
        <Reveal>
          <div className="wrap grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl">{tServiceCta("heading")}</h2>
              <p className="mt-3 text-paper/75">{tServiceCta("body")}</p>
              <p className="mt-6 text-sm text-paper/60">
                Or call{" "}
                <a href={`tel:${site.phonePrimary}`} className="font-medium text-white">
                  {site.phonePrimary}
                </a>{" "}
                during working hours.
              </p>
            </div>
            <ContactCTA
              formLocation={`service_${slug}`}
              locale={locale}
              tone="dark"
              presetIntentKey={SERVICE_INTENT[slug]}
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
