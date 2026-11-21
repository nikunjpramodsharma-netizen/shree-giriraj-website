import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { Reveal } from "@/components/Reveal";
import { JourneyRail } from "@/components/JourneyRail";
import { CountUp } from "@/components/motion/CountUp";
import { graph, breadcrumbNode, organizationNode, faqNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { site } from "@/lib/config";
import { AUTHOR, authorInitials } from "@/lib/author";
import { TEAM, TEAM_IS_REAL } from "@/lib/homepage-content";
import {
  STORY_IS_WRITTEN,
  STORY,
  FOUNDER,
  founderInitials,
  ABOUT_FAQS,
  ABOUT_ANSWER,
  JOURNEY,
} from "@/lib/about";

export const revalidate = 300;

const ABOUT_LOCALE = "en";

/** The seven services, as links. Notes restate the service pages. */
const ABOUT_SERVICES: { href: string; label: string; note: string }[] = [
  { href: "/services/resale-flats", label: "Buy or sell a resale flat", note: "the main business since 1996, with a free fair price opinion for sellers" },
  { href: "/services/rentals", label: "Rentals", note: "verified owners, societies that welcome you and a registered leave and licence agreement" },
  { href: "/services/new-project-bookings", label: "New project bookings", note: "launches in Borivali and Kandivali, with the MahaRERA record read with you" },
  { href: "/services/investment-advisory", label: "Investment advisory", note: "the pocket, the building and the rent worked out on the actual flat" },
  { href: "/services/commercial-plots", label: "Shops, offices and plots", note: "approved use, society rules and frontage checked first" },
  { href: "/services/mhada-paperwork", label: "MHADA paperwork", note: "transfers and no objection certificates, anywhere in Mumbai" },
  { href: "/services/interiors", label: "Interiors and civil work", note: "an itemised estimate first, and the society's permission handled" },
];

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
 * carried his one confirmed sentence and then the prompts he had yet to
 * answer; the story replaced them on 10 September 2026 and the page indexes.
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
    // 16 November 2026: the title leads with the local query the Google
    // Business Profile competes on ("real estate agency in Borivali West");
    // the description carries both dates, the founder and the registration.
    title: "About us: Borivali West real estate agency",
    description: `Family run real estate agency in Chikoowadi, Borivali West, in real estate since ${site.established}. Founded by ${FOUNDER.name}. MahaRERA ${site.rera}.`,
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
    { label: "MahaRERA registration", value: site.rera },
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
          <div className="eyebrow mt-8 text-bronze">About</div>
          <h1 className="mt-4 max-w-[17ch] text-4xl leading-[1.05] text-white md:text-6xl">
            In real estate since {site.established}.{" "}
            <span className="text-bronze">
              At the same office since {site.officeSince}.
            </span>
          </h1>
          <p className="mt-7 max-w-[54ch] text-lg text-paper/80">
            A family run real estate agency in Borivali West, working{" "}
            {site.areas.join(", ")}. Three suburbs, known building by building.
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

      {/* THE SHORT ANSWER. Who, since when, where and the registration, in
          one paragraph before the story. */}
      <section className="border-b border-line bg-white py-8 md:py-10">
        <div className="wrap">
          <div className="max-w-3xl border-l-4 border-bronze pl-5">
            <div className="eyebrow">The short answer</div>
            <p className="mt-2 text-lg leading-relaxed text-ink md:text-xl">{ABOUT_ANSWER}</p>
          </div>
        </div>
      </section>

      {!STORY_IS_WRITTEN && (
        <div className="wrap pt-8">
          <div className="rounded-xl border border-bronze/40 bg-bronze/10 px-5 py-4 text-sm text-ink">
            <b>Draft.</b> The facts on this page are real. The story is not
            written yet, so the page is noindexed until it is.
          </div>
        </div>
      )}

      {/*
        THE STORY. The founder's portrait pinned beside the firm's story,
        told in the third person on the owner's instruction (10 September
        2026). The sections come from about.ts, where the note on what they
        are built from and what they leave out lives.
      */}
      <section className="bg-paper-alt py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow">The founder</div>
              <h2 className="mt-3 text-3xl leading-tight text-ink md:text-5xl">
                Founded the firm in {site.established}.{" "}
                <span className="text-brand-blue">
                  Still leads it every day.
                </span>
              </h2>
              <p className="mt-4 max-w-[58ch] text-lg text-ink/70">
                {FOUNDER.name}, {FOUNDER.role.toLowerCase()} of {site.name}: the
                years behind the firm and the ones ahead of it.
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
                      className="flex h-full w-full items-center justify-center text-6xl font-semibold tracking-wide text-bronze"
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
                {/* The confirmed facts sit under the portrait, so the column
                    carries something on every screen instead of a blank. */}
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {facts.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">{f.label}</dt>
                      <dd className="text-right text-sm font-medium text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <div className="fw-body max-w-[62ch]">
              <Reveal>
                <p className="fw-open">
                  {FOUNDER.name} has worked these suburbs since{" "}
                  {site.established}, and from the same office in Chikoowadi
                  since {site.officeSince}. Long enough to know these buildings
                  from the inside.
                </p>
              </Reveal>

              <div className="mt-8 space-y-8">
                {STORY.map((s) => (
                  <Reveal key={s.heading}>
                    <section>
                      <h3 className="text-xl text-ink md:text-2xl">{s.heading}</h3>
                      <div className="mt-3">
                        {s.paragraphs.map((p) => (
                          <p key={p.slice(0, 40)}>{p}</p>
                        ))}
                      </div>
                    </section>
                  </Reveal>
                ))}
              </div>
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
              <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <div className="font-display text-5xl font-semibold text-brand-indigo md:text-6xl">
                  <CountUp value={new Date().getFullYear() - Number(site.established)} suffix=" years" duration={2200} />
                </div>
                <div className="text-sm text-muted">
                  in these suburbs, counted from {site.established}. {new Date().getFullYear() - Number(site.officeSince)} of them from the office in Chikoowadi.
                </div>
              </div>
            </div>
          </Reveal>
          <div className="mt-14 md:mt-20">
            <JourneyRail entries={JOURNEY} />
          </div>
        </div>
      </section>

      <div className="wrap pb-12">

        {/* THE AUTHOR. Every article is written by Nikunj Sharma, and the
            article markup points here (/about#nikunj-sharma) as the author's
            profile. Facts only from author.ts: name, role and the line the
            owner confirmed on 16 September 2026. No invented biography. */}
        <Reveal>
          <section id="nikunj-sharma" className="mb-16 max-w-[68ch] scroll-mt-24">
            <div className="eyebrow">Who writes the articles</div>
            <div className="mt-4 flex items-start gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-paper-alt">
                {AUTHOR.photo ? (
                  <Image src={AUTHOR.photo} alt={`${AUTHOR.name}, ${AUTHOR.role}, ${site.name}`} fill sizes="80px" className="object-cover" />
                ) : (
                  <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-xl font-semibold text-bronze-deep">
                    {authorInitials()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl text-ink md:text-3xl">{AUTHOR.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {AUTHOR.role}, marketing and sales, {site.name}
                </p>
                <p className="mt-3 text-ink/80">{AUTHOR.bio}</p>
                <p className="mt-3 text-ink/80">
                  <Link prefetch={false} href="/blog" className="text-brand-indigo underline underline-offset-4">
                    Read his articles
                  </Link>{" "}
                  on buying, selling, renting and MHADA paperwork.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* WHAT THE FIRM DOES, linked. The story names the seven services in
            prose; this is the same list as links, so a reader (and a crawler)
            can go straight from the firm to the service. */}
        <Reveal>
          <section className="max-w-[68ch]">
            <h2 className="text-2xl text-ink md:text-3xl">What Shree Giriraj does</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {ABOUT_SERVICES.map((sv) => (
                <li key={sv.href} className="py-3.5">
                  <Link prefetch={false} href={sv.href} className="font-semibold text-brand-indigo underline underline-offset-4">
                    {sv.label}
                  </Link>
                  <span className="text-ink/75">: {sv.note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-ink/75">
              New to the three suburbs? Read the{" "}
              <Link prefetch={false} href="/areas/borivali-west" className="text-brand-indigo underline underline-offset-4">Borivali West</Link>,{" "}
              <Link prefetch={false} href="/areas/kandivali" className="text-brand-indigo underline underline-offset-4">Kandivali</Link> and{" "}
              <Link prefetch={false} href="/areas/malad" className="text-brand-indigo underline underline-offset-4">Malad</Link>{" "}
              guides, or{" "}
              <Link prefetch={false} href="/contact" className="text-brand-indigo underline underline-offset-4">visit the office in Chikoowadi</Link>.
              Looking for a real estate agency near you? See us in{" "}
              <Link prefetch={false} href="/areas/borivali-west/real-estate-agency" className="text-brand-indigo underline underline-offset-4">Borivali West</Link>,{" "}
              <Link prefetch={false} href="/areas/kandivali/real-estate-agency" className="text-brand-indigo underline underline-offset-4">Kandivali West</Link> and{" "}
              <Link prefetch={false} href="/areas/malad/real-estate-agency" className="text-brand-indigo underline underline-offset-4">Malad West</Link>.
            </p>
          </section>
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
