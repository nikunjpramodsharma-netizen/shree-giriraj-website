import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { EmiCalculator } from "@/components/EmiCalculator";
import { StampDutyCalculator } from "@/components/StampDutyCalculator";
import { AreaCalculator } from "@/components/AreaCalculator";
import { HraRentReceipts } from "@/components/HraRentReceipts";
import { InteriorsScope } from "@/components/InteriorsScope";
import { CapitalGainsCalculator } from "@/components/CapitalGainsCalculator";
import { RentalYieldCalculator } from "@/components/RentalYieldCalculator";
import { PropertyTaxCalculator } from "@/components/PropertyTaxCalculator";
import { graph, breadcrumbNode, faqNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import Image from "next/image";
import { TOOLS, getTool } from "@/lib/tools";
import { TOOL_IMAGES } from "@/lib/tool-images";
import { RelatedLinks } from "@/components/RelatedLinks";
import { interlinksForTool } from "@/lib/interlinks";

export const revalidate = 300;

const TOOL_LOCALE = "en";

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  if (params.locale !== TOOL_LOCALE) return [];
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const tool = getTool(params.slug);
  if (!tool || params.locale !== TOOL_LOCALE) return {};
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    ...pageUrls(params.locale, `/tools/${tool.slug}`, [
      TOOL_LOCALE,
    ]),
  };
}

export default function ToolPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const tool = getTool(slug);
  if (!tool || locale !== TOOL_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: tool.title, path: `/tools/${tool.slug}` },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          faqNode(tool.faqs.map((f) => ({ question: f.q, answer: f.a }))),
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        {/* The tool's own picture, on the right and fading into the navy, so the
            heading stays fully legible on the left. */}
        {TOOL_IMAGES[tool.slug] && (
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden md:block"
            style={{
              // The picture fades in from nothing, so there is no edge where it begins.
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.55) 38%, black 72%)",
              maskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.55) 38%, black 72%)",
            }}
          >
            <Image
              src={TOOL_IMAGES[tool.slug].src}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 58vw, 0px"
              className="object-cover opacity-60"
            />
          </div>
        )}
        <div className="wrap relative py-12 md:py-16">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
            Free tool
          </div>
          <h1 className="mt-3 max-w-[22ch] text-3xl text-white md:text-5xl">
            {tool.title}
          </h1>
          <p className="mt-5 max-w-[62ch] text-paper/80">{tool.answer}</p>
        </div>
      </header>

      {/* The calculator sits directly under the heading. No wall, no scroll
          hunt, and nothing to fill in before it works. */}
      <div className="wrap -mt-6 pb-12">
        {tool.component === "emi" && <EmiCalculator />}
        {tool.component === "stampDuty" && <StampDutyCalculator />}
        {tool.component === "area" && <AreaCalculator />}
        {tool.component === "hra" && <HraRentReceipts />}
        {tool.component === "interiors" && <InteriorsScope />}
        {tool.component === "capitalGains" && <CapitalGainsCalculator />}
        {tool.component === "propertyTax" && <PropertyTaxCalculator />}
        {tool.component === "rentalYield" && <RentalYieldCalculator />}
      </div>

      <div className="wrap pb-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div className="max-w-[68ch]">
            <h2 className="text-2xl text-ink md:text-3xl">
              Why this one is different
            </h2>
            <div className="mt-4 space-y-4 text-ink/85">
              {tool.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="mt-12 text-2xl text-ink md:text-3xl">
              Common questions
            </h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {tool.faqs.map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-2 text-ink/75">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="space-y-6">
            {/* Saying what it does not do is not a disclaimer bolted on. It is
                the reason to trust the numbers it does give. */}
            <div className="rounded-xl border border-line p-5">
              <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
                What this does not do
              </div>
              <ul className="mt-3 space-y-2.5 text-sm text-ink/70">
                {tool.limits.map((l) => (
                  <li key={l} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-brass">
                      ·
                    </span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-line p-5">
              <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
                Read next
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {tool.readNext.map((r) => (
                  <li key={r.href}>
                    <Link prefetch={false}
                      href={r.href}
                      className="text-brand-indigo underline underline-offset-4"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <RelatedLinks
        links={interlinksForTool(tool.slug, locale)}
        locale={locale}
        tone="alt"
        heading="Where these numbers get used"
        intro="The services this tool does the sums for, the suburbs the rates come from, and the articles that explain the rules behind it."
      />

      <ContactCTA locale={locale} formLocation={`tool-${tool.slug}`} />
    </article>
  );
}
