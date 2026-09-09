import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageUrls, SERVICE_SLUGS } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { graph, itemListNode, breadcrumbNode } from "@/lib/schema";

export const revalidate = 60;

const SERVICES = [
  { slug: "resale-flats", key: "resale" },
  { slug: "rentals", key: "rentals" },
  { slug: "new-project-bookings", key: "newProject" },
  { slug: "investment-advisory", key: "investmentAdvisory" },
  { slug: "commercial-plots", key: "commercial" },
  { slug: "interiors", key: "interiors" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  return {
    ...pageUrls(params.locale, "/services"),
    title: t("heading"),
  };
}

/**
 * The translation keys predate the slugs and do not mirror them, so the map is
 * explicit rather than derived. Deriving it would silently produce undefined
 * keys the moment a slug and a key disagree.
 */
const SERVICE_TITLE_KEY: Record<(typeof SERVICE_SLUGS)[number], string> = {
  "resale-flats": "resaleTitle",
  rentals: "rentalsTitle",
  "new-project-bookings": "newProjectTitle",
  "investment-advisory": "investmentAdvisoryTitle",
  "commercial-plots": "commercialTitle",
  interiors: "interiorsTitle",
};

export default async function ServicesIndexPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  const locale = params.locale;

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: t("heading"), path: "/services" },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          itemListNode(
            locale,
            SERVICE_SLUGS.map((slug) => ({
              name: t(SERVICE_TITLE_KEY[slug]),
              path: `/services/${slug}`,
            })),
          ),
          breadcrumbNode(locale, trail),
        )}
      />
      {/* The six pages below this one all open with a photograph. The page
          that lists them should not be the flat one. */}
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/hero-mumbai-aerial.jpg"
          alt="Mumbai from above, dense residential blocks under daylight"
          fill
          priority
          sizes="100vw"
          className="hero-kenburns object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(21,27,61,.92) 0%, rgba(21,27,61,.74) 45%, rgba(21,27,61,.34) 78%, rgba(21,27,61,.55) 100%), linear-gradient(180deg, rgba(21,27,61,.5) 0%, rgba(21,27,61,0) 32%, rgba(21,27,61,.85) 100%)" }}
        />
        <div className="wrap relative z-10 pt-20 md:pt-28">
          <Breadcrumbs trail={trail} tone="dark" />
        </div>
        <div className="wrap relative z-10 mt-6 pb-20 md:pb-28">
          <div className="eyebrow text-brass-bright">{t("eyebrow")}</div>
          <h1 className="mt-3.5 text-4xl md:text-5xl">{t("heading")}</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="block rounded-2xl border border-brand-indigo/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h2 className="text-xl text-brand-indigo">{t(`${s.key}Title`)}</h2>
                <p className="mt-2.5 text-[0.96rem] text-muted">{t(`${s.key}Body`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
