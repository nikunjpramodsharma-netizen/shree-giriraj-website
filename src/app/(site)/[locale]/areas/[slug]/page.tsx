import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/client";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ConsultCTA } from "@/components/ConsultCTA";
import { HeroVideo } from "@/components/HeroVideo";
import { FactChips } from "@/components/motion/FactChips";
import { GrowBars } from "@/components/motion/GrowBars";
import { DrawLine } from "@/components/motion/DrawLine";
import { AutoScene } from "@/components/motion/AutoScene";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { CountUp } from "@/components/motion/CountUp";
import { StickyBar } from "@/components/motion/StickyBar";
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
        <div className="absolute inset-0 opacity-50">
          <HeroVideo
            src={area.motion.video.src}
            poster={area.motion.video.poster}
            alt={area.hero?.alt ?? `${area.longName}, Mumbai`}
          />
        </div>
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
          <h1 className="rise mt-3 max-w-[20ch] text-3xl text-white md:text-5xl">
            {area.longName}
          </h1>
          <p className="rise-2 mt-5 max-w-[58ch] text-paper/80">
            {area.metaDescription}
          </p>
          <FactChips
            facts={panel.stats.map((s) => {
              const m = s.value.match(/^₹([\d,]+)$/);
              return m
                ? { value: Number(m[1].replace(/,/g, "")), prefix: "₹", label: s.label }
                : { text: s.value, label: s.label };
            })}
          />
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
              <dd className="mt-1 text-2xl text-ink">
                {/^₹[\d,]+$/.test(s.value) ? (
                  <CountUp value={Number(s.value.replace(/[₹,]/g, ""))} prefix="₹" />
                ) : (
                  s.value
                )}
              </dd>
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
                <InView className="cascade max-w-[68ch]">
                  <h2 style={{ ["--i" as string]: 0 }} className="text-2xl text-ink md:text-3xl">{s.heading}</h2>
                  <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-ink/85">
                    {s.body.map((para, pi) => (
                      <p key={para.slice(0, 48)} style={{ ["--i" as string]: pi + 1 }}>{para}</p>
                    ))}
                  </div>
                </InView>
                {s.image && (
                  <figure className="mt-8 max-w-[76ch]">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                      <Parallax strength={40} className="absolute -inset-y-6 inset-x-0">
                        <div className="relative h-full w-full">
                          <Image
                            src={s.image.src}
                            alt={s.image.alt}
                            fill
                            sizes="(min-width: 1024px) 760px, 100vw"
                            className="object-cover"
                          />
                        </div>
                      </Parallax>
                    </div>
                    {s.image.caption && (
                      <figcaption className="mt-2.5 text-sm text-muted">{s.image.caption}</figcaption>
                    )}
                  </figure>
                )}
                {s.scene === "pockets" && (
                  <div className="mt-10 grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
                    <div className="rounded-2xl border border-line bg-white p-6">
                      <div className="eyebrow">Asking rates by pocket</div>
                      <div className="mt-5">
                        <GrowBars bars={area.motion.pockets} footnote={area.motion.pocketsNote} />
                      </div>
                    </div>
                    <AutoScene scenes={area.motion.pocketScenes} />
                  </div>
                )}
                {s.scene === "commute" && (
                  <div className="mt-10 rounded-3xl bg-brand-indigo-deep p-6 text-paper md:p-9">
                    <InView className="cascade grid gap-6 sm:grid-cols-2 lg:grid-cols-4" threshold={0.2}>
                      {area.motion.commute.map((c, i) => (
                        <div key={c.label} style={{ ["--i" as string]: i }} className="border-l-2 border-brass/60 pl-4">
                          <div className="font-display text-3xl font-semibold text-white">
                            {c.value !== undefined ? (
                              <CountUp value={c.value} prefix={c.prefix} suffix={c.suffix} decimals={(c as { decimals?: number }).decimals} />
                            ) : (
                              c.text
                            )}
                          </div>
                          <div className="mt-1 text-sm text-paper/75">{c.label}</div>
                        </div>
                      ))}
                    </InView>
                    <div className="mt-10 space-y-8">
                      {area.motion.metro.map((m) => (
                        <DrawLine key={m.label} label={m.label} stops={m.stops} tone="dark" />
                      ))}
                    </div>
                  </div>
                )}
                {s.scene === "landmarks" && (
                  <div className="mt-10">
                    <AutoScene scenes={area.motion.landmarks} interval={5500} />
                  </div>
                )}
                {s.scene === "rents" && (
                  <div className="mt-10 max-w-[68ch] rounded-2xl border border-line bg-white p-6">
                    <div className="eyebrow">Asking rents by size</div>
                    <div className="mt-5">
                      <GrowBars bars={area.motion.rents} footnote={area.motion.rentsNote} />
                    </div>
                  </div>
                )}
                {s.invite && <Invite invite={s.invite} />}
              </section>
            ),
          )}
        </div>

        <section className="mt-16 max-w-[68ch]">
          <h2 className="text-2xl text-ink md:text-3xl">Common questions</h2>
          <InView className="cascade mt-6 space-y-3" threshold={0.1}>
            {area.faqs.map((f, i) => (
              <details key={f.q} style={{ ["--i" as string]: i }} open={i === 0} className="group rounded-2xl border border-line bg-white p-5 open:shadow-sm">
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

        {area.sources.length > 0 && (
          <details className="mt-12 max-w-[68ch] rounded-xl border border-line p-5">
            <summary className="cursor-pointer list-none text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted marker:content-none">
              Where these figures come from. Market figures as of {area.figuresAsOf}; asking rates, not prices paid.
            </summary>
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
          </details>
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
      <StickyBar
        message={`Hi Shree Giriraj, I am looking at property in ${area.longName}. Can you help?`}
        waLabel="WhatsApp"
        callLabel="Call"
      />
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
