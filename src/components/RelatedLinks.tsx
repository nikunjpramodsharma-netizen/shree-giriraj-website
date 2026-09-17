import EnglishLink from "next/link";
import { Link } from "@/i18n/navigation";
import { InView } from "@/components/motion/InView";
import { LineIcon, type IconName } from "@/components/motion/LineIcon";
import { tr } from "@/lib/copy-i18n";
import type { Interlinks, LinkCard, LinkKind } from "@/lib/interlinks";

/**
 * The band that ties a page to the rest of the site. Four lanes, each a
 * cascade of cards: the services this page belongs with, the suburbs it is
 * done in, the tools that do its arithmetic, the articles that go deeper.
 * Tools, suburbs and articles are English only, so those cards bypass the
 * locale Link; a service card keeps the reader's language.
 */

const KIND_LABEL: Record<LinkKind, string> = {
  service: "Service",
  area: "Suburb",
  tool: "Free tool",
  article: "Article",
};

const KIND_ICON: Record<LinkKind, IconName> = {
  service: "handshake",
  area: "building",
  tool: "rupee",
  article: "file",
};

function Card({ card, locale, index }: { card: LinkCard; locale: string; index: number }) {
  const inner = (
    <>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-indigo text-brass-bright transition-colors group-hover:bg-brass group-hover:text-brand-indigo">
          <LineIcon name={KIND_ICON[card.kind]} className="h-5 w-5" />
        </span>
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-muted">
          {tr(locale, KIND_LABEL[card.kind])}
        </span>
      </div>
      <div className="mt-3 font-semibold leading-snug text-ink group-hover:text-brand-indigo">{card.title}</div>
      {card.hook && <p className="mt-2 line-clamp-2 text-sm text-ink/70">{card.hook}</p>}
      <span aria-hidden="true" className="mt-4 inline-block text-sm font-semibold text-brand-blue transition-transform group-hover:translate-x-1">
        {tr(locale, "Open")} →
      </span>
    </>
  );
  const className =
    "group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-indigo/10";
  const style = { ["--i" as string]: index };
  return card.englishOnly ? (
    <EnglishLink href={card.href} className={className} style={style}>
      {inner}
    </EnglishLink>
  ) : (
    <Link href={card.href} className={className} style={style}>
      {inner}
    </Link>
  );
}

export function RelatedLinks({
  links,
  locale,
  heading,
  tone = "light",
}: {
  links: Interlinks;
  locale: string;
  heading?: string;
  intro?: string;
  tone?: "light" | "alt";
}) {
  const t = (s: string) => tr(locale, s);
  // One row of cards for the things a reader acts on (tools, services), and
  // two slim lists for the things they read (suburbs, articles). Four full
  // lanes of cards made every page a screen and a half longer.
  const cards = [...links.tools.slice(0, 2), ...links.services.slice(0, 2)];
  const lists: { label: string; items: LinkCard[] }[] = [
    { label: "Where we do it", items: links.areas },
    { label: "Read the long version", items: links.articles.slice(0, 3) },
  ].filter((l) => l.items.length > 0);
  if (cards.length === 0 && lists.length === 0) return null;

  return (
    <section className={`py-14 md:py-16 ${tone === "alt" ? "bg-paper-alt" : ""}`}>
      <div className="wrap">
        <InView className="cascade">
          <div style={{ ["--i" as string]: 0 }} className="eyebrow">
            {t("Keep going")}
          </div>
          <h2 style={{ ["--i" as string]: 1 }} className="mt-3 max-w-[30ch] text-2xl text-brand-indigo md:text-3xl">
            {heading ?? t("Everything on this site connects to this page")}
          </h2>
        </InView>
        {cards.length > 0 && (
          <InView className="cascade mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" threshold={0.1}>
            {cards.map((c, i) => (
              <Card key={c.href} card={c} locale={locale} index={i} />
            ))}
          </InView>
        )}
        {lists.length > 0 && (
          <InView className="cascade mt-8 grid gap-8 md:grid-cols-2" threshold={0.1}>
            {lists.map((l, li) => (
              <div key={l.label} style={{ ["--i" as string]: li }}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-brass">{t(l.label)}</span>
                  <span aria-hidden="true" className="h-px flex-1 bg-line" />
                </div>
                <ul className="divide-y divide-line">
                  {l.items.map((c) => (
                    <li key={c.href}>
                      <EnglishLink href={c.href} className="group flex items-baseline justify-between gap-4 py-2.5 text-[0.97rem] text-ink hover:text-brand-indigo">
                        <span className="font-medium">{c.title}</span>
                        <span aria-hidden="true" className="text-brand-blue transition-transform group-hover:translate-x-1">→</span>
                      </EnglishLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </InView>
        )}
      </div>
    </section>
  );
}
