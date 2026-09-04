import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  featuredProjectsGridQuery,
  featuredTestimonialsQuery,
  faqsQuery,
} from "@/sanity/queries";
import { site, waLink } from "@/lib/config";
import { HeroRotator, type HeroSlide, type HeroOpener } from "@/components/HeroRotator";
import { ChecksAccordion } from "@/components/ChecksAccordion";
import { AreaSwitcher } from "@/components/AreaSwitcher";
import { SituationTool } from "@/components/SituationTool";
import { ServiceTrack } from "@/components/ServiceTrack";
import {
  CHECKS,
  AREA_PANELS,
  SITUATIONS,
  SITUATION_AREAS,
  SERVICE_PANELS,
  JOURNAL_TEASERS,
  JOURNAL_POSTS_READY,
  TEAM,
  TEAM_IS_REAL,
} from "@/lib/homepage-content";
import { ContactCTA } from "@/components/ContactCTA";
import { FAQSection } from "@/components/FAQSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Reveal } from "@/components/Reveal";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";
import { getLowestPriceConfig } from "@/lib/project-helpers";
import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { graph, organizationNode, websiteNode, faqNode } from "@/lib/schema";

/**
 * PLACEHOLDER PHOTOGRAPHY. Stock images from Pexels, not Borivali, Kandivali
 * or Malad. Replace with real local photography before launch.
 */
const HERO_OPENER: HeroOpener = {
  src: "/hero/00-opener.mp4",
  poster: "/hero/00-opener-poster.jpg",
};

const HERO_SLIDES: HeroSlide[] = [
  { src: "/hero/01-mumbai-towers.jpg", alt: "Residential towers in the Mumbai skyline" },
  { src: "/hero/02-highrise.jpg", alt: "Modern high rise apartment buildings" },
  { src: "/hero/03-interior.jpg", alt: "A living room with city views through full height windows" },
  { src: "/hero/04-rooftop.jpg", alt: "A rooftop pool deck overlooking the city" },
];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Self canonical, plus the full four locale cluster. The homepage is
  // genuinely translated in all four, so the whole set is correct here.
  return { alternates: buildAlternates(params.locale, "/") };
}

// Re-fetch content periodically so CMS edits show up without a redeploy.
export const revalidate = 60;

type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type GridProject = {
  _id: string;
  name: string;
  slug: { current: string };
  location?: string;
  coverImage?: any;
  configurations?: Config[];
};

type Testimonial = {
  _id: string;
  quote: LocalizedValue<string>;
  author: string;
  role?: LocalizedValue<string>;
  rating?: number;
};

type Faq = {
  _id: string;
  question: LocalizedValue<string>;
  answer: LocalizedValue<string>;
  category?: string;
};

// Static skyline silhouettes for the Areas cards, in the site's own brand colors.
// Plain data (not JSX) so it renders via .map() inside the component, not at module scope.
// Placeholder until real Borivali/Kandivali/Malad photography is available.
type SkylineRect = { x: number; y: number; w: number; h: number; fill: string };
const AREA_SKYLINES: SkylineRect[][] = [
  [
    { x: 20, y: 60, w: 40, h: 90, fill: "#151b3d" },
    { x: 70, y: 30, w: 35, h: 120, fill: "#151b3d" },
    { x: 115, y: 70, w: 45, h: 80, fill: "#1c2450" },
    { x: 170, y: 45, w: 38, h: 105, fill: "#151b3d" },
    { x: 220, y: 80, w: 40, h: 70, fill: "#1c2450" },
    { x: 270, y: 55, w: 35, h: 95, fill: "#151b3d" },
    { x: 315, y: 75, w: 45, h: 75, fill: "#1c2450" },
    { x: 90, y: 45, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 185, y: 65, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 285, y: 75, w: 4, h: 4, fill: "#e0bd6a" },
  ],
  [
    { x: 30, y: 50, w: 42, h: 100, fill: "#151b3d" },
    { x: 85, y: 75, w: 38, h: 75, fill: "#1c2450" },
    { x: 135, y: 35, w: 40, h: 115, fill: "#151b3d" },
    { x: 188, y: 65, w: 35, h: 85, fill: "#1c2450" },
    { x: 235, y: 50, w: 42, h: 100, fill: "#151b3d" },
    { x: 290, y: 80, w: 36, h: 70, fill: "#1c2450" },
    { x: 48, y: 70, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 150, y: 55, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 250, y: 70, w: 4, h: 4, fill: "#e0bd6a" },
  ],
  [
    { x: 25, y: 70, w: 40, h: 80, fill: "#1c2450" },
    { x: 78, y: 40, w: 36, h: 110, fill: "#151b3d" },
    { x: 125, y: 60, w: 45, h: 90, fill: "#1c2450" },
    { x: 182, y: 30, w: 38, h: 120, fill: "#151b3d" },
    { x: 232, y: 65, w: 40, h: 85, fill: "#1c2450" },
    { x: 285, y: 50, w: 42, h: 100, fill: "#151b3d" },
    { x: 95, y: 55, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 195, y: 45, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 300, y: 65, w: 4, h: 4, fill: "#e0bd6a" },
  ],
  [
    { x: 18, y: 55, w: 38, h: 95, fill: "#151b3d" },
    { x: 68, y: 75, w: 40, h: 75, fill: "#1c2450" },
    { x: 118, y: 35, w: 36, h: 115, fill: "#151b3d" },
    { x: 165, y: 60, w: 42, h: 90, fill: "#1c2450" },
    { x: 218, y: 45, w: 38, h: 105, fill: "#151b3d" },
    { x: 268, y: 70, w: 40, h: 80, fill: "#1c2450" },
    { x: 320, y: 55, w: 36, h: 95, fill: "#151b3d" },
    { x: 85, y: 60, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 235, y: 50, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 335, y: 60, w: 4, h: 4, fill: "#e0bd6a" },
  ],
  [
    { x: 22, y: 65, w: 42, h: 85, fill: "#1c2450" },
    { x: 75, y: 30, w: 38, h: 120, fill: "#151b3d" },
    { x: 128, y: 55, w: 40, h: 95, fill: "#1c2450" },
    { x: 178, y: 70, w: 36, h: 80, fill: "#151b3d" },
    { x: 225, y: 40, w: 42, h: 110, fill: "#1c2450" },
    { x: 278, y: 60, w: 38, h: 90, fill: "#151b3d" },
    { x: 105, y: 50, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 205, y: 65, w: 4, h: 4, fill: "#e0bd6a" },
    { x: 295, y: 55, w: 4, h: 4, fill: "#e0bd6a" },
  ],
];

type CompareValue = true | false | "partial";
type CompareRow = { key: string; us: CompareValue; portals: CompareValue; brokers: CompareValue };
const COMPARE_ROWS: CompareRow[] = [
  { key: "row1", us: true, portals: false, brokers: "partial" },
  { key: "row2", us: true, portals: false, brokers: "partial" },
  { key: "row3", us: true, portals: false, brokers: "partial" },
  { key: "row4", us: true, portals: false, brokers: false },
  { key: "row5", us: true, portals: false, brokers: "partial" },
  { key: "row6", us: true, portals: false, brokers: false },
];

function CompareMark({
  value,
  labels,
  highlight = false,
}: {
  value: CompareValue;
  labels: { yes: string; partial: string; no: string };
  highlight?: boolean;
}) {
  if (value === true) {
    return (
      <span
        className={`inline-flex items-center gap-2 text-sm font-semibold ${
          highlight ? "text-brand-indigo" : "text-muted"
        }`}
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 fill-brass">
          <circle cx="10" cy="10" r="10" opacity="0.15" />
          <path
            d="M6 10.2l2.4 2.4L14.5 6.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {labels.yes}
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-muted">
        <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 fill-brand-indigo/15">
          <circle cx="10" cy="10" r="10" />
          <path d="M6 10h8" stroke="#1c2450" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {labels.partial}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted/70">
      <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 fill-ink/10">
        <circle cx="10" cy="10" r="10" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="#5c6072" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {labels.no}
    </span>
  );
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;

  const [
    projects,
    testimonials,
    faqs,
    tHero,
    tServices,
    tProjectsGrid,
    tTestimonials,
    tAreas,
    tFaq,
    tLeadForm,
    tShowcase,
    tCompare,
    tHandover,
  ] = await Promise.all([
      client.fetch<GridProject[]>(featuredProjectsGridQuery),
      client.fetch<Testimonial[]>(featuredTestimonialsQuery),
      client.fetch<Faq[]>(faqsQuery),
      getTranslations({ locale, namespace: "hero" }),
      getTranslations({ locale, namespace: "services" }),
      getTranslations({ locale, namespace: "projectsGrid" }),
      getTranslations({ locale, namespace: "testimonials" }),
      getTranslations({ locale, namespace: "areas" }),
      getTranslations({ locale, namespace: "faq" }),
      getTranslations({ locale, namespace: "leadForm" }),
      getTranslations({ locale, namespace: "showcase" }),
      getTranslations({ locale, namespace: "compare" }),
      getTranslations({ locale, namespace: "handover" }),
    ]);

  const services = [
    { slug: "resale-flats", title: tServices("resaleTitle"), body: tServices("resaleBody") },
    { slug: "rentals", title: tServices("rentalsTitle"), body: tServices("rentalsBody") },
    { slug: "new-project-bookings", title: tServices("newProjectTitle"), body: tServices("newProjectBody") },
    { slug: "redevelopment", title: tServices("redevelopmentTitle"), body: tServices("redevelopmentBody") },
    { slug: "shops-plots", title: tServices("shopsTitle"), body: tServices("shopsBody") },
    { slug: "interiors", title: tServices("interiorsTitle"), body: tServices("interiorsBody") },
  ];

  // Core markets only. Dahisar and Goregaon are served occasionally, not as
  // core markets, so they belong on the /areas page as extended coverage
  // rather than on the homepage. Their copy stays in messages/ for that page.
  const areas = [
    { name: "Borivali", body: tAreas("borivaliBody") },
    { name: "Kandivali", body: tAreas("kandivaliBody") },
    { name: "Malad", body: tAreas("maladBody") },
  ];

  // Literal class names so Tailwind's build-time scanner can find them (dynamic template strings won't work).
  const revealDelays = ["delay-0", "delay-100", "delay-200"];

  // One project reads as chosen. A grid reads as a shelf, which is the thing
  // we are deliberately not. Prefer the flagship, fall back to the first.
  const featured =
    projects?.find((p) => p.slug?.current === "jaswanti-jewel") ?? projects?.[0];

  const compareLabels = {
    yes: tCompare("legendYes"),
    partial: tCompare("legendPartial"),
    no: tCompare("legendNo"),
  };

  /**
   * Seeded placeholder testimonials are marked featured in Sanity, so without
   * this the homepage renders "Placeholder Client (Borivali)" with five stars.
   * Filtering in code rather than unfeaturing them in Studio means a future
   * placeholder cannot quietly ship either.
   *
   * An invented testimonial is not a soft problem: it is a false claim about a
   * real person's experience, and in a market this small it gets noticed.
   */
  const realTestimonials = (testimonials ?? []).filter((x) => {
    const hay = `${x.author ?? ""} ${getLocalizedField(x.quote, locale) ?? ""}`;
    return !/placeholder|lorem ipsum|sample/i.test(hay);
  });

  // Only the FAQs actually rendered on this page go into the markup. The
  // FAQSection below reads the same list, so the two cannot drift apart.
  const faqSchema = faqNode(
    (faqs ?? []).map((f) => ({
      question: getLocalizedField(f.question, locale) ?? "",
      answer: getLocalizedField(f.answer, locale) ?? "",
    })),
  );

  return (
    <>
      <JsonLd
        data={graph(organizationNode(), websiteNode(locale), faqSchema)}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <HeroRotator slides={HERO_SLIDES} opener={HERO_OPENER} />
        <div
          className="absolute inset-0 z-[3]"
          style={{
            background:
              "linear-gradient(100deg, rgba(21,27,61,0.88) 0%, rgba(21,27,61,0.68) 42%, rgba(21,27,61,0.28) 72%, rgba(21,27,61,0.5) 100%), linear-gradient(180deg, rgba(21,27,61,0.45) 0%, rgba(21,27,61,0) 30%, rgba(21,27,61,0.8) 100%)",
          }}
        />
        <div className="wrap relative z-[6] py-24">
          <div className="max-w-3xl">
            <div className="eyebrow text-brass-bright">
              {[...site.areas, `Since ${site.established}`].join(" · ")}
            </div>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl md:text-6xl">
              {tHero("headingPart1")}
              <em className="italic text-brass-bright">{tHero("headingEm")}</em>
            </h1>
            <p className="mt-6 max-w-[30em] text-lg text-paper/80">{tHero("body")}</p>
            <div className="mt-8">
              <a
                href={waLink(tHero("whatsappMessage"))}
                target="_blank"
                rel="noopener"
                className="btn btn-wa"
              >
                {tHero("ctaWhatsapp")}
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { n: `Since ${site.established}`, l: tHero("statYears") },
                { n: String(site.areas.length), l: tHero("statSuburbs") },
                { n: tHero("statRera"), l: site.rera },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-semibold text-white sm:text-3xl">{s.n}</div>
                  <div className="text-sm text-paper/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* 02 SITUATION.
          Moved directly under the hero. It was fourth, below the checks and
          the areas, which put the one interactive thing on the page about
          three screens down. It is a lead magnet, so it belongs where
          attention still is. */}
      <section className="py-24">
        <div className="wrap">
          <Reveal className="mb-11 max-w-2xl">
            <div className="eyebrow">Two questions</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              Tell us the situation and we will tell you what usually goes wrong
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-muted">
              Not a search box. There is nothing to search. This tells you what to watch
              for before you speak to anybody, including us.
            </p>
          </Reveal>
          <SituationTool situations={SITUATIONS} areas={SITUATION_AREAS} />
        </div>
      </section>

      {/* 03 CHECKS */}
      <section className="bg-paper-alt py-24">
        <div className="wrap">
          <Reveal className="mb-11 max-w-2xl">
            <div className="eyebrow">Before you sign</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              Six things we look at that a listing will never tell you
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-muted">
              This is the part of the job that does not fit in a photograph.
            </p>
          </Reveal>
          <div className="grid gap-9 md:grid-cols-[.85fr_1.15fr] md:items-start md:gap-14">
            <div className="relative aspect-[5/4] overflow-hidden rounded-xl md:sticky md:top-6">
              <Image
                src="/sections/checks.jpg"
                alt="Keys and building plans on a desk"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <ChecksAccordion checks={CHECKS} />
          </div>
        </div>
      </section>

      {/* 04 AREAS */}
      <section className="bg-brand-indigo-deep py-24 text-paper">
        <div className="wrap">
          <Reveal className="mb-11 max-w-2xl">
            <div className="eyebrow text-brass-bright">{tAreas("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-white md:text-4xl">
              Three suburbs, one office, since 1996
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-paper/70">
              Pick the one you are looking at.
            </p>
          </Reveal>
          <AreaSwitcher panels={AREA_PANELS} />
        </div>
      </section>

      {/* 05 SERVICES */}
      <section id="services" className="bg-paper-alt py-24">
        <div className="wrap">
          <Reveal className="mb-11 max-w-2xl">
            <div className="eyebrow">{tServices("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              Resale is the business. The rest is what a move actually needs.
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-muted">
              Most people meet us over one flat and come back for the next three things.
              That is why all of it sits under one roof instead of being handed to a
              stranger at every step.
            </p>
          </Reveal>
        </div>
        <ServiceTrack panels={SERVICE_PANELS} />
      </section>

      {/* COMPARE */}
      <section className="py-24">
        <div className="wrap">
          <Reveal className="mb-13 max-w-2xl">
            <div className="eyebrow">{tCompare("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {tCompare("heading")}
            </h2>
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto rounded-2xl border border-brand-indigo/10">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-brand-indigo/10 bg-paper-alt">
                    <th className="p-5 text-sm font-semibold text-muted">&nbsp;</th>
                    <th className="p-5 text-sm font-semibold text-brand-indigo">{tCompare("colUs")}</th>
                    <th className="p-5 text-sm font-semibold text-muted">{tCompare("colPortals")}</th>
                    <th className="p-5 text-sm font-semibold text-muted">{tCompare("colBrokers")}</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.key}
                      className={i % 2 === 1 ? "bg-paper-alt/50" : undefined}
                    >
                      <td className="p-5 text-sm text-ink">{tCompare(row.key)}</td>
                      <td className="p-5">
                        <CompareMark value={row.us} labels={compareLabels} highlight />
                      </td>
                      <td className="p-5">
                        <CompareMark value={row.portals} labels={compareLabels} />
                      </td>
                      <td className="p-5">
                        <CompareMark value={row.brokers} labels={compareLabels} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>
      {/* 07 FEATURED PROJECT */}
      {featured && (
        <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
          <div className="absolute inset-0">
            <Image
              src={
                featured.coverImage
                  ? urlFor(featured.coverImage).width(1600).height(1120).url()
                  : "/sections/project-jaswanti.jpg"
              }
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-40"
            />
          </div>
          <div className="wrap relative py-24">
            <Reveal className="max-w-3xl">
              <span className="inline-block rounded-sm bg-brass px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-brand-indigo-deep">
                {tProjectsGrid("eyebrow")}
              </span>
              <h2 className="mt-4 text-3xl text-white md:text-5xl">{featured.name}</h2>
              {featured.location && (
                <p className="mt-2 text-paper/70">{featured.location}</p>
              )}

              {featured.configurations && featured.configurations.length > 0 && (
                <div className="mt-7 grid max-w-2xl grid-cols-2 gap-2.5 md:grid-cols-4">
                  {featured.configurations.slice(0, 4).map((c, i) => (
                    <div
                      key={`${c.type}-${i}`}
                      className="rounded-lg border border-brass/25 bg-white/5 p-3.5"
                    >
                      <div className="text-[0.62rem] uppercase tracking-[0.12em] text-brass-bright">
                        {c.type}
                      </div>
                      {c.displayPrice && (
                        <div className="mt-1 font-display text-base text-white">
                          {c.displayPrice}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-6 max-w-[52ch] text-[0.84rem] text-paper/50">
                Exact all inclusive pricing and floor availability shared on request. Every
                figure is verified against the builder sheet before it goes out.
              </p>

              <div className="mt-6 flex flex-wrap gap-3.5">
                <Link
                  href={`/projects/${featured.slug.current}`}
                  className="btn btn-brass"
                >
                  See the project
                </Link>
                <Link href="/projects" className="btn btn-outline border-paper/40 text-paper">
                  {tProjectsGrid("viewAll")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* 08 THE PEOPLE */}
      <section className="py-24">
        <div className="wrap">
          <div className="grid gap-9 md:grid-cols-2 md:items-center md:gap-14">
            <Reveal>
              <div className="relative aspect-[5/4] overflow-hidden rounded-xl">
                <Image
                  src="/sections/people.jpg"
                  alt="Handing over keys across a desk"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal>
              <div className="eyebrow">Since {site.established}</div>
              <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
                The same shop, the same street, the same family
              </h2>
              <p className="mt-4 text-muted">
                We opened in Chikoowadi in {site.established} and never moved. That is long
                enough to have sold flats in the same building twice, and to remember why
                the second sale was harder than the first.
              </p>
              {TEAM_IS_REAL ? (
                <ul className="mt-6 flex flex-col gap-4">
                  {TEAM.map((m) => (
                    <li key={m.name} className="flex items-baseline gap-3.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                      <span>
                        <b className="font-semibold text-ink">{m.name}</b>{" "}
                        <span className="text-[0.93rem] text-muted">{m.role}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {realTestimonials.length > 0 && (
        <section className="bg-paper-alt py-24">
          <div className="wrap">
            <Reveal>
              <div className="eyebrow">{tTestimonials("eyebrow")}</div>
              <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
                {tTestimonials("heading")}
              </h2>
              <div className="mt-10">
                <TestimonialCarousel testimonials={realTestimonials} locale={locale} />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* FAQ */}
      <Reveal>
        <FAQSection
          faqs={faqs}
          locale={locale}
          eyebrow={tFaq("eyebrow")}
          heading={tFaq("heading")}
        />
      </Reveal>
      {/* 11 JOURNAL */}
      <section className="py-24">
        <div className="wrap">
          <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="eyebrow">Worth reading</div>
              <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
                What we write when nobody is buying anything
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-brand-blue">
              All articles
            </Link>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {JOURNAL_TEASERS.map((j, i) => (
              <Reveal key={j.slug} className={revealDelays[i % 3]}>
                <Link
                  href={JOURNAL_POSTS_READY ? "/blog/" + j.slug : "/blog"}
                  className="block h-full overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[14/9]">
                    <Image
                      src={j.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="font-mono text-[0.62rem] uppercase tracking-[0.06em] text-brass">
                      {j.kicker}
                    </div>
                    <h3 className="mt-2 text-lg text-brand-indigo">{j.title}</h3>
                    <p className="mt-1.5 text-[0.88rem] text-muted">{j.blurb}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="enquire" className="bg-brand-indigo-deep text-paper">
        <Reveal>
        <div className="wrap grid items-center gap-14 py-24 md:grid-cols-2">
          <div>
            <div className="eyebrow text-brass-bright">{tLeadForm("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl md:text-4xl">
              {tLeadForm("headingPart1")}
              <em className="italic text-brass-bright">{tLeadForm("headingEm")}</em>
            </h2>
            <p className="mt-4 text-paper/75">{tLeadForm("body")}</p>
            <div className="mt-6 space-y-3 text-sm">
              <p>
                <a href={`tel:${site.phonePrimary}`} className="font-medium text-white">{site.phonePrimary}</a>{" "}
                ·{" "}
                <a href={`tel:${site.phoneSecondary}`} className="font-medium text-white">{site.phoneSecondary}</a>
              </p>
              <p><a href={`mailto:${site.email}`} className="text-white">{site.email}</a></p>
              <p className="text-paper/70">{site.address}</p>
            </div>
          </div>
          <ContactCTA
            formLocation="homepage_contact"
            locale={locale}
            defaultOpen
            tone="dark"
          />
        </div>
        </Reveal>
      </section>
    </>
  );
}
