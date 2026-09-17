import Image from "next/image";
import { Spans } from "@/components/MarkdownBody";
import { CountUp } from "@/components/motion/CountUp";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { pickIcon } from "@/components/motion/LineIcon";
import { BenefitDeck } from "@/components/motion/BenefitDeck";
import { SectionDeck } from "@/components/motion/SectionDeck";
import { waLink } from "@/lib/config";
import { tr } from "@/lib/copy-i18n";
import type { Block, Inline } from "@/lib/markdown";
import type { ServiceScene } from "@/lib/service-scenes";

/**
 * The body of a service page, staged as scenes instead of a column.
 *
 * The markdown is unchanged and every word of it is still on the page, so
 * search and the four languages keep working. What changes is how it is
 * met: the opening paragraphs stand alone as a lead; the first bulleted list
 * becomes a cascade of cards with line icons that draw themselves; each
 * later heading and its paragraphs become a scene with a photograph beside
 * it that drifts slower than the page; the numbers strip and the worked
 * example count up between them; the closing "how to start" becomes a dark
 * band with the WhatsApp button; the small print stays small.
 */

type Section = { heading: string; id: string; blocks: Block[] };

function split(blocks: Block[]): { lead: Block[]; sections: Section[]; note: Block[] } {
  const lead: Block[] = [];
  const sections: Section[] = [];
  const note: Block[] = [];
  let current: Section | null = null;
  let afterHr = false;
  let seenFirstH2 = false;
  for (const b of blocks) {
    if (b.t === "hr") {
      afterHr = true;
      continue;
    }
    if (afterHr) {
      note.push(b);
      continue;
    }
    if (b.t === "h2") {
      if (!seenFirstH2) {
        // The first heading repeats the hero heading; its paragraphs are the lead.
        seenFirstH2 = true;
        current = null;
        continue;
      }
      current = { heading: b.text, id: b.id, blocks: [] };
      sections.push(current);
      continue;
    }
    if (current) current.blocks.push(b);
    else lead.push(b);
  }
  return { lead, sections, note };
}

/**
 * The list under "what you get" arrives in pieces: the markdown is hard
 * wrapped, so each bullet is its own one item list and its continuation lines
 * are paragraphs after it. This puts every bullet back together.
 */
function mergeItems(blocks: Block[]): Inline[][] {
  const items: Inline[][] = [];
  for (const b of blocks) {
    if (b.t === "ul") items.push(...b.items.map((it) => [...it]));
    else if (b.t === "p" && items.length > 0) items[items.length - 1].push({ t: "text", v: " " }, ...b.spans);
  }
  return items;
}

function plain(spans: Inline[]): string {
  return spans.map((s) => ("v" in s ? s.v : "")).join("");
}

export function ServiceScenes({
  blocks,
  scene,
  locale,
}: {
  blocks: Block[];
  scene: ServiceScene;
  locale: string;
}) {
  const { lead, sections, note } = split(blocks);
  const t = (s: string) => tr(locale, s);
  // The first section whose first block is a list is "what you get".
  const cardsIndex = sections.findIndex((s) => s.blocks[0]?.t === "ul");
  const cards = cardsIndex >= 0 ? sections[cardsIndex] : null;
  const lastIndex = sections.length - 1;
  const closing = lastIndex >= 0 ? sections[lastIndex] : null;
  const middle = sections.filter((s, i) => i !== cardsIndex && i !== lastIndex);
  let img = 0;

  return (
    <div>
      {/* LEAD */}
      {lead.length > 0 && (
        <section className="wrap py-16 md:py-20">
          <InView className="cascade mx-auto max-w-[62ch]">
            {lead.map((b, i) =>
              b.t === "p" ? (
                <p key={i} style={{ ["--i" as string]: i }} className={`${i === 0 ? "text-xl leading-relaxed text-ink md:text-2xl" : "mt-5 text-[1.05rem] text-ink/80"}`}>
                  <Spans spans={b.spans} />
                </p>
              ) : null,
            )}
          </InView>
        </section>
      )}

      {/* WHAT YOU GET: a cascade of cards */}
      {cards && (
        <section className="bg-paper-alt py-14 md:py-16">
          <div className="wrap">
            <InView className="cascade">
              <div style={{ ["--i" as string]: 0 }} className="eyebrow">{t("What you get")}</div>
              <h2 style={{ ["--i" as string]: 1 }} className="mt-3 max-w-[24ch] text-3xl text-brand-indigo md:text-4xl">
                {cards.heading}
              </h2>
            </InView>
            <BenefitDeck
              items={mergeItems(cards.blocks).map((it) => {
                const text = plain(it);
                // A bold lead is the title and the rest is the detail. With no
                // bold lead the first clause stands in, and the whole line stays.
                const lead = it[0]?.t === "bold" ? it[0].v : null;
                const title = (lead ?? text.split(/[,.;:]/)[0].split(" ").slice(0, 7).join(" ")).replace(/[.,:;]+$/, "");
                const rest = lead ? it.slice(1) : it;
                const first = rest[0];
                const body =
                  lead && first && first.t === "text"
                    ? [{ ...first, v: first.v.replace(/^[\s,.:;]+/, "").replace(/^./, (c) => c.toUpperCase()) }, ...rest.slice(1)]
                    : rest;
                return { title, icon: pickIcon(text), body: <Spans spans={body} /> };
              })}
            />
          </div>
        </section>
      )}

      {/* NUMBERS STRIP */}
      {scene.numbers.length > 0 && (
        <section className="bg-brand-indigo-deep py-16 text-paper md:py-20">
          <div className="wrap">
            <InView className="cascade grid gap-8 sm:grid-cols-2 lg:grid-cols-4" threshold={0.2}>
              {scene.numbers.map((n, i) => (
                <div key={n.label} style={{ ["--i" as string]: i }} className="border-l-2 border-brass/60 pl-5">
                  <div className="font-display text-3xl font-semibold text-white md:text-4xl">
                    {n.value !== undefined ? (
                      <CountUp value={n.value} prefix={n.prefix} suffix={n.suffix} decimals={n.decimals} />
                    ) : (
                      n.text
                    )}
                  </div>
                  <p className="mt-2 text-sm text-paper/85">{t(n.label)}</p>
                  <p className="mt-1.5 text-xs text-paper/50">{n.source}</p>
                </div>
              ))}
            </InView>
          </div>
        </section>
      )}

      {/* MIDDLE SECTIONS, folded into one tabbed block */}
      {middle.length > 0 && (
        <section className="py-14 md:py-16">
          <div className="wrap">
            <SectionDeck
              sections={middle.map((s) => ({
                id: s.id,
                heading: s.heading,
                image: scene.images[img++ % scene.images.length],
                body: (
                  <>
                    {s.blocks.map((b, bi) => {
                      if (b.t === "p")
                        return (
                          <p key={bi} className="mt-4 text-[1.02rem] leading-relaxed text-ink/85">
                            <Spans spans={b.spans} />
                          </p>
                        );
                      if (b.t === "ul")
                        return (
                          <ul key={bi} className="mt-4 space-y-2">
                            {b.items.map((it, k) => (
                              <li key={k} className="flex gap-2.5 text-ink/85">
                                <span aria-hidden="true" className="text-brass">·</span>
                                <span><Spans spans={it} /></span>
                              </li>
                            ))}
                          </ul>
                        );
                      if (b.t === "ol")
                        return (
                          <ol key={bi} className="mt-4 space-y-2">
                            {b.items.map((it, k) => (
                              <li key={k} className="flex gap-3 text-ink/85">
                                <span aria-hidden="true" className="mt-0.5 text-sm font-bold tabular-nums text-brass">{k + 1}</span>
                                <span><Spans spans={it} /></span>
                              </li>
                            ))}
                          </ol>
                        );
                      return null;
                    })}
                  </>
                ),
              }))}
            />
          </div>
        </section>
      )}

      {/* WORKED EXAMPLE */}
      {scene.example && (
        <section className="py-16 md:py-20">
          <div className="wrap">
            <InView className="cascade mx-auto max-w-3xl rounded-3xl border border-line bg-white p-8 shadow-xl shadow-brand-indigo/5 md:p-10" threshold={0.2}>
              <div style={{ ["--i" as string]: 0 }} className="eyebrow">{t("A worked example")}</div>
              <h2 style={{ ["--i" as string]: 1 }} className="mt-3 text-2xl text-brand-indigo md:text-3xl">
                {scene.example.title}
              </h2>
              <p style={{ ["--i" as string]: 2 }} className="mt-3 text-sm text-muted">{scene.example.given}</p>
              <dl style={{ ["--i" as string]: 3 }} className="mt-6 divide-y divide-line">
                {scene.example.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="text-ink/80">
                      {r.label}
                      {r.note && <span className="ml-2 text-xs text-muted">{r.note}</span>}
                    </dt>
                    <dd className="font-display text-xl font-semibold text-brand-indigo md:text-2xl">
                      <CountUp value={r.value} prefix={r.prefix} suffix={r.suffix} decimals={r.decimals} duration={1800} />
                    </dd>
                  </div>
                ))}
              </dl>
              <p style={{ ["--i" as string]: 4 }} className="mt-4 text-xs text-muted">{scene.example.caption}</p>
              {scene.example.tool && (
                <a style={{ ["--i" as string]: 5 }} href={scene.example.tool.href} className="btn btn-outline mt-6 border-brand-indigo text-brand-indigo">
                  {scene.example.tool.label}
                </a>
              )}
            </InView>
          </div>
        </section>
      )}

      {/* CLOSING: how to start */}
      {closing && (
        <section id={closing.id} className="scroll-mt-24 bg-brand-indigo py-16 text-paper md:py-20">
          <div className="wrap grid items-center gap-8 md:grid-cols-[1.2fr_.8fr]">
            <InView className="cascade">
              <div style={{ ["--i" as string]: 0 }} className="eyebrow text-brass-bright">{closing.heading}</div>
              {closing.blocks.map((b, bi) =>
                b.t === "p" ? (
                  <p key={bi} style={{ ["--i" as string]: bi + 1 }} className="mt-4 max-w-[58ch] text-lg text-paper/90">
                    <Spans spans={b.spans} />
                  </p>
                ) : null,
              )}
            </InView>
            <InView className="cascade flex flex-wrap gap-3 md:justify-end">
              <a style={{ ["--i" as string]: 1 }} href={waLink(scene.message)} target="_blank" rel="noopener" className="btn btn-wa">
                {t("Send this to us on WhatsApp")}
              </a>
              <a style={{ ["--i" as string]: 2 }} href="#enquire" className="btn border-white/70 text-white hover:bg-white hover:text-brand-indigo">
                {t("Or leave your details")}
              </a>
            </InView>
          </div>
        </section>
      )}

      {/* SMALL PRINT */}
      {note.length > 0 && (
        <section className="wrap py-10">
          <div className="mx-auto max-w-[62ch] border-l-[3px] border-brass bg-paper-alt px-5 py-4 text-sm text-ink/75">
            {note.map((b, i) =>
              b.t === "p" ? (
                <p key={i} className={i > 0 ? "mt-3" : ""}>
                  <Spans spans={b.spans} />
                </p>
              ) : null,
            )}
          </div>
        </section>
      )}
    </div>
  );
}
