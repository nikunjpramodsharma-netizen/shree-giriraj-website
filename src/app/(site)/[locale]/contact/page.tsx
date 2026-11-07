import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, organizationNode, faqNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { site } from "@/lib/config";
import { OpenNow } from "@/components/OpenNow";
import { ShopMap } from "@/components/motion/ShopMap";

export const revalidate = 300;

const CONTACT_LOCALE = "en";

/** "+919324974133" as a reader dials it: "93249 74133". */
function spoken(phone: string): string {
  const d = phone.replace(/\D/g, "").slice(-10);
  return `${d.slice(0, 5)} ${d.slice(5)}`;
}

/**
 * Four questions people ask before they visit. Every answer restates what
 * the site already says: the address and the Garden Groove name (config and
 * this page), the hours (site.hours, owner confirmed 16 September 2026), the
 * free first conversation (About) and the WhatsApp number.
 */
const CONTACT_FAQS: { q: string; a: string }[] = [
  {
    q: "Where is the Shree Giriraj office?",
    a: `${site.address}. The complex is also known locally as Garden Groove Shopping Centre, which is the same place. We have been at this address since ${site.officeSince}.`,
  },
  {
    q: "What are your opening hours?",
    a: `${site.hours.label}, including Sundays. Visit, call or WhatsApp in those hours. A message sent after hours is answered first thing the next morning.`,
  },
  {
    q: "Do you charge for a first conversation?",
    a: "No. The first conversation is free, whether on WhatsApp, by phone or at the office. It usually happens the same day, and there is no obligation.",
  },
  {
    q: "How do I reach you on WhatsApp?",
    a: `Message ${spoken(site.phonePrimary)} on WhatsApp with what you need, the area and your budget. We reply with options that fit, usually the same day. You can also call ${spoken(site.phonePrimary)} or ${spoken(site.phoneSecondary)}.`,
  },
];

const CONTACT_ANSWER = `Shree Giriraj Real Estate is at ${site.address}. We are open ${site.hours.label.replace(", all seven days", "")}, all seven days. WhatsApp or call ${spoken(site.phonePrimary)} for a free first conversation, usually the same day.`;

/**
 * /contact.
 *
 * Exists for two reasons beyond the obvious. It is the page a local pack
 * listing wants to point at, and it is where the NAP block belongs: the
 * address, phone and name have to match the Google Business Profile character
 * for character, or the two records compete instead of reinforcing.
 *
 * Opening hours were confirmed by the owner on 16 September 2026: 9 am to
 * 9 pm, every day of the week. They come from site.hours in config.ts, the
 * same value the business markup uses, so the two cannot disagree.
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== CONTACT_LOCALE) return {};
  return {
    title: "Contact us: Chikoowadi, Borivali West",
    description: "Visit, call or WhatsApp us in Chikoowadi, Borivali West. Open 9 am to 9 pm, all week. The first conversation is free, usually the same day.",
    ...pageUrls(params.locale, "/contact", [CONTACT_LOCALE]),
  };
}

export default function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (locale !== CONTACT_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          organizationNode(),
          breadcrumbNode(locale, trail),
          faqNode(CONTACT_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        )}
      />

      {/* Borivali, because this page is about a specific shop in a specific place. A photograph of the shopfront would be better and is on the list. */}
      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/premium/u/complex-06.jpg"
          alt="A quiet lift lobby finished in stone and brass"
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
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
            Contact
          </div>
          <h1 className="mt-3 max-w-[20ch] text-3xl text-white md:text-5xl">
            Talk to someone who works here
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            A family run agency. The person who answers is the person who
            handles your file.
          </p>
        </div>
      </header>

      <section className="border-b border-line bg-white py-8 md:py-10">
        <div className="wrap">
          <div className="max-w-3xl border-l-4 border-bronze pl-5">
            <div className="eyebrow">The short answer</div>
            <p className="mt-2 text-lg leading-relaxed text-ink md:text-xl">
              {CONTACT_ANSWER}{" "}
              <a className="text-brand-indigo underline underline-offset-4" href={site.social.google} target="_blank" rel="noopener">
                Read our Google reviews
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <div className="wrap py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            {/* NAP block. Must match the Google Business Profile exactly. */}
            <h2 className="text-2xl text-ink md:text-3xl">{site.name}</h2>
            <address className="mt-4 not-italic text-ink/80">
              {site.address}
            </address>
            <p className="mt-2 text-sm text-muted">
              The complex is also known locally as Garden Groove Shopping
              Centre, which is the same place. We have been at this address
              since 2005, and in property in these suburbs since 1996.
            </p>

            <dl className="mt-8 space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Phone
                </dt>
                <dd className="mt-1 space-x-3 text-ink">
                  <a
                    className="underline underline-offset-4"
                    href={`tel:${site.phonePrimary}`}
                  >
                    {site.phonePrimary}
                  </a>
                  <a
                    className="underline underline-offset-4"
                    href={`tel:${site.phoneSecondary}`}
                  >
                    {site.phoneSecondary}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Email
                </dt>
                <dd className="mt-1 text-ink">
                  <a
                    className="underline underline-offset-4"
                    href={`mailto:${site.email}`}
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  MahaRERA registration
                </dt>
                <dd className="mt-1 text-ink">{site.rera}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Find us online
                </dt>
                <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-ink">
                  <a className="underline underline-offset-4" href={site.social.instagram} target="_blank" rel="noopener">Instagram</a>
                  <a className="underline underline-offset-4" href={site.social.facebook} target="_blank" rel="noopener">Facebook</a>
                  <a className="underline underline-offset-4" href={site.social.google} target="_blank" rel="noopener">Google reviews</a>
                  <a className="underline underline-offset-4" href={site.social.justdial} target="_blank" rel="noopener">JustDial</a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 rounded-xl border border-line bg-paper-alt p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-ink">Opening hours</div>
                <OpenNow opens={site.hours.opens} closes={site.hours.closes} />
              </div>
              <p className="mt-2 text-ink">
                {site.hours.label}. Visit, call, or WhatsApp; a message sent
                after hours is answered first thing the next morning.
              </p>
            </div>

            <ShopMap mapsUrl={site.social.google} />
          </div>

          <ContactCTA locale={locale} formLocation="contact-page" defaultOpen />
        </div>
      </div>

      <section className="bg-paper-alt py-14 md:py-16">
        <div className="wrap">
          <div className="eyebrow">Common questions</div>
          <h2 className="mt-3 text-2xl text-brand-indigo md:text-3xl">Before you visit or call</h2>
          <div className="mt-6 grid items-start gap-3 md:grid-cols-2">
            {CONTACT_FAQS.map((f) => (
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
          <p className="mt-6 text-sm text-ink/75">
            See what clients say on our{" "}
            <a className="text-brand-indigo underline underline-offset-4" href={site.social.google} target="_blank" rel="noopener">
              Google reviews
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
