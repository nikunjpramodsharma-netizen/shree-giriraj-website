import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, breadcrumbNode, organizationNode, faqNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { site } from "@/lib/config";
import { TEAM, TEAM_IS_REAL } from "@/lib/homepage-content";
import {
  STORY_IS_WRITTEN,
  STORY_PROMPTS,
  FOUNDER,
  founderInitials,
  ABOUT_FAQS,
} from "@/lib/about";

export const revalidate = 300;

const ABOUT_LOCALE = "en";

/**
 * /about.
 *
 * This route exists because About has been in the main navigation the whole
 * time and was a live 404. A dead end in the nav is worse than a thin page.
 *
 * The factual spine is real: in property since 1996, at this office since
 * 2005, the MahaRERA agent number, the
 * address, the three suburbs. The story is not, because it is yours to tell,
 * so those blocks are flagged and the page is noindexed until they are filled.
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== ABOUT_LOCALE) return {};
  return {
    // "in Borivali since 1996" was the old wording here and in the h1. It
    // reads as the shop having stood in Borivali since 1996, which is the
    // exact implication the owner corrected: the trade dates from 1996, this
    // address from 2005. The tenure claim is the safe half of it.
    title: `About ${site.name}: in real estate since ${site.established}`,
    description: `A family run estate agency working across ${site.areas.join(", ")}. MahaRERA registered agent, ${site.rera}.`,
    ...pageUrls(params.locale, "/about", [ABOUT_LOCALE]),
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
      <JsonLd
        data={graph(
          organizationNode({ founder: FOUNDER.name }),
          breadcrumbNode(locale, trail),
          faqNode(ABOUT_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        )}
      />

      {/*
        The suburbs, not a staged office.
        
        This hero used to be a stock photograph of three people at a desk,
        captioned "The Shree Giriraj team at work". None of them work here and
        two of them are not Indian, so the alt text was a plain untruth sitting
        in the markup of the one page a reader opens specifically to find out
        who they are dealing with. A skyline claims nothing it cannot back up.

        It is still a placeholder. The right image is a photograph of the shop
        in Chikoowadi, or of the people in it, and it is listed as such in
        content/PLACEHOLDERS.md. Swap it the day one exists.
      */}
      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/sections/about-suburbs.jpg"
          alt="Residential towers in Mumbai above a line of trees"
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
            About
          </div>
          <h1 className="mt-3 max-w-[20ch] text-3xl text-white md:text-5xl">
            In real estate since {site.established}
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

        {/*
          The one paragraph of real story the site has. It was the homepage
          people section, which was removed: a stock photo of a foreign office
          under the words "the same shop, the same street, the same family"
          contradicted its own claim, and the team list beneath it was empty.

          The sentence about selling in the same building twice is the best on
          the site, so it moved here rather than being deleted with the
          section. About is where somebody has come looking for exactly this.
        */}
        <div className="mt-12 max-w-[68ch]">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
            The same shop, the same street
          </div>
          <p className="mt-3 text-lg text-ink/85">
            We have worked these suburbs since {site.established}, and out of
            the same shop in Chikoowadi since {site.officeSince}. That is long
            enough to have sold flats in the same building twice, and to
            remember why the second sale was harder than the first.
          </p>
        </div>

        {/*
          The founder. One confirmed fact, presented plainly.

          The full portrait, not a thumbnail. The first version put him in a
          96 pixel circle beside his name, which read as an avatar on a contact
          card. The owner's instruction on 9 September 2026 was the whole
          image, so it runs at its own proportions in a two column block: the
          photograph on one side, the name and the one confirmed sentence on
          the other. Nothing is cropped away.

          The monogram remains as the fallback if the photograph is ever
          pulled: initials read as deliberate, whereas a stock face under a
          real man's name is the thing this page was already caught doing.
        */}
        <section className="mt-12 grid max-w-4xl gap-8 rounded-xl border border-line bg-white/50 p-6 md:grid-cols-[minmax(0,20rem)_1fr] md:items-center md:gap-10 md:p-8">
          {FOUNDER.photo ? (
            <Image
              src={FOUNDER.photo}
              alt={`${FOUNDER.name}, ${FOUNDER.role.toLowerCase()} of ${site.name}`}
              width={1024}
              height={1536}
              sizes="(min-width: 768px) 20rem, 100vw"
              className="w-full max-w-xs justify-self-center rounded-xl md:max-w-none"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex aspect-[2/3] w-full max-w-xs items-center justify-center justify-self-center rounded-xl bg-brand-indigo text-5xl font-semibold tracking-wide text-brass-bright"
            >
              {founderInitials()}
            </span>
          )}
          <div>
            <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
              {FOUNDER.role}
            </div>
            <h2 className="mt-1.5 text-2xl text-ink md:text-3xl">
              {FOUNDER.name}
            </h2>
            <p className="mt-3 text-lg text-ink/75">
              Founded the firm in {site.established} and still runs it from the
              shop in Chikoowadi.
            </p>
          </div>
        </section>

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

        {/*
          Every service, tool and article on the site carries one of these for
          answer engines, and About was the only section without. Facts only:
          the founder, the two dates, the registration, the areas, the services
          and the address. All of it is confirmed and all of it is stated
          elsewhere on the site, so nothing here can drift from the rest.
        */}
        <section className="mt-16 max-w-[68ch]">
          <h2 className="text-2xl text-ink md:text-3xl">Common questions</h2>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {ABOUT_FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-2 text-ink/75">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

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
