import { parseBlocks, type Block } from "@/lib/markdown";
import { REPO_SERVICE_LOCALES } from "@/lib/service-content-locales";
import { CORE_SERVICES } from "@/lib/service-content-core";

/**
 * Service pages whose body lives in this repo rather than in Sanity.
 *
 * WHY THIS EXISTS
 *
 * The other five service pages pull their body from a Sanity `page` document,
 * which is right for prose the owner may want to edit without a deploy. This
 * one could not: there is no SANITY_API_WRITE_TOKEN in the environment, and
 * the route calls notFound() when no document matches, so a code-only service
 * would have been a 404 no matter what was written around it.
 *
 * The trade is explicit. Investment advisory, commercial and MHADA paperwork are not editable in the Studio
 * until somebody creates the document there and this entry is deleted. In
 * exchange the copy is version controlled, reviewable in a diff, and testable,
 * which for a page making claims about money is arguably the better half of
 * the trade anyway.
 *
 * WHAT MUST STAY TRUE OF ANYTHING ADDED HERE
 *
 * No projected returns, no appreciation percentages, no yield figures, and no
 * named under-construction project without its own MahaRERA number. The owner
 * confirmed on 8 September 2026 that no return figures are to be published,
 * and no citable third party source for western suburbs yields has been
 * verified. If a figure ever goes in, it carries its source inline.
 */

export type RepoService = {
  /** Matches the Sanity `page.title` field: used for the meta title. */
  title: string;
  heroHeading: string;
  heroSubheading: string;
  /**
   * The 40 to 60 word direct answer shown in a box under the hero, English
   * only. Answer engines and featured snippets lift the first plain answer on
   * a page, so it states who we are, what we do and one hard figure.
   */
  answer?: string;
  seoDescription: string;
  /** Markdown, parsed at render into the same blocks the blog uses. */
  body: string;
};

const INVESTMENT_ADVISORY_BODY = `
## Property investment advisory in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered agency, number A51800005726, at Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. We have worked in real estate since 1996, and from this office since 2005.

This service is for people buying here to hold rather than to live in. It covers Borivali West and East, Kandivali and Malad, and nothing else. Knowing each pocket closely is what makes the advice worth having. Thirty years of walking these buildings is what you are hiring.

## What you get

- **The pocket, read for you.** Why two buildings at the same rate behave differently, pocket by pocket.
- **The building, assessed.** Age, society, the land transfer to the society, water, parking and the lane itself: the things that hold resale value.
- **The realistic rent.** What the flat can earn today, and what that is as a share of the price asked. Worked out on the real flat, not quoted for the suburb.
- **Paperwork checked first.** Ownership, any loan or claim on the flat, and the society papers, all checked before money moves.
- **Handled end to end.** Negotiation, documents and registration.
- **A straight answer.** If a particular flat does not add up, we say so and find you one that does.

## Is real estate a good investment in Mumbai?

It can be a very good one. The western suburbs have rewarded patient owners for decades. A flat here pays you twice: rent while you hold it, and the sale price when you sell. You can measure the rent before you buy, and we do. The sale price depends on the building and the pocket more than the city. That is exactly where local knowledge earns its keep.

## What return should an investor expect?

We work it out on the flat in front of you, not as one number for the suburb. The rent you can get, the running costs and the price you negotiate decide the answer. They differ from one building to the next. You leave with two figures for the flat. Gross yield is a year's rent as a share of the price. Net yield is what is left after costs. Our [rental yield calculator](/tools/rental-yield-calculator) lets you test any other flat the same way.

## Why local knowledge decides the outcome here

Borivali splits between the station belt, older and better connected, and the Link Road side, newer and quieter. Kandivali has the widest choice of new flats in the belt. Malad has the Mindspace office district keeping rental demand steady. Inside each, the best buys are not on any listing. Which buildings have strong water on the upper floors. Which societies welcome tenants. Which lanes families choose. We know them because we have sold in these buildings, more than once.

## How to start

Tell us the budget, whether you are buying for rent or for resale, and how long you plan to hold. We tell you which suburb and pocket fit. We show you what is available this month, and what the numbers look like on anything you shortlist. No obligation, and usually the same day.

---

**A note on risk.** Property is a long term asset. Values and rents move, a flat takes time to sell, and buying and selling carry real costs. Nothing on this page is a promise of return or a substitute for independent financial advice.
`.trim();

const COMMERCIAL_PLOTS_BODY = `
## Commercial property in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered agency, number A51800005726, at Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. We have worked in real estate since 1996, and from this office since 2005.

We find shops, showrooms, offices and, when a genuine one comes up, plots. This is for two kinds of client: a business that needs premises here, and an investor buying a unit to let. Footfall, frontage and approved use decide whether a unit works. We know which stretch of which road suits which trade.

## What you get

- **Shops for sale and for rent** in Borivali, Kandivali and Malad, west and east. Each one matched to the footfall and frontage your business needs.
- **Office space** in Borivali West and Malad West, from a single unit to a small floor, to rent or to buy.
- **Showrooms and wide frontage units** on the main shopping roads.
- **Plots,** on the rare occasions a genuine one exists, for investors and small builders.
- **Use and title confirmed.** The approved use, the society's rules on business and the title, all checked before you commit. So the unit you take is one you can trade from.
- **Negotiated and registered.** The leave and licence agreement or the sale deed, negotiated and taken through registration.

## Shop for rent in Borivali West, Kandivali West or Malad West

Most commercial enquiries we take are for a shop to rent in one of these three. Most arrive with a budget and a trade, but not a stretch of road. The stretch is the decision. Tell us the trade, and we name the two or three stretches that see its customers. We also tell you what is free on them this month.

Offices work the same way. Being close to the station, to parking and to your clients matters more than the floor size. A first floor unit above the right row of shops is often the better office.

## Can residential property be used as commercial in Mumbai?

Generally no. A flat is approved for living in, and a shop or general office would change that approved use. Some professionals may use part of their own home for their practice, if the society's rules allow it. A business that brings customers through the door needs a unit approved for business, and we will find you one.

## Is it wise to invest in commercial property?

Commercial units usually offer stronger rental terms than flats. Leases run longer, deposits are larger, and the tenant commonly pays the running costs. There are fewer buyers when you sell, so it suits money that can stay invested. Buying to let rather than to use? Our [investment advisory](/services/investment-advisory) covers the numbers. The [rental yield calculator](/tools/rental-yield-calculator) shows the net figure before a viewing.

## How to start

Tell us the business or the investment, the budget, and any stretch you already have in mind. We come back with the two or three that fit, what is free on them now, and a viewing. No obligation, usually the same day.
`.trim();

const MHADA_PAPERWORK_BODY = `
## MHADA paperwork anywhere in Mumbai

Shree Giriraj Real Estate is a MahaRERA registered agency, number A51800005726, at Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. We have worked in real estate since 1996, and from this office since 2005.

MHADA is the Maharashtra Housing and Area Development Authority. A great many Mumbai flats were allotted through it, from Goregaon and Vikhroli to Kurla and Bandra. Each one needs permissions a privately built flat does not: before a sale, before a tenant, before a loan, and when the allottee dies.

Done properly, none of it is difficult. We prepare the complete file against the Board's own document list. We submit it to the right desk and follow it until it is decided. Every Mumbai Board file goes to the same office in Bandra East. So we take on flats in every suburb, and in the island city too.

## What you get

- **Transfer of tenement** with the Mumbai Board's Estate Manager. Tenement is MHADA's word for a flat, and the Estate Manager is the officer who handles transfers. For a sale, a gift within the family, or a transfer to a legal heir.
- **No objection certificate for sale,** with both the society's permission and the Board's.
- **No objection certificate for rent,** so the flat can be let with the Board's approval.
- **No objection certificate for a loan,** which a bank needs before it lends on a MHADA flat.
- **Transfer on death** of the original allottee, with the heirship papers the Board asks for.
- **Regularisation,** where a flat changed hands without the Board's permission. It brings the record in line with who owns the flat today.
- **Society paperwork** for MHADA layouts, including the lease and the land transfer papers a redevelopment will need.

## Can a MHADA flat be transferred to another person?

Yes. The Estate Management, Sale, Transfer and Exchange of Tenements Regulations, 1981 need the previous written permission of the Board and of the housing society. The society may permit a transfer once three things are true. Five years have passed since allotment. The buyer falls in the scheme's income group. And all dues are paid. With those in place the transfer is routine, and our file is built to meet each one the first time.

## What are the MHADA transfer fees?

This is the Mumbai Board's schedule for transfer of tenancy rights, as published on mhada.gov.in and checked on 9 September 2026.

| Income group | Charge per sq ft | Maximum charge |
| --- | --- | --- |
| Low Income Group (LIG) | ₹45 | ₹15,000 |
| Middle Income Group (MIG) | ₹55 | ₹25,000 |
| High Income Group (HIG) | ₹60 | ₹35,000 |

On a sale, the Board may also ask for a share of the profit, called the unearned increase. We confirm both for your scheme before you agree a price. So the numbers you plan on are the numbers you pay.

## Can I rent out my MHADA flat?

Yes. The no objection certificate for rent is a notified service under the Maharashtra Right to Public Services Act. Its time limit is eight days, and the Estate Manager is the officer responsible. In our office's experience it does come through in about eight days. We take the application through. Then we register the leave and licence agreement under section 55 of the Rent Control Act, as for any flat.

## How to start

Tell us which flat, wherever in Mumbai it is, and which scheme. Then tell us what you need: a sale, a tenant, a loan, a transfer to an heir, or a transfer that needs regularising. Bring the allotment letter and the latest receipt if you have them. We tell you what the file needs, what the official charges are, and how long the Board has to decide. Free to ask, and usually answered the same day.

---

**A note on accuracy.** The rules, fees and time limits on this page come from documents published by MHADA and the Government of Maharashtra, checked on 9 September 2026. They change, so we confirm the current position for every application before it goes in.
`.trim();

export const REPO_SERVICES: Record<string, RepoService> = {
  // Resale, rentals, new project bookings and interiors moved here from
  // Sanity on 16 September 2026; see service-content-core.ts for why.
  ...CORE_SERVICES,
  "investment-advisory": {
    title: "Property investment advice, Borivali",
    heroHeading: "Property investment advisory in the western suburbs",
    heroSubheading:
      "For investors buying in Borivali, Kandivali and Malad to hold. We read the pocket, do the sums on the actual flat, and say so when they do not work.",
    answer:
      "Shree Giriraj Real Estate advises people buying flats in Borivali, Kandivali and Malad to hold rather than live in. We compare pockets and buildings, and work out the rent the flat can earn as a share of its price. We do the sums on your actual flat, after costs, and say plainly when they do not work.",
    seoDescription:
      "Property investment advice in Borivali, Kandivali and Malad: each pocket assessed, the rental yield worked out and the title checked before you buy.",
    body: INVESTMENT_ADVISORY_BODY,
  },
  "commercial-plots": {
    title: "Shops and offices in Borivali West",
    heroHeading: "Commercial property in Borivali, Kandivali and Malad",
    heroSubheading:
      "Shops, showrooms, offices and the occasional genuine plot, to buy or rent. For businesses that need premises here and investors buying a unit to let.",
    answer:
      "Can a flat in Mumbai be used as a shop or office? Generally no: a flat is approved for living in, and a business would change that use. Some professionals may use part of their own home for their practice, if the society allows. Shree Giriraj Real Estate finds shops and offices approved for business in Borivali, Kandivali and Malad.",
    seoDescription:
      "Shops, offices and plots in Borivali, Kandivali and Malad, for rent or sale. Approved use, society rules and frontage checked before you commit.",
    body: COMMERCIAL_PLOTS_BODY,
  },
  "mhada-paperwork": {
    title: "MHADA NOC and transfer, all Mumbai",
    heroHeading: "MHADA paperwork, handled end to end",
    heroSubheading:
      "Transfers, no objection certificates for sale, rent and loans, transfer to heirs and regularisation, for MHADA flats anywhere in Mumbai.",
    answer:
      "Shree Giriraj Real Estate prepares and follows MHADA files for flats anywhere in Mumbai. We handle transfers, no objection certificates for sale, rent and loans, transfers to heirs and regularisation. The Mumbai Board's transfer charge is ₹45 to ₹60 per sq ft, capped at ₹15,000 to ₹35,000. The rent certificate has an eight day time limit.",
    seoDescription:
      "MHADA NOC for sale or rent, transfer of tenement, transfer on death and regularisation for flats anywhere in Mumbai, filed with the Mumbai Board.",
    body: MHADA_PAPERWORK_BODY,
  },
};

/**
 * The service in the locale asked for, falling back to English. The Hindi,
 * Marathi and Gujarati versions live in service-content-locales.ts and are
 * adapted rather than literal, so a copy edit in English should be checked
 * against all three.
 */
export function getRepoService(slug: string, locale: string = "en"): RepoService | undefined {
  const base = REPO_SERVICES[slug];
  if (!base) return undefined;
  if (locale === "en") return base;
  return REPO_SERVICE_LOCALES[slug]?.[locale as "hi" | "mr" | "gu"] ?? base;
}

/**
 * Every locale that has a genuine translation of this service, English first.
 * The route's hreflang cluster and the sitemap both read this, so the two
 * cannot disagree about which locale URLs are real.
 */
export function repoServiceLocales(slug: string): readonly ("en" | "hi" | "mr" | "gu")[] {
  if (!REPO_SERVICES[slug]) return [];
  const extra = Object.keys(REPO_SERVICE_LOCALES[slug] ?? {}) as ("hi" | "mr" | "gu")[];
  return ["en", ...extra];
}

/** Parsed once per render, the same way a markdown blog post is. */
export function repoServiceBlocks(svc: RepoService): Block[] {
  return parseBlocks(svc.body);
}
