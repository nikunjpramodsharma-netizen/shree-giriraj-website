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
      {card.hook && <p className="mt-2 line-clamp-3 text-sm text-ink/70">{card.hook}</p>}
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
  intro,
  tone = "light",
}: {
  links: Interlinks;
  locale: string;
  heading?: string;
  intro?: string;
  tone?: "light" | "alt";
}) {
  const lanes: { key: keyof Interlinks; label: string }[] = [
    { key: "tools", label: "Do the arithmetic" },
    { key: "areas", label: "Where we do it" },
    { key: "services", label: "The services that go with this" },
    { key: "articles", label: "Read the long version" },
  ];
  const present = lanes.filter((l) => links[l.key].length > 0);
  if (present.length === 0) return null;
  const t = (s: string) => tr(locale, s);

  return (
    <section className={`py-16 md:py-20 ${tone === "alt" ? "bg-paper-alt" : ""}`}>
      <div className="wrap">
        <InView className="cascade">
          <div style={{ ["--i" as string]: 0 }} className="eyebrow">
            {t("Keep going")}
          </div>
          <h2 style={{ ["--i" as string]: 1 }} className="mt-3 max-w-[26ch] text-3xl text-brand-indigo md:text-4xl">
            {heading ?? t("Everything on this site connects to this page")}
          </h2>
          <p style={{ ["--i" as string]: 2 }} className="mt-3 max-w-[58ch] text-ink/70">
            {intro ?? t("The tools do the sums, the suburb pages carry the rates, and the articles go as deep as you want to.")}
          </p>
        </InView>
        <div className="mt-10 space-y-10">
          {present.map((lane) => (
            <div key={lane.key}>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-brass">{t(lane.label)}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </div>
              <InView className="cascade grid gap-4 sm:grid-cols-2 lg:grid-cols-3" threshold={0.1}>
                {links[lane.key].map((c, i) => (
                  <Card key={c.href} card={c} locale={locale} index={i} />
                ))}
              </InView>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
