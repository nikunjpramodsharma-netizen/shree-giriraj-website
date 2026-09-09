import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { Reveal } from "@/components/Reveal";
import { JourneyRail } from "@/components/JourneyRail";
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
  JOURNEY,
} from "@/lib/about";

export const revalidate = 300;

const ABOUT_LOCALE = "en";

/**
 * /about.
 *
 * Rebuilt on 9 September 2026 with the About page of nextyn.com as the model,
 * at the owner's request. The shape is theirs: a full height hero over a
 * drifting ground, a foreword with the founder's portrait pinned beside the
 * letter, a journey rail that fills as the reader scrolls and lights each
 * date as it reaches it, then the facts and the questions. The tokens are
 * ours: indigo and brass on paper, Geist, the same buttons and eyebrow every
 * other page uses. Nothing of Nextyn's palette or type crosses over.
 *
 * The factual spine is real: in property since 1996, at this office since
 * 2005, the founder's name, the MahaRERA agent number, the address, the three
 * suburbs. The story is not, because it is the owner's to tell, so the letter
 * carries his one confirmed sentence and then the prompts he has yet to
 * answer, visibly marked, and the page stays noindexed until they are.
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
    description: `A family run estate agency working across ${site.areas.join(", ")}. Founded by ${FOUNDER.name}. MahaRERA registered agent, ${site.rera}.`,
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
    { label: "In real estate since", value: site.established },
    { label: "At this office since", value: site.officeSince },
    { label: "MahaRERA agent", value: site.rera },
    { label: "Core areas", value: site.areas.join(", ") },
  ];

  const founderAlt = `${FOUNDER.name}, ${FOUNDER.role.toLowerCase()} of ${site.name}`;

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
        HERO. Full height, the headline carrying the whole idea of the page.

        The ground is three blurred lobes of the brand's own indigo, blue and
        brass drifting over deep indigo, with the Mumbai skyline ghosting
        through at low opacity so it still reads as a place rather than a
        poster, and a grain on top so the gradient does not look like a
        gradient. All of it moves by transform only and stops under reduced
        motion. See globals.css, ABOUT PAGE MOTION.

        The two sentences of the h1 are the two confirmed dates, and nothing
        else. The second takes the brass, the way Nextyn's second sentence
        takes their accent.
      */}
      <header className="relative isolate overflow-hidden bg-brand-indigo-deep text-paper">
        <div className="about-mesh" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <Image
          src="/sections/about-suburbs.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30 mix-blend-luminosity"
        />
        <span className="grain" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 24% 46%, rgba(21,27,61,.55) 0%, rgba(21,27,61,.25) 56%, rgba(21,27,61,0) 88%), linear-gradient(180deg, rgba(21,27,61,.35) 0%, rgba(21,27,61,0) 40%, rgba(21,27,61,.75) 100%)",
          }}
        />
        <div className="wrap relative z-10 flex min-h-[78vh] flex-col justify-center py-24 md:py-32">
          <Breadcrumbs trail={trail} tone="dark" />
          <div className="eyebrow mt-8 text-brass-bright">About</div>
          <h1 className="mt-4 max-w-[17ch] text-4xl leading-[1.05] text-white md:text-6xl">
            In real estate since {site.established}.{" "}
            <span className="text-brass-bright">
              In the same shop since {site.officeSince}.
            </span>
          </h1>
          <p className="mt-7 max-w-[54ch] text-lg text-paper/80">
            A family run agency in Borivali West, working{" "}
            {site.areas.join(", ")}. We would rather know three suburbs properly
            than claim to cover the city.
          </p>
          <div className="about-legend mt-12">
            <span>{site.established}</span>
            <i />
            <b>Today</b>
            <i />
            <span>{site.areas.join(" · ")}</span>
          </div>
        </div>
      </header>

      {!STORY_IS_WRITTEN && (
        <div className="wrap pt-8">
          <div className="rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink">
            <b>Draft.</b> The facts on this page are real. The story is not
            written yet, so the page is noindexed until it is.
          </div>
        </div>
      )}

      {/*
        FOREWORD. The founder's portrait pinned beside his letter.

        The letter is the part only he can write. Until he does, the body is
        his one confirmed sentence followed by the prompts he has yet to
        answer, each visibly marked, sitting exactly where the prose will go.
        That is a more honest draft than lorem ipsum in his voice, and it
        means the layout is finished the day the words arrive.
      */}
      <section className="bg-paper-alt py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow">From the founder</div>
              <h2 className="mt-3 text-3xl leading-tight text-ink md:text-5xl">
                Founded the firm in {site.established}.{" "}
                <span className="text-brand-blue">
                  Still runs it from the shop.
                </span>
              </h2>
              <p className="mt-4 max-w-[58ch] text-lg text-ink/70">
                {FOUNDER.name}, {FOUNDER.role.toLowerCase()}, on the years
                behind {site.name} and the ones ahead of it.
              </p>
            </div>
          </Reveal>

          <div className="fw mt-12">
            <Reveal>
              <div className="fw-side">
                <div className="fw-por">
                  {FOUNDER.photo ? (
                    <Image
                      src={FOUNDER.photo}
                      alt={founderAlt}
                      fill
                      sizes="(min-width: 900px) 21rem, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center text-6xl font-semibold tracking-wide text-brass-bright"
                    >
                      {founderInitials()}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-lg font-semibold text-ink">{FOUNDER.name}</div>
                  <div className="text-sm text-muted">
                    {FOUNDER.role}, {site.name}
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="fw-body max-w-[62ch]">
              <Reveal>
                <p className="fw-open">
                  We have worked these suburbs since {site.established}, and out
                  of the same shop in Chikoowadi since {site.officeSince}. That
                  is long enough to have sold flats in the same building twice,
                  and to remember why the second sale was harder than the first.
                </p>
              </Reveal>

              {!STORY_IS_WRITTEN && (
                <div className="mt-10 space-y-8">
                  {STORY_PROMPTS.map((s) => (
                    <Reveal key={s.heading}>
                      <section className="rounded-xl border border-dashed border-brass/50 bg-paper/60 p-6">
                        <div className="flex items-baseline gap-3">
                          <h3 className="text-xl text-ink/80 md:text-2xl">
                            {s.heading}
                          </h3>
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
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/*
        THE JOURNEY. A rail that fills as the reader scrolls, with a dated
        entry lighting as the fill reaches it. Three rows, because the firm
        has exactly three things it can date and stand behind. See about.ts.
      */}
      <section className="py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow">The journey</div>
              <h2 className="mt-3 text-3xl leading-tight text-ink md:text-5xl">
                Two dates, three suburbs,{" "}
                <span className="text-brand-blue">one address.</span>
              </h2>
              <p className="mt-4 max-w-[58ch] text-lg text-ink/70">
                Everything on this rail is a matter of record. When there is
                more to tell, it goes here in order.
              </p>
            </div>
          </Reveal>
          <div className="mt-14 md:mt-20">
            <JourneyRail entries={JOURNEY} />
          </div>
        </div>
      </section>

      <div className="wrap pb-12">
        {/* Verified facts. Every one of these is confirmed, not inferred. */}
        <Reveal>
          <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-paper p-5">
                <dt className="text-xs uppercase tracking-wider text-muted">
                  {f.label}
                </dt>
                <dd className="mt-1 text-lg text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

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
        <Reveal>
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
        </Reveal>

        <Reveal>
          <div className="mt-16 max-w-[68ch] rounded-xl border border-line p-5">
            <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
              Where to find us
            </div>
            <p className="mt-2 text-ink">{site.address}</p>
            <p className="mt-1 text-sm text-muted">
              The complex is also known locally as Garden Groove Shopping Centre.
            </p>
          </div>
        </Reveal>
      </div>

      <ContactCTA locale={locale} formLocation="about" />
    </article>
  );
}
