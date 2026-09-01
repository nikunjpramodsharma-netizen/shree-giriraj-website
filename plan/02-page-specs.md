# 02. Page Specifications

Section by section specification for every page. Frameworks: `cro` (value proposition, CTA hierarchy, trust signals, objection handling, friction), `copywriting` (above the fold structure, specificity over vagueness, customer language), `ai-seo` (answer first blocks, extractability), `schema` (per page type assignment).

**Voice rule applied throughout:** if a sentence would fit any estate agent in India, it is cut. Sample copy below is written in the intended voice so you can judge it.

---

## 0. The competitive reality that shapes every page

I pulled live SERP data before writing these specs. It changes the approach materially.

**Portals own every transactional head term, completely.** For "flats in borivali west" the top eight results are 99acres, NoBroker, MagicBricks, OLX, Housing, SquareYards, 99acres again and a YouTube video. For "flat for rent in borivali" it is NoBroker, 99acres, Nestaway, MagicBricks, OLX and a Facebook post. **There is not one local agent anywhere in either result set.**

The strategic consequence: **no page on this site should try to be a listings page.** You cannot out inventory a portal and stale listings would damage the trust that is your only real asset. Every page is built to win on something the portals structurally cannot do, which is judgement about specific places.

**Where a local independent does rank.** For "interior designer borivali" the SERP carries a **local pack**, and `parineeinterio.in`, an independent local business, ranks third organically against Livspace, DesignCafe and HomeLane. This proves the local independent play works in this geography. It is also the highest CPC cluster you have. Interiors is therefore specified as a full commercial page, not an afterthought service.

**Where AI Overviews already appear.** Both "stamp duty in mumbai" and "society redevelopment process" return an AI Overview. Those are AEO targets confirmed by data, not by theory. Note who ranks for stamp duty: developers (Ruparel, Rustomjee) and lenders (Bajaj Finserv, Tata Capital). If a developer can rank for it, so can you.

**Jaswanti Jewel is a real branded query.** 720 searches a month, low competition, CPC $0.90. The SERP returns a knowledge graph, Google reviews, third party reviews, short videos and images. Two dedicated domains rank (`jaswantijewel.in` and `jaswanti-jewel.in`), plus 99acres, Housing and `housiey.com`. **At least one of those is a broker microsite, which means brokers are already capturing this traffic.** The project page spec below is built to compete for it.

**Developer confirmed: Ashray.** Verified with you on 25 August 2026. Portals title the project "Ashray Jaswanti Jewel" and the developer trades as Ashray Group and Ashray Realtors, with its own site at `ashraygroup.com`.

**Jaswanti Gold is out of scope. Decided 25 August 2026.** Ashray has a second Kandivali West project, Jaswanti Gold, which carries higher search volume. **You do not handle it, so nothing on this site targets it, mentions it, or bids on it.** Building for a project you cannot service would produce enquiries you have to turn away, which is worse than no traffic. The research is retained in `04 Research data` as a record of a closed decision, not as a backlog item.

**One finding from that research does carry over, and it bears on section 7.** Portals already publish per unit asking prices for Ashray projects, including Jaswanti Jewel on 99acres and Housing. Your pricing is not private information that masking protects. Masking only makes your page less useful than the portal page, on a query where you are already competing with that portal. This strengthens the case for publishing ranges with a verification date and gating only the exact floor by floor sheet.

---

## 1. Homepage `/`

**Purpose.** Establish who you are in five seconds, route visitors to the right service or suburb, and convert the ready ones straight to WhatsApp.

**Target query intent.** Branded and navigational ("shree giriraj borivali", "property agent borivali"). Do **not** optimise this page for "flats in borivali west". Portals own it and the area pages are the right vehicle anyway.

**Primary CTA.** WhatsApp enquiry. **One primary CTA in the hero, not two.** Two competing buttons above the fold create decision paralysis.

**Schema.** `@graph` containing `RealEstateAgent`, `WebSite`, `FAQPage`.

| # | Section | Contents | CTA |
|---|---|---|---|
| 1 | Hero | Eyebrow "Borivali. Kandivali. Malad." H1, one sentence subhead, single primary CTA. Three proof stats. **Remove the 4.8★ stat.** Replace the stale "25+ years" with "Since 1996" | WhatsApp, primary |
| 2 | Trust strip | MahaRERA number, Since 1996, office address, "Flat, shop, plot, redevelopment" | None |
| 3 | Services grid | Six cards, ordered by commercial value: Rentals, Resale flats, New project bookings, Interiors, Redevelopment, Shops and plots. Each card links to its page with the anchor text in `01-architecture.md` section 7.1 | Card links |
| 4 | Featured project | Jaswanti Jewel. Configurations, masked pricing, verification date, amenities | Get the price sheet, secondary |
| 5 | Areas | Four cards: Borivali West, Borivali East, Kandivali, Malad. One genuinely specific line each, not a generic blurb | Card links |
| 6 | Why us | Three numbered points. Rewritten per section 1.2 below | None |
| 7 | Social proof | Testimonials from CMS. **Renders nothing until real testimonials exist.** No placeholder, no invented quote | None |
| 8 | FAQ | Six general questions only, per the existing restructuring decision. Service specific FAQs live on service pages | None |
| 9 | Lead form | Name, phone, intent, area. Opens WhatsApp prefilled | Send enquiry, primary |
| 10 | Footer | Four columns per `01-architecture.md` section 6 | Phone, WhatsApp |

### 1.1 Hero copy, three options

Per `cro`, the headline must communicate the value proposition and be specific enough to mean something.

> **Option A, recommended.**
> **We have been selling flats on these streets since 1996.**
> Borivali, Kandivali and Malad. We know which societies have parking, which have water, and what a fair price actually looks like this month.
> `[ Ask us on WhatsApp ]`

> **Option B, sharper on the portal contrast.**
> **The listings you can find yourself. The judgement you cannot.**
> Thirty years of buying, selling and renting in the western suburbs. We will tell you what is wrong with a flat before you fall in love with it.
> `[ Ask us on WhatsApp ]`

> **Option C, service led.**
> **Buy, sell, rent or redevelop. One office, since 1996.**
> Resale, new launches, tenancy, society redevelopment and the interiors after. Run out of one shop in Chikoowadi, Borivali West.
> `[ Ask us on WhatsApp ]`

Option A is the recommendation. It leads with provenance, then earns it with three concrete specifics rather than claiming "trusted" or "leading". Per `copywriting`, specificity over vagueness.

**What is deliberately absent:** "your dream home awaits", "leading real estate consultants", "we understand your needs". All three would fit any agent in India.

### 1.2 Why us, rewritten

The current three points are close but generic. Sharpened:

> **1. Thirty years on the same three suburbs.**
> We opened in Chikoowadi in 1996 and never moved. That is long enough to have sold flats in the same building twice, and to remember why the second sale was harder.
>
> **2. We tell you the problems first.**
> Water timing, lift maintenance, parking allotment, society politics, redevelopment that has been "starting next year" for six years. You will hear it from us before you see the flat, not after you have paid the token.
>
> **3. We stay until you have the keys, and after.**
> Shortlisting, negotiation, agreement, loan, registration, possession, then the interiors. One office through the whole thing, not a handover to a stranger at every step.

Point 2 is the differentiator and it is the one that cannot be copied by a portal.

### 1.3 Claims requiring verification

| Claim | Status | Needed |
|---|---|---|
| "4.8★ client rating" | **Remove Day 1** | No source exists in the codebase |
| "25+ years" | **Correct Day 1** | 1996 to 2026 is 30 years. Use "Since 1996" |
| "Direct builder relationships" | **Verify** | Name a builder or soften to "we work directly with developers in these three suburbs" |
| "Often before they hit the open market" | **Verify** | Can you evidence one instance |
| Address, phones, email, MahaRERA | Verified from brief | Must match GBP character for character |

---

## 2. Services index `/services`

**Purpose.** Route to the six service pages and rank for the umbrella intent.
**Intent.** Commercial investigation. "real estate agent borivali" measured 50 a month, low competition.
**CTA.** WhatsApp, plus per card links.
**Schema.** `ItemList` of `Service`, plus `BreadcrumbList`.

| # | Section | Contents |
|---|---|---|
| 1 | Intro | H1 plus a 40 to 60 word answer first paragraph stating exactly what the firm does and where. Written to be extractable by an AI engine asking "what does Shree Giriraj do" |
| 2 | Six service cards | Title, one line outcome, who it is for, link |
| 3 | How we work | Four step process, identical across all services, so the service pages do not repeat it |
| 4 | Areas strip | Links to all four area pages |
| 5 | FAQ | Four questions on fees, exclusivity, coverage and timelines |
| 6 | CTA band | WhatsApp plus phone |

Sample answer first paragraph:

> Shree Giriraj Real Estate is a family run property firm in Borivali West, Mumbai, operating since 1996. We handle resale flats, rentals, new project bookings, society redevelopment advisory, commercial shops and plots, and interior and civil work, across Borivali West, Borivali East, Kandivali and Malad. MahaRERA registered, reg. no. A51800005726.

That is 52 words, contains the entity, the location, the service list, the service area, the founding year and the registration. It is written to be quoted whole.

---

## 3. Service detail template, all six

**Schema.** `Service` plus `FAQPage` plus `BreadcrumbList`.
**CTA.** WhatsApp primary, phone secondary, repeated after sections 3 and 6.

| # | Section | Contents | Why |
|---|---|---|---|
| 1 | H1 plus answer block | Service name with location. 40 to 60 word answer first paragraph | `ai-seo` extraction |
| 2 | Who this is for | Three or four bullets naming real situations, not personas | `cro` self identification |
| 3 | What we actually do | Numbered steps. Concrete and specific to this service | `cro` process transparency |
| 4 | What it costs and how we are paid | Honest fee structure, or the honest reason it varies | `cro` objection handling. This is the objection nobody addresses |
| 5 | Where we do this | Links to all four area pages with suburb specific anchors | `site-architecture` cross linking |
| 6 | Common problems we catch | Three or four real failure modes you have seen | The differentiator. Nothing else on this page is uncopyable |
| 7 | Proof | Case study link or testimonial. **Empty until real ones exist** | `cro` social proof |
| 8 | FAQ | Six to eight questions, drawn from the People Also Ask data in `05-aeo-faq.md` | AEO |
| 9 | Related services | Two lateral links | Internal linking |
| 10 | CTA band | WhatsApp, phone, office address | Conversion |

### Per service variation

| Service | Priority | Volume evidence | Specific emphasis |
|---|---|---|---|
| **Rentals** | **Highest** | 1 bhk for rent in borivali 590 a month, flat for rent in borivali 480, rent agreement mumbai 480 | Section 4 covers brokerage clearly. Add a leave and licence explainer block, since "leave and license agreement mumbai" runs 110 a month with low competition and it is the question tenants actually ask |
| **Interiors** | **Highest** | 2 bhk interior design cost 1,600 a month CPC $2.28, interior designer borivali 480, modular kitchen cost mumbai 390 | **Cost is the whole game here.** Every PAA question on this SERP is about price. Section 4 becomes a real cost band table, not a "contact us". This is the one page where withholding price loses you the query |
| **Resale flats** | High | resale flat in borivali 30, flats in borivali west 260, property rates in borivali 110 | Section 6 covers title checks, society NOC, and the difference between agreement value and market value |
| **New project bookings** | High | new projects in kandivali 260, under construction projects in borivali 50, CPC up to $1.02 | Links prominently to Jaswanti Jewel. Section 6 covers possession delay risk and how to read a MahaRERA listing |
| **Redevelopment** | Medium | corpus fund in redevelopment 210 low competition, society redevelopment process 70, redevelopment agreement 50 | **Corpus fund is the entry point,** it has three times the volume of the process query. Lead the FAQ with it. AI Overview present on this SERP |
| **Shops and plots** | Medium | shop for rent borivali 40, from prior research | Lowest volume. Write for credibility and referral, not for density. Do not pad it |

### Sample section 6, Rentals

> **What we check before you sign**
>
> **Who actually owns it.** More rental disputes in Borivali start with a flat let out by a family member who was not authorised to let it than with anything else. We see the ownership document, not a photograph of it.
>
> **Whether the society will register you.** Some societies in the older Chikoowadi buildings still resist non member tenants, particularly single tenants and bachelors. Better to know in week one than after you have paid the deposit.
>
> **Water timing, not water supply.** Almost every building has water. The question is at what hour and for how long. We will tell you before you see the flat.
>
> **What the deposit really is.** Ten months is common in this belt. If someone asks for less, there is usually a reason, and it is worth knowing what it is.

That is the voice. Specific, useful, slightly blunt, and impossible for a portal to write.

---

## 4. Areas index `/areas`

**Purpose.** Hub for the four suburb pages, and a genuine comparison resource.
**Intent.** Comparison. "borivali or kandivali", "best area to live in mumbai western suburbs" returned no measurable volume, so this page is built for the hub role and for AI fan out coverage, not for a head term.
**Schema.** `ItemList`, `BreadcrumbList`.

| # | Section | Contents |
|---|---|---|
| 1 | Intro | Answer first paragraph naming all four suburbs and the firm's coverage |
| 2 | Comparison table | Four rows. Columns: connectivity, who moves here, rough price direction, what surprises people. **Tables beat prose for comparison content** per `ai-seo` |
| 3 | Four area cards | Link out with descriptive anchors |
| 4 | Which suburb suits you | Three short scenarios routing to the right page |
| 5 | CTA band | WhatsApp |

Section 2 is the AEO asset on this page. A comparison table is the single most cited content format per the `ai-seo` citation share data at roughly 33%.

---

## 5. Area detail template, all four

The highest leverage build in the plan. **Not a listings page.**

**Schema.** `RealEstateAgent` with `areaServed`, plus `Place`, `FAQPage`, `BreadcrumbList`.
**CTA.** WhatsApp primary, repeated after sections 4 and 8.

| # | Section | Contents | Source |
|---|---|---|---|
| 1 | H1 plus answer block | "Property in Borivali West" plus a 40 to 60 word answer covering what the suburb is, who moves there and what you do there | `ai-seo` |
| 2 | The honest introduction | Three to four paragraphs of genuine local knowledge from your Day 2 answers. Pockets, roads, society clusters. **This section is written by you, not by Claude Code** | Day 2 block |
| 3 | What it costs here | Price direction and range, with a stated "as of" month. **No invented figures.** If unverifiable, describe direction rather than numbers | Facts discipline |
| 4 | What to check before you buy or rent here | Four to six suburb specific checks. The uncopyable section | Day 2 block |
| 5 | Getting around | Station, bus, Link Road, Western Express Highway, metro where relevant, schools and hospitals by name | Local specifics |
| 6 | Services we run here | Links to all six service pages with suburb specific anchors | Internal linking |
| 7 | Projects here | Jaswanti Jewel appears on Kandivali only | Cross link |
| 8 | Nearby areas | Lateral links to the other three suburbs | Fan out coverage |
| 9 | FAQ | Six questions **taken verbatim from live People Also Ask data**, listed in `05-aeo-faq.md` | AEO |
| 10 | CTA band | WhatsApp, phone, office | Conversion |

### Per area

| Page | Anchor query | Volume | Competition | Notes |
|---|---|---|---|---|
| `/areas/borivali-west` | borivali west property | 140 | **HIGH** | Also targets flats in borivali west at 260. High competition means section 2 quality is what wins, not keywords |
| `/areas/borivali-east` | property in borivali east | 90 | HIGH | Differentiate hard from West. What actually differs, honestly |
| `/areas/kandivali` | kandivali west flats | **390** | MEDIUM | Highest area volume of the four. Also carries the Jaswanti Jewel cross link. Real estate kandivali was measured low competition previously |
| `/areas/malad` | malad west property | 110 | **HIGH**, CPC $3.97 | That CPC is the highest in the whole dataset. Somebody is paying real money for Malad intent. Worth noting for `08-paid-campaigns.md` |

### PAA questions confirmed live for Borivali West

Straight from the SERP pull. Use these, do not invent alternatives:

- What is the typical cost of a flat in Borivali West
- What is the best area to live in Borivali West
- What is the price range for a 1 BHK flat in Borivali West
- What is the average price of a 3 BHK flat in Borivali West, Mumbai

**All four are price questions.** That is the whole demand signal for this suburb.

**Status 25 August 2026: you have deferred the pricing decision, so the launch default is full masking.**

Two consequences to accept knowingly, so this is a considered trade rather than a drift:

1. **These four questions go unanswered, and they are the entire demand signal for the suburb.** A page that answers none of them is unlikely to rank for them, and an AI engine will cite whoever does
2. **The numbers are already public.** Housing and 99acres publish per unit asking prices across Borivali and Kandivali. Masking is not protecting private information, it only makes your page less complete than the portal's, on a query where you are already competing with that portal

**What the page does instead at launch.** Answer with direction and context rather than numbers: which pockets sit at the top and bottom of the range and why, what has moved in the last two years, what drives the difference between two apparently similar flats. That is genuinely useful, it is defensible, and it is something a portal cannot write. It will not fully satisfy a "what is the price" query, but it is the best available under the constraint.

**Revisit trigger:** after 4 to 6 weeks of Search Console data, check impressions and average position for the price queries. If these pages are not ranking, this is the most likely reason, and it is a cheap decision to reverse.

---

## 6. Projects index `/projects`

**Purpose.** Container for project pages. Currently one project.
**Schema.** `ItemList`, `BreadcrumbList`.

| # | Section | Contents |
|---|---|---|
| 1 | Intro | Answer first paragraph on what booking through you adds versus going direct |
| 2 | Current projects | Jaswanti Jewel card |
| 3 | Why book through us, not direct | Three points. The real objection on this page: buyers assume going direct is cheaper |
| 4 | Register for upcoming launches | Email or WhatsApp capture. A genuine lead magnet, see section 14 |
| 5 | CTA band | WhatsApp |

Section 3 handles the objection nobody writes about. Suggested copy:

> **The price is the same. What changes is what you know.**
> Builder pricing is fixed. You do not pay us more by coming through us, and you do not pay the builder less by walking in alone. What you get is somebody who has seen the other towers going up in Kandivali, knows which floors actually got the view they were sold, and will tell you which configuration is overpriced for what it is.

---

## 7. Jaswanti Jewel `/projects/jaswanti-jewel`

**This page has a real branded query behind it: 720 searches a month, low competition, CPC $0.90.** Brokers are already capturing it. The SERP carries a knowledge graph, Google reviews, third party reviews, short videos and images, which means a text only page will lose.

**Intent.** Commercial, high. People searching the project name are deep in consideration.
**Primary CTA.** Get the current price sheet, which is a **gated** action. Secondary, WhatsApp.
**Schema.** `Residence` plus `FAQPage` plus `BreadcrumbList`. **No `Product` or `offers` block** while pricing is masked, because marking up masked prices would be inaccurate structured data. `schema` guide, accuracy first.

| # | Section | Contents |
|---|---|---|
| 1 | H1 plus answer block | Project name, G+37 single tower, location off M.G. Road Kandivali West, configurations 2 to 5 BHK, **project MahaRERA number**. Answers "what is Jaswanti Jewel" in 40 to 60 words |
| 2 | Location | Distance to Kandivali station, Link Road, Western Express Highway, metro, named schools and hospitals |
| 3 | Configurations | Table: type, carpet area, floor band, indicative price **masked**, with "price sheet verified [month]" |
| 4 | Price gate | "Get the current all inclusive price sheet and floor availability." Name plus phone. Delivered on WhatsApp. See section 14 |
| 5 | Amenities | Sky clubhouse at roughly 390 ft, infinity pool, automated car parking, home automation, EV charging, Italian marble, spa and salon, gym. **Every item checked against the builder brochure on Day 3** |
| 6 | Media | Images and video. The SERP shows short videos ranking. A walkthrough video embedded here, and posted to YouTube, is a real opportunity |
| 7 | What we would check | Your honest read: which floors, which configuration is fair value, what to ask the builder. **The section no broker microsite will write** |
| 8 | RERA and approvals | Project MahaRERA number, link to the MahaRERA listing, your agent registration |
| 9 | FAQ | The live PAA questions, listed below |
| 10 | CTA band | WhatsApp, site visit request |

### PAA questions confirmed live for "jaswanti jewel"

- What is the price range at Jaswanti Jewel
- Where is the Jaswanti Jewel located
- What is Jaswanti Jewel known for
- What is the price range for a 1 BHK flat in Kandivali West

The first is the dominant query and it collides with your masking policy, which you have deferred and therefore left as full masking at launch. My recommendation, for when you revisit it: answer with a genuine band ("2 BHK configurations currently start in the low ₹2 crore range, all inclusive, as verified in [month]") and gate the exact floor by floor sheet. A band plus a date satisfies the query and the AI engine. A blank does not, and a competitor's answer gets cited instead.

**The last PAA question mentions 1 BHK.** The brief lists 2, 3, 4 and 5 BHK only. Do not add a 1 BHK. Answer honestly that the project does not offer one and point to alternatives.

### Verification gate for this page

| Item | Status |
|---|---|
| MahaRERA position | **Resolved 25 August 2026.** `A51800005726` is the agent registration, and you act as agent rather than promoter, so the page carries your agent number. **Recommended, not required: add the project's own number when Ashray supplies it.** Every competing page in that SERP shows one and buyers look for it |
| MahaRERA declared completion date | **Blocking if the page states a possession date.** Register dates and brochure dates frequently differ, and the register is the defensible one. If you cannot get it, do not state a possession date at all |
| Developer name | **Confirmed 25 August 2026: Ashray.** Use "Ashray Group" or "Ashray Realtors" once you confirm which trading name they use publicly |
| Carpet areas 766, 788 to 795, 1006, 1055 sq ft | Verify against the builder sheet |
| "28th floor", "lower floor", "higher floor" bands | Verify |
| Sky clubhouse at 390 ft | Verify against brochure |
| Price sheet date | Required before publishing any figure |
| Project name | **Resolved 25 August 2026.** Jaswanti Jewel is the featured project. Jaswanti Gold is a separate Ashray project, see section 0 |

**If the project MahaRERA number cannot be confirmed, this page must not promote the project.** MahaRERA requires the registration number on property advertisements. Reduce to a generic new launches page until it is resolved.

---

## 8. About `/about`

**Purpose.** Carry the entire E-E-A-T load. Per `ai-seo`, expert attribution is worth a 25 to 30% citation boost and the site currently has none.
**Intent.** Trust verification. Someone deciding whether to hand you a two crore transaction.
**Schema.** `AboutPage` plus `RealEstateAgent` plus `Person` for each named individual.

| # | Section | Contents |
|---|---|---|
| 1 | H1 plus answer block | Who the firm is, since when, run by whom, from where |
| 2 | The 1996 story | How it started, told plainly. No founder mythology |
| 3 | The people | Named humans, roles, years in the business, photographs. The `teamMember` Sanity schema already exists for this |
| 4 | How we work | Values expressed as practices, not adjectives. "We tell you the problems first" beats "we value transparency" |
| 5 | Credentials | MahaRERA registration with number, any association memberships, the physical office |
| 6 | The office | Photograph, address, map, hours. Proof of a real place |
| 7 | CTA band | Visit, call, WhatsApp |

Section 3 is non negotiable. An unnamed real estate firm asking for two crore decisions is a trust failure, and AI engines cannot cite an author who does not exist.

---

## 9. Contact `/contact`

**Purpose.** Convert, and anchor local SEO with exact NAP.
**Schema.** `ContactPage` plus `LocalBusiness` with `geo`, `openingHoursSpecification`, `hasMap`.

| # | Section | Contents |
|---|---|---|
| 1 | H1 plus the three ways to reach you | WhatsApp, both phones click to call, email |
| 2 | NAP block | Exact address, **character for character identical to the Google Business Profile.** Any variance splits your local signal |
| 3 | Map | Embedded, with a link to the GBP listing |
| 4 | Hours | Structured, matching GBP exactly |
| 5 | Form | Four fields maximum. See section 13 |
| 6 | How to find us | Landmark directions from Borivali station. Genuinely useful in Mumbai, where addresses are approximate |
| 7 | What happens next | "We reply on WhatsApp, usually the same day." Sets expectation, reduces abandonment |

---

## 10. Blog index `/blog` and post template

**Blog index schema.** `Blog`, `BreadcrumbList`.
**Post schema.** `BlogPosting` plus `BreadcrumbList`. Add `FAQPage` only where the post carries a genuine FAQ block.

### Post template

| # | Section | Contents |
|---|---|---|
| 1 | H1 | Matches the target query phrasing |
| 2 | Answer block | 40 to 60 words answering the title question directly, before any preamble. **The single most important element for AI citation** |
| 3 | Last updated date | Displayed. `ai-seo` weights freshness heavily and undated content loses |
| 4 | Author byline | Named, with role and years of experience. Links to `/about` |
| 5 | Body | H2 and H3 headings phrased as questions where natural. One idea per paragraph |
| 6 | Data or table | Where the topic supports it. Tables and statistics carry the largest citation boost |
| 7 | Sources | Outbound links to MahaRERA, the Maharashtra registration department, RBI. Citing sources is the single highest ranked GEO method at plus 40% |
| 8 | Cluster link | Link back to the pillar guide with descriptive anchor |
| 9 | Related posts | Two or three |
| 10 | Soft CTA | Contextual, not a hard sell. Cold readers convert on the next visit, not this one |

---

## 11. Guides index `/guides` and pillar template

**Schema.** `Article` plus `FAQPage` plus `BreadcrumbList`.
**Length.** 3,500 to 5,000 words. These are the AI citation targets.

| # | Section | Contents |
|---|---|---|
| 1 | H1 plus answer block | |
| 2 | Table of contents | Jump links. Also gives crawlers a section map |
| 3 | Definition block | "What is X" in 40 to 60 words, self contained |
| 4 | Step by step process | Numbered. Numbered lists beat paragraphs for process queries |
| 5 | Cost and numbers table | With sources and dates |
| 6 | Common mistakes | Your experience, first hand. E-E-A-T |
| 7 | Local specifics | What differs in Borivali, Kandivali and Malad. The section no national publisher can write |
| 8 | FAQ | Eight to twelve questions |
| 9 | Spoke links | To every post in the cluster |
| 10 | CTA | Contextual |

---

## 12. Case studies `/case-studies` and template

**Nothing publishes here without written client consent.** Full templates and intake in `04-social-proof.md`.
**Schema.** `Article`. `Review` **only** where the client has given an attributable quote and consent.

| # | Section | Contents |
|---|---|---|
| 1 | H1 | The situation, not the outcome. "A Chikoowadi family who needed to sell before possession" |
| 2 | Summary box | Situation, what we did, outcome, timeline. Scannable |
| 3 | The situation | |
| 4 | What we did | |
| 5 | What went wrong | **Include this.** Every case study without a problem reads as fiction |
| 6 | Outcome | Real numbers only where consented. Otherwise describe without figures |
| 7 | Client quote | Verbatim, attributed as agreed |
| 8 | Service link | To the relevant service page |

---

## 13. Forms

Per `cro` and `lead-magnets`: every extra field costs 5 to 10% conversion.

| Form | Fields | Rationale |
|---|---|---|
| Homepage and contact | Name, phone, intent, area | Four is the ceiling. Email is **not** collected. WhatsApp is the channel, so an email field is friction that buys nothing |
| Price sheet gate | Name, phone | Two fields. Highest intent action on the site |
| Launch register | Name, phone, budget band | Budget band qualifies, and people volunteer it here |

**Every form must capture `gclid` and UTM parameters in hidden fields.** Without a stored `gclid` there is no offline conversion import, and without that Google Ads is optimising blind. Detail in `07-analytics-ga4.md`.

**Friction to remove:** no email field, no captcha, no "preferred contact time", no consent checkbox beyond what law requires, no multi step wizard.

---

## 14. Lead magnets

Per `lead-magnets`, matched to buyer stage.

| Magnet | Stage | Gate | Placement | Effort |
|---|---|---|---|---|
| **Jaswanti Jewel price sheet and floor availability** | Decision | Full gate, name plus phone | Project page, homepage featured block, ads landing page | Zero. It already exists as a document |
| **Suburb buyer checklist**, one per area | Consideration | Ungated with optional WhatsApp | Area pages | Low. Comes out of your Day 2 answers |
| **Upcoming launch register** | Consideration | Full gate | Projects index, new project bookings page | Zero |
| **Society redevelopment readiness checklist** | Awareness to consideration | Partial gate | Redevelopment page, redevelopment cluster posts | Medium. High value for committee members |
| **Interior cost calculator** | Consideration | Ungated, WhatsApp to proceed | Interiors page | Medium. But "2 bhk interior design cost" is 1,600 a month at CPC $2.28 and every PAA question on that SERP is about cost. This is the strongest free tool opportunity on the site |

The price sheet gate is the highest value and lowest effort item here. It converts the exact traffic that is already searching the project name 720 times a month.

---

## 15. Paid landing pages `/lp/*`

`noindex, follow`. Excluded from sitemap. Structure per `cro` landing page framework.

| # | Section | Contents |
|---|---|---|
| 1 | Hero | Headline **matching the ad copy word for word.** Message match is the largest Quality Score lever you control |
| 2 | Single CTA | One action. No navigation, no header links, no footer links out |
| 3 | Three proof points | Since 1996, MahaRERA registered, physical office |
| 4 | What you get | Three or four specific bullets |
| 5 | Form or WhatsApp | Two fields |
| 6 | Objection block | Three FAQs handling the specific hesitation for that campaign |
| 7 | Trust footer | Address, MahaRERA, phones |

The nav is stripped deliberately. Every outbound link on a paid landing page is a leak.

Per campaign detail in `08-paid-campaigns.md`.

---

## 16. Legal pages

`/privacy` and `/terms`. `WebPage` schema. Standard content covering data collection, WhatsApp and form data, GA4 and advertising cookies, retention and contact for deletion. Linked from the footer and from every form. Low priority to write, but a form collecting phone numbers without a privacy policy is a real exposure.

---

## 17. Master claims verification list

Every claim on the site that needs your signoff before launch. This is the Day 5 gate.

| # | Claim | Page | Status | Substantiation needed |
|---|---|---|---|---|
| 1 | 4.8★ client rating | Home | **Remove Day 1** | **Checked 25 Aug 2026: the Google rating is 5.0 from 2 reviews, so 4.8 cannot be sourced to Google.** And 5.0 from 2 is not displayable either, since the count reads as thin. Display no rating until roughly 10 reviews, then show it with the count and link it to GBP. Never as `AggregateRating` schema on your own domain |
| 1b | **NAP across the whole site** | Site wide | **Correct Day 1** | The site and the draft HTML said "11, Garden Groove Shopping Centre, Chikuwadi, Borivali (W)". The Google profile says "Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West". Same place, two names. **The GBP string is the master.** Garden Groove moves to the how to find us prose on `/contact` only. Note the spelling changes: Chikoowadi, and Borivali West spelled out |
| 2 | 25+ years | Home | **Correct Day 1** | It is 30 years. Use "Since 1996" |
| 3 | Established 1996 | Home, About | Verify | Shop establishment licence, GST registration, partnership deed, or the oldest registered agreement you hold. Keep one on file |
| 4 | MahaRERA A51800005726 | Site wide | **Confirmed 25 Aug 2026: agent registration.** Verify it is still current | Correct as used. Also worth promoting rather than burying, since many operators in this market are unregistered |
| 5 | Jaswanti Jewel project MahaRERA | Project page | **No longer blocking.** Add when supplied | You have confirmed your position: you act as the registered agent, not the promoter, so your agent registration is what the page carries. **My recommendation stands that you display the project number as well once Ashray supplies it.** It costs nothing, buyers look for it, and it is the standard on every competing project page in that SERP. Source from the builder or MahaRERA, never a portal |
| 6 | Developer identity | Project page | **Unverified** | Portals say "Ashray". Confirm |
| 7 | Carpet areas and floor bands | Project page | Verify | Builder price sheet |
| 8 | Masked prices ₹2.**Cr etc | Project page | Verify | Confirm masking stays, supply the sheet date |
| 9 | Amenity list | Project page | Verify | Builder brochure, item by item |
| 10 | "Direct builder relationships" | Home, services | Verify | Name one, or soften |
| 11 | "Often before they hit the open market" | Home | Verify | One evidenced instance, or cut |
| 12 | Any price range on area pages | Area pages | Verify | Your own transaction knowledge, with a stated month |
| 13 | Stamp duty rates | Blog, guides | Verify | Cite the Maharashtra registration department directly, with the date checked |
| 14 | Testimonials | Home, services | **Blocked** | Written consent plus agreed attribution. Nothing renders until then |
| 15 | Case study outcomes | Case studies | **Blocked** | Written consent. No figures without it |
| 16 | Service area coverage | Site wide | Verify | Confirm you genuinely service all four suburbs equally |

Items 1, 2, 5, 14 and 15 are hard blocks. The rest are verification tasks distributed across Days 2 to 5.
