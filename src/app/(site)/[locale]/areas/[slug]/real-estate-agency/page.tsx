import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ConsultCTA } from "@/components/ConsultCTA";
import { ContactCTA } from "@/components/ContactCTA";
import { InView } from "@/components/motion/InView";
import { StickyBar } from "@/components/motion/StickyBar";
import { ShortlistForm } from "@/components/ShortlistForm";
import { SHORTLIST_SUBURB_FOR_AREA } from "@/lib/shortlist";
import { bhkPagesFor } from "@/lib/bhk-pages";
import { graph, breadcrumbNode, faqNode, localServiceNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { site, waLink } from "@/lib/config";
import { showPhone } from "@/lib/card";
import { getArea } from "@/lib/areas";
import { FLAT_LISTINGS } from "@/lib/flats";
import { AGENCY_PAGES, agencyListingLinks, agencyPagePath, getAgencyPage, priceRows } from "@/lib/agency-pages";

export const revalidate = 300;

/** English only, like the rest of /areas. Any other locale is a 404. */
const LOCALE = "en";

/**
 * Three pages, built ahead of time. A static segment wins over the sibling
 * [listing] dynamic segment, so this does not touch the flats pages.
 */
export function generateStaticParams({ params }: { params: { locale?: string; slug?: string } }) {
  if (params?.locale && params.locale !== LOCALE) return [];
  return AGENCY_PAGES.filter((p) => !params?.slug || p.slug === params.slug).map((p) => ({
    ...(params?.slug ? {} : { slug: p.slug }),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const p = getAgencyPage(params.slug);
  if (!p || params.locale !== LOCALE) return {};
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    ...pageUrls(params.locale, agencyPagePath(p.slug), [LOCALE]),
  };
}

export default function AgencyPage({ params }: { params: { locale: string; slug: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const p = getAgencyPage(params.slug);
  const area = getArea(params.slug);
  const sale = FLAT_LISTINGS.find((l) => l.area === params.slug && l.intent === "sale");
  if (!p || !area || !sale || locale !== LOCALE) notFound();

  const path = agencyPagePath(p.slug);
  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    { name: area.longName, path: `/areas/${area.slug}` },
    { name: "Real estate agency", path },
  ];
  const rows = priceRows(p.slug);
  const links = agencyListingLinks(p.slug);
  const bhk = bhkPagesFor(p.slug);

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          faqNode(p.faqs.map((f) => ({ question: f.q, answer: f.a }))),
          localServiceNode({
            locale,
            name: p.h1,
            path,
            place: p.place,
            description: p.metaDescription,
          }),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <div className="absolute inset-0">
          <Image src={sale.image.src} alt={sale.image.alt} fill priority sizes="100vw" className="object-cover opacity-45" />
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
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
            Since {site.established} · MahaRERA {site.rera}
          </div>
          <h1 className="rise mt-3 max-w-[22ch] text-3xl text-white md:text-5xl">{p.h1}</h1>
          <p className="rise-2 mt-5 max-w-[58ch] text-paper/80">
            Tell us {p.ask} on WhatsApp. We send you the flats that fit, usually the same day.
          </p>
          <div className="rise-3 mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <a href={waLink(p.waMessage)} target="_blank" rel="noopener" className="btn btn-wa">
              Get matching flats on WhatsApp
            </a>
            <a
              href={`tel:${site.phonePrimary}`}
              className="text-sm font-semibold text-bronze underline decoration-bronze/40 underline-offset-4"
            >
              Or call {showPhone(site.phonePrimary)}
            </a>
          </div>
          <p className="rise-3 mt-3 text-xs text-paper/60">Free, no obligation. Open {site.hours.label}.</p>
        </div>
      </header>

      <div className="wrap py-12">
        <div className="max-w-[68ch] rounded-r-xl border-l-[3px] border-bronze bg-paper-alt px-6 py-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-bronze-deep">The short answer</div>
          <p className="mt-2.5 text-lg text-ink">{p.answer}</p>
        </div>

        <section className="mt-12 max-w-[68ch]" aria-labelledby="pockets">
          <h2 id="pockets" className="text-2xl text-ink md:text-3xl">
            The pockets of {p.place} we cover
          </h2>
          <p className="mt-3 text-ink/80">{p.pocketsIntro}</p>
          <ul className="mt-5 space-y-2.5">
            {p.pockets.map((k) => (
              <li key={k.name} className="flex gap-3 text-ink/85">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                <span>
                  <span className="font-semibold text-brand-indigo">{k.name}</span>: {k.line}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            The full pocket by pocket guide is on the{" "}
            <a href={`/areas/${area.slug}`} className="font-semibold text-brand-indigo underline underline-offset-4">
              {area.longName} area guide
            </a>
            .
          </p>
        </section>

        <section className="mt-12" aria-labelledby="what-we-do">
          <h2 id="what-we-do" className="text-2xl text-ink md:text-3xl">
            What our real estate agency does in {p.place}
          </h2>
          <InView className="cascade mt-6 grid gap-4 md:grid-cols-2" threshold={0.1}>
            {p.services.map((s, i) => (
              <div
                key={s.title}
                style={{ ["--i" as string]: i }}
                className="flex flex-col rounded-2xl border border-line bg-white p-6"
              >
                <div className="font-display text-xl font-semibold text-brand-indigo">{s.title}</div>
                <p className="mt-2 text-[0.97rem] text-ink/85">{s.body}</p>
                <a
                  href={s.href}
                  className="mt-auto pt-4 text-sm font-semibold text-brand-indigo underline underline-offset-4"
                >
                  {s.cta}
                </a>
              </div>
            ))}
          </InView>
        </section>

        {rows.length > 0 && (
          <section className="mt-12" aria-labelledby="costs">
            <h2 id="costs" className="text-2xl text-ink md:text-3xl">
              What 1, 2 and 3 BHK flats cost in {p.place}
            </h2>
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <caption className="sr-only">Asking price and asking rent by size in {p.place}</caption>
                <thead className="bg-paper-alt text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Size</th>
                    <th scope="col" className="px-4 py-3 font-semibold">To buy</th>
                    <th scope="col" className="px-4 py-3 font-semibold">To rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-white">
                  {rows.map((r) => (
                    <tr key={r.size}>
                      <th scope="row" className="px-4 py-3 align-top font-medium text-brand-indigo">{r.size}</th>
                      <td className="px-4 py-3 align-top text-ink/85">
                        {r.buy.figure}
                        {r.buy.basis && <span className="block text-xs text-muted">{r.buy.basis}</span>}
                      </td>
                      <td className="px-4 py-3 align-top text-ink/85">
                        {r.rent.figure}
                        {r.rent.basis && <span className="block text-xs text-muted">{r.rent.basis}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 max-w-[68ch] text-xs text-muted">
              Asking figures, not prices paid. The sources and the month of each figure are on the flats pages below.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {links.sale && (
                <li>
                  <a href={links.sale} className="font-semibold text-brand-indigo underline underline-offset-4">
                    Flats for sale in {p.place}
                  </a>
                </li>
              )}
              {links.rent && (
                <li>
                  <a href={links.rent} className="font-semibold text-brand-indigo underline underline-offset-4">
                    Flats for rent in {p.place}
                  </a>
                </li>
              )}
              {bhk.map((b) => (
                <li key={b.path}>
                  <a href={b.path} className="font-semibold text-brand-indigo underline underline-offset-4">
                    {b.size} flats for sale
                  </a>
                </li>
              ))}
              <li>
                <a href={`/areas/${area.slug}`} className="font-semibold text-brand-indigo underline underline-offset-4">
                  {area.longName} area guide
                </a>
              </li>
            </ul>
          </section>
        )}

        <section className="mt-12" aria-labelledby="how-we-work">
          <div className="eyebrow">How we work</div>
          <h2 id="how-we-work" className="mt-3 text-2xl text-ink md:text-3xl">
            Tell us once. We do the searching.
          </h2>
          <p className="mt-3 max-w-[62ch] text-ink/80">{p.howIntro}</p>
          <InView as="ol" className="cascade mt-6 grid gap-4 md:grid-cols-3" threshold={0.15}>
            {[
              { title: "Send us three things", body: `Tell us ${p.ask}. One WhatsApp message is enough.` },
              {
                title: "Get your shortlist, usually the same day",
                body: "Flats that fit, each with its asking price and what we know about the building and the society.",
              },
              {
                title: "Papers checked before you pay a token",
                body: "We arrange the visits, then check the title, the society NOC and the OC before any money moves.",
              },
            ].map((step, i) => (
              <li
                key={step.title}
                style={{ ["--i" as string]: i }}
                className="rounded-2xl border border-line bg-white p-6"
              >
                <div className="font-display text-3xl font-semibold text-bronze-deep" aria-hidden="true">
                  {i + 1}
                </div>
                <div className="mt-2 font-semibold text-brand-indigo">{step.title}</div>
                <p className="mt-2 text-[0.97rem] text-ink/80">{step.body}</p>
              </li>
            ))}
          </InView>
          <div className="mt-8 max-w-4xl">
            <ShortlistForm
              intent="buy"
              suburb={SHORTLIST_SUBURB_FOR_AREA[p.slug]}
              location={`agency-${p.slug}`}
            />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl text-ink md:text-3xl">Common questions</h2>
          <InView className="cascade mt-6 grid items-start gap-3 md:grid-cols-2" threshold={0.1}>
            {p.faqs.map((f, i) => (
              <details
                key={f.q}
                style={{ ["--i" as string]: i }}
                className="group rounded-xl border border-line bg-white px-5 py-3.5 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none font-medium text-brand-indigo marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="shrink-0 text-bronze-deep transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[0.97rem] text-ink/75">{f.a}</p>
              </details>
            ))}
          </InView>
        </section>
      </div>

      <ConsultCTA locale={locale} formLocation={`agency-${p.slug}`} />
      <div id="enquire">
        <ContactCTA locale={locale} formLocation={`agency-${p.slug}-footer`} presetArea={area.longName} />
      </div>
      <StickyBar message={p.waMessage} waLabel="Flats on WhatsApp" callLabel="Call" />
    </article>
  );
}
