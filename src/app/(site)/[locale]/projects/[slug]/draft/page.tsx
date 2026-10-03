import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { JJ } from "@/lib/projects/jaswanti-jewel";
import { site, waLink } from "@/lib/config";
import { CountUp } from "@/components/motion/CountUp";
import { StickyBar } from "@/components/motion/StickyBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { PageWhatsApp } from "@/components/PageWhatsApp";
import {
  AmenityCards,
  FloorPlanTabs,
  HeroMedia,
  ImgNote,
  PhotoGrid,
  SectionNav,
  StoryScroll,
  TowerClimb,
  TravelRings,
} from "@/components/project/ProjectInteractive";

/**
 * DRAFT of the new project page template (plan/10-project-page-plan.md),
 * built for Jaswanti Jewel so the owner can judge the look before the
 * developer's high resolution files arrive. Noindexed, linked from nowhere,
 * English only. When approved it replaces /projects/jaswanti-jewel.
 */

export const metadata: Metadata = {
  title: { absolute: "DRAFT Jaswanti Jewel Kandivali West | Shree Giriraj" },
  robots: { index: false, follow: false },
};

const WA_PRICE = `Hi Shree Giriraj, I am interested in Jaswanti Jewel. Please send today's price sheet and available floors for a ___ BHK.`;
const WA_VISIT = `Hi Shree Giriraj, I would like to visit the Jaswanti Jewel sample flat. I am free on ___.`;

function WaIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 5 5.1-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.3-5-4.5-.1-.2-1.1-1.5-1.1-2.9s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 2 .9 2.1c.1.1.1.3 0 .5s-.2.4-.3.5l-.4.5c-.1.1-.3.3-.1.6s.6 1.1 1.4 1.8c1 .9 1.8 1.1 2.1 1.3s.4.1.6-.1.7-.8.9-1.1.4-.2.6-.1 1.5.7 1.8.9.4.2.5.3.1.6-.1 1.3z" />
    </svg>
  );
}

function SectionHead({ eyebrow, title, intro, dark = false }: { eyebrow: string; title: string; intro?: string; dark?: boolean }) {
  return (
    <div className="mb-10 max-w-2xl">
      <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${dark ? "text-bronze" : "text-bronze-deep"}`}>{eyebrow}</div>
      <h2 className={`mt-3 font-display text-3xl leading-tight md:text-5xl ${dark ? "text-white" : "text-brand-indigo"}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg ${dark ? "text-paper/75" : "text-ink/75"}`}>{intro}</p>}
    </div>
  );
}

export default async function ProjectDraft({ params }: { params: { locale: string; slug: string } }) {
  if (params.slug !== JJ.slug || params.locale !== "en") notFound();
  const qr = await QRCode.toString(JJ.reraUrl, { type: "svg", margin: 1, color: { dark: "#151b3d", light: "#ffffff" } });

  return (
    <article className="bg-paper">
      <PageWhatsApp message={WA_PRICE} />

      <div className="fixed left-3 top-[4.4rem] z-50 rounded-full bg-brand-red px-3 py-1 text-[0.65rem] font-semibold text-white shadow-lg md:bottom-6 md:left-6 md:top-auto md:px-4 md:py-1.5 md:text-xs">
        Draft for review, not published
      </div>

      {/* 1. HERO */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-brand-indigo-deep text-paper md:min-h-[94vh]">
        <HeroMedia still={JJ.story[0].img} loop="/projects/jaswanti-jewel/hero-loop.mp4" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo-deep via-brand-indigo-deep/55 to-brand-indigo-deep/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-indigo-deep/80 via-transparent to-transparent" />
        <span className="absolute right-4 top-24 hidden text-[0.6rem] uppercase tracking-wider text-white/60 md:block">Artist&apos;s impression</span>
        <span className="absolute right-4 top-[4.6rem] text-[0.6rem] uppercase tracking-wider text-white/60 md:hidden">Sample flat, shot on location</span>
        <div className="wrap relative w-full pb-8 pt-24 md:pb-14 md:pt-40">
          <Breadcrumbs tone="dark" trail={[{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }, { name: JJ.name, path: `/projects/${JJ.slug}` }]} />
          <div className="mt-4 flex flex-wrap gap-1.5 text-[0.7rem] font-semibold md:mt-6 md:gap-2 md:text-xs">
            <span className="rounded-full bg-bronze px-3 py-1 text-brand-indigo-deep">Possession from {JJ.possession.developer}</span>
            <span className="rounded-full border border-white/30 px-3 py-1 text-white/85">MahaRERA possession {JJ.possession.rera}</span>
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-[2.6rem] leading-[1.02] text-white md:mt-5 md:text-7xl xl:text-[5.5rem]">{JJ.name}</h1>
          <p className="mt-2 text-base text-paper/85 md:mt-3 md:text-lg">{JJ.locality}</p>
          <p className="mt-4 hidden max-w-xl text-lg text-paper/75 md:block xl:text-xl">{JJ.heroLine}</p>
          <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3 md:mt-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-paper/60">2, 3, 4 and 5 BHK from</div>
              <div className="font-display text-[2.4rem] leading-none text-bronze md:text-5xl xl:text-6xl">{JJ.startingPrice}</div>
              <div className="text-xs text-paper/60">All inclusive, prices as of {JJ.priceAsOf}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-7 md:flex md:flex-wrap md:gap-3">
            <a href={waLink(WA_PRICE)} target="_blank" rel="noopener" className="btn btn-wa col-span-2 justify-center md:col-span-1">
              <WaIcon /> Get the price sheet on WhatsApp
            </a>
            <a href={waLink(WA_VISIT)} target="_blank" rel="noopener" className="btn btn-bronze justify-center px-3">
              Book a site visit
            </a>
            <a href={`tel:${site.phonePrimary}`} className="btn justify-center border-white/40 px-3 text-white hover:bg-white hover:text-black">
              Call us
            </a>
          </div>
          <div className="mt-5 flex items-center gap-3 text-xs text-paper/70 md:mt-8">
            <span className="h-14 w-14 shrink-0 overflow-hidden rounded bg-white p-1" dangerouslySetInnerHTML={{ __html: qr }} />
            <span>
              MahaRERA Reg. No. <b className="text-white">{JJ.rera}</b>
              <br />
              {JJ.reraUrl.replace("https://", "")}
            </span>
          </div>
        </div>
      </section>

      <SectionNav
        cta={{ href: waLink(WA_PRICE), label: "Price sheet on WhatsApp" }}
        items={[
          { id: "overview", label: "Overview" },
          { id: "amenities", label: "Amenities" },
          { id: "sample-flat", label: "Sample flat" },
          { id: "prices", label: "Prices" },
          { id: "floor-plans", label: "Floor plans" },
          { id: "location", label: "Location" },
          { id: "paperwork", label: "Possession and RERA" },
          { id: "questions", label: "Questions" },
        ]}
      />

      {/* 2. AT A GLANCE */}
      <section className="border-t border-white/10 bg-brand-indigo-deep text-paper">
        <div className="wrap grid grid-cols-2 gap-y-8 py-10 md:grid-cols-5">
          {JJ.glance.map((g) => (
            <div key={g.label} className="text-center md:border-l md:border-white/10 md:first:border-0">
              <div className="font-display text-3xl text-bronze md:text-4xl">
                {"value" in g && typeof g.value === "number" ? <CountUp value={g.value} prefix={g.prefix ?? ""} suffix={g.suffix ?? ""} /> : g.text}
              </div>
              <div className="mx-auto mt-1 max-w-[12rem] text-xs uppercase tracking-wider text-paper/60">{g.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. OUR VIEW */}
      <section id="overview" className="scroll-mt-32 py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl lg:aspect-[4/5]">
            <Image src="/projects/jaswanti-jewel/balcony-living.webp" alt="Living room opening onto a wide balcony with city views" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <ImgNote note="Artist's impression" />
          </div>
          <div>
            <SectionHead eyebrow="Our view" title="A new tower, ready in months, not years" />
            <span className="mb-4 inline-block rounded bg-brand-red/10 px-2 py-0.5 text-[0.7rem] font-semibold text-brand-red">Draft: for the owner to correct</span>
            <p className="text-lg text-ink/80"><b className="text-brand-indigo">Who it suits.</b> {JJ.view.suits}</p>
            <ul className="mt-6 space-y-3">
              {JJ.view.standsOut.map((s) => (
                <li key={s} className="flex gap-3 text-ink/85">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze/20 text-xs text-bronze-deep">✓</span>
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-7 rounded-r-xl border-l-[3px] border-bronze bg-paper-alt px-5 py-4 text-ink/80">
              <b className="text-brand-indigo">Worth knowing.</b> {JJ.view.worthKnowing}
            </div>
          </div>
        </div>
      </section>

      {/* 4. A DAY AT JASWANTI JEWEL */}
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <SectionHead dark eyebrow="A day at Jaswanti Jewel" title="From the pathway to the pool, 390 feet up" />
          <StoryScroll steps={JJ.story} />
        </div>
      </section>

      {/* 5. AMENITIES, with the tower climbing beside them */}
      <section id="amenities" className="relative scroll-mt-32 bg-[#10142e] py-20 text-paper">
        <div className="wrap flex gap-10">
          <TowerClimb markers={[{ floor: 1, label: "Lobby" }, { floor: 37, label: "Club, 37th" }, { floor: 38, label: "Rooftop" }]} />
          <div className="min-w-0 flex-1">
            <SectionHead dark eyebrow="Amenities" title="Ready by March 2027, at handover" intro="Every amenity is ready when you move in, not years later. The club sits on the 37th floor and the pool on the rooftop." />
            <AmenityCards groups={JJ.amenityGroups} />
            <div className="mt-10 flex flex-wrap gap-2">
              {JJ.alsoIncluded.map((a) => (
                <span key={a} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-paper/80">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SAMPLE FLAT */}
      <section id="sample-flat" className="scroll-mt-32 py-20">
        <div className="wrap">
          <SectionHead eyebrow="The sample flat" title="Walk through it before you visit" intro="Filmed in the furnished sample flat. Tap play for the full walkthrough, then come and see it in person." />
          <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
            <div className="mx-auto w-[280px] rounded-[2.4rem] border-[10px] border-brand-indigo-deep bg-black shadow-2xl">
              <video className="aspect-[9/16] w-full rounded-[1.7rem] object-cover" src={JJ.sampleFlat.video} poster={JJ.sampleFlat.poster} controls playsInline preload="none" />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {JJ.sampleFlat.stills.map((s) => (
                  <div key={s.src} className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <Image src={s.src} alt={s.alt} fill sizes="(min-width: 1024px) 15vw, 40vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Stills from the sample flat walkthrough.</p>
            </div>
          </div>
          <div className="mt-14">
            <h3 className="mb-5 font-display text-2xl text-brand-indigo">More of the sample flat</h3>
            <PhotoGrid images={JJ.sampleFlat.gallery} />
          </div>
        </div>
      </section>

      {/* 7. PRICES */}
      <section id="prices" className="scroll-mt-32 bg-white py-20">
        <div className="wrap">
          <SectionHead eyebrow="Prices and availability" title={`From ${JJ.startingPrice}, all inclusive`} intro={`Prices as of ${JJ.priceAsOf}, on RERA carpet area. Ask us for today's floor wise availability.`} />
          <div className="space-y-3 md:hidden">
            {JJ.prices.map((p, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3.5">
                <div>
                  <div className="font-semibold text-brand-indigo">{p.config}</div>
                  <div className="mt-0.5 text-sm text-ink/70">
                    {p.carpet ? `${p.carpet.toLocaleString("en-IN")} sq ft` : "Size on request"} · {p.floor}
                    {"confirm" in p && p.confirm && <span className="ml-1.5 rounded bg-brand-red/10 px-1 py-0.5 text-[0.6rem] font-semibold text-brand-red">confirm</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl text-bronze-deep">{p.price}</div>
                  <div className="text-[0.7rem] font-semibold text-whatsapp">{p.status}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-hidden rounded-xl border border-line md:block">
            <table className="w-full text-left">
              <thead className="bg-brand-indigo text-sm text-white">
                <tr>
                  <th className="px-5 py-3 font-semibold">Home</th>
                  <th className="px-5 py-3 font-semibold">Carpet area</th>
                  <th className="px-5 py-3 font-semibold">Floor</th>
                  <th className="px-5 py-3 font-semibold">All inclusive price</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {JJ.prices.map((p, i) => (
                  <tr key={i} className="border-t border-line text-ink">
                    <td className="px-5 py-4 font-semibold text-brand-indigo">{p.config}</td>
                    <td className="px-5 py-4">
                      {p.carpet ? `${p.carpet.toLocaleString("en-IN")} sq ft` : "On request"}
                      {"confirm" in p && p.confirm && <span className="ml-2 rounded bg-brand-red/10 px-1.5 py-0.5 text-[0.65rem] font-semibold text-brand-red">confirm</span>}
                    </td>
                    <td className="px-5 py-4 text-ink/75">{p.floor}</td>
                    <td className="px-5 py-4 font-display text-lg text-bronze-deep">{p.price}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-whatsapp/10 px-2.5 py-1 text-xs font-semibold text-whatsapp">{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[JJ.rates.lower, JJ.rates.upper, `Floor rise: ${JJ.rates.floorRise}`].map((r) => (
              <div key={r} className="rounded-xl bg-paper px-5 py-4 text-sm text-ink/80">{r}</div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-brand-indigo p-6 text-paper md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-display text-xl text-white">Flexible payment plans available</div>
              <p className="mt-1 text-sm text-paper/75">The developer offers flexible plans. Tell us what suits you and we will share the options.</p>
            </div>
            <a href={waLink(WA_PRICE)} target="_blank" rel="noopener" className="btn btn-wa shrink-0">
              <WaIcon /> Get today&apos;s price sheet
            </a>
          </div>
        </div>
      </section>

      {/* 8. FLOOR PLANS */}
      <section id="floor-plans" className="scroll-mt-32 bg-paper-alt py-20">
        <div className="wrap">
          <SectionHead eyebrow="Floor plans" title="Six foot balconies, three lifts, every floor" intro="RERA carpet areas from the developer's floor plans. Jodi homes combine two adjoining flats into one." />
          <FloorPlanTabs plans={JJ.floorPlans} />
        </div>
      </section>

      {/* 9. LOCATION */}
      <section id="location" className="relative scroll-mt-32 overflow-hidden bg-brand-indigo-deep py-20 text-paper">
        <Image src="/projects/jaswanti-jewel/kandivali-aerial.webp" alt="Aerial view of Mumbai's western suburbs" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="wrap relative">
          <SectionHead dark eyebrow="Location" title="Off M. G. Road, minutes from the metro" intro="A few minutes from Dahanukarwadi Metro and Link Road. Message us and we will take you to the site." />
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <TravelRings times={JJ.location.times} />
            <div>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <iframe title="Kandivali West around Dahanukarwadi Metro" src={JJ.mapEmbed} className="h-72 w-full" loading="lazy" />
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {JJ.location.nearby.map((g) => (
                  <div key={g.group}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-bronze">{g.group}</div>
                    <ul className="mt-2 space-y-1 text-sm text-paper/80">
                      {g.items.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 and 11. PROGRESS, MAHARERA AND PAPERWORK */}
      <section id="paperwork" className="scroll-mt-32 py-20">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Construction" title="Built to the 37th floor, handover next" />
            <ol className="relative ml-3 border-l-2 border-bronze/40">
              {JJ.progress.map((p, i) => (
                <li key={p.when} className="mb-8 ml-6">
                  <span className={`absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-bronze ${i < 2 ? "bg-bronze" : "bg-paper"}`} />
                  <div className="text-xs font-semibold uppercase tracking-wider text-bronze-deep">{p.when}</div>
                  <div className="mt-1 text-lg text-ink">{p.what}</div>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted">Construction figures from the developer&apos;s environmental compliance report of June 2026.</p>
          </div>
          <div className="rounded-2xl bg-brand-indigo p-8 text-paper">
            <SectionHead dark eyebrow="MahaRERA and paperwork" title="Checked with you before you book" />
            <div className="flex items-center gap-4">
              <span className="h-24 w-24 shrink-0 overflow-hidden rounded bg-white p-1.5" dangerouslySetInnerHTML={{ __html: qr }} />
              <div className="text-sm text-paper/80">
                MahaRERA Reg. No.
                <div className="font-display text-2xl text-white">{JJ.rera}</div>
                {JJ.reraUrl.replace("https://", "")}
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-paper/85">
              {["The MahaRERA registration and possession date", "The commencement certificate and title report", "The scheme's approvals and any cases on the MahaRERA record", "The agreement draft, before you sign"].map((c) => (
                <li key={c} className="flex gap-2"><span className="text-bronze">✓</span>{c}</li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg bg-white/5 p-4 text-sm text-paper/75">
              <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-brand-red">Draft line, owner to approve</span>
              {JJ.view.worthKnowing}
            </p>
          </div>
        </div>
      </section>

      {/* 12. DEVELOPER and 13. WHY THROUGH US */}
      <section className="bg-paper-alt py-20">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="The developer" title="An established Mumbai developer" intro="Built by a developer with more than 30 years in Mumbai real estate. Ask us anything about their track record and we will answer it." />
            <div className="grid grid-cols-3 gap-4">
              {JJ.developerFacts.map((f) => (
                <div key={f.label} className="rounded-xl bg-white p-5 text-center shadow-sm">
                  <div className="font-display text-3xl text-brand-indigo"><CountUp value={f.value} suffix={f.suffix ?? ""} /></div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHead eyebrow="Why book through us" title="The same home, with someone on your side" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Site visit, arranged", "We book the sample flat visit and come with you."],
                ["Paperwork checked", "MahaRERA, approvals and the agreement, before your token."],
                ["Loan and registration", "Help with the home loan, stamp duty and registration."],
                ["After you book", "One call away until you have the keys, since 1996."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl bg-white p-5 shadow-sm">
                  <div className="font-semibold text-brand-indigo">{t}</div>
                  <p className="mt-1 text-sm text-ink/70">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">MahaRERA registered agent {site.rera}.</p>
          </div>
        </div>
      </section>

      {/* 14. QUESTIONS */}
      <section id="questions" className="scroll-mt-32 py-20">
        <div className="wrap max-w-3xl">
          <SectionHead eyebrow="Questions" title="Jaswanti Jewel, answered" />
          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {JJ.faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-indigo">
                  {f.q}
                  <span className="text-xl text-bronze transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 16. FINAL CALL */}
      <section className="relative overflow-hidden bg-brand-indigo-deep py-20 text-paper">
        <Image src="/projects/jaswanti-jewel/infinity-pool.webp" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="wrap relative text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl text-white md:text-5xl">Tell us the size and floor you want</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-paper/80">We will send today&apos;s availability and prices on WhatsApp, usually the same day. No obligation.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={waLink(WA_PRICE)} target="_blank" rel="noopener" className="btn btn-wa"><WaIcon /> WhatsApp us</a>
            <a href={waLink(WA_VISIT)} target="_blank" rel="noopener" className="btn btn-bronze">Book a site visit</a>
          </div>
        </div>
      </section>

      <ContactCTA locale={params.locale} formLocation="project-jaswanti-jewel-draft" presetIntentKey="intentNewProject" presetArea="Kandivali West" />

      <p className="wrap py-6 text-[0.7rem] leading-relaxed text-muted">
        Renders are artist&apos;s impressions and floor plans are indicative, from the developer. Prices, availability and possession dates are as shared by the developer in {JJ.priceAsOf} and may change; please confirm before booking. MahaRERA Reg. No. {JJ.rera}, {JJ.reraUrl.replace("https://", "")}.
      </p>

      <StickyBar message={WA_PRICE} waLabel="Price sheet" callLabel="Call" />
    </article>
  );
}
