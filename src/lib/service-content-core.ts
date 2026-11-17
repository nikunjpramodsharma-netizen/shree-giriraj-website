import type { RepoService } from "@/lib/service-content";

/**
 * The four services that used to live in Sanity: resale flats, rentals, new
 * project bookings and interiors.
 *
 * WHY THEY MOVED INTO THE REPO
 *
 * The owner asked on 16 September 2026 for every service page to be rewritten
 * with research behind it. The Sanity bodies could not be edited: there is no
 * write token in this environment, and the resale page still said "for nearly
 * 30 years" because of it. Moving the four into code puts all seven services
 * under one mechanism, version controlled and testable, with Hindi, Marathi
 * and Gujarati versions alongside (service-content-locales.ts).
 *
 * WHERE THE FACTS COME FROM
 *
 * Every legal or procedural claim below is one already sourced in the site's
 * own articles, which were checked against primary documents: RERA section
 * 2(k) on carpet area, section 55 of the Maharashtra Rent Control Act on
 * registering leave and licence, the Maharashtra Stamp Act and the 2021
 * women's concession order on duty, the Table of Fees on registration, the
 * model bye laws on society permission for interior work and the BMC permission for structural work under
 * the Municipal Corporation Act on structural changes, and the MahaRERA
 * portal for project registration. The deposit norm of two to three months
 * in newer societies is the owner's own, confirmed 9 September 2026.
 *
 * FIGURES ADDED ON 7 NOVEMBER 2026 (readability batch). The resale price
 * table and the rent table restate the asking rates and asking rents already
 * on the area guides (areas.ts), with their portal and date. The projects
 * table restates the project pages (project-facts.ts), with the owner's
 * "from about" rule for masked prices. The interiors table is a sourced,
 * dated Mumbai market range from four published cost guides, labelled as
 * the market's range and never as the firm's price list. Still no return
 * figures.
 *
 * Tone follows the owner's rule of 9 September 2026: every warning stated as
 * what the firm does for the reader, at most one caution a section, and a
 * warm no obligation invitation to finish.
 */

const RESALE_BODY = `
## Resale flats in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered agency, number A51800005726. Our office is at Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. We have worked in real estate since 1996, and from this office since 2005. Buying and selling resale flats has been the heart of it all along.

Buying? We shortlist two or three flats and check the building and the papers before you agree a price. Selling? We give you a free, fair price opinion on WhatsApp, get the file ready and bring buyers we have already met.

## What a buyer gets

- **A shortlist that fits how you live.** Tell us the budget, the family and the commute. We show you two or three flats that fit, not thirty that match a filter.
- **The building checked before you visit.** Water timing, real parking and where any redevelopment stands.
- **The papers read before a price is agreed.** The past sale deeds that prove ownership, the share certificate, the society dues and the occupancy certificate. We also search for any loan or claim on the flat.
- **Carpet area measured** as RERA defines it in section 2(k): the usable floor inside the walls. So the rate per square foot you compare is a real one.
- **Stamp duty and registration in rupees** before you commit. Duty is 6 percent for a man and 5 percent for a woman buying in her sole name. Registration is 1 percent, up to 30,000 rupees. Both are charged on the price or the government's ready reckoner value, whichever is higher.
- **Every step after that,** through registration, the society transfer and the Index II, the registry's record that the flat is yours.

## What does a resale flat cost here?

These are Square Yards' average asking rates, the same figures our area pages use. Borivali West is September 2026 and Kandivali West, for apartments, October 2026. Malad West spans two Square Yards pages read in November 2026. Asking is not the final registered price.

| Suburb | Asking rate per sq ft | 1 BHK, 400 to 450 sq ft | 2 BHK, 650 sq ft |
| --- | --- | --- | --- |
| Borivali West | ₹30,750 | about ₹1.23 to ₹1.38 crore | about ₹2 crore |
| Kandivali West | ₹27,200 | about ₹1.09 to ₹1.22 crore | about ₹1.77 crore |
| Malad West | ₹28,250 to ₹30,800 | about ₹1.13 to ₹1.39 crore | about ₹1.84 to ₹2 crore |

The flat prices are the rate times the size shown. Stamp duty adds 6 percent for most buyers, and registration up to 30,000 rupees. Older buildings sit below these figures and new towers above. The [flats for sale in Borivali West](/areas/borivali-west/flats-for-sale), [Kandivali West](/areas/kandivali/flats-for-sale) and [Malad West](/areas/malad/flats-for-sale) pages break the rates down by size.

## What is my flat worth?

Your flat is worth what a buyer in your pocket will pay for it this month. We work that out free, from the asking rates in your building and lane, the floor, the age of the building and the carpet area. Pockets matter: in Borivali, the station belt and the Link Road side are two markets at the same rate.

The [ready reckoner rate](/blog/ready-reckoner-rate-mumbai) published by IGR Maharashtra is a different number. It is the government's floor value for stamp duty, not the market price. A formal valuation report for a bank or a court is a separate document from a qualified valuer.

## How do I sell my flat in Borivali, Kandivali or Malad?

1. **Send us the basics on WhatsApp:** the building, the floor, the size and when you want to move. We reply with a fair listing price, usually the same day.
2. **We get the file ready before we list:** the share certificate, the past sale deeds with their [Index II](/blog/index-2-property-document), the [society's no objection letter](/blog/society-noc-for-sale-of-flat-mumbai) and the dues cleared.
3. **We bring buyers we have already met and checked,** and show the flat at times that suit you.
4. **We stay with the sale** through negotiation, the agreement, registration and the [share certificate transfer](/blog/society-share-certificate-transfer-fee).

A flat with its papers in order sells faster and closer to the asking price, so the file comes first.

## How to start

Tell us what you are buying or selling, and where, on WhatsApp or by phone. Buyers get the two or three flats worth their time. Sellers get a fair listing price and what the file needs first. No obligation, and usually the same day.
`.trim();

const RENTALS_BODY = `
## Flats for rent in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered agency, number A51800005726, at Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. Rentals are the busiest thing we do. They are how most people meet us first.

Renting here is simple when three things are settled before the first visit. The owner is who they say they are. The society will register you. And the deposit is the going rate for the building. We settle all three, so the first flat you see is one you can actually take.

## For tenants

- **Verified owners only.** We meet the owner and see the ownership papers before you see the flat. So your agreement is with the person entitled to let it.
- **Societies that welcome you.** Some older societies have their own views on tenants. We ask before the first visit, so every building we show you will register you.
- **The right deposit.** Two to three months' rent is the norm in newer societies here, more in some older buildings. We tell you the going rate before you negotiate, and our [deposit guide](/blog/rent-deposit-months-western-suburbs) explains when it is negotiable.
- **A registered rent agreement.** In Maharashtra it is called a leave and licence agreement. Section 55 of the Maharashtra Rent Control Act says it must be registered. We draft it, register it and hand you your copy.
- **The practical details.** Water timing, parking, the society's rules on pets and guests, and the deposit return date written into the agreement.

## What does a flat rent for here?

These are asking rents a month, the same figures as our flats for rent pages. Borivali West is Square Yards' average for September 2026, and Kandivali West for October 2026. In Malad West, the 1 BHK is Square Yards' rent per sq ft read in November 2026, and the 2 and 3 BHK are Broker Network, July 2026.

| Size | Borivali West | Kandivali West | Malad West |
| --- | --- | --- | --- |
| 1 BHK | about ₹32,800 | about ₹35,200 | about ₹37,000 to ₹42,000 |
| 2 BHK | about ₹49,600 | about ₹52,850 | ₹42,000 to ₹65,000 |
| 3 BHK | about ₹73,850 | about ₹82,200 | ₹60,000 to ₹1 lakh |

Asking rents are a starting point, not signed rents. The building, the floor and the furnishing decide where a flat sits in the range. See the flats for rent in [Borivali West](/areas/borivali-west/flats-for-rent), [Kandivali West](/areas/kandivali/flats-for-rent) and [Malad West](/areas/malad/flats-for-rent) for rents by size.

## For owners

- **A tenant you would choose yourself.** Stable income, a registered agreement, and a tenancy that looks set to last.
- **The paperwork done properly.** A registered [leave and licence agreement](/blog/leave-and-licence-agreement-mumbai), [police intimation](/blog/tenant-police-verification-mumbai), the society's no objection letter where it asks for one, and a clear record of the deposit.
- **Fewer empty months.** Most of our rentals are matched from people already talking to us, not from portal enquiries.
- **Handover and return handled at both ends,** with a list of what is in the flat. So the deposit talk at the end is a short one.
- **Selling instead of letting?** Our [resale service](/services/resale-flats) starts with a free fair price opinion on WhatsApp.

## Why register the agreement?

Section 55 says the agreement must be in writing and registered. The duty to register it sits with the landlord. Registration protects both sides: the tenant can prove the terms, and the landlord can enforce them. It takes a morning, and we do it with every tenancy, for a flat in Borivali as much as a shop in Malad.

## How to start

Tell us your budget, the area and your move in date. Or tell us the flat you want to let and when it is free. We come back with what fits, usually the same day, and plan the first visit around your hours. No obligation.
`.trim();

const NEW_PROJECTS_BODY = `
## New project bookings in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered agency, number A51800005726, at Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. We deal with a small number of developers directly. That gets our clients into a launch early, with the current price sheet and a straight answer on which floor is worth the money.

Buying a new launch means buying a drawing and a promise. We check the drawing against the plan the authorities approved. We check the promise against the MahaRERA registration. And we judge the price floor by floor. That is the whole service, and it is why our clients book with confidence.

## What you get

- **Early access** to launches from developers we work with directly, often before the open market. You choose from the full inventory, not what is left.
- **The MahaRERA record read with you.** The project number, the promised possession date and the approved plan. Your flat's carpet area as the law defines it. And the developer's record of finishing what it starts.
- **The floor and the view judged honestly.** In a tall tower, the floor moves the price more than the carpet area does. We show you what your floor looks out on, not the sample flat.
- **The payment plan explained** stage by stage, so you know what each demand letter will ask for and when.
- **The agreement for sale read before you sign,** including the possession date and what the developer owes you if it slips.
- **Booking, agreement and registration** handled with you, and the occupancy certificate confirmed before you take the keys.

## Which new projects do we carry in Borivali and Kandivali West?

| Project | Area | Homes | Price | Possession |
| --- | --- | --- | --- | --- |
| [Jaswanti Jewel](/projects/jaswanti-jewel) | Off M.G. Road, Kandivali West | 2, 3, 4 and 5 BHK | From ₹2.92 Cr, all inclusive | From March 2027 |
| [The Landmark](/projects/the-landmark-borivali-west) | S.V. Road, near Vijay Sales, Borivali West | 2, 2.5 and 3 BHK | From about ₹2 Cr | Ask us |
| [Veena Celestia](/projects/veena-celestia) | Chandavarkar Lane, Borivali West | Ask us | Base rate ₹41,000++ per sq ft | Ask us |
| [Blissful Living](/projects/blissful-living) | Kandivali West | To follow | Shared once registered | To follow |
| [Luxury Living](/projects/luxury-living-punit-nagar) | Punit Nagar, Borivali West | To follow | Shared once registered | To follow |

Jaswanti Jewel's price is from the developer's October 2026 sheet, and its MahaRERA possession date is December 2027. The Landmark's figure is rounded down from its project page. Blissful Living and Luxury Living are awaiting MahaRERA registration, so register your interest and we send details once they are registered. Exact all inclusive sheets and floor wise availability come on WhatsApp.

Looking in Malad West, or at a launch not in this table? Tell us the budget and we read its MahaRERA record with you before you book. Our guide to [new projects in Borivali West](/guides/new-projects-borivali-west) walks through a launch booking step by step, and [every project we carry](/projects) has its own page.

## What RERA gives a buyer here

Since 1 May 2017, every project of this size in Maharashtra must be registered with MahaRERA before it is sold. The record is public, and it carries the promised completion date. The developer must keep 70 percent of buyers' money in a separate account for that project's construction. Carpet area has one legal meaning under section 2(k). And for five years after possession, structural defects are the developer's to fix. We use every one of these before you book, and our guide shows [how to check a builder's RERA page](/guides/how-to-check-a-builder-rera-page) yourself.

## How to start

Tell us the budget, the size and the suburb, and whether you will live there or hold it. We come back with the launches that fit, the floors we would look at and why. Then we arrange a site visit and come with you. No obligation, usually the same day.
`.trim();

const INTERIORS_BODY = `
## Interior designer in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered agency, number A51800005726, at Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. Interiors began because our resale clients kept asking whom to trust once the keys were theirs. Today it is a service of its own, for new and resale flats across the three suburbs.

A flat in a society is not a standalone house. There are rules on working hours, lift use and debris. The committee must give permission, and sometimes the BMC must too. We know the societies here and handle that side. So the design that is drawn is the one that gets built.

## What you get

- **A walk through the flat first,** with you, to agree what is done room by room before anything is priced.
- **An itemised estimate** before any work starts. You see what each part costs and can change the scope before you commit.
- **Design and building by one team,** so nothing is lost between the drawing and the site. Layout, kitchen, wardrobes, false ceiling, electrical, plumbing, painting and the civil work that goes with them.
- **Society permission handled for you,** in writing, under the society's bye laws. Working hours, lift use and debris rules are agreed before the first worker arrives.
- **The BMC side where it applies.** Structural work also needs the BMC's permission, under the Mumbai Municipal Corporation Act. That means merging flats, moving a kitchen or bathroom, or touching a column. We tell you at the design stage.
- **A finish date agreed,** and a handover walk through against the original scope.

## What does a 2 BHK interior cost in Mumbai?

This is the typical Mumbai market range from published cost guides, read on 7 November 2026. It is not our price list. Your own number comes from an itemised estimate for your flat.

| Level | What it usually includes | Typical Mumbai range |
| --- | --- | --- |
| Basic | A kitchen, two wardrobes, a TV unit, laminate finishes | about ₹5.5 lakh to ₹7 lakh |
| Mid | The basics plus beds, dining, a living room false ceiling and better hardware | about ₹7 lakh to ₹12 lakh |
| Premium | Premium shutters, marine plywood, profile lighting and wardrobe internals | ₹12 lakh and above |

Where the range comes from:

- [Design Cafe, Mumbai interior cost guide, January 2026](https://www.designcafe.com/blog/home-interiors/interior-design-cost-in-mumbai/): a basic 2 BHK at ₹5.5 lakh to ₹6 lakh.
- [Design Cafe, 2 BHK cost guide, September 2026](https://www.designcafe.com/blog/home-interiors/2bhk-interior-design-cost/): tiers of ₹5 to 7 lakh, ₹7 to 12 lakh and ₹12 lakh plus. It puts Mumbai at ₹8 to 12 lakh.
- [Livspace, Mumbai interior cost guide, January 2026](https://www.livspace.com/in/magazine/calculate-interior-design-cost-in-mumbai): ₹7 lakh to ₹10 lakh for a 500 to 700 sq ft 2 BHK, before 18 percent GST.
- [Asian Paints Beautiful Homes, Mumbai interior cost guide](https://www.beautifulhomes.asianpaints.com/blogs/interior-design-cost-per-square-foot-in-mumbai.html): ₹7 lakh to ₹13 lakh or more for 800 to 1,200 sq ft.

Ask whether any quote includes GST at 18 percent. Our free [interior scope builder](/tools/interior-scope-builder) helps you list the rooms before we meet. For the room by room figures, read [what a 2 BHK interior costs in Mumbai](/blog/2-bhk-interior-cost-mumbai) and the [modular kitchen cost in Mumbai](/blog/modular-kitchen-cost-mumbai).

## How to start

Send 3 photos of your flat on WhatsApp for an itemised estimate. Add the area, or tell us when the keys are yours. We fix a time to walk the flat, and you have the itemised estimate within days. No obligation, and no advance until the scope is agreed in writing.
`.trim();

export const CORE_SERVICES: Record<string, RepoService> = {
  "resale-flats": {
    title: "Resale flats, Borivali to Malad: buy or sell",
    heroHeading: "Buy or sell a resale flat in Borivali, Kandivali or Malad",
    heroSubheading:
      "Buying: two or three flats that fit, with the building and the papers checked first. Selling: a free fair price opinion and buyers we have already met. Our main business since 1996.",
    answer:
      "Shree Giriraj Real Estate helps you buy or sell a resale flat in Borivali, Kandivali and Malad. Buyers get two or three flats that fit, with the papers checked first. Sellers get a free fair price opinion on WhatsApp. On Square Yards' September 2026 average, a 650 sq ft 2 BHK in Borivali West asks about ₹2 crore.",
    seoDescription:
      "Buy or sell a resale flat in Borivali, Kandivali or Malad. Papers checked before you agree a price, and a free fair price opinion for sellers.",
    body: RESALE_BODY,
  },
  rentals: {
    title: "Rent or let a flat: Borivali, Kandivali",
    heroHeading: "Flats for rent in Borivali, Kandivali and Malad",
    heroSubheading:
      "Verified owners, societies that welcome you and a registered rent agreement, for tenants and landlords across the western suburbs.",
    answer:
      "Shree Giriraj Real Estate finds flats for rent in Borivali, Kandivali and Malad. We check the owner and the society before your first visit. A 2 BHK averaged about ₹49,600 a month in Borivali West in September 2026, on Square Yards' figures. Deposits run two to three months' rent in newer societies.",
    seoDescription:
      "Rent a flat in Borivali, Kandivali or Malad from a verified owner, or let yours to a checked tenant, with the registered agreement handled.",
    body: RENTALS_BODY,
  },
  "new-project-bookings": {
    title: "New launches in Borivali, Kandivali, Malad",
    heroHeading: "New projects in Borivali, Kandivali and Malad",
    heroSubheading:
      "Early access through developers we deal with directly, the MahaRERA record read with you, and a straight answer on which floor is worth it.",
    answer:
      "Shree Giriraj Real Estate books new launches in Borivali, Kandivali and Malad. We read the MahaRERA record with you before you pay anything. We carry Jaswanti Jewel in Kandivali West, from ₹2.92 crore all inclusive, and The Landmark on S.V. Road, Borivali West, from about ₹2 crore. Exact price sheets come on WhatsApp.",
    seoDescription:
      "New launches in Borivali, Kandivali and Malad: early access through developers we deal with directly, and the MahaRERA record read with you first.",
    body: NEW_PROJECTS_BODY,
  },
  interiors: {
    title: "Interior designer in Borivali and Kandivali",
    heroHeading: "Interior designer in Borivali, Kandivali and Malad",
    heroSubheading:
      "Design, carpentry and civil work by one team, with an itemised estimate first and the society's permission handled for you.",
    answer:
      "Shree Giriraj Real Estate designs and fits out flats in Borivali, Kandivali and Malad. One team handles design, carpentry and civil work. Published Mumbai cost guides put a 2 BHK at about ₹5.5 lakh for basic work to ₹12 lakh and above for premium. You get an itemised estimate first, and pay no advance until the scope is agreed.",
    seoDescription:
      "Interior designer in Borivali, Kandivali and Malad: design and civil work by one team, an itemised estimate first, no advance until scope is agreed.",
    body: INTERIORS_BODY,
  },
};
