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

const KIND_ICON: Record<LinkKind, IconName> = {
  service: "handshake",
  area: "building",
  tool: "rupee",
  article: "file",
};

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
  // Four short rows of link chips, one per kind of page. The band used to be
  // a row of cards and two lists, most of a screen tall; every link is still
  // here, in about a third of the height.
  const rows: { label: string; kind: LinkKind; items: LinkCard[] }[] = [
    { label: "Do the arithmetic", kind: "tool" as const, items: links.tools },
    { label: "Where we do it", kind: "area" as const, items: links.areas },
    { label: "The services that go with this", kind: "service" as const, items: links.services },
    { label: "Read the long version", kind: "article" as const, items: links.articles.slice(0, 3) },
  ].filter((r) => r.items.length > 0);
  if (rows.length === 0) return null;

  return (
    <section className={`py-10 md:py-12 ${tone === "alt" ? "bg-paper-alt" : ""}`}>
      <div className="wrap">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <div className="eyebrow">{t("Keep going")}</div>
          <h2 className="text-lg font-semibold text-brand-indigo md:text-xl">{heading ?? t("Everything on this site connects to this page")}</h2>
        </div>
        <InView className="cascade mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2" threshold={0.1}>
          {rows.map((r, ri) => (
            <div key={r.label} style={{ ["--i" as string]: ri }} className="flex flex-wrap items-center gap-2">
              <span className="flex w-full items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brass">
                <LineIcon name={KIND_ICON[r.kind]} className="h-4 w-4" />
                {t(r.label)}
              </span>
              {r.items.map((c) => {
                const cls =
                  "rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-brand-indigo hover:text-brand-indigo";
                return c.englishOnly ? (
                  <EnglishLink key={c.href} prefetch={false} href={c.href} title={c.hook} className={cls}>
                    {c.title}
                  </EnglishLink>
                ) : (
                  <Link key={c.href} prefetch={false} href={c.href} title={c.hook} className={cls}>
                    {c.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </InView>
      </div>
    </section>
  );
}
