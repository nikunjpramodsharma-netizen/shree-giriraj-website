import { parseBlocks, type Block } from "@/lib/markdown";

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
  seoDescription: string;
  /** Markdown, parsed at render into the same blocks the blog uses. */
  body: string;
};

const INVESTMENT_ADVISORY_BODY = `
## Property investment advisory in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. We have worked in real estate since 1996 and
from this office since 2005.

Investment advisory is for people buying property here to hold rather than to
live in. It covers Borivali West and East, Kandivali and Malad, and nothing
else, because pocket level knowledge is the whole of what makes the service
worth having. Thirty years of walking these buildings is what you are hiring.

## What you get

- A reading of the micro market you are considering, pocket by pocket, so
  you know why two buildings at the same rate behave differently
- An assessment of the specific building on the things that hold resale
  value: age, society, conveyance, water, parking, and the lane itself
- The rent the flat can realistically command today, and what that is as a
  yield on the price being asked, worked on the real property rather than
  quoted for the suburb
- Title, encumbrance and society paperwork checked before money moves
- Negotiation, documentation and registration handled end to end
- A straight answer. If a particular flat does not stack up, we say so and
  find you one that does

## Is real estate a good investment in Mumbai?

It can be a very good one, and the western suburbs have rewarded patient
owners for decades. A flat here produces two returns: rent while you hold
it, and what the resale market gives you when you sell. The rent you can
measure before you buy, and we do. The resale depends on the building and the
pocket more than the city, which is exactly where local knowledge earns its
keep.

## What return should an investor expect?

We do the arithmetic on the flat in front of you rather than publishing a
number for the suburb, because the achievable rent, the outgoings and the
price you actually negotiate decide the answer, and they differ from one
building to the next. You leave with the gross and net yield on the specific
property, and with the [rental yield calculator](/tools/rental-yield-calculator)
you can test any other flat the same way.

## Why local knowledge decides the outcome here

Borivali splits between the station belt, older and better connected, and
the Link Road side, newer and quieter. Kandivali has the widest choice of new
stock in the belt. Malad has the Mindspace corridor keeping rental demand
steady. Inside each, the things that separate a good buy from an ordinary one
are not on any listing: which buildings have strong water on the upper
floors, which societies welcome tenants, which lanes families choose. We know
them because we have sold in these buildings, more than once.

## How to start

Tell us the budget, whether you are buying for rent or for resale, and how
long you expect to hold. We will tell you which suburb and pocket fit that,
what is realistically available this month, and what the numbers look like
on anything you shortlist. No obligation, and usually the same day.

---

**A note on risk.** Property is a long term asset. Values and rents move, the
asset is illiquid and transaction costs are real, and nothing on this page is
a guarantee of return or a substitute for independent financial advice.
`.trim();

const COMMERCIAL_PLOTS_BODY = `
## Commercial property in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. We have worked in real estate since 1996 and
from this office since 2005.

This service covers commercial space across Borivali, Kandivali and Malad:
shops, showrooms, office units and, when a genuine one comes up, plots. It is
for two kinds of client. A business that needs premises here, and an investor
buying a commercial unit to let. Footfall, frontage and approved use decide
whether a unit works, and knowing which stretch of which road suits which
trade is what we bring.

## What you get

- **Shops for sale and for rent** in Borivali West, Kandivali West and Malad
  West, and on the east side of each, matched to the footfall and frontage
  your business needs
- **Office space** in Borivali West and Malad West, from a single unit to a
  small floor, for rent or purchase
- **Showrooms and larger frontage units** on the main trading roads
- **Plots**, on the occasions a genuine one exists, for investors and small
  builders
- The approved use, the society's commercial rules and the title confirmed
  before you commit, so the unit you take is the unit you can trade from
- Leave and licence or sale deed negotiated and taken through registration

## Shop for rent in Borivali West, Kandivali West or Malad West

Most enquiries we take for commercial space are for a shop for rent in
Borivali West, Kandivali West or Malad West, and most arrive with a budget and
a trade but not a stretch. The stretch is the decision. Tell us the trade and
we will tell you which two or three stretches actually see that trade's
customers, and what is available on them this month. Office space works the
same way: proximity to the station, to parking and to your clients matters
more than the floor plate, and a first floor unit above the right parade is
often the better office.

## Can residential property be used as commercial in Mumbai?

Generally no. A flat is sanctioned for residential use, and a shop or general
office is a change of use the building was not approved for. Certain
professionals may use part of their own residence for their practice, subject
to the society's rules. For a business that brings customers through the
door, a unit sanctioned as commercial is the right answer, and we will find
you one.

## Is it wise to invest in commercial property?

Commercial has a stronger income profile than a flat: leases run longer,
deposits are larger and the tenant commonly carries the outgoings. The pool
of buyers when you sell is smaller, so it suits money that can stay invested.
If you are buying to let rather than to occupy, our
[investment advisory](/services/investment-advisory) covers the numbers, and
the [rental yield calculator](/tools/rental-yield-calculator) shows the net
figure before a viewing.

## How to start

Tell us the business or the investment, the budget, and any stretch you
already have in mind. We will come back with the two or three that fit, what
is available on them now, and a viewing. No obligation, usually the same day.
`.trim();

const MHADA_PAPERWORK_BODY = `
## MHADA paperwork in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. We have worked in real estate since 1996 and
from this office since 2005.

MHADA is the Maharashtra Housing and Area Development Authority, and a great
many flats in the western suburbs were allotted through it. Each one carries
a set of permissions a privately built flat does not need: before a sale,
before a tenant, before a mortgage, and when an allottee dies. Done properly,
none of it is difficult. We prepare the complete file against the Board's own
document list, submit it to the right desk, and follow it through until it is
decided, for owners, heirs, buyers and landlords across Borivali, Kandivali
and Malad.

## What you get

- **Transfer of tenement** with the Mumbai Board's Estate Manager, for a
  sale, a gift within the family, or a transfer to a legal heir
- **No objection certificate for sale**, including the society's permission
  and the Board's
- **No objection certificate for leave and licence**, so the flat can be let
  with the Board's blessing
- **No objection certificate for a mortgage**, which a lender needs before
  sanctioning a loan on a MHADA flat
- **Transfer on death** of the original allottee, with the heirship documents
  the Board asks for
- **Regularisation** where a flat changed hands without the Board's
  permission, so the record matches the reality
- **Society paperwork** for MHADA layouts, including the lease and conveyance
  position a redevelopment will need

## Can a MHADA flat be transferred to another person?

Yes. Under the Estate Management, Sale, Transfer and Exchange of Tenements
Regulations, 1981, a transfer needs the previous written permission of the
Board and of the housing society, and the society may permit one once five
years have passed from allotment, the buyer falls in the scheme's income
group, and dues are paid. With those in place the transfer is routine, and
the file we prepare is built to satisfy each one the first time.

## What are the MHADA transfer fees?

The Mumbai Board publishes a schedule for transfer of tenancy rights: 45
rupees per square foot for Low Income Group flats capped at 15,000 rupees, 55
per square foot for Middle Income Group capped at 25,000, and 60 per square
foot for High Income Group capped at 35,000, as published on mhada.gov.in and
checked on 9 September 2026. On a sale the Board may also ask for a share of
the unearned increase. We confirm both for your scheme before you agree a
price, so the numbers you plan on are the numbers you pay.

## Can I rent out my MHADA flat?

Yes. The no objection certificate for rent is a notified service under the
Maharashtra Right to Public Services Act, with a time limit of eight days and
the Estate Manager as the designated officer. We take the application
through, then register the leave and licence agreement under section 55 of
the Rent Control Act as for any flat, so you let with a clear record.

## How to start

Tell us which flat, which scheme and what you need: a sale, a tenant, a
loan, a transfer to an heir, or a transfer that needs regularising. Bring the
allotment letter and the latest receipt if you have them. We will tell you
what the file needs, what the official charges are, and how long the Board
has to decide. Free to ask, and usually answered the same day.

---

**A note on accuracy.** The rules, fees and time limits on this page come
from documents published by MHADA and the Government of Maharashtra, checked
on 9 September 2026. They change, so we confirm the current position for
every application before it goes in.
`.trim();

export const REPO_SERVICES: Record<string, RepoService> = {
  "investment-advisory": {
    title: "Property Investment Advisory in Borivali, Kandivali & Malad",
    heroHeading: "Property investment advisory in the western suburbs",
    heroSubheading:
      "For investors buying in Borivali, Kandivali and Malad to hold rather than to live in. We read the micro market, do the arithmetic on the actual flat, and tell you when the numbers do not work.",
    seoDescription:
      "Property investment advisory in Borivali, Kandivali and Malad by Shree Giriraj Real Estate, MahaRERA agent A51800005726. Micro market assessment, rental yield arithmetic and title checks for investors in the Mumbai western suburbs.",
    body: INVESTMENT_ADVISORY_BODY,
  },
  "commercial-plots": {
    title: "Commercial Property in Borivali, Kandivali & Malad",
    heroHeading: "Commercial property in Borivali, Kandivali and Malad",
    heroSubheading:
      "Shops, showrooms, office space and the occasional genuine plot, for sale or rent across the western suburbs. For businesses that need premises here and investors buying a unit to let.",
    seoDescription:
      "Commercial property in Borivali, Kandivali and Malad: shops for rent and sale, office space and plots, through Shree Giriraj Real Estate, MahaRERA agent A51800005726. Approved use, society rules and frontage checked before you commit.",
    body: COMMERCIAL_PLOTS_BODY,
  },
  "mhada-paperwork": {
    title: "MHADA Paperwork in Borivali, Kandivali & Malad",
    heroHeading: "MHADA paperwork, handled end to end",
    heroSubheading:
      "Transfer of tenement, no objection certificates for sale, rent and mortgage, transfer to heirs, and regularisation, for MHADA flats across Borivali, Kandivali and Malad. A complete file to the right desk, followed up until it is decided.",
    seoDescription:
      "MHADA transfer, NOC for sale, rent and mortgage, transfer on death and regularisation for MHADA flats in Borivali, Kandivali and Malad, through Shree Giriraj Real Estate, MahaRERA agent A51800005726. Rules and charges from MHADA's own documents.",
    body: MHADA_PAPERWORK_BODY,
  },
};

export function getRepoService(slug: string): RepoService | undefined {
  return REPO_SERVICES[slug];
}

/** Parsed once per render, the same way a markdown blog post is. */
export function repoServiceBlocks(svc: RepoService): Block[] {
  return parseBlocks(svc.body);
}
