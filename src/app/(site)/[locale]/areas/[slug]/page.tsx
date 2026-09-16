import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/client";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ConsultCTA } from "@/components/ConsultCTA";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, faqNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { site, waLink } from "@/lib/config";
import {
  AREAS,
  getArea,
  getAreaPanel,
  areaIsComplete,
  isInputBlock,
  type InputBlock,
  type AreaInvite,
} from "@/lib/areas";

export const revalidate = 300;

/** English only, in line with the rest of the 2026 content. */
const AREA_LOCALE = "en";

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  if (params.locale !== AREA_LOCALE) return [];
  return AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const area = getArea(params.slug);
  if (!area || params.locale !== AREA_LOCALE) return {};

  const complete = areaIsComplete(area);
  return {
    title: area.metaTitle,
    description: area.metaDescription,
    ...pageUrls(params.locale, `/areas/${area.slug}`, [
      AREA_LOCALE,
    ]),
    // A page still carrying an input block is half written. It can be reviewed
    // on a deployment, but it must not compete for the query it is aimed at,
    // and it must never be the version Google indexes first.
    ...(complete ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function AreaPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const area = getArea(slug);
  const panel = getAreaPanel(slug);
  if (!area || !panel || locale !== AREA_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    { name: area.longName, path: `/areas/${area.slug}` },
  ];

  const complete = areaIsComplete(area);

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          faqNode(area.faqs.map((f) => ({ question: f.q, answer: f.a }))),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src={area.hero?.src ?? panel.image}
          alt={area.hero?.alt ?? `${area.longName}, Mumbai`}
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
            Area guide
          </div>
          <h1 className="mt-3 max-w-[20ch] text-3xl text-white md:text-5xl">
            {area.longName}
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            {area.metaDescription}
          </p>
        </div>
      </header>

      <div className="wrap py-12">
        {!complete && (
          // Visible on the page on purpose. This page is unfinished, it is
          // noindexed, and anyone reviewing it should be able to see that at a
          // glance rather than mistake a prompt for copy.
          <div className="mb-10 rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink">
            <b>Draft.</b> The flagged blocks below need your local knowledge.
            This page is set to noindex until they are written, so it will not
            appear in search while it is in this state.
          </div>
        )}

        <div className="mb-10 max-w-[68ch] rounded-r-xl border-l-[3px] border-brass bg-paper-alt px-6 py-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
            The short answer
          </div>
          <p className="mt-2.5 text-lg text-ink">{area.answer}</p>
        </div>

        <div className="max-w-[68ch] space-y-4 text-ink/90">
          {area.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {/* Measured figures, not illustrative ones. See AREA_PANELS. */}
        <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {panel.stats.map((s) => (
            <div key={s.label} className="bg-paper p-5">
              <dt className="text-xs uppercase tracking-wider text-muted">
                {s.label}
              </dt>
              <dd className="mt-1 text-2xl text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 max-w-[68ch] rounded-xl border border-line bg-paper-alt p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
            What we would watch
          </div>
          <p className="mt-2 text-ink">{panel.watch}</p>
        </div>

        <div className="mt-14 space-y-14">
          {area.sections.map((s) =>
            isInputBlock(s) ? (
              <PendingSection key={s.heading} block={s} />
            ) : (
              <section key={s.heading}>
                <div className="max-w-[68ch]">
                  <h2 className="text-2xl text-ink md:text-3xl">{s.heading}</h2>
                  <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-ink/85">
                    {s.body.map((para) => (
                      <p key={para.slice(0, 48)}>{para}</p>
                    ))}
                  </div>
                </div>
                {s.image && (
                  <figure className="mt-8 max-w-[76ch]">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 1024px) 760px, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {s.image.caption && (
                      <figcaption className="mt-2.5 text-sm text-muted">{s.image.caption}</figcaption>
                    )}
                  </figure>
                )}
                {s.invite && <Invite invite={s.invite} />}
              </section>
            ),
          )}
        </div>

        <section className="mt-16 max-w-[68ch]">
          <h2 className="text-2xl text-ink md:text-3xl">Common questions</h2>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {area.faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-2 text-ink/75">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {area.sources.length > 0 && (
          <div className="mt-12 max-w-[68ch] rounded-xl border border-line p-5">
            <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
              Sources. Market figures as of {area.figuresAsOf}; asking rates, not prices paid.
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {area.sources.map((src) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-indigo underline underline-offset-4"
                  >
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10 max-w-[68ch] text-sm text-muted">
          We work across {site.areas.join(", ")}, and occasionally in{" "}
          {site.extendedAreas.join(" and ")}.
        </p>
      </div>

      <ConsultCTA locale={locale} formLocation={`area-${area.slug}`} />
      <div id="enquire">
        <ContactCTA
          locale={locale}
          formLocation={`area-${area.slug}-footer`}
          presetArea={area.longName}
        />
      </div>
    </article>
  );
}

/**
 * The invitation that follows a section. One hook sentence, one WhatsApp
 * button with the message already written, one quiet alternative. The offer
 * is always the answer to the reader's own case, free, which is what makes
 * it an invitation rather than a sales interruption.
 */
function Invite({ invite }: { invite: AreaInvite }) {
  return (
    <aside className="mt-8 max-w-[68ch] rounded-2xl border border-brass/30 bg-brand-indigo-deep p-6 text-paper md:p-7">
      <p className="font-display text-lg leading-snug text-white md:text-xl">{invite.hook}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={waLink(invite.message)}
          target="_blank"
          rel="noopener"
          className="btn btn-wa"
        >
          {invite.button}
        </a>
        <a href="#enquire" className="text-sm font-semibold text-brass-bright underline decoration-brass/40 underline-offset-4">
          Or leave your details below
        </a>
      </div>
      <p className="mt-3 text-xs text-paper/60">Free, no obligation, usually answered the same day.</p>
    </aside>
  );
}

/** An unwritten section, shown as the questions it is waiting on. */
function PendingSection({ block }: { block: InputBlock }) {
  return (
    <section className="max-w-[68ch] rounded-xl border border-dashed border-brass/50 p-6">
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl text-ink/70 md:text-3xl">{block.heading}</h2>
        <span className="shrink-0 rounded-full border border-brass/40 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-brass">
          Needs you
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-ink/60">
        {block.prompts.map((p) => (
          <li key={p} className="flex gap-2.5">
            <span aria-hidden="true" className="text-brass">
              ·
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
