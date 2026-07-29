import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const revalidate = 60;

const SERVICES = [
  { slug: "resale-flats", key: "resale" },
  { slug: "rentals", key: "rentals" },
  { slug: "new-project-bookings", key: "newProject" },
  { slug: "redevelopment", key: "redevelopment" },
  { slug: "shops-plots", key: "shops" },
  { slug: "interiors", key: "interiors" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  return {
    title: t("heading"),
  };
}

export default async function ServicesIndexPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
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
