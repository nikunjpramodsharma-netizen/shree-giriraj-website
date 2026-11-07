import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageUrls, SERVICE_SLUGS } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { graph, itemListNode, breadcrumbNode, faqNode } from "@/lib/schema";
import { site } from "@/lib/config";

export const revalidate = 60;

const SERVICES = [
  { slug: "resale-flats", key: "resale" },
  { slug: "rentals", key: "rentals" },
  { slug: "new-project-bookings", key: "newProject" },
  { slug: "investment-advisory", key: "investmentAdvisory" },
  { slug: "commercial-plots", key: "commercial" },
  { slug: "mhada-paperwork", key: "mhada" },
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
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

/**
 * The translation keys predate the slugs and do not mirror them, so the map is
 * explicit rather than derived. Deriving it would silently produce undefined
 * keys the moment a slug and a key disagree.
 */
/**
 * The short answer and four questions, English only like the service page
 * questions. Every fact is one the site already states: the first
 * conversation is free (About), brokerage agreed in writing first and nothing
 * to pay on a rental until it completes (the service questions), the areas
 * and the Bandra East office (MHADA paperwork), the hours (config) and the
 * MahaRERA number.
 */
const HUB_ANSWER =
  "Shree Giriraj Real Estate is a MahaRERA registered agency in Chikoowadi, Borivali West, in real estate since 1996. We help you buy, sell or rent a flat in Borivali, Kandivali and Malad. We also book new launches, advise investors, find shops and offices, handle MHADA paperwork across Mumbai, and do interiors.";

const HUB_FAQS: { q: string; a: string }[] = [
  {
    q: "Do you charge for the first conversation?",
    a: "No. The first conversation is free, and usually happens the same day. Brokerage is agreed in writing before we start. On a rental there is nothing to pay until your tenancy completes.",
  },
  {
    q: "Which areas do you cover?",
    a: "Borivali, Kandivali and Malad, on both the west and east sides, with Dahisar and Goregaon now and then. MHADA paperwork we handle anywhere in Mumbai, because every Mumbai Board file goes to the same office in Bandra East.",
  },
  {
    q: "How quickly will I hear back?",
    a: "Usually the same day. Send your budget and area on WhatsApp to 93249 74133, and we reply with options that fit. The office is open 9 am to 9 pm, all seven days.",
  },
  {
    q: "Is Shree Giriraj registered with MahaRERA?",
    a: `Yes, registration ${site.rera}. You can check it free on the MahaRERA portal. We have worked in real estate since ${site.established}, and from our Chikoowadi office since ${site.officeSince}.`,
  },
];

const SERVICE_TITLE_KEY: Record<(typeof SERVICE_SLUGS)[number], string> = {
  "resale-flats": "resaleTitle",
  rentals: "rentalsTitle",
  "new-project-bookings": "newProjectTitle",
  "investment-advisory": "investmentAdvisoryTitle",
  "commercial-plots": "commercialTitle",
  "mhada-paperwork": "mhadaTitle",
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
          locale === "en" ? faqNode(HUB_FAQS.map((f) => ({ question: f.q, answer: f.a }))) : null,
        )}
      />
      {/* The seven pages below this one all open with a photograph. The page
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
          <div className="eyebrow text-bronze">{t("eyebrow")}</div>
          <h1 className="mt-3.5 max-w-[22ch] text-4xl md:text-5xl">{t("heading")}</h1>
        </div>
      </section>

      {locale === "en" && (
        <section className="border-b border-line bg-white py-8 md:py-10">
          <div className="wrap">
            <div className="max-w-3xl border-l-4 border-bronze pl-5">
              <div className="eyebrow">The short answer</div>
              <p className="mt-2 text-lg leading-relaxed text-ink md:text-xl">{HUB_ANSWER}</p>
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-3">
            {SERVICES.map((s) => (
              <Link prefetch={false}
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

      {locale === "en" && (
        <section className="bg-paper-alt py-14 md:py-16">
          <div className="wrap">
            <div className="eyebrow">Common questions</div>
            <h2 className="mt-3 text-2xl text-brand-indigo md:text-3xl">Before you get in touch</h2>
            <div className="mt-6 grid items-start gap-3 md:grid-cols-2">
              {HUB_FAQS.map((f) => (
                <details key={f.q} className="group rounded-xl border border-line bg-white px-5 py-3.5 open:shadow-sm">
                  <summary className="cursor-pointer list-none text-[0.98rem] font-medium text-brand-indigo marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <span className="shrink-0 text-bronze-deep transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-[0.97rem] text-ink/75">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
