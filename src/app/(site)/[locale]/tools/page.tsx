import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, itemListNode } from "@/lib/schema";
import { buildAlternates } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const revalidate = 300;

const TOOL_LOCALE = "en";

/**
 * The planned tools, from plan/14-free-tools.md. Listed here so the page shows
 * the shape of what is coming, but only built tools are linked. Same readiness
 * rule as the guides hub: never link into a hole.
 */
/**
 * All seven planned tools are built, so there is nothing left to preview
 * here. Kept as an empty list rather than deleted, because the next tool to
 * be planned goes straight back in.
 */
const PLANNED: string[] = [];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== TOOL_LOCALE) return {};
  return {
    title: "Free property calculators for Mumbai buyers and tenants",
    description:
      "Straightforward calculators for the numbers that decide a property purchase. No signup, no email, nothing gated.",
    alternates: buildAlternates(params.locale, "/tools", [TOOL_LOCALE]),
  };
}

export default function ToolsIndex({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (locale !== TOOL_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          itemListNode(
            locale,
            TOOLS.map((t) => ({ name: t.title, path: `/tools/${t.slug}` })),
          ),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/moment-keys-2.jpg"
          alt="Paperwork and keys on a desk"
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
            Tools
          </div>
          <h1 className="mt-3 max-w-[18ch] text-3xl text-white md:text-5xl">
            Work out the numbers yourself
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            No signup, no email, nothing behind a form. If a calculator is any
            good it should not need to hold your details hostage.
          </p>
        </div>
      </header>

      <div className="wrap py-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tools/${t.slug}`}
                className="group block h-full rounded-xl border border-line bg-paper p-6 transition-colors hover:bg-paper-alt"
              >
                <h2 className="text-xl text-ink group-hover:text-brand-indigo md:text-2xl">
                  {t.title}
                </h2>
                <p className="mt-2 text-sm text-ink/70">{t.answer}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 max-w-[68ch]">
          <h2 className="text-lg text-ink">Being built next</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {PLANNED.map((p) => (
              <li
                key={p}
                className="rounded-full border border-line px-3 py-1.5 text-sm text-muted"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ContactCTA locale={locale} formLocation="tools-index" />
    </article>
  );
}
