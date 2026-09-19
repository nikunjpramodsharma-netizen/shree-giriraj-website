import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ConsultCTA } from "@/components/ConsultCTA";
import { ContactCTA } from "@/components/ContactCTA";
import { RelatedLinks } from "@/components/RelatedLinks";
import { InView } from "@/components/motion/InView";
import { StickyBar } from "@/components/motion/StickyBar";
import { FlatPriceEstimator } from "@/components/FlatPriceEstimator";
import { graph, breadcrumbNode, faqNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { waLink } from "@/lib/config";
import { getArea } from "@/lib/areas";
import { FLAT_LISTINGS, LISTING_SEGMENT, getListing, listingPath } from "@/lib/flats";
import { interlinksForListing } from "@/lib/interlinks";

export const revalidate = 300;

const LOCALE = "en";

/**
 * All six pages are built ahead of time. The parent segments' params are not
 * always passed down here, so the list is derived from the data on its own,
 * narrowed by whatever parent params do arrive.
 */
export function generateStaticParams({ params }: { params: { locale?: string; slug?: string } }) {
  if (params?.locale && params.locale !== LOCALE) return [];
  return FLAT_LISTINGS.filter((l) => !params?.slug || l.area === params.slug).map((l) => ({
    ...(params?.slug ? {} : { slug: l.area }),
    listing: LISTING_SEGMENT[l.intent],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string; listing: string };
}): Promise<Metadata> {
  const l = getListing(params.slug, params.listing);
  if (!l || params.locale !== LOCALE) return {};
  return {
    title: l.metaTitle,
    description: l.metaDescription,
    ...pageUrls(params.locale, listingPath(l), [LOCALE]),
  };
}

export default function FlatsPage({ params }: { params: { locale: string; slug: string; listing: string } }) {
  const { locale } = params;
  // Pages rendered on demand must set the locale themselves, or next-intl
  // falls back to reading request headers, which a static render forbids.
  setRequestLocale(locale);
  const l = getListing(params.slug, params.listing);
  const area = getArea(params.slug);
  if (!l || !area || locale !== LOCALE) notFound();

  const path = listingPath(l);
  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    { name: area.longName, path: `/areas/${area.slug}` },
    { name: l.intent === "sale" ? "Flats for sale" : "Flats for rent", path },
  ];
  const other = FLAT_LISTINGS.find((x) => x.area === l.area && x.intent !== l.intent);

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          faqNode(l.faqs.map((f) => ({ question: f.q, answer: f.a }))),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <div className="absolute inset-0">
          <Image src={l.image.src} alt={l.image.alt} fill priority sizes="100vw" className="object-cover opacity-45" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,27,61,.55) 0%, rgba(21,27,61,.4) 40%, rgba(21,27,61,.94) 100%)",
          }}
        />
        <div className="wrap relative py-14 md:py-20">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
            {l.intent === "sale" ? "Flats for sale" : "Flats for rent"} · {l.place}
          </div>
          <h1 className="rise mt-3 max-w-[22ch] text-3xl text-white md:text-5xl">{l.h1}</h1>
          <p className="rise-2 mt-5 max-w-[58ch] text-paper/80">{l.intro}</p>
          <div className="rise-3 mt-7 flex flex-wrap items-center gap-3">
            <a href={waLink(l.waMessage)} target="_blank" rel="noopener" className="btn btn-wa">
              Tell us the size and budget
            </a>
            <a href="#enquire" className="text-sm font-semibold text-brass-bright underline decoration-brass/40 underline-offset-4">
              Or leave your details
            </a>
          </div>
        </div>
      </header>

      <div className="wrap py-12">
        <div className="max-w-[68ch] rounded-r-xl border-l-[3px] border-brass bg-paper-alt px-6 py-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">The short answer</div>
          <p className="mt-2.5 text-lg text-ink">{l.answer}</p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl text-ink md:text-3xl">
            {l.intent === "sale" ? `1, 2 and 3 BHK in ${l.place}` : `Rents by size in ${l.place}`}
          </h2>
          <InView className="cascade mt-6 grid gap-4 md:grid-cols-3" threshold={0.15}>
            {l.sizes.map((s, i) => (
              <div key={s.size} style={{ ["--i" as string]: i }} className="flex flex-col rounded-2xl border border-line bg-white p-6">
                <div className="font-display text-2xl font-semibold text-brand-indigo">{s.size}</div>
                {s.figure ? (
                  <div className="mt-2 text-lg text-ink">
                    ₹{s.figure}
                    {s.figureNote && <div className="text-xs text-muted">{s.figureNote}</div>}
                  </div>
                ) : s.figureNote ? (
                  <div className="mt-2 text-xs text-muted">{s.figureNote}</div>
                ) : null}
                <p className="mt-3 text-[0.97rem] text-ink/85">{s.suits}</p>
                <div className="mt-auto pt-4 text-sm text-ink/75">
                  <span className="font-semibold text-brand-indigo">What we check: </span>
                  {s.check}
                </div>
              </div>
            ))}
          </InView>
          <p className="mt-3 max-w-[68ch] text-xs text-muted">{l.figuresNote}</p>
        </section>

        {l.pockets && (
          <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="max-w-[60ch]">
              <h2 className="text-2xl text-ink md:text-3xl">Asking rates by pocket</h2>
              <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
                {l.pockets.map((p) => (
                  <li key={p.label} className="flex items-baseline justify-between gap-4 px-5 py-3">
                    <span className="text-ink">{p.label}</span>
                    <span className="text-right text-sm text-ink/80">
                      ₹{p.low.toLocaleString("en-IN")}
                      {p.high !== p.low && ` to ₹${p.high.toLocaleString("en-IN")}`} per sq ft
                      <span className="block text-xs text-muted">{p.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <FlatPriceEstimator pockets={l.pockets} place={l.place} />
          </section>
        )}

        <section className="mt-12 max-w-[68ch]">
          <h2 className="text-2xl text-ink md:text-3xl">What we check before you {l.intent === "sale" ? "pay a token" : "sign"}</h2>
          <ul className="mt-5 space-y-2.5">
            {l.checks.map((c) => (
              <li key={c} className="flex gap-3 text-ink/85">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <aside className="mt-8 rounded-2xl border border-brass/30 bg-brand-indigo-deep p-6 text-paper md:p-7">
            <p className="font-display text-lg leading-snug text-white md:text-xl">
              Send us the size, the budget and the pocket, and we will send the flats that fit this week.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href={waLink(l.waMessage)} target="_blank" rel="noopener" className="btn btn-wa">
                WhatsApp us
              </a>
              <a href="#enquire" className="text-sm font-semibold text-brass-bright underline decoration-brass/40 underline-offset-4">
                Or leave your details below
              </a>
            </div>
            <p className="mt-3 text-xs text-paper/60">Free, no obligation, usually answered the same day.</p>
          </aside>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl text-ink md:text-3xl">Common questions</h2>
          <InView className="cascade mt-6 grid items-start gap-3 md:grid-cols-2" threshold={0.1}>
            {l.faqs.map((f, i) => (
              <details key={f.q} style={{ ["--i" as string]: i }} className="group rounded-xl border border-line bg-white px-5 py-3.5 open:shadow-sm">
                <summary className="cursor-pointer list-none font-medium text-brand-indigo marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="shrink-0 text-brass transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[0.97rem] text-ink/75">{f.a}</p>
              </details>
            ))}
          </InView>
        </section>

        <details className="mt-12 max-w-[68ch] rounded-xl border border-line p-5">
          <summary className="cursor-pointer list-none text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted marker:content-none">
            Where these figures come from. Asking rates and rents, not prices paid.
          </summary>
          <ul className="mt-4 space-y-2 text-sm">
            {l.sources.map((src) => (
              <li key={src.url}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-brand-indigo underline underline-offset-4">
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
        </details>

        {other && (
          <p className="mt-8 text-sm text-muted">
            Looking to {other.intent === "sale" ? "buy" : "rent"} instead? See{" "}
            <a href={listingPath(other)} className="font-semibold text-brand-indigo underline underline-offset-4">
              flats for {other.intent} in {other.place}
            </a>
            , or read the full{" "}
            <a href={`/areas/${area.slug}`} className="font-semibold text-brand-indigo underline underline-offset-4">
              {area.longName} area guide
            </a>
            .
          </p>
        )}
      </div>

      <RelatedLinks
        links={interlinksForListing(l.area, l.intent, locale)}
        locale={locale}
        tone="alt"
        heading={`Buying or renting in ${l.place}, and the sums behind it`}
        intro="The services that go with this search, the calculators that use these figures, the other two suburbs, and the articles that go deeper."
      />

      <ConsultCTA locale={locale} formLocation={`flats-${l.intent}-${l.area}`} />
      <div id="enquire">
        <ContactCTA locale={locale} formLocation={`flats-${l.intent}-${l.area}-footer`} presetArea={area.longName} />
      </div>
      <StickyBar message={l.waMessage} waLabel="WhatsApp" callLabel="Call" />
    </article>
  );
}
