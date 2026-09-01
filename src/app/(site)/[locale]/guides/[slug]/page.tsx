import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { postLocaleIndexQuery } from "@/sanity/queries";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ConsultCTA } from "@/components/ConsultCTA";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, faqNode, itemListNode } from "@/lib/schema";
import { buildAlternates } from "@/lib/seo";
import { formatDate } from "@/lib/blog";
import { PILLARS, getPillar, type Spoke } from "@/lib/pillars";

export const revalidate = 300;

/** Guides are English only, so this is the only locale that gets routes. */
const GUIDE_LOCALE = "en";

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  if (params.locale !== GUIDE_LOCALE) return [];
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const pillar = getPillar(params.slug);
  if (!pillar || params.locale !== GUIDE_LOCALE) return {};
  return {
    title: pillar.metaTitle,
    description: pillar.metaDescription,
    // English only content, so a single available locale and therefore a
    // canonical with no hreflang cluster. See buildAlternates.
    alternates: buildAlternates(params.locale, `/guides/${pillar.slug}`, [
      GUIDE_LOCALE,
    ]),
  };
}

/**
 * Which spoke slugs have a genuinely published English post behind them.
 *
 * Everything else on the pillar still renders, as plain text rather than a
 * link. A hub that links into holes is worse than one that shows the shape of
 * the cluster and fills in over time.
 */
async function publishedSpokes(): Promise<Set<string>> {
  try {
    const rows = await client.fetch<{ slug: string; locales: string[] }[]>(
      postLocaleIndexQuery,
    );
    return new Set(
      (rows || [])
        .filter((r) => (r.locales ?? []).includes(GUIDE_LOCALE))
        .map((r) => r.slug),
    );
  } catch {
    // Sanity unreachable is not a reason to 500 a static reference page.
    return new Set();
  }
}

export default async function GuidePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const pillar = getPillar(slug);
  if (!pillar || locale !== GUIDE_LOCALE) notFound();

  const live = await publishedSpokes();
  const allSpokes = pillar.sections.flatMap((s) => s.spokes);
  const liveSpokes = allSpokes.filter((s) => live.has(s.slug));

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: pillar.title, path: `/guides/${pillar.slug}` },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          // Only the spokes that actually resolve. Structured data pointing at
          // unpublished URLs is a self inflicted crawl error.
          liveSpokes.length > 0
            ? itemListNode(
                locale,
                liveSpokes.map((s) => ({
                  name: s.title,
                  path: `/blog/${s.slug}`,
                })),
              )
            : null,
          // Marked up because these questions are rendered further down.
          faqNode(pillar.faqs.map((f) => ({ question: f.q, answer: f.a }))),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src={pillar.image}
          alt={pillar.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,27,61,.58) 0%, rgba(21,27,61,.38) 40%, rgba(21,27,61,.93) 100%)",
          }}
        />
        <div className="wrap relative py-14 md:py-20">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
            Guide
          </div>
          <h1 className="mt-3 max-w-[20ch] text-3xl text-white md:text-5xl">
            {pillar.title}
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            {pillar.metaDescription}
          </p>
        </div>
      </header>

      <div className="wrap py-12">
        {/* ANSWER BLOCK. First on the page and complete on its own, because it
            is the element most likely to be lifted whole by a search or AI
            result. Same treatment as the blog template. */}
        <div className="mb-10 max-w-[68ch] rounded-r-xl border-l-[3px] border-brass bg-paper-alt px-6 py-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
            The short answer
          </div>
          <p className="mt-2.5 text-lg text-ink">{pillar.answer}</p>
        </div>

        <div className="max-w-[68ch] space-y-4 text-ink/90">
          {pillar.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="mt-14 space-y-14">
          {pillar.sections.map((section, i) => (
            <section key={section.heading}>
              <div className="flex items-baseline gap-4">
                <span className="text-[0.7rem] font-bold tabular-nums text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-2xl text-ink md:text-3xl">
                  {section.heading}
                </h2>
              </div>
              <p className="mt-3 max-w-[62ch] text-ink/75">{section.intro}</p>

              <ul className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                {section.spokes.map((spoke) => (
                  <SpokeCard
                    key={spoke.slug}
                    spoke={spoke}
                    published={live.has(spoke.slug)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-16 max-w-[68ch]">
          <h2 className="text-2xl text-ink md:text-3xl">Common questions</h2>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {pillar.faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-2 text-ink/75">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12 max-w-[68ch] rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            Sources, last checked{" "}
            {formatDate(pillar.sourcesCheckedOn, locale)}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {pillar.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-brand-indigo underline underline-offset-4"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ConsultCTA locale={locale} formLocation={`guide-${pillar.slug}`} />
      <ContactCTA locale={locale} formLocation={`guide-${pillar.slug}-footer`} />
    </article>
  );
}

/**
 * A spoke is a link once its post exists and plain text before that. Both
 * states are rendered so the reader can see the full map of the subject, which
 * is most of the value of a hub page.
 */
function SpokeCard({
  spoke,
  published,
}: {
  spoke: Spoke;
  published: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={
            published
              ? "font-semibold text-ink group-hover:text-brand-indigo"
              : "font-semibold text-ink/55"
          }
        >
          {spoke.title}
        </span>
        {!published && (
          <span className="mt-0.5 shrink-0 rounded-full border border-line px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-muted">
            Soon
          </span>
        )}
      </div>
      <p
        className={
          published ? "mt-2 text-sm text-ink/70" : "mt-2 text-sm text-ink/45"
        }
      >
        {spoke.blurb}
      </p>
    </>
  );

  return (
    <li className="bg-paper">
      {published ? (
        <Link
          href={`/blog/${spoke.slug}`}
          className="group block h-full p-5 transition-colors hover:bg-paper-alt"
        >
          {inner}
        </Link>
      ) : (
        <div className="h-full p-5">{inner}</div>
      )}
    </li>
  );
}
