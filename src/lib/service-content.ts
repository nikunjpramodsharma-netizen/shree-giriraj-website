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
 * The trade is explicit. Investment Advisory is not editable in the Studio
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
};

export function getRepoService(slug: string): RepoService | undefined {
  return REPO_SERVICES[slug];
}

/** Parsed once per render, the same way a markdown blog post is. */
export function repoServiceBlocks(svc: RepoService): Block[] {
  return parseBlocks(svc.body);
}
