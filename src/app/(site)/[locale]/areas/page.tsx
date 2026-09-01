import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, itemListNode } from "@/lib/schema";
import { buildAlternates } from "@/lib/seo";
import { site } from "@/lib/config";
import { AREAS, getAreaPanel } from "@/lib/areas";

export const revalidate = 300;

const AREA_LOCALE = "en";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== AREA_LOCALE) return {};
  return {
    title: "The areas we work in: Borivali, Kandivali and Malad",
    description:
      "Local guides to the three western suburbs we have worked in since 1996, including what changes between pockets and what to check before you commit.",
    alternates: buildAlternates(params.locale, "/areas", [AREA_LOCALE]),
  };
}

export default function AreasIndex({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (locale !== AREA_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          itemListNode(
            locale,
            AREAS.map((a) => ({ name: a.longName, path: `/areas/${a.slug}` })),
          ),
        )}
      />

      <header className="bg-brand-indigo-deep text-paper">
        <div className="wrap py-14 md:py-20">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
            Areas
          </div>
          <h1 className="mt-3 max-w-[18ch] text-3xl text-white md:text-5xl">
            Where we actually work
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            Three suburbs, since 1996. We would rather know these properly than
            claim to cover all of Mumbai.
          </p>
        </div>
      </header>

      <div className="wrap py-12">
        <ul className="grid gap-6 md:grid-cols-3">
          {AREAS.map((a) => {
            const panel = getAreaPanel(a.slug);
            return (
              <li key={a.slug}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="group block overflow-hidden rounded-xl border border-line bg-paper transition-colors hover:bg-paper-alt"
                >
                  {panel && (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={panel.image}
                        alt={`${a.longName}, Mumbai`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-xl text-ink group-hover:text-brand-indigo">
                      {a.longName}
                    </h2>
                    <p className="mt-2 text-sm text-ink/70">{a.answer}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 max-w-[68ch] text-sm text-muted">
          We also work occasionally in {site.extendedAreas.join(" and ")},
          though neither is a core market.
        </p>
      </div>

      <ContactCTA locale={locale} formLocation="areas-index" />
    </article>
  );
}
