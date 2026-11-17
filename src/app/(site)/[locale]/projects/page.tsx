import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { projectsQuery } from "@/sanity/queries";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";
import { pageUrls } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { type Crumb } from "@/components/Breadcrumbs";
import { graph, breadcrumbNode, itemListNode, faqNode } from "@/lib/schema";
import { repairProjectLocales } from "@/lib/project-locale-fixes";
import { COMPARISON } from "@/lib/project-facts";
import { PROJECT_LINKS, registrationAwaited } from "@/lib/project-links";
import { waLink } from "@/lib/config";
import { JJ } from "@/lib/projects/jaswanti-jewel";

/**
 * Jaswanti Jewel is served from code in English only; its translated route is
 * noindex with a canonical to English. The hi, mr and gu lists link straight
 * to the English page so nobody lands on the copy (technical crawl, 16 Nov 2026).
 */
const ENGLISH_ONLY_PROJECTS = new Set([JJ.slug]);

const MALAD_WA =
  "Hi Shree Giriraj, I am looking at new projects in Malad West. My budget is about ___ for a ___ BHK. Can you send me the launches that fit?";

export const revalidate = 60;

/** Under 150 characters; the page intro in messages is longer. English only. */
const EN_META_DESCRIPTION =
  "New projects in Kandivali West and Borivali West compared: BHK, from about price, possession and MahaRERA status. Price sheets on WhatsApp.";

/** The page opens with this answer (English). 60 words or fewer. */
const INTRO_EN =
  "Five new projects are on our list in Kandivali West and Borivali West. Jaswanti Jewel and Veena Celestia are registered, with Jewel from ₹2.92 Cr. The Landmark starts from about ₹2 Cr. Blissful Living and Luxury Living are awaiting MahaRERA registration. Message us your budget on WhatsApp for a shortlist.";

const FAQS_EN = [
  {
    q: "Which new projects are there in Kandivali West?",
    a: "Kandivali West has Jaswanti Jewel off M. G. Road, registered on MahaRERA, with 2, 3, 4 and 5 BHK homes from ₹2.92 Cr as of October 2026 and possession from March 2027. Blissful Living on Ext. Mathuradas Road is awaiting MahaRERA registration.",
  },
  {
    q: "Which new projects are there in Borivali West?",
    a: "Borivali West has The Landmark on S.V. Road, with 2, 2.5 and 3 BHK homes from about ₹2 Cr, and Veena Celestia on Chandavarkar Lane, which is RERA registered. Luxury Living in Punit Nagar is awaiting MahaRERA registration.",
  },
  {
    q: "Are there new projects in Malad West?",
    a: "Yes. Square Yards listed 10 newly launched and 17 under construction projects in Malad West when read on 16 November 2026. None is on this page yet. Send us your budget on WhatsApp and we share the Malad West launches that fit, each with its MahaRERA registration checked.",
  },
  {
    q: "When is possession at Jaswanti Jewel?",
    a: "Jaswanti Jewel's possession is from March 2027, the developer's handover target, with every amenity ready at handover. The MahaRERA possession date is December 2027, the planned completion in the project's June 2026 environmental compliance report.",
  },
  {
    q: "How do I check a project's MahaRERA registration?",
    a: "Ask us for the project's MahaRERA number and look it up on the MahaRERA website, maharera.maharashtra.gov.in. Where a project is not registered yet, its page says so, and we send details once it is.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "projectsPage" });
  return {
    ...pageUrls(params.locale, "/projects"),
    title: t("metaTitle"),
    description: params.locale === "en" ? EN_META_DESCRIPTION : t("body"),
  };
}

type Project = {
  _id: string;
  name: string;
  slug: { current: string };
  developer?: string;
  status?: string;
  location?: string;
  area?: string;
  featured?: boolean;
  coverImage?: any;
  summary?: LocalizedValue<string>;
};

function areaOf(slug: string): string | undefined {
  return PROJECT_LINKS.find((p) => p.slug === slug)?.area;
}

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const [projects, t] = await Promise.all([
    client.fetch<Project[]>(projectsQuery),
    getTranslations({ locale, namespace: "projectsPage" }),
  ]);

  /**
   * This index and /blog were the only two pages on the site with no
   * structured data at all, in four locales each. A list page's job in search
   * is to be understood as a list, so it gets the trail plus an ItemList of
   * what is actually on it.
   */
  const en = locale === "en";
  const cardProjects = (projects ?? []).map((p) => repairProjectLocales(p.slug.current, p));
  const groups: { id: string; title: string; blurb: string; items: Project[] }[] = en
    ? [
        {
          id: "kandivali-west",
          title: "New projects in Kandivali West",
          blurb: "Jaswanti Jewel is registered and building towards handover. Blissful Living is awaiting MahaRERA registration.",
          items: cardProjects.filter((p) => areaOf(p.slug.current) === "kandivali"),
        },
        {
          id: "borivali-west",
          title: "New projects in Borivali West",
          blurb: "The Landmark and Veena Celestia are on offer now. Luxury Living is awaiting MahaRERA registration.",
          items: cardProjects.filter((p) => areaOf(p.slug.current) === "borivali-west"),
        },
        {
          id: "more",
          title: "More projects",
          blurb: "",
          items: cardProjects.filter((p) => !areaOf(p.slug.current)),
        },
      ].filter((g) => g.items.length > 0)
    : [{ id: "all", title: "", blurb: "", items: cardProjects }];

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: t("heading"), path: "/projects" },
  ];

  const statusLabel: Record<string, string> = {
    booking: t("statusBooking"),
    upcoming: t("statusUpcoming"),
    sold: t("statusSold"),
  };

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          itemListNode(
            locale,
            projects.map((p) => ({
              name: p.name,
              path: `/projects/${p.slug.current}`,
              ...(ENGLISH_ONLY_PROJECTS.has(p.slug.current) ? { locale: "en" } : {}),
            })),
          ),
          ...(en ? [faqNode(FAQS_EN.map((f) => ({ question: f.q, answer: f.a })))] : []),
        )}
      />
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/premium/u/tower-05.jpg"
          alt="A modern residential high rise in Mumbai on a clear day"
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
        <div className="wrap relative z-10 py-20 md:py-28">
          <div className="eyebrow text-bronze">{t("eyebrow")}</div>
          <h1 className="mt-3.5 max-w-[24ch] text-4xl text-white md:text-6xl">
            {en ? "New projects in Kandivali West and Borivali West" : t("heading")}
          </h1>
          <p className="mt-4 max-w-[40em] text-paper/75">{en ? INTRO_EN : t("body")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          {en && (
            <p className="mb-10 max-w-[62ch] text-sm text-muted">
              Jump to{" "}
              <a href="#kandivali-west" className="font-semibold text-brand-indigo underline underline-offset-4">Kandivali West</a>,{" "}
              <a href="#borivali-west" className="font-semibold text-brand-indigo underline underline-offset-4">Borivali West</a> or{" "}
              <a href="#malad-west" className="font-semibold text-brand-indigo underline underline-offset-4">Malad West</a>.
            </p>
          )}
          {(!projects || projects.length === 0) && (
            <p className="text-muted">
              {t("emptyState")}
              <Link prefetch={false} href="/studio" className="text-brand-blue underline">
                {t("studioLink")}
              </Link>
              .
            </p>
          )}

          {groups.map((g) => (
            <div key={g.id} id={g.id} className={g.title ? "mt-14 first:mt-0" : ""}>
              {g.title && (
                <>
                  <h2 className="text-2xl text-brand-indigo md:text-3xl">{g.title}</h2>
                  {g.blurb && <p className="mt-2 max-w-[62ch] text-ink/80">{g.blurb}</p>}
                </>
              )}
              <div className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 ${g.title ? "mt-6" : ""}`}>
                {g.items.map((project) => {
                  const toEnglish = !en && ENGLISH_ONLY_PROJECTS.has(project.slug.current);
                  const Card = toEnglish ? "a" : Link;
                  return (
                  <Card
                    {...(toEnglish ? {} : { prefetch: false })}
                    key={project._id}
                    href={`/projects/${project.slug.current}`}
                    {...(toEnglish ? { hrefLang: "en" } : {})}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {project.coverImage && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={urlFor(project.coverImage).width(700).height(525).url()}
                          alt={project.coverImage?.alt || project.name}
                          width={700}
                          height={525}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        {project.status && (
                          <span className="absolute left-3 top-3 rounded-full bg-bronze px-3 py-1 text-[0.66rem] font-bold uppercase tracking-wider text-brand-indigo-deep">
                            {registrationAwaited(project.slug.current) && project.status === "booking"
                              ? statusLabel.upcoming
                              : statusLabel[project.status] || project.status}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-xl text-brand-indigo">{project.name}</h2>
                      {project.location && (
                        <p className="mt-1 text-sm text-muted">{project.location}</p>
                      )}
                      {project.summary && (
                        <p className="mt-3 flex-1 text-sm text-muted line-clamp-3">
                          {getLocalizedField(project.summary, locale)}
                        </p>
                      )}
                      <span className="mt-4 text-sm font-semibold text-brand-blue">
                        {t("viewDetails")}
                      </span>
                    </div>
                  </Card>
                  );
                })}
              </div>
            </div>
          ))}

          {en && (
            <div id="malad-west" className="mt-14">
              <h2 className="text-2xl text-brand-indigo md:text-3xl">New projects in Malad West</h2>
              <p className="mt-2 max-w-[62ch] text-ink/80">
                Square Yards listed 10 newly launched and 17 under construction projects in Malad West when we read it
                on 16 November 2026. None is on this page yet. Tell us the size and the budget, and we send the Malad
                West launches that fit, each with its MahaRERA registration checked, usually the same day.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
                <a href={waLink(MALAD_WA)} target="_blank" rel="noopener" className="btn btn-wa">
                  Ask for Malad West launches
                </a>
                <a href="/areas/malad" className="text-sm font-semibold text-brand-indigo underline underline-offset-4">
                  Malad West property rates and guide
                </a>
              </div>
            </div>
          )}

          {en && (
            <>
              <h2 className="mt-16 text-2xl text-brand-indigo md:text-3xl">The five projects side by side</h2>
              <p className="mt-2 max-w-[62ch] text-ink/80">
                Prices are rough &quot;from about&quot; figures. Possession is shown only where the project page states it.
                Exact price sheets are on WhatsApp.
              </p>
              <div className="mt-6 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="bg-paper-alt text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Project</th>
                      <th className="px-4 py-3 font-semibold">Area</th>
                      <th className="px-4 py-3 font-semibold">BHK</th>
                      <th className="px-4 py-3 font-semibold">From about</th>
                      <th className="px-4 py-3 font-semibold">Possession</th>
                      <th className="px-4 py-3 font-semibold">MahaRERA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {COMPARISON.map((r) => (
                      <tr key={r.slug}>
                        <th scope="row" className="px-4 py-3 font-medium text-brand-indigo">
                          <Link prefetch={false} href={`/projects/${r.slug}`} className="underline underline-offset-4">
                            {r.name}
                          </Link>
                        </th>
                        <td className="px-4 py-3 text-ink/85">{r.suburb}</td>
                        <td className="px-4 py-3 text-ink/85">{r.bhk}</td>
                        <td className="px-4 py-3 text-ink/85">{r.fromAbout}</td>
                        <td className="px-4 py-3 text-ink/85">{r.possession}</td>
                        <td className="px-4 py-3 text-ink/85">{r.reraText}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 max-w-[62ch] text-sm text-muted">
                Blissful Living and Luxury Living: MahaRERA registration awaited. Register your interest and we will send
                details once they are registered.
              </p>

              <h2 className="mt-16 text-2xl text-brand-indigo md:text-3xl">Common questions</h2>
              <div className="mt-6 grid items-start gap-3 md:grid-cols-2">
                {FAQS_EN.map((f) => (
                  <details key={f.q} className="group rounded-xl border border-line bg-white px-5 py-3.5 open:shadow-sm">
                    <summary className="cursor-pointer list-none font-medium text-brand-indigo marker:content-none">
                      <span className="flex items-center justify-between gap-4">
                        {f.q}
                        <span className="shrink-0 text-bronze-deep transition group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-3 text-[0.97rem] text-ink/75">{f.a}</p>
                  </details>
                ))}
              </div>
              <h2 className="mt-16 text-2xl text-brand-indigo md:text-3xl">Before you book a new project</h2>
              <ul className="mt-4 max-w-[68ch] space-y-3 text-ink/80">
                <li>
                  <a href="/guides/new-projects-borivali-west" className="font-semibold text-brand-indigo underline underline-offset-4">
                    New projects in Borivali West
                  </a>
                  : how to read a launch before you book.
                </li>
                <li>
                  <a href="/blog/under-construction-vs-ready-to-move-flat" className="font-semibold text-brand-indigo underline underline-offset-4">
                    Under construction or ready to move
                  </a>
                  : what you trade by waiting for possession.
                </li>
                <li>
                  <a href="/blog/buy-first-flat-in-mumbai" className="font-semibold text-brand-indigo underline underline-offset-4">
                    Buying your first flat in Mumbai, step by step
                  </a>
                  : from the budget to the keys.
                </li>
                <li>
                  Prefer a resale flat? See flats for sale in{" "}
                  <a href="/areas/kandivali/flats-for-sale" className="font-semibold text-brand-indigo underline underline-offset-4">Kandivali West</a>,{" "}
                  <a href="/areas/borivali-west/flats-for-sale" className="font-semibold text-brand-indigo underline underline-offset-4">Borivali West</a> and{" "}
                  <a href="/areas/malad/flats-for-sale" className="font-semibold text-brand-indigo underline underline-offset-4">Malad West</a>, with 1, 2 and 3 BHK prices by pocket.
                </li>
              </ul>
              <p className="mt-8 text-sm text-muted">
                Reading about the suburbs first? See the{" "}
                <a href="/areas/kandivali" className="font-semibold text-brand-indigo underline underline-offset-4">
                  Kandivali West guide
                </a>
                , the{" "}
                <a href="/areas/borivali-west" className="font-semibold text-brand-indigo underline underline-offset-4">
                  Borivali West guide
                </a>
                , the{" "}
                <a href="/areas/malad" className="font-semibold text-brand-indigo underline underline-offset-4">
                  Malad West guide
                </a>
                , and the{" "}
                <a href="/tools/stamp-duty-calculator-mumbai" className="font-semibold text-brand-indigo underline underline-offset-4">
                  stamp duty calculator
                </a>
                .
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
