import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, organizationNode } from "@/lib/schema";
import { buildAlternates } from "@/lib/seo";
import { site } from "@/lib/config";
import { TEAM, TEAM_IS_REAL } from "@/lib/homepage-content";

export const revalidate = 300;

const ABOUT_LOCALE = "en";

/**
 * /about.
 *
 * This route exists because About has been in the main navigation the whole
 * time and was a live 404. A dead end in the nav is worse than a thin page.
 *
 * The factual spine is real: established 1996, the MahaRERA agent number, the
 * address, the three suburbs. The story is not, because it is yours to tell,
 * so those blocks are flagged and the page is noindexed until they are filled.
 */
const STORY_IS_WRITTEN = false;

const STORY_PROMPTS: { heading: string; prompts: string[] }[] = [
  {
    heading: "How it started",
    prompts: [
      "Who started it in 1996, and what were they doing before?",
      "What did Borivali look like as a property market then, compared with now?",
      "Was there a moment early on that set how you work?",
    ],
  },
  {
    heading: "How we work, and why",
    prompts: [
      "What do you do differently from a portal or a larger agency?",
      "What kind of client do you work best with, and who are you not for?",
      "Is there a deal you turned down, and why? That single answer would do more for trust than anything else on this page.",
    ],
  },
  {
    heading: "What has changed in thirty years",
    prompts: [
      "What has RERA actually changed for a buyer here?",
      "What do people get wrong now that they did not get wrong before?",
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== ABOUT_LOCALE) return {};
  return {
    title: `About ${site.name}: in Borivali since ${site.established}`,
    description: `A family run estate agency working across ${site.areas.join(", ")}. MahaRERA registered agent, ${site.rera}.`,
    alternates: buildAlternates(params.locale, "/about", [ABOUT_LOCALE]),
    ...(STORY_IS_WRITTEN ? {} : { robots: { index: false, follow: true } }),
  };
}

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (locale !== ABOUT_LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  const facts = [
    { label: "Established", value: site.established },
    { label: "MahaRERA agent", value: site.rera },
    { label: "Core areas", value: site.areas.join(", ") },
  ];

  return (
    <article>
      <JsonLd data={graph(organizationNode(), breadcrumbNode(locale, trail))} />

      <header className="bg-brand-indigo-deep text-paper">
        <div className="wrap py-14 md:py-20">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
            About
          </div>
          <h1 className="mt-3 max-w-[20ch] text-3xl text-white md:text-5xl">
            In Borivali since {site.established}
          </h1>
          <p className="mt-5 max-w-[58ch] text-paper/80">
            A family run agency working across {site.areas.join(", ")}. We would
            rather know three suburbs properly than claim to cover the city.
          </p>
        </div>
      </header>

      <div className="wrap py-12">
        {!STORY_IS_WRITTEN && (
          <div className="mb-10 rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink">
            <b>Draft.</b> The facts on this page are real. The story is not
            written yet, so the page is noindexed until it is.
          </div>
        )}

        {/* Verified facts. Every one of these is confirmed, not inferred. */}
        <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="bg-paper p-5">
              <dt className="text-xs uppercase tracking-wider text-muted">
                {f.label}
              </dt>
              <dd className="mt-1 text-lg text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 space-y-12">
          {STORY_PROMPTS.map((s) => (
            <section
              key={s.heading}
              className="max-w-[68ch] rounded-xl border border-dashed border-brass/50 p-6"
            >
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl text-ink/70 md:text-3xl">
                  {s.heading}
                </h2>
                <span className="shrink-0 rounded-full border border-brass/40 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-brass">
                  Needs you
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink/60">
                {s.prompts.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-brass">
                      ·
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Gated the same way as the homepage: placeholder names never ship. */}
        {TEAM_IS_REAL && (
          <section className="mt-16">
            <h2 className="text-2xl text-ink md:text-3xl">The people</h2>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {TEAM.map((m) => (
                <li key={m.name} className="bg-paper p-5">
                  <div className="font-semibold text-ink">{m.name}</div>
                  <p className="mt-1 text-sm text-ink/70">{m.role}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-16 max-w-[68ch] rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            Where to find us
          </div>
          <p className="mt-2 text-ink">{site.address}</p>
          <p className="mt-1 text-sm text-muted">
            The complex is also known locally as Garden Groove Shopping Centre.
          </p>
        </div>
      </div>

      <ContactCTA locale={locale} formLocation="about" />
    </article>
  );
}
