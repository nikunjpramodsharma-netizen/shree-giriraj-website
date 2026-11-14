import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, itemListNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { PILLARS } from "@/lib/pillars";
import { getPublishedGuides } from "@/lib/guides";

export const revalidate = 300;

const GUIDE_LOCALE = "en";

/** About 60 words. The first thing on the page, written to be quoted whole. */
const HUB_INTRO =
  "These free guides explain each step of a Mumbai property deal in plain words. Start with property paperwork for the documents, from the first check to the tax bill in your name. Then pick buying, new projects, renting or MHADA for the guides that fit you. Each guide cites official sources, and our Borivali office can help with any step.";

type TopicLink = { title: string; href: string };
type Topic = { title: string; blurb: string; links: TopicLink[] };

/**
 * The long form guides on new projects, in series order. Only the guides that
 * exist are listed, so this shows three today and five once the last two
 * arrive, with no edit here. See src/lib/guides.ts.
 */
function newProjectsTopic(): Topic | null {
  const links = getPublishedGuides().map((g) => ({
    title: g.label,
    href: `/guides/${g.slug}`,
  }));
  if (links.length === 0) return null;
  return {
    title: "New projects and launches",
    blurb:
      "Booking a flat in a new project: launch bookings, the allotment letter, stamp duty and GST, and how to read a builder's RERA page.",
    links,
  };
}

/** Topic cards. Every link points at a page that is live today. */
const STATIC_TOPICS: Topic[] = [
  {
    title: "Buying a flat",
    blurb:
      "From comparing flats to paying stamp duty, for buyers in Borivali, Kandivali and Malad.",
    links: [
      { title: "Carpet, built up and super built up area", href: "/blog/carpet-area-vs-built-up-area" },
      { title: "Under construction or ready to move", href: "/blog/under-construction-vs-ready-to-move-flat" },
      { title: "Stamp duty and registration charges in Mumbai", href: "/blog/stamp-duty-and-registration-charges-mumbai" },
      { title: "Home loan EMI calculator", href: "/tools/home-loan-emi-calculator" },
      { title: "Resale flats in Borivali, Kandivali and Malad", href: "/services/resale-flats" },
    ],
  },
  {
    title: "Renting",
    blurb:
      "For tenants and owners: deposits, the rent agreement and what a flat earns.",
    links: [
      { title: "How many months of deposit is normal", href: "/blog/rent-deposit-months-western-suburbs" },
      { title: "Rent agreement stamp duty calculator", href: "/tools/rent-agreement-stamp-duty-calculator-mumbai" },
      { title: "HRA calculator and rent receipts", href: "/tools/hra-calculator-rent-receipts" },
      { title: "Rental yield in Mumbai", href: "/blog/rental-yield-mumbai" },
      { title: "Flats to rent in Borivali, Kandivali and Malad", href: "/services/rentals" },
    ],
  },
  {
    title: "MHADA flats",
    blurb:
      "Transfers, NOCs, selling and renting a MHADA flat. We handle MHADA paperwork anywhere in Mumbai.",
    links: [
      { title: "MHADA paperwork service", href: "/services/mhada-paperwork" },
      { title: "MHADA flat transfer", href: "/blog/mhada-flat-transfer" },
      { title: "MHADA NOC online", href: "/blog/mhada-noc-online" },
      { title: "Can we sell a MHADA flat?", href: "/blog/can-we-sell-mhada-flat" },
      { title: "Can we rent out a MHADA flat?", href: "/blog/can-we-rent-mhada-flat" },
    ],
  },
];

/** Buying a flat first, then new projects, then the rest. */
function topics(): Topic[] {
  const fresh = newProjectsTopic();
  if (!fresh) return STATIC_TOPICS;
  return [STATIC_TOPICS[0], fresh, ...STATIC_TOPICS.slice(1)];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== GUIDE_LOCALE) return {};
  return {
    title: "Mumbai property guides: buy, rent, MHADA",
    description:
      "Free guides for Mumbai home buyers, owners and tenants: property paperwork, buying, new projects, renting and MHADA, with steps and sources.",
    ...pageUrls(params.locale, "/guides", [GUIDE_LOCALE]),
  };
}

export default function GuidesIndex({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (locale !== GUIDE_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ];
  const TOPICS = topics();

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          itemListNode(
            locale,
            [
              ...PILLARS.map((p) => ({ name: p.title, path: `/guides/${p.slug}` })),
              ...TOPICS.flatMap((t) =>
                t.links.map((l) => ({ name: l.title, path: l.href })),
              ),
            ],
          ),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/premium/u/paperwork-06.jpg"
          alt="A residential building facade"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(21,27,61,.92) 0%, rgba(21,27,61,.74) 45%, rgba(21,27,61,.34) 78%, rgba(21,27,61,.55) 100%), linear-gradient(180deg, rgba(21,27,61,.5) 0%, rgba(21,27,61,0) 32%, rgba(21,27,61,.85) 100%)" }}
        />
        <div className="wrap relative z-10 py-20 md:py-28">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
            Guides
          </div>
          <h1 className="mt-3 max-w-[18ch] text-3xl text-white md:text-5xl">
            Property guides for Mumbai buyers, owners and tenants
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            Free to read, no form in the way. Paperwork, buying, new projects,
            renting and MHADA, each with the steps and the official sources.
          </p>
        </div>
      </header>

      <div className="wrap py-12">
        <div className="mb-10 max-w-[68ch] rounded-r-xl border-l-[3px] border-bronze bg-paper-alt px-6 py-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-bronze-deep">
            Where to start
          </div>
          <p className="mt-2.5 text-lg text-ink">{HUB_INTRO}</p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {PILLARS.map((p) => {
            const count = p.sections.reduce(
              (n, s) => n + s.spokes.length,
              0,
            );
            return (
              <li key={p.slug}>
                <Link prefetch={false}
                  href={`/guides/${p.slug}`}
                  className="group block overflow-hidden rounded-xl border border-line bg-paper transition-colors hover:bg-paper-alt"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={p.image}
                      alt={p.imageAlt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl text-ink group-hover:text-brand-indigo md:text-2xl">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-sm text-ink/70">{p.answer}</p>
                    <p className="mt-4 text-xs uppercase tracking-wider text-muted">
                      {count} articles
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
          {TOPICS.map((t) => (
            <li
              key={t.title}
              className="rounded-xl border border-line bg-paper p-6"
            >
              <h2 className="text-xl text-ink md:text-2xl">{t.title}</h2>
              <p className="mt-2 text-sm text-ink/70">{t.blurb}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {t.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      prefetch={false}
                      href={l.href}
                      className="text-brand-indigo underline underline-offset-4 hover:text-ink"
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <ContactCTA locale={locale} formLocation="guides-index" />
    </article>
  );
}
