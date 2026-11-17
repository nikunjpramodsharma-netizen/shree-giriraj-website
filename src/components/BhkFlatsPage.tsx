import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { ShortlistForm } from "@/components/ShortlistForm";
import { graph, breadcrumbNode, faqNode, localServiceNode } from "@/lib/schema";
import { site, waLink } from "@/lib/config";
import { showPhone } from "@/lib/card";
import { SHORTLIST_SUBURB_FOR_AREA } from "@/lib/shortlist";
import { BHK_PAGES, lakhOrCrore, type BhkPage } from "@/lib/bhk-pages";

/**
 * One size in one suburb: /areas/{area}/{n}-bhk-flats-for-sale.
 * Data and the reasoning behind these pages: src/lib/bhk-pages.ts.
 * English only, like the rest of /areas, so plain anchors are right.
 */
export function BhkFlatsPage({ page: p, areaName, locale }: { page: BhkPage; areaName: string; locale: string }) {
  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    { name: areaName, path: `/areas/${p.area}` },
    { name: "Flats for sale", path: p.salePath },
    { name: p.size, path: p.path },
  ];
  const otherSizes = BHK_PAGES.filter((x) => x.area === p.area && x.size !== p.size);
  const sameSizeElsewhere = BHK_PAGES.filter((x) => x.size === p.size && x.area !== p.area);
  const message = `Hi Shree Giriraj, I am looking to buy a ${p.size} in ${p.place}. My budget is about ___ and I prefer ___ (pocket). Please send the flats that fit.`;
  const c = p.cashOnTop;

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          faqNode(p.faqs.map((f) => ({ question: f.q, answer: f.a }))),
          localServiceNode({ locale, name: p.h1, path: p.path, place: p.place, description: p.metaDescription }),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <div className="wrap relative py-14 md:py-20">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
            {p.size} for sale · {p.place}
          </div>
          <h1 className="rise mt-3 max-w-[22ch] text-3xl text-white md:text-5xl">{p.h1}</h1>
          <div className="rise-2 mt-6 max-w-[40rem] rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-wider text-paper/60">A {p.size} here asks</div>
            <div className="mt-1 font-display text-3xl font-semibold text-white">{p.quickFigure}</div>
            <div className="mt-1 text-sm text-paper/70">{p.quickBasis}</div>
            <p className="mt-3 text-xs text-paper/60">{p.quickNote}</p>
          </div>
          <div className="rise-3 mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
            <a href={waLink(message)} target="_blank" rel="noopener" className="btn btn-wa">
              Get {p.size} flats on WhatsApp
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
          <p className="mt-3 text-xs text-muted">Updated on {p.updatedOn}: every figure read again against its source that day.</p>
        </div>

        <p className="mt-8 max-w-[68ch] text-ink/85">{p.intro}</p>

        <section className="mt-12" aria-labelledby="by-pocket">
          <h2 id="by-pocket" className="text-2xl text-ink md:text-3xl">
            {p.size} price in {p.place}, pocket by pocket
          </h2>
          <p className="mt-3 max-w-[68ch] text-ink/80">
            Each row is the pocket&apos;s published asking rate times {p.sizeLabel}, the {p.size} size these figures use.
            Find your budget, and that is the pocket to ask us about.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <caption className="sr-only">
                {p.size} asking price by pocket in {p.place}
              </caption>
              <thead className="bg-paper-alt text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Pocket and source</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Asking rate per sq ft</th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {p.size} asks
                    <span className="block font-normal normal-case tracking-normal">{p.sizeLabel}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {p.pocketRows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className="px-4 py-3 font-medium text-brand-indigo">
                      {r.label}
                      <span className="block text-xs font-normal text-muted">{r.note}</span>
                    </th>
                    <td className="px-4 py-3 text-ink/85">{r.rate}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{r.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {p.band.figure && (
            <p className="mt-3 max-w-[68ch] text-sm text-ink/80">
              Published band for a {p.size} in {p.place}: <strong>₹{p.band.figure}</strong>
              {p.band.note && <span className="text-muted"> ({p.band.note})</span>}.
            </p>
          )}
          <p className="mt-2 max-w-[68ch] text-xs text-muted">
            Asking figures, not prices paid. Portals do not always state whether a rate is on carpet or built up area,
            so ask us what any price is quoted on.
          </p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-xl text-brand-indigo">Who a {p.size} here suits</h2>
            <p className="mt-3 text-ink/85">{p.suits}</p>
            <h3 className="mt-5 font-semibold text-ink">What we check on a {p.size}</h3>
            <p className="mt-2 text-ink/80">{p.check}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-xl text-brand-indigo">The cash on top of the price</h2>
            <p className="mt-3 text-ink/85">
              On {c.priceLow === c.priceHigh ? lakhOrCrore(c.priceLow) : `${lakhOrCrore(c.priceLow)} to ${lakhOrCrore(c.priceHigh)}`},
              stamp duty at 6 percent is{" "}
              <strong>
                {c.dutyLow === c.dutyHigh ? lakhOrCrore(c.dutyLow) : `${lakhOrCrore(c.dutyLow)} to ${lakhOrCrore(c.dutyHigh)}`}
              </strong>
              , and registration is capped at ₹30,000. Where the only buyers are women the duty is 5 percent.
            </p>
            <p className="mt-3 text-sm text-ink/75">
              A home loan covers neither, so plan them with the down payment. Work out your own figure with the{" "}
              <a href="/tools/stamp-duty-calculator-mumbai" className="font-semibold text-brand-indigo underline underline-offset-4">
                stamp duty calculator
              </a>{" "}
              and the{" "}
              <a href="/tools/home-loan-emi-calculator" className="font-semibold text-brand-indigo underline underline-offset-4">
                EMI calculator
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-12 max-w-4xl">
          <ShortlistForm intent="buy" suburb={SHORTLIST_SUBURB_FOR_AREA[p.area]} bhk={p.size} location={`bhk-${p.area}-${p.size[0]}`} />
        </div>

        <section className="mt-12 max-w-[68ch]">
          <h2 className="text-2xl text-ink md:text-3xl">What we check before you pay a token</h2>
          <ul className="mt-5 space-y-2.5">
            {p.checks.map((ch) => (
              <li key={ch} className="flex gap-3 text-ink/85">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                <span>{ch}</span>
              </li>
            ))}
          </ul>
        </section>

        {p.rentLine && p.rentPath && (
          <section className="mt-12 max-w-[68ch]">
            <h2 className="text-2xl text-ink md:text-3xl">Renting a {p.size} in {p.place} instead?</h2>
            <p className="mt-3 text-ink/80">{p.rentLine}</p>
            <p className="mt-3 text-sm">
              <a href={p.rentPath} className="font-semibold text-brand-indigo underline underline-offset-4">
                Flats for rent in {p.place}
              </a>
              {" · "}
              <a href="/blog/rent-or-buy-borivali-kandivali-malad" className="font-semibold text-brand-indigo underline underline-offset-4">
                Rent or buy in Borivali, Kandivali and Malad
              </a>
            </p>
          </section>
        )}

        <section className="mt-14">
          <h2 className="text-2xl text-ink md:text-3xl">Common questions</h2>
          <div className="mt-6 grid items-start gap-3 md:grid-cols-2">
            {p.faqs.map((f) => (
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

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <LinkList
            heading={`Other sizes in ${p.place}`}
            links={[
              ...otherSizes.map((x) => ({ href: x.path, label: `${x.size} flats for sale in ${x.place}` })),
              { href: p.salePath, label: `All flats for sale in ${p.place}` },
            ]}
          />
          <LinkList
            heading={`${p.size} flats nearby`}
            links={sameSizeElsewhere.map((x) => ({ href: x.path, label: `${x.size} flats for sale in ${x.place}` }))}
          />
          <LinkList
            heading="Before you buy, or sell"
            links={[
              { href: "/blog/1-bhk-price-borivali-kandivali-malad", label: "1 BHK price, down payment and EMI" },
              { href: "/blog/buy-first-flat-in-mumbai", label: "Buying your first flat in Mumbai" },
              { href: "/tools/property-valuation-calculator-mumbai", label: "What is my flat worth?" },
              { href: `/areas/${p.area}`, label: `${areaName} area guide` },
            ]}
          />
        </section>

        <details className="mt-12 max-w-[68ch] rounded-xl border border-line p-5">
          <summary className="cursor-pointer list-none text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted marker:content-none">
            Where these figures come from. Asking rates, not prices paid.
          </summary>
          <ul className="mt-4 space-y-2 text-sm">
            {p.sources.map((src) => (
              <li key={src.url}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-brand-indigo underline underline-offset-4">
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div id="enquire">
        <ContactCTA locale={locale} formLocation={`bhk-${p.area}-${p.size[0]}`} presetArea={p.place} />
      </div>
    </article>
  );
}

function LinkList({ heading, links }: { heading: string; links: { href: string; label: string }[] }) {
  return (
    <div className="rounded-xl border border-line p-5">
      <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">{heading}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-brand-indigo underline underline-offset-4">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
