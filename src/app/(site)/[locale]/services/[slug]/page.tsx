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
import { graph, serviceNode, breadcrumbNode, faqNode } from "@/lib/schema";
import { getServiceFaqs } from "@/lib/service-faqs";

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
 * One image per service, and no image used twice.
 *
 * Each service now has a pair: one photograph on the homepage panel and a
 * different one on the page it opens. Four services were showing the same
 * picture in both places, which made the click feel like it went nowhere.
 *
 * The pairs are chosen so the two halves say different things about the same
 * service. Resale: a tall tower at golden hour on the panel, then towers of
 * twenty odd floors standing around a large landscaped garden on the page,
 * because a buyer is buying the society as much as the flat. Rentals: the
 * keys, then the empty flat those keys open. New launches: towers on the
 * panel, one building close up on the page. Interiors: a fitted kitchen, then
 * a finished living room. Redevelopment: the crane, then the building going up
 * under it. Shops: retail units on a plaza, then shoppers walking a covered
 * arcade of glass shopfronts.
 *
 * TWO RULES LEARNED THE HARD WAY.
 *
 * Authenticity is not a licence to show something unappealing. An earlier
 * resale hero was society blocks at dusk: real, and it made the flats look
 * like somewhere nobody would choose. This page is selling homes, so the
 * building has to look worth living in.
 *
 * And no identifiable foreign faces or foreign signage. A building from
 * anywhere reads as a building; a face or a shopfront in another script reads
 * as a stock photo. Children on a playground, a family unpacking, and a
 * shopping plaza with Chinese signage were all dropped for exactly this.
 * Where people appear, they are at a distance or seen from behind.
 *
 * The shops pair was the third rule. Both halves were a real Indian high
 * street and a real Indian shop counter, and both read as somewhere cheap.
 * This page asks an investor to buy a commercial unit, so it has to show the
 * kind of address they would want to own, not the kind they would walk past.
 * The page then gained people, because an empty parade of units says nothing
 * about footfall, and footfall is what a shop buyer is actually buying.
 *
 * A NOTE ON THE RESALE HERO. The brief was a building of fifteen to twenty
 * floors with a proper garden, and it is the only frame in the set that
 * delivers both at once. It is not Mumbai and its garden statues make that
 * plain. Buildings read across borders where faces and signage do not, so
 * this was judged worth it; if that ever stops being true, the thing to look
 * for is a tall Indian society with its own landscaped podium.
 *
 * Pexels, 8 September 2026. Heroes 1920 wide, panels 1100 by 1375.
 */const HERO_IMAGE: Record<(typeof SERVICE_SLUGS)[number], string> = {
  "resale-flats": "/services/hero-resale.jpg",
  rentals: "/services/hero-rentals.jpg",
  "new-project-bookings": "/services/hero-new-projects.jpg",
  redevelopment: "/services/hero-redevelopment.jpg",
  "shops-plots": "/services/hero-shops.jpg",
  interiors: "/services/hero-interiors.jpg",
};

/** Alt text per service. A hero image is content, not decoration. */
const HERO_ALT: Record<(typeof SERVICE_SLUGS)[number], string> = {
  "resale-flats": "High rise apartment towers standing around a large landscaped garden",
  rentals: "An empty flat with the balcony door open to the light",
  "new-project-bookings": "A tall residential building in Mumbai against a clear sky",
  redevelopment: "A residential building going up, wrapped in scaffolding and safety netting",
  "shops-plots": "Shoppers walking a covered shopping arcade lined with glass shopfronts",
  interiors: "A furnished living room in a Mumbai flat",
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
  // English only: the answers quote English sources and article titles.
  // Rendered and marked up together, or not at all.
  const faqs = locale === "en" ? getServiceFaqs(slug) : [];

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
          faqs.length > 0 ? faqNode(faqs.map((f) => ({ question: f.q, answer: f.a }))) : null,
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

      {/* COMMON QUESTIONS. The questions people actually type for this
          service, answered from the same sourced figures the blog carries.
          See service-faqs.ts for where each answer comes from. */}
      {faqs.length > 0 && (
        <section className="pb-16">
          <Reveal>
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-2xl text-ink md:text-3xl">Common questions</h2>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                {faqs.map((f) => (
                  <div key={f.q} className="py-5">
                    <dt className="font-semibold text-ink">{f.q}</dt>
                    <dd className="mt-2 text-ink/75">
                      {f.a}
                      {f.href && f.hrefLabel && (
                        <>
                          {" "}
                          <Link
                            href={f.href}
                            className="text-brand-indigo underline underline-offset-4"
                          >
                            {f.hrefLabel}
                          </Link>
                          .
                        </>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </section>
      )}

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
