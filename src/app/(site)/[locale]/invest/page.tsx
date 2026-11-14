import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import EnglishLink from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { PageWhatsApp } from "@/components/PageWhatsApp";
import { Rich } from "@/components/invest/Placeholder";
import { RateGapChart } from "@/components/invest/RateGapChart";
import { RateHistoryChart } from "@/components/invest/RateHistoryChart";
import { Timeline } from "@/components/invest/Timeline";
import rateHistory from "@/data/invest/rate-history.json";
import timeline from "@/data/invest/timeline.json";
import { graph, breadcrumbNode, faqNode } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";
import { site } from "@/lib/config";
import {
  INVEST_FAQS,
  INVESTOR_WHATSAPP,
  LIVE_GUIDES,
  MSG_PLACE,
  MSG_SHEET,
  investWaLink,
  schemaFaqs,
} from "@/lib/invest";

/*
 * English only, like /guides: one available locale, so the canonical carries
 * no hreflang cluster. Noindex and nofollow until the placeholders are gone.
 * The linking to do when it goes live is listed at the top of src/lib/invest.ts.
 */
export const revalidate = 300;

const LOCALE = "en";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale !== LOCALE) return {};
  return {
    title: "Invest in new launches in Borivali, Kandivali and Malad",
    description:
      "Book at the builder's launch rate in Borivali, Kandivali and Malad through developers we deal with directly. You own the unit. We run the deal. From ₹1 Cr.",
    robots: { index: false, follow: false },
    ...pageUrls(params.locale, "/invest", [LOCALE]),
  };
}

const AUDIENCE = [
  { who: "NRIs", what: "who own a flat back home and want a second one without flying in for it." },
  { who: "Business owners", what: "who trade in other things and have never done property." },
  { who: "Professionals", what: "with ₹1 to 2 Cr sitting in a fixed deposit." },
];

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "We send you the file.",
    body: "Two or three live launches. For each: the builder sheet, and the papers we have already checked.",
  },
  {
    n: "02",
    title: "You pick.",
    body: "We tell you which project and which floor we would take, and why. The choice is yours.",
  },
  {
    n: "03",
    title: "You book, in your own name.",
    body: "You pay the builder directly. [[PAYMENT_STRUCTURE_ONE_LINE]] The allotment letter is in your name. Money never passes through us.",
  },
  {
    n: "04",
    title: "We watch the sheet.",
    body: "As the builder revises their rate, we tell you where your unit stands and what a buyer would pay for it today.",
  },
  {
    n: "05",
    title: "You exit, or hold.",
    body: "Before possession we bring the buyer, run the transfer, and you take the difference. Or you hold to possession and we let the flat for you. Either way, the next launch sheet is already in your WhatsApp.",
  },
];

const CHECKS = [
  "MahaRERA registration certificate, checked against the MahaRERA website",
  "Title or search report from the builder's advocate, and the land document",
  "Commencement Certificate and IOD from BMC, and how many floors the CC covers",
  "BMC approved plans, so your unit is on the plan",
  "7/12 extract or property card for the plot",
  "The bank's NOC for sale of units, if the project is mortgaged",
  "For a redevelopment: the society's resolution, development agreement, and vacation status",
];

const WATCH = [
  {
    title: "The rate does not move.",
    body: "Markets go flat. You hold, and the flat is still yours, in a building we picked for resale demand. We let it at possession if you want.",
  },
  {
    title: "The builder is late.",
    body: "It happens. The agreement carries the RERA possession date and the remedies if they miss it. We chase.",
  },
  {
    title: "No buyer at exit.",
    body: "Our resale and rental business brings people looking in these three suburbs every week. That is the buyer pool. If the price we can get is not the price you want, you hold.",
  },
  {
    title: "You need out early.",
    body: "The allotment and agreement say how a transfer works and what the builder charges. We check that clause before you book, so you know the cost of changing your mind.",
  },
];

const h2 = "mt-3.5 text-3xl text-brand-indigo md:text-4xl";
const body = "text-[1.02rem] text-ink/85";

/** A link to a guide only when that guide is live; otherwise its words as plain text. */
function GuideRef({ text, href }: { text: string; href: string }) {
  if (!LIVE_GUIDES[href]) return <span className="text-muted">{text}</span>;
  return (
    <EnglishLink href={href} className="text-brand-indigo underline underline-offset-4">
      {text}
    </EnglishLink>
  );
}

function WaButton({ message, children }: { message: string; children: string }) {
  return (
    <a href={investWaLink(message)} target="_blank" rel="noopener" className="btn btn-wa">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 5 5.1-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.3-5-4.5-.1-.2-1.1-1.5-1.1-2.9s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 2 .9 2.1c.1.1.1.3 0 .5s-.2.4-.3.5l-.4.5c-.1.1-.3.3-.1.6s.6 1.1 1.4 1.8c1 .9 1.8 1.1 2.1 1.3s.4.1.6-.1.7-.8.9-1.1.4-.2.6-.1 1.5.7 1.8.9.4.2.5.3.1.6-.1 1.3z" />
      </svg>
      {children}
    </a>
  );
}

export default function InvestPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (locale !== LOCALE) notFound();

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Invest in new launches", path: "/invest" },
  ];
  const ex = rateHistory;

  return (
    <article>
      <JsonLd data={graph(breadcrumbNode(locale, trail), faqNode(schemaFaqs()))} />
      <PageWhatsApp message={MSG_SHEET} number={INVESTOR_WHATSAPP} />

      {/* Hero */}
      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/premium/u/tower-04.jpg"
          alt="A sea bridge in warm evening light with the skyline beyond"
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
          <h1 className="mt-6 max-w-[20ch] text-3xl text-white md:text-5xl">
            Buy at the builder&rsquo;s launch rate. Sell before possession.
          </h1>
          <p className="mt-5 max-w-[60ch] text-paper/80">
            Early allotments in Borivali, Kandivali and Malad through developers we deal with directly. You own the
            unit. We run the deal. A typical allocation is two or three units in a launch, around ₹3 to 5 Cr in
            total. Single units from ₹1 Cr.
          </p>
          <div className="mt-7">
            <WaButton message={MSG_SHEET}>Send me the current launch sheet</WaButton>
          </div>
          <p className="mt-6 text-sm text-paper/70">
            MahaRERA registered agency {site.rera} · In real estate since {site.established} · Office in Borivali West
            since {site.officeSince}
          </p>
        </div>
      </header>

      {/* Who this is for */}
      <section className="py-20">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className={h2}>Who this is for</h2>
            <p className="mt-3.5 text-[1.04rem] text-muted">
              People who have money to put to work and have never bought at launch. Usually one of three:
            </p>
          </div>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {AUDIENCE.map((a) => (
              <li key={a.who} className="rounded-xl border border-line bg-paper-alt p-6">
                <div className="font-display text-xl text-brand-indigo">{a.who}</div>
                <p className="mt-2 text-sm text-ink/80">{a.what}</p>
              </li>
            ))}
          </ul>
          <p className={`mt-8 max-w-[68ch] ${body}`}>
            You do not need to know how a launch works. That is the job. You need to be comfortable with a two to
            three year horizon and with saying yes on WhatsApp.
          </p>
        </div>
      </section>

      {/* The gap */}
      <section className="bg-paper-alt py-20">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className={h2}>The gap we work in</h2>
          </div>
          <p className={`mt-4 max-w-[68ch] ${body}`}>
            A builder&rsquo;s rate at launch is the lowest the building will see. The builder revises it upward at
            construction milestones. The rate we book at sits below the public sheet because we bring several
            bookings at once and have dealt with these builders for years.
          </p>
          <div className="mt-8">
            <RateGapChart />
          </div>
        </div>
      </section>

      {/* How a cycle works. Same numbered rail style as the homepage checks block. */}
      <section className="py-20">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className={h2}>How a cycle works</h2>
          </div>
          <ol className="mt-10 grid gap-x-8 gap-y-2 md:grid-cols-5">
            {STEPS.map((s) => (
              <li key={s.n} className="border-t border-line pt-5">
                <span className="font-mono text-xs font-medium text-bronze-deep">{s.n}</span>
                <h3 className="mt-2 font-display text-lg text-brand-indigo">{s.title}</h3>
                <p className="mt-2 pb-5 text-[0.95rem] text-muted">
                  <Rich text={s.body} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What we check */}
      <section className="bg-paper-alt py-20">
        <div className="wrap grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <div>
            <h2 className={h2}>What we check before anyone pays</h2>
            <p className={`mt-4 ${body}`}>
              The risk in a new project is in the builder and the papers, not the flat. So we read the file first.
              For every project on this page we hold:
            </p>
            <p className={`mt-4 ${body}`}>
              If a builder is slow with any of these, we tell you, and we tell you what we think it means.
            </p>
          </div>
          <ul className="space-y-3">
            {CHECKS.map((c) => (
              <li key={c} className="flex gap-3 rounded-xl border border-line bg-paper p-4 text-[0.97rem] text-ink/85">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-bronze" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Worked example */}
      <section className="py-20">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className={h2}>A worked example</h2>
          </div>
          <p className={`mt-4 max-w-[68ch] ${body}`}>
            This is an illustration built on the actual price revisions of <Rich text={ex.project} />, a project in{" "}
            <Rich text={ex.location} /> launched in <Rich text={ex.launched} />. It is not a client&rsquo;s story and
            is not a prediction.
          </p>
          <div className="mt-8">
            <RateHistoryChart />
          </div>
          <p className={`mt-6 max-w-[68ch] ${body}`}>
            On a <Rich text={ex.carpetArea} /> sq ft unit booked at launch, the sheet moved from ₹
            <Rich text={ex.totalAtLaunch} /> to ₹<Rich text={ex.totalAtMilestone} /> over <Rich text={ex.months} />{" "}
            months. From that you subtract the builder&rsquo;s transfer fee, stamp duty and registration if the
            agreement was registered, and our exit brokerage, and what is left is the gain. We show you this
            arithmetic on the real project before you book.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-paper-alt py-20">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className={h2}>The timeline, in the builder&rsquo;s own dates</h2>
          </div>
          <div className="mt-10">
            <Timeline />
          </div>
          <p className={`mt-8 max-w-[68ch] ${body}`}>
            For <Rich text={timeline.project} />: plinth <Rich text={timeline.stages[0].date} />,{" "}
            <Rich text={timeline.stages[1].label} /> <Rich text={timeline.stages[1].date} />, top slab{" "}
            <Rich text={timeline.stages[2].date} />, target OC <Rich text={timeline.stages[3].date} />. The
            builder&rsquo;s sheet usually moves at these points. The window we would look to exit in is{" "}
            <Rich text={timeline.exitWindow} />. These are the builder&rsquo;s dates, and buildings run late, so treat
            them as a plan, not a promise.
          </p>
        </div>
      </section>

      {/* What we watch */}
      <section className="py-20">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className={h2}>What we watch, and what we do</h2>
          </div>
          <dl className="mt-8 grid gap-5 md:grid-cols-2">
            {WATCH.map((w) => (
              <div key={w.title} className="rounded-xl border border-line bg-paper-alt p-6">
                <dt className="font-display text-lg text-brand-indigo">{w.title}</dt>
                <dd className="mt-2 text-[0.97rem] text-ink/80">{w.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How we earn, and what we do not do */}
      <section className="bg-paper-alt py-20">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <div>
            <h2 className={h2}>How we earn</h2>
            <p className={`mt-4 ${body}`}>
              Plainly: <Rich text="[[FEE_SENTENCE]]" />
            </p>
            <p className={`mt-4 ${body}`}>
              The builder paying us is why the booking costs you nothing extra. We say this up front because you will
              ask, and because it should not be a surprise later.
            </p>
          </div>
          <div>
            <h2 className={h2}>What we do not do</h2>
            <p className={`mt-4 ${body}`}>
              We do not hold your money. We do not promise a return. We do not arrange bookings where a builder takes
              more than the law allows without a registered agreement. We do not put you in a project whose file we
              have not read.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="common-questions" className="scroll-mt-24 py-20">
        <div className="wrap max-w-[68ch]">
          <h2 className={h2}>Common questions</h2>
          <dl className="mt-4">
            {INVEST_FAQS.map((f) => (
              <div key={f.question} className="border-b border-line py-4">
                <dt className="text-lg font-semibold text-brand-indigo">{f.question}</dt>
                <dd className="mt-1.5 text-[0.95rem] text-ink/80">
                  <Rich text={f.answer} />
                  {f.link && (
                    <>
                      {" "}
                      <GuideRef text={f.link.text} href={f.link.href} />
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* New to this, then start with one message */}
      <section className="bg-paper-alt py-20">
        <div className="wrap grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className={h2}>If you are new to all of this</h2>
            <p className={`mt-4 ${body}`}>
              Start with our{" "}
              <EnglishLink
                href="/blog/how-to-invest-in-real-estate-india"
                className="text-brand-indigo underline underline-offset-4"
              >
                first investor&rsquo;s guide to property in Borivali, Kandivali and Malad
              </EnglishLink>
              , which compares a flat, a shop, a new project and a REIT. Then{" "}
              <EnglishLink
                href="/blog/best-area-to-invest-in-mumbai"
                className="text-brand-indigo underline underline-offset-4"
              >
                the pockets compared
              </EnglishLink>
              . This page is the next step after those.
            </p>

            <div className="mt-12">
              <h2 className="text-3xl text-brand-indigo md:text-4xl">Start with one message</h2>
            </div>
            <p className={`mt-4 ${body}`}>
              Tell us roughly what you want to place and whether you are in India or abroad. We reply with the
              current sheet on two launches, usually the same day.
            </p>
            <div className="mt-6">
              <WaButton message={MSG_PLACE}>Send me the current launch sheet</WaButton>
            </div>
            <p className={`mt-6 text-sm text-muted`}>
              Or call <Rich text="[[INVESTOR_PHONE]]" />. Office: {site.address}.
            </p>
          </div>
          <ContactCTA
            locale={locale}
            formLocation="invest"
            tone="light"
            presetIntentKey="intentInvest"
            whatsappNumber={INVESTOR_WHATSAPP}
          />
        </div>
      </section>
    </article>
  );
}
