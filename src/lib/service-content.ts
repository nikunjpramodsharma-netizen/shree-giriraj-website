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
 * The trade is explicit. Investment Advisory and Commercial are not editable in the Studio
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
## Is real estate a good investment in Mumbai?

It can be, and it is not automatic. A Mumbai flat produces two returns: rent
while you hold it, and whatever the resale market gives you when you sell.
The rent is measurable before you buy. The resale is not, and anybody who
tells you what a building will be worth in ten years is guessing.

What decides the outcome is usually not the city. It is the specific building,
the specific pocket, and the price you paid on the day. That is the part local
knowledge changes, and it is the part we work on.

## What Shree Giriraj Investment Advisory covers

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. The firm has worked in real estate since 1996
and has operated from this office since 2005.

Investment advisory is for people buying property here to hold rather than to
live in. It covers four suburbs of the Mumbai western suburbs: Borivali West,
Borivali East, Kandivali and Malad. It does not cover the rest of Mumbai,
because pocket level knowledge is the whole of what makes the service worth
anything and we do not have it everywhere.

What the service includes:

- Reading the micro market you are considering, pocket by pocket rather than
  suburb by suburb
- Assessing a specific building on the things that move a resale price later:
  age, society condition, conveyance status, water, parking, the redevelopment
  question, and what the lane is like after dark
- Working out the rent the flat can realistically command today, and what that
  is as a yield on the price being asked
- Checking the title, the encumbrance position and the society paperwork
  before money moves
- Negotiation, documentation and registration, handled end to end
- Telling you when the answer is that this particular flat is not worth buying

## What return should an investor expect?

We do not publish an expected return, and you should be careful with anybody
who does. Yields and appreciation vary by building, floor, pocket and the price
you actually negotiate, and a number quoted for "Borivali" as a whole tells you
nothing about the flat in front of you.

What we will do is the arithmetic on the specific property: the achievable rent,
the price, the outgoings, and therefore the gross yield you would be buying at
today. That is a fact about a real flat rather than a forecast, and it is the
number an investment decision should actually rest on.

## What is the 2% rule for properties?

The 2% rule is an American rule of thumb suggesting a rental property should
produce monthly rent of about 2% of its purchase price. It does not translate
to Mumbai. Indian residential yields are structurally far lower than that,
because capital values here are high relative to rents, and applying the rule
to a Borivali flat would rule out essentially every property in the city.

It is worth knowing only so you can recognise it when an overseas article
quotes it at you. Judge a flat here on its own arithmetic instead.

## Why local knowledge decides the outcome here

Borivali, Kandivali and Malad are not single markets. Borivali splits between
the station belt, which is older and denser and better connected, and the Link
Road side, which is newer and quieter. Two buildings a few hundred metres apart
can trade at similar prices for completely different reasons, and rent very
differently.

The things that separate them are not on any listing site. Which buildings have
water pressure problems on the upper floors. Which societies actually approve
interior work, and which will refuse a tenant. Which plots have a conveyance
problem that will surface the moment redevelopment is discussed. Which lanes a
family will not rent in. None of that appears in a price per square foot, and
all of it shows up in what you can charge and what you can sell for.

## What can go wrong

The failure modes we see most often, in order:

1. **Buying the brochure rather than the building.** The carpet area, the
   parking allotment and the amenities as promised are not always the ones the
   society will actually give you.
2. **Buying into a title or conveyance problem.** It does not stop the purchase.
   It stops the sale, years later, when you want your money back.
3. **Overpaying on a pocket comparison.** Paying a Link Road price for a station
   belt flat, or the reverse, because the per square foot number looked similar.
4. **Assuming rent.** A flat that a family will not take, or a society that will
   not permit the tenant you have in mind, does not earn what the spreadsheet said.
5. **No exit plan.** Resale liquidity varies sharply between buildings here.
   Some flats sell in weeks and some sit for a year.

## How to start

Tell us the budget, whether you are buying for rent or for resale, and how long
you expect to hold. We will tell you which of the four suburbs fits that, what
is realistically available, and what the arithmetic looks like on anything you
are considering. If the honest answer is that the numbers do not work, that is
the answer you will get.

---

**A note on risk.** Real estate investment carries risk, including the risk of
capital loss. Property is illiquid, transaction costs are high, and rental
income is not guaranteed. Past performance of any market or building does not
indicate future results. Nothing on this page is a guarantee of return,
appreciation or rental income, and nothing on this page is investment, tax or
legal advice. Consider your own circumstances and take independent professional
advice before committing capital.
`.trim();

const COMMERCIAL_PLOTS_BODY = `
## Commercial property in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. The firm has worked in real estate since 1996
and has operated from this office since 2005.

This service covers commercial space in three suburbs of the Mumbai western
suburbs: Borivali West and East, Kandivali West and East, and Malad West and
East. That means shops, showrooms, office units and, where they genuinely
exist, plots. It is for two kinds of client: a business that needs premises
here, and an investor buying a commercial unit to let.

Commercial property moves differently from a flat. Footfall, frontage,
approved use and the society's position on trade all matter more than the
square footage does, and none of them appear in a listing. Knowing which
stretch of which road works for which kind of business is the whole of what we
add.

## What is included

- **Shops for sale and for rent** in Borivali West, Kandivali West and Malad
  West, and on the east side of each, matched to the footfall and frontage the
  business actually needs
- **Office space** in Borivali West and Malad West, from single units to small
  floors, for rent or purchase
- **Showrooms and larger frontage units** on the main trading roads
- **Plots**, on the rare occasions a genuine one comes up, for investors and
  small builders
- Checking the approved use, the society's commercial rules and the no
  objection position before you commit
- Leave and licence or sale deed, negotiated and taken through registration

## Where commercial space works in these suburbs

Each suburb has a small number of stretches where commercial space genuinely
trades, and a great deal of frontage where it does not. In Borivali West the
trading spine runs through the station belt and along the main roads out of
it, and the Link Road side is a different, quieter proposition. In Kandivali
the established trade sits off M.G. Road and along the Link Road corridor. In
Malad West the office demand clusters near the Mindspace end and the Link Road,
and the retail demand sits on a different set of streets altogether.

A unit two hundred metres off the right stretch is a different asset from one
on it, at a similar rate per square foot. That is the thing to get right first.

## Shop for rent in Borivali West, Kandivali West or Malad West

Most of the enquiries we take for commercial space are for a shop for rent in
Borivali West, Kandivali West or Malad West, and most of them arrive with a
budget and a trade but not a stretch. The stretch is the decision. A shop for
rent on the wrong road, at the same rent, is a business that closes in eighteen
months. Tell us the trade and we will tell you which two or three stretches
actually see that trade's customers, and what is available on them this month.

Office space in Borivali West and Malad West works the same way. Proximity to
the station, to parking and to the kind of client the office serves matters
more than the floor plate, and a first floor unit above the right parade is
often a better office than a bigger one on a quieter road.

## Can residential property be used as commercial in Mumbai?

Generally no, and the exceptions are narrow. A flat is sanctioned for
residential use, and running a shop or a general office from it is a change of
use the building was not approved for. Certain professionals have long been
permitted to use part of their own residence for their practice, subject to the
society's bye laws and to limits on how much of the flat is used, but that does
not extend to retail or to a business that brings customers and stock through a
residential lobby.

If you need commercial premises, buy or rent a unit that is sanctioned as one.
It is cheaper than discovering the restriction after the fit out.

## How much is GST on commercial property in Mumbai?

Renting commercial premises is a taxable supply of services under GST, charged
at the rate applicable to renting of commercial property, which is currently
eighteen percent, where the landlord is liable to be registered. Residential
letting to an individual for use as a residence is treated differently. On a
purchase, a completed commercial unit sold after its completion certificate
does not attract GST; an under construction one does.

The practical point: ask whether a rent quoted to you is inclusive or exclusive
of GST before you compare two units, because the difference is material.
Confirm your own position with an accountant, since it turns on the
registration status of both parties.

## What is the price range for commercial property in Mumbai?

We do not publish rates, and a Mumbai wide range would be meaningless for a
unit in Kandivali anyway. What we will tell you is what a specific stretch is
trading at this month, and why the unit you are looking at sits where it does
in that range: the frontage, the floor, the approved use, the parade around it
and what it is letting for today.

## Is it wise to invest in commercial property?

It is a different investment from a flat rather than a better or worse one. The
income profile is stronger: leases run longer, deposits are larger, and the
tenant commonly carries the outgoings. Against that, vacancies are longer when
they happen, lending is on tighter terms, and the pool of buyers when you want
to exit is far smaller than for a two bedroom flat.

If you are buying to let rather than to occupy, our
[property investment advisory](/services/investment-advisory) covers the
arithmetic, and the
[rental yield calculator](/tools/rental-yield-calculator) will show you the
net figure before you go to a viewing.

## What we check before you commit

1. **The approved use.** What the unit is sanctioned for is a matter of record,
   not of what the last occupant did in it.
2. **The society's position.** Some societies with ground floor commercial
   units restrict trades, hours, signage and cooking. That restricts your
   tenant pool or your own business.
3. **Frontage and access.** Where the shutter faces, how visible it is from the
   road, whether a delivery vehicle can actually stop.
4. **The parade around it.** A unit beside trades that pull traffic is a
   different asset from the same unit beside three vacant shutters.
5. **Title and outgoings.** The same checks as a flat, plus who has been paying
   the property tax and on what assessment.
6. **What it lets for today.** Not what it could let for. What a tenant is
   paying, or would pay, this month.

## A note on plots

Genuine plots are rare in these suburbs and rarely small. Most of what is
called a plot is an old bungalow plot, a society plot heading for
redevelopment, or land whose development potential depends on its reservation
in the development plan. We will tell you what actually exists when you ask
rather than list something that does not.

---

**A note on risk.** Commercial property carries risk, including the risk of
capital loss and of extended vacancy. Property is illiquid and transaction
costs are high. Nothing on this page is a guarantee of rent, occupancy or
resale value, and nothing on this page is investment, tax or legal advice.
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
};

export function getRepoService(slug: string): RepoService | undefined {
  return REPO_SERVICES[slug];
}

/** Parsed once per render, the same way a markdown blog post is. */
export function repoServiceBlocks(svc: RepoService): Block[] {
  return parseBlocks(svc.body);
}
