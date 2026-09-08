import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, itemListNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { PILLARS } from "@/lib/pillars";

export const revalidate = 300;

const GUIDE_LOCALE = "en";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== GUIDE_LOCALE) return {};
  return {
    title: "Guides: property paperwork, buying and renting in Mumbai",
    description:
      "Long form guides to the parts of a Mumbai property transaction that catch people out, each one hubbing the detailed articles underneath it.",
    ...pageUrls(params.locale, "/guides", [GUIDE_LOCALE]),
  };
}

export default function GuidesIndex({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (locale !== GUIDE_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          itemListNode(
            locale,
            PILLARS.map((p) => ({ name: p.title, path: `/guides/${p.slug}` })),
          ),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/architecture-facade-2.jpg"
          alt="A residential building facade"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(21,27,61,.92) 0%, rgba(21,27,61,.74) 45%, rgba(21,27,61,.34) 78%, rgba(21,27,61,.55) 100%), linear-gradient(180deg, rgba(21,27,61,.5) 0%, rgba(21,27,61,0) 32%, rgba(21,27,61,.85) 100%)" }}
        />
        <div className="wrap relative z-10 py-20 md:py-28">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
            Guides
          </div>
          <h1 className="mt-3 max-w-[18ch] text-3xl text-white md:text-5xl">
            The parts that catch people out
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            Free to read, no form in the way. Each guide is a map of one subject
            with the detailed articles underneath it.
          </p>
        </div>
      </header>

      <div className="wrap py-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {PILLARS.map((p) => {
            const count = p.sections.reduce(
              (n, s) => n + s.spokes.length,
              0,
            );
            return (
              <li key={p.slug}>
                <Link
                  href={`/guides/${p.slug}`}
                  className="group block overflow-hidden rounded-xl border border-line bg-paper transition-colors hover:bg-paper-alt"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={p.image}
                      alt={p.imageAlt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl text-ink group-hover:text-brand-indigo md:text-2xl">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-sm text-ink/70">{p.answer}</p>
                    <p className="mt-4 text-xs uppercase tracking-wider text-muted">
                      {count} articles
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <ContactCTA locale={locale} formLocation="guides-index" />
    </article>
  );
}
