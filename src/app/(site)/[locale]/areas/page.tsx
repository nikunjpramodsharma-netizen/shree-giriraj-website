import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, itemListNode, faqNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { site } from "@/lib/config";
import { AREAS, getAreaPanel } from "@/lib/areas";
import { FLAT_LISTINGS, listingPath } from "@/lib/flats";

/**
 * The three suburbs side by side, from the same figures the area guides and
 * the flats for sale pages carry (read 16 November 2026). A rate times a
 * size; asking, not registered.
 */
/**
 * Questions people ask about the three suburbs (People Also Ask and Search
 * Console, November 2026). Every figure is one already in the table above or
 * on the area guides, with its source and month.
 */
const FAQS = [
  {
    q: "What is the property rate in Borivali West per sq ft?",
    a: "As of September 2026, Square Yards puts the Borivali West average asking rate at 30,750 rupees per sq ft. By pocket, NoBroker's May 2026 figures run from 25,000 to 26,000 in Chikoowadi to 27,000 to 33,800 in Yogi Nagar. These are asking rates, not prices paid.",
  },
  {
    q: "What is the property rate in Kandivali West per sq ft?",
    a: "As of October 2026, Square Yards puts Kandivali West at 26,800 rupees per sq ft, or 27,200 for apartments. Mahavir Nagar asks near 36,450 and Charkop Sectors 2 and 4 ask 25,950 to 26,150.",
  },
  {
    q: "Which area is cheaper, Kandivali or Malad?",
    a: "Kandivali West is cheaper per sq ft: 27,200 rupees for apartments in October 2026, against 28,250 to 30,800 for Malad West, both on Square Yards' figures. A 2 BHK of about 700 sq ft asks about ₹1.90 crore in Kandivali West and ₹1.98 to ₹2.16 crore in Malad West.",
  },
  {
    q: "Which is better to live in, Borivali or Kandivali?",
    a: "Borivali West suits families who want settled societies, the station belt and the national park nearby, at about 30,750 rupees per sq ft in September 2026. Kandivali West costs less, at 27,200 for apartments in October 2026, and has more of the new launches. Inside each, the pocket matters more than the suburb.",
  },
  {
    q: "Is Malad a good area to buy a flat?",
    a: "Malad West suits buyers who want to live or let near the Mindspace office district, which was 100 percent committed at 30 September 2026 on Mindspace Business Parks REIT's figures. That keeps renters close by. A 1 BHK of 400 to 450 sq ft asks about ₹1.13 to ₹1.39 crore there.",
  },
  {
    q: "How much does a 1 BHK cost in Borivali, Kandivali and Malad?",
    a: "A 1 BHK of 400 to 450 sq ft asks about ₹1.23 to ₹1.38 crore in Borivali West, ₹1.09 to ₹1.22 crore in Kandivali West and ₹1.13 to ₹1.39 crore in Malad West. These use Square Yards' September to November 2026 rates, and are asking figures, not prices paid.",
  },
  {
    q: "What is the rent of a 2 BHK in these suburbs?",
    a: "A 2 BHK rents for about ₹49,600 a month on average in Borivali West (Square Yards, September 2026) and ₹52,850 in Kandivali West (October 2026). Malad West asks ₹42,000 to ₹65,000 on Broker Network's July 2026 figures. Deposits in newer societies run two to three months.",
  },
  {
    q: "Can you help me buy or sell a flat in these suburbs?",
    a: "Yes. Send the size, the budget and the pocket on WhatsApp and we send the flats that fit, usually the same day. Selling instead? Send the building's name and we tell you what it would ask this month, free.",
  },
];

const COMPARE = [
  { slug: "borivali-west", place: "Borivali West", rate: "30,750", rateNote: "Square Yards, September 2026", oneBhk: "₹1.23 to ₹1.38 Cr", twoBhk: "about ₹2.15 Cr", rent: "₹49,600", rentNote: "Square Yards, September 2026" },
  { slug: "kandivali", place: "Kandivali West", rate: "27,200", rateNote: "Square Yards, apartments, October 2026", oneBhk: "₹1.09 to ₹1.22 Cr", twoBhk: "about ₹1.90 Cr", rent: "₹52,850", rentNote: "Square Yards, October 2026" },
  { slug: "malad", place: "Malad West", rate: "28,250 to 30,800", rateNote: "Square Yards, September to November 2026", oneBhk: "₹1.13 to ₹1.39 Cr", twoBhk: "₹1.98 to ₹2.16 Cr", rent: "₹42,000 to ₹65,000", rentNote: "Broker Network, July 2026" },
];

export const revalidate = 300;

const AREA_LOCALE = "en";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== AREA_LOCALE) return {};
  return {
    title: "Borivali, Kandivali, Malad West area guides",
    description:
      "Property rates, 1 and 2 BHK prices and rents in Borivali, Kandivali and Malad West, checked November 2026, from a local agency working here since 1996.",
    ...pageUrls(params.locale, "/areas", [AREA_LOCALE]),
  };
}

export default function AreasIndex({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (locale !== AREA_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          itemListNode(
            locale,
            AREAS.map((a) => ({ name: a.longName, path: `/areas/${a.slug}` })),
          ),
          faqNode(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        {/* The Borivali panel image: the home suburb, and the one this firm
            has worked in since 1996 (and out of the Borivali office since 2005). */}
        <Image
          src="/premium/u/coast-green-02.jpg"
          alt="A quiet beach backed by coconut palms"
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
            Areas
          </div>
          <h1 className="mt-3 max-w-[22ch] text-3xl text-white md:text-5xl">
            Borivali, Kandivali and Malad West: area guides
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            Three suburbs we have worked in since 1996, pocket by pocket. Each
            guide carries the property rates with their source and month, what a
            1, 2 or 3 BHK costs, the rents, and what we check before you commit.
          </p>
        </div>
      </header>

      <div className="wrap py-12">
        <section aria-labelledby="compare" className="mb-12">
          <h2 id="compare" className="text-2xl text-ink md:text-3xl">
            Property rates in Borivali, Kandivali and Malad West compared
          </h2>
          <p className="mt-3 max-w-[68ch] text-ink/80">
            Borivali West asks the most of the three per square foot and
            Kandivali West the least, on Square Yards&apos; autumn 2026 figures.
            Rents run the other way: Kandivali West&apos;s average 2 BHK rent of
            ₹52,850 is above Borivali West&apos;s ₹49,600. Figures read 16
            November 2026; asking, not prices paid.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-paper-alt text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Suburb</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Average asking rate per sq ft</th>
                  <th scope="col" className="px-4 py-3 font-semibold">1 BHK, 400 to 450 sq ft</th>
                  <th scope="col" className="px-4 py-3 font-semibold">2 BHK, about 700 sq ft</th>
                  <th scope="col" className="px-4 py-3 font-semibold">2 BHK rent a month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {COMPARE.map((c) => (
                  <tr key={c.slug}>
                    <th scope="row" className="px-4 py-3 font-medium text-brand-indigo">
                      <a href={`/areas/${c.slug}`} className="underline underline-offset-4">{c.place}</a>
                    </th>
                    <td className="px-4 py-3 text-ink/85">
                      ₹{c.rate}
                      <span className="block text-xs text-muted">{c.rateNote}</span>
                    </td>
                    <td className="px-4 py-3 text-ink/85">{c.oneBhk}</td>
                    <td className="px-4 py-3 text-ink/85">{c.twoBhk}</td>
                    <td className="px-4 py-3 text-ink/85">
                      {c.rent}
                      <span className="block text-xs text-muted">{c.rentNote}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-[68ch] text-xs text-muted">
            Prices are the rate times the size shown. Each suburb&apos;s flats for
            sale page breaks them down by pocket.
          </p>
        </section>

        <ul className="grid gap-6 md:grid-cols-3">
          {AREAS.map((a) => {
            const panel = getAreaPanel(a.slug);
            return (
              <li key={a.slug}>
                <Link prefetch={false}
                  href={`/areas/${a.slug}`}
                  className="group block overflow-hidden rounded-xl border border-line bg-paper transition-colors hover:bg-paper-alt"
                >
                  {panel && (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={a.hero?.src ?? panel.image}
                        alt={a.hero?.alt ?? `${a.place}, Mumbai`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-xl text-ink group-hover:text-brand-indigo">
                      {a.place} property rates and guide
                    </h2>
                    <p className="mt-2 text-sm text-ink/70">{a.answer}</p>
                  </div>
                </Link>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {FLAT_LISTINGS.filter((l) => l.area === a.slug).map((l) => (
                    <a
                      key={l.intent}
                      href={listingPath(l)}
                      className="font-semibold text-brand-indigo underline underline-offset-4"
                    >
                      Flats for {l.intent} in {l.place}
                    </a>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>

        <section className="mt-14" aria-labelledby="areas-faq">
          <h2 id="areas-faq" className="text-2xl text-ink md:text-3xl">Common questions</h2>
          <div className="mt-6 grid items-start gap-3 md:grid-cols-2">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-line bg-white px-5 py-3.5 open:shadow-sm">
                <summary className="cursor-pointer list-none font-medium text-brand-indigo marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="shrink-0 text-bronze-deep transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[0.97rem] text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 max-w-[68ch] text-sm text-muted">
          Looking for a launch instead? See the{" "}
          <a href="/projects" className="font-semibold text-brand-indigo underline underline-offset-4">
            new projects in Kandivali West and Borivali West
          </a>
          , compared side by side. We also work occasionally in{" "}
          {site.extendedAreas.join(" and ")}, though neither is a core market.
        </p>
      </div>

      <ContactCTA locale={locale} formLocation="areas-index" />
    </article>
  );
}
