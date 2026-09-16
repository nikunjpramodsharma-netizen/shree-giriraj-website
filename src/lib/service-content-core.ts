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
 * model bye laws on society permission for interior work and section 342 of
 * the Municipal Corporation Act on structural changes, and the MahaRERA
 * portal for project registration. The deposit norm of two to three months
 * in newer societies is the owner's own, confirmed 9 September 2026. No
 * prices, no rents, no cost bands, no return figures.
 *
 * Tone follows the owner's rule of 9 September 2026: every warning stated as
 * what the firm does for the reader, at most one caution a section, and a
 * warm no obligation invitation to finish.
 */

const RESALE_BODY = `
## Resale flats in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. We have worked in real estate since 1996 and
from this office since 2005, and resale flats have been the heart of it the
whole way through.

A resale flat gives you three things a new launch cannot: a society that
already runs, a building whose habits you can see, and keys on the day you
register. What it asks for in return is a file that has been read properly,
and that is the part we do before you fall for a flat.

## What you get

- **A shortlist that fits how you live.** Tell us the budget, the family and
  the commute and we show you two or three flats that actually fit, not
  thirty that match a filter
- **The building checked before the viewing.** Water timing, the parking the
  society will really allot, where any redevelopment genuinely stands, and
  whether the society welcomes the kind of buyer you are
- **The file read before a price is agreed.** Title chain, share certificate,
  society dues, conveyance position, occupancy certificate and an
  encumbrance search, so the flat you agree on is the flat you can register
- **Carpet area measured**, as RERA defines it under section 2(k), so the
  rate per square foot you compare is a real one
- **Stamp duty and registration explained in rupees** before you commit:
  6 percent for a male buyer, 5 percent for a woman buying in her sole name,
  registration at 1 percent capped at 30,000 rupees, all charged on the
  higher of the price and the ready reckoner value
- **Negotiation, agreement, registration and society transfer** handled with
  you, and the Index II collected afterwards so your ownership is on record

## Buying a resale flat here

Borivali, Kandivali and Malad each split into pockets that trade differently
at the same rate. In Borivali the station belt and the Link Road side are
two markets. In Kandivali the floor you choose in a tower moves the price
more than the carpet area does. In Malad the Mindspace corridor sets the
rental demand. We have sold in most of the buildings you will look at, in
many of them more than once, and that is the knowledge you are hiring.

## Selling a resale flat here

A flat with its paperwork in order sells faster and closer to the asking
price. We get the file ready before we list: the society's no objection, the
dues cleared, the chain of documents complete. Then we bring serious buyers,
people we have already qualified, so that the offer you accept is one that
completes on the date you planned.

## How to start

Tell us what you are buying or selling and where, on WhatsApp or by phone.
If you are buying, we come back with the two or three flats worth your time
and what to check in each. If you are selling, we tell you what your flat
should list at and what the file needs before it does. No obligation, and
usually the same day.
`.trim();

const RENTALS_BODY = `
## Flats for rent in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. Rentals are the busiest thing we do, and the
way most people meet us for the first time.

Renting here is straightforward when three things are settled before the
first visit: the owner is who they say they are, the society will register
you, and the deposit is the going rate for the building. We settle all three,
so the first flat you see is one you can actually take.

## For tenants

- **Verified owners only.** We meet the owner and see the ownership document
  before you see the flat, so your agreement is with the person entitled to
  let it
- **Societies that will register you.** Some older societies have their own
  views on tenants. We ask before the first visit, so every building we show
  you is one that will welcome you
- **The right deposit.** Two to three months' rent is the norm in newer
  societies here, more in some older buildings. We tell you the going rate
  for the building before you negotiate, so you pay what the street pays
- **A registered leave and licence agreement**, which section 55 of the
  Maharashtra Rent Control Act requires and which protects you as much as the
  owner. We draft it, register it and hand you your copy
- **The practical details**: water timing, parking, the society's rules on
  pets and guests, and the deposit return period written into the agreement

## For owners

- **A tenant you would choose yourself.** We qualify tenants on the things
  that matter to a landlord: stable income, a registered agreement, and a
  tenancy that looks like it will last
- **The paperwork done properly.** Registered agreement, police intimation,
  society NOC where the society asks for one, and a clear record of the
  deposit
- **No empty months waiting on portal enquiries.** Most of our rentals are
  matched from people already talking to us
- **Handover and return** handled at both ends, with an inventory, so the
  deposit conversation at the end is a short one

## Why a registered agreement matters

Under section 55 the agreement must be in writing and registered, and the
duty to register it sits with the landlord. An unregistered agreement leaves
both sides exposed: the tenant cannot prove the terms, and the landlord
cannot enforce them. Registration is a morning's work and we do it as part of
every tenancy, for a flat in Borivali as much as for a shop in Malad.

## How to start

Tell us the budget, the area and the move in date, or the flat you want to
let and when it is free. We come back with what fits, usually the same day,
and arrange the first visit around your hours. No obligation.
`.trim();

const NEW_PROJECTS_BODY = `
## New project bookings in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. We deal with a small number of developers
directly, which is what gets our clients into a launch early, with the
current price sheet and a straight answer on which floor is worth the money.

Buying a new launch is buying a drawing and a promise. The drawing is
checked against the sanctioned plan, the promise is checked against the
MahaRERA registration, and the price is judged floor by floor. That is the
whole of the service, and it is why our clients book with confidence.

## What you get

- **Early access** to launches from developers we work with directly, often
  before the open market, with the full inventory to choose from rather than
  what is left
- **The MahaRERA registration read with you**: the project number, the
  declared possession date, the sanctioned plan, the carpet area of your
  unit as the Act defines it, and the developer's record of completing what
  it has started
- **The floor and the view judged honestly.** In a tall tower the floor band
  moves the price more than the carpet area does. We tell you what your floor
  actually looks out on, not what the sample flat does
- **The payment plan explained** against the construction stages, and what
  each demand letter will ask for and when
- **The agreement for sale reviewed** before you sign, including the
  possession clause and what the developer owes if it slips
- **Booking, agreement and registration** handled with you, and the
  occupancy certificate confirmed before you take the keys

## What RERA gives a buyer here

Since 1 May 2017 every project of this size in Maharashtra has to be
registered with MahaRERA before it is sold, and the registration is public.
It carries the declared completion date, and the developer has to keep
seventy percent of what buyers pay in a separate account for that project's
construction. Carpet area has one legal meaning under section 2(k). And for
five years after possession, structural defects are the developer's to fix.
We use every one of those before you book, and we tell you plainly if a
project does not stand up to them.

## Jaswanti Jewel and the projects we carry

We are booking Jaswanti Jewel by Ashray in Kandivali West, off M.G. Road,
along with a small number of other launches across the three suburbs. Exact
all inclusive pricing and floor availability are shared on request, and
every figure is checked against the developer's current sheet before it goes
out.

## How to start

Tell us the budget, the configuration and the suburb, and whether you are
buying to live in or to hold. We come back with the launches that fit, the
floors we would look at and why, and a site visit arranged directly with the
developer. No obligation, usually the same day.
`.trim();

const INTERIORS_BODY = `
## Interior design and civil work in Borivali, Kandivali and Malad

Shree Giriraj Real Estate is a MahaRERA registered estate agent, registration
number A51800005726, working from Shop No 11, Clover Grove CHS, Chikoowadi,
Borivali West, Mumbai 400092. Interiors began because our resale clients kept
asking who they could trust with the flat once the keys were theirs. It is
now a service in its own right, for new and resale flats across the three
suburbs.

A flat in a society is not a standalone house. There are rules on working
hours, lift use and debris, a committee whose permission is needed, and
sometimes a municipal permission on top. We know the societies here and we
handle that side, so the design that is drawn is the one that gets built.

## What you get

- **A walk through the flat first**, with you, to agree what is being done
  room by room before anything is priced
- **An itemised estimate** before any work starts, so you see what each part
  costs and can change the scope before you commit to it
- **Design and execution together**, so nothing is lost between the drawing
  and the site. Layout, kitchen, wardrobes, false ceiling, electrical,
  plumbing, painting and the civil work that goes with them
- **Society permission handled for you**, in writing, under the society's
  bye laws, with the working hours, lift and debris conditions agreed before
  the first worker arrives
- **The municipal side where it applies.** Anything structural, such as
  merging flats, moving a kitchen or bathroom or touching a column, needs the
  BMC as well under section 342 of the Municipal Corporation Act, and we tell
  you at the design stage rather than after
- **A finish date agreed** and a handover walk through against the original
  scope

## What it costs

It depends on three things more than anything else: the kitchen, the
wardrobes and the finish level you choose. Rather than publish a range for a
flat we have not seen, we walk the flat, agree the scope and give you an
itemised estimate, so the number you plan on is the number for your home.
Our free [interior scope builder](/tools/interior-scope-builder) helps you
think through the rooms before we meet.

## How to start

Send us the flat's address and a few photographs, or tell us when the keys
are yours. We fix a time to walk the flat, and you have an itemised estimate
within days. No obligation, and no advance until the scope is agreed in
writing.
`.trim();

export const CORE_SERVICES: Record<string, RepoService> = {
  "resale-flats": {
    title: "Resale Flats in Borivali, Kandivali & Malad",
    heroHeading: "Resale flats in Borivali, Kandivali and Malad",
    heroSubheading:
      "Ready to move homes across the western suburbs, with the building and the file checked before you agree a price. Our main business since 1996.",
    seoDescription:
      "Buy or sell a resale flat in Borivali, Kandivali or Malad with Shree Giriraj Real Estate, MahaRERA agent A51800005726. Title, society and carpet area checked before a price is agreed; stamp duty and registration explained in rupees.",
    body: RESALE_BODY,
  },
  rentals: {
    title: "Flats for Rent in Borivali, Kandivali & Malad",
    heroHeading: "Flats for rent in Borivali, Kandivali and Malad",
    heroSubheading:
      "Verified owners, societies that will register you, the right deposit and a registered leave and licence agreement, for tenants and landlords across the western suburbs.",
    seoDescription:
      "Flats for rent in Borivali, Kandivali and Malad through Shree Giriraj Real Estate, MahaRERA agent A51800005726. Owner verified before the first visit, two to three months' deposit in newer societies, registered leave and licence agreement handled for you.",
    body: RENTALS_BODY,
  },
  "new-project-bookings": {
    title: "New Project Bookings in Borivali, Kandivali & Malad",
    heroHeading: "New project bookings, with the launch price sheet in hand",
    heroSubheading:
      "Early access to new launches from developers we deal with directly, the MahaRERA registration read with you, and a straight answer on which floor is worth the money.",
    seoDescription:
      "Book a new launch in Borivali, Kandivali or Malad with Shree Giriraj Real Estate, MahaRERA agent A51800005726. Early access through direct developer relationships, MahaRERA checks, carpet area and payment plan explained before you book.",
    body: NEW_PROJECTS_BODY,
  },
  interiors: {
    title: "Interior Design & Civil Work in Borivali, Kandivali & Malad",
    heroHeading: "Interiors and civil work, from people who know your building",
    heroSubheading:
      "Design and execution under one roof for flats in Borivali, Kandivali and Malad, with an itemised estimate before work starts and the society's permission handled for you.",
    seoDescription:
      "Interior design and civil work for flats in Borivali, Kandivali and Malad by Shree Giriraj Real Estate. Itemised estimate before work starts, society permission and BMC approvals handled, design and execution together.",
    body: INTERIORS_BODY,
  },
};
