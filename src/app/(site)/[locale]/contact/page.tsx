import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, organizationNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { site } from "@/lib/config";

export const revalidate = 300;

const CONTACT_LOCALE = "en";

/**
 * /contact.
 *
 * Exists for two reasons beyond the obvious. It is the page a local pack
 * listing wants to point at, and it is where the NAP block belongs: the
 * address, phone and name have to match the Google Business Profile character
 * for character, or the two records compete instead of reinforcing.
 *
 * Opening hours are NOT on this page. They are not confirmed, and hours are
 * exactly the kind of detail someone acts on, so a guess would send a person
 * to a closed shop.
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== CONTACT_LOCALE) return {};
  return {
    title: `Contact ${site.name}, Borivali West`,
    description: `Talk to us about buying, selling, renting or investing across ${site.areas.join(", ")}. WhatsApp, phone or send your details.`,
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
      <JsonLd data={graph(organizationNode(), breadcrumbNode(locale, trail))} />

      {/* Borivali, because this page is about a specific shop in a specific place. A photograph of the shopfront would be better and is on the list. */}
      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/sections/area-borivali.jpg"
          alt="Residential buildings in Borivali, Mumbai"
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
            Contact
          </div>
          <h1 className="mt-3 max-w-[20ch] text-3xl text-white md:text-5xl">
            Talk to someone who works here
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            Not a call centre and not a lead form that goes nowhere. You will
            get one of us.
          </p>
        </div>
      </header>

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
                  MahaRERA agent registration
                </dt>
                <dd className="mt-1 text-ink">{site.rera}</dd>
              </div>
            </dl>

            {/* Deliberately not stating hours. See the note at the top. */}
            <div className="mt-8 rounded-xl border border-dashed border-brass/50 p-5">
              <div className="flex items-baseline gap-3">
                <div className="text-sm font-semibold text-ink/70">
                  Opening hours
                </div>
                <span className="shrink-0 rounded-full border border-brass/40 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-brass">
                  Needs you
                </span>
              </div>
              <p className="mt-2 text-sm text-ink/60">
                Not published yet, because a guess would send somebody to a
                closed shop. Confirm your hours including Sundays and they go
                here and into the business markup.
              </p>
            </div>
          </div>

          <ContactCTA locale={locale} formLocation="contact-page" defaultOpen />
        </div>
      </div>
    </article>
  );
}
