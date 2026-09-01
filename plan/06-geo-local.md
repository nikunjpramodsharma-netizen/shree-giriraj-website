# 06. GEO: Two Workstreams

You asked for these to be planned separately because the acronym is overloaded. They are genuinely different disciplines with different owners, different timelines and different measurement.

- **Workstream A: Generative Engine Optimization.** Getting cited by ChatGPT, Perplexity and Google AI Overviews
- **Workstream B: Local and geographic SEO.** Google Business Profile, NAP, local pages, citations, reviews

They share one asset. Your Google Business Profile is simultaneously the foundation of workstream B and, per the `ai-seo` third party presence pillar, one of the strongest citation sources feeding workstream A. Everything else is separate.

Frameworks: `ai-seo` (all three pillars, platform behaviour, monitoring), `seo-audit` (local business failure modes, NAP, location pages), `schema` (LocalBusiness).

---

# WORKSTREAM A: Generative Engine Optimization

On page tactics, answer formats and FAQ question sets are in `05-aeo-faq.md`. This section covers the programme: entity, presence, and measurement.

## A1. The honest starting position

**Your entity presence is thin, but not zero.** No structured data anywhere on the site, no named humans, no Wikipedia entry, no third party profiles I could find. You **do** have a claimed Google Business Profile, which is the single most important entity anchor and is already in place. What it lacks is a review corpus: two reviews.

To an AI engine today, Shree Giriraj Real Estate resolves weakly. It exists as a Google listing and as a string of text, with almost nothing corroborating it.

That is not a criticism of the build. It is simply where you start, and it means the first job is not optimisation, it is existence.

## A2. Establish the entity

An AI engine needs to resolve "Shree Giriraj Real Estate" to a specific business with specific attributes. That resolution happens through consistent, corroborating signals across multiple sources.

| Signal | Action | Priority | Day |
|---|---|---|---|
| `RealEstateAgent` and `LocalBusiness` schema on the site | Name, address, phones, email, geo, opening hours, areaServed, foundingDate 1996, MahaRERA identifier, sameAs links | **Highest** | 1 |
| `Person` schema for named staff | The `teamMember` schema already exists and is unused | **Highest** | 2 |
| Google Business Profile | **Already claimed.** Add secondary categories, verify the pin, seed Q and A, add photos | **Highest** | 1 |
| `sameAs` links from site schema to every profile you control | GBP, Facebook, Instagram, JustDial, YouTube | High | 2 |
| Consistent NAP everywhere | Section B2 | High | Ongoing |
| `llms.txt` | Plain description of the business, area served and key page links | Medium | 1 |

**On Wikipedia.** The `ai-seo` guide notes Wikipedia is roughly 7.8% of ChatGPT citations. **You are not Wikipedia notable and you should not attempt a page.** A local estate agency does not meet notability guidelines, the page would be deleted, and attempting it is a reputational risk. Ignore this lever entirely.

## A3. Presence, ranked by what the SERP data actually showed

I checked six live SERPs. On three of them a third party or user generated source outranks every local agent. That tells you where the citations are better than any general guidance.

| Source | Evidence from the SERP pull | Action | Priority |
|---|---|---|---|
| **Google Business Profile** | Local pack present on "interior designer borivali". Your profile is claimed but sits at 2 reviews | Optimise it, then run the review programme in B5. **Reviews are the binding constraint** | **Highest** |
| **YouTube** | A YouTube video ranks 8th for "flats in borivali west". Short videos appear on the "jaswanti jewel" SERP | Walkthrough videos: Jaswanti Jewel sample flat, one per suburb, one on the resale checking process | **High** |
| **Reddit** | A Reddit thread ranks 6th for "interior designer borivali" | Answer honestly in r/mumbai and r/india when property questions come up. Identify yourself as an agent. Do not seed threads | Medium |
| **JustDial** | Ranks 2nd for "interior designer borivali" | Claim and complete the listing. It is a citation source and a directory in one | Medium |
| **Facebook** | A Facebook post ranks 6th for "flat for rent in borivali" | A maintained page with real listings is worth more here than it looks | Medium |
| Quora | Not in the pulled SERPs, but cited by AI engines generally | Answer Mumbai property questions with real depth | Low |
| Housing, 99acres, MagicBricks agent profiles | These domains own every transactional SERP | An agent profile on a portal you cannot beat is a citation source, not a surrender | Medium |

**The strategic read.** You cannot outrank portals for transactional queries. But an AI engine asked "who is a good property agent in Borivali" does not simply return the top ranking page, it synthesises from sources that describe agents. Portal agent profiles, JustDial, GBP reviews and Reddit mentions are all sources that describe you. Being present on them is the play.

**YouTube deserves more weight than it usually gets.** It is the second largest search engine, Google AI Overviews cite it frequently, and video already ranks on two of your six target SERPs. A phone shot walkthrough of a Jaswanti Jewel sample flat, with honest commentary, could realistically capture a share of 720 monthly branded searches. That is a higher return per hour than most of the content plan. It is not in the 5 days, but it belongs early in the backlog.

## A4. Content structure

Covered in full in `05-aeo-faq.md`. The four that matter most, restated:

1. Answer first paragraphs on every page. 40 to 60 words, self contained
2. Named author bylines and displayed last updated dates
3. Outbound citations to primary sources. Highest ranked GEO method at +40%
4. Comparison tables. Roughly 33% of AI citations

## A5. Measurement

**Two AI Overviews already confirmed** on "stamp duty in mumbai" and "society redevelopment process". Those are the baseline.

Monthly manual check, 20 queries, roughly 30 minutes. Method in `05-aeo-faq.md` section 6.

| Milestone | Target |
|---|---|
| Entity resolves correctly when you ask ChatGPT "what is Shree Giriraj Real Estate" | Month 2 |
| Cited on any query | Month 4 to 6 |
| Cited on stamp duty in Mumbai or society redevelopment process | Month 6 to 9 |
| Appearing when asked "best property agent in Borivali" | Month 9 to 12 |

**Do not buy an AI visibility tool yet.** At this size the manual check is sufficient and the budget is better spent on ads.

---

# WORKSTREAM B: Local and geographic SEO

This is the workstream that produces leads soonest. For a single location business serving three suburbs, the local pack is worth more than organic rankings, and it is winnable in a way that organic head terms are not.

## B1. Google Business Profile

**The single highest value asset in this entire plan.** More valuable than the website. It sits above organic results, it carries reviews, it drives calls and directions, and it feeds workstream A.

### It already exists, and that changes the schedule

**Confirmed 25 August 2026. The profile is live and claimed.** It carries photographs, set opening hours and a Street View link, which are not present on an unclaimed auto generated listing.

**This removes the biggest external clock in the plan.** I had budgeted 1 to 2 weeks for postcard verification and sequenced the review programme behind it. That constraint is gone. **Review generation can start on Day 1 instead of week 3.** Given the findings below, it should.

### What the profile currently shows

| Field | Current value | Assessment |
|---|---|---|
| Name | Shree Giriraj Real Estate | Correct. No keyword stuffing. Leave it |
| Rating | **5.0 from 2 reviews** | See section B1.1. This is the important one |
| Primary category | Real estate agency | Correct |
| Secondary categories | **None visible** | **Gap.** See below |
| Address | Shop No 11, Clover Grove, CHS, Chikoowadi, Borivali West, Mumbai, Maharashtra 400092 | Becomes the master NAP. See B2 |
| Phone | 093249 74133 | Matches. Standardise the format site wide |
| Hours | Opens 11am | **Verify.** 11am is late for property viewings if it is not accurate |
| Photos | Present, including the shopfront signboard | Good start. Needs many more |
| Map pin | Appears near **Sector 4 Charkop** while the address says Chikoowadi | **Verify the pin.** A misplaced pin damages local pack relevance and sends people to the wrong street |

### B1.1 The rating problem, and why it is not the win it looks like

**Your Google rating is 5.0 from 2 reviews.** The site claims 4.8★.

Two consequences.

**The 4.8★ claim is still unsubstantiated.** It does not match your Google rating, so whatever its origin, it cannot be sourced to Google. It comes off on Day 1 as planned.

**And 5.0 is not yet displayable either.** A perfect score from two reviews reads as thin, not impressive. Anyone who clicks through sees the count. Displaying "5.0" invites "only two?" and a visitor who was going to trust you now has a reason not to.

**The threshold to display a rating is roughly 10 reviews.** Below that, say nothing about ratings and use "Since 1996" and the MahaRERA agent registration as your trust stats instead.

**This makes review generation the highest priority local task in the plan, and it is now unblocked.** Section B5 moves from week 3 to Day 1.

### What to fix on the profile

| Fix | Priority | Note |
|---|---|---|
| **Add secondary categories** | **High** | Real Estate Consultant, Property Management Company, Commercial Real Estate Agency, and **Interior Designer**. That last one matters: "interior designer borivali" returns a **local pack**, it is your highest CPC cluster at $1.30 with low competition, and you cannot appear in that pack without the category |
| **Verify the map pin** | **High** | Chikoowadi and Sector 4 Charkop are not the same location |
| Verify opening hours | High | Including whether you work Sundays. Sunday hours are a genuine local pack advantage in property |
| Add 20+ photographs | Medium | Office interior, team, more shopfront angles, properties handled |
| Create Products or Services entries | Medium | One per service, six total. Each becomes a searchable surface inside the profile |
| Seed the Q and A section | Medium | You may ask and answer questions on your own profile. Use the six general FAQs from `05-aeo-faq.md`. One of the most underused local levers |
| Weekly Google Posts | Medium | A listing, a market note, a blog post |
| Tag the website link with UTMs | **High** | `?utm_source=google&utm_medium=organic&utm_campaign=gbp_profile`. Without it, GBP traffic is indistinguishable from SEO traffic and you cannot tell whether local work is producing anything |
| Enable messaging | Low | Only if you will actually answer it |

**Do not change the business name and do not change the address** unless B2 forces it. Address edits on a live profile can trigger re verification, and you do not want to risk a working profile for a cosmetic change.

### Setup

| Field | Value | Note |
|---|---|---|
| Name | Shree Giriraj Real Estate | **Exactly this.** No keywords appended. "Shree Giriraj Real Estate, Borivali Property Dealers" is a guideline violation and a suspension risk |
| Primary category | Real Estate Agency | |
| Secondary categories | Real Estate Consultant, Property Management Company, Commercial Real Estate Agency, Interior Designer | **Interior Designer matters.** That SERP has a local pack and it is your highest CPC cluster |
| Address | Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092 | This exact string becomes the master NAP. Everything else copies it |
| Phone | +91 93249 74133 | One primary. The second goes in the additional phones field |
| Website | The `/contact` page, or the homepage. Not both | |
| Hours | Real hours, including a genuine Sunday position | Property runs on Sundays. If you work Sundays, say so, it is a competitive advantage in the local pack |
| Service areas | Borivali West, Borivali East, Kandivali, Malad | |
| Attributes | Identifies as family owned, appointment required or not, wheelchair access if applicable | |
| Opening date | 1996 | Reinforces the founding year signal |
| Description | 750 characters. Answer first, names all four suburbs and all six services | |

### The things people skip that matter

| Item | Why |
|---|---|
| **Photographs, 20 or more** | Office exterior, office interior, the team, the signboard, properties you have handled. Profiles with photos get materially more engagement. Add a few monthly |
| **Products or services entries** | Create one per service, six total. Each becomes a searchable surface within the profile |
| **Google Posts, weekly** | Underused. A new listing, a market note, a blog post. Keeps the profile active |
| **Q and A, seeded honestly** | You may ask and answer questions on your own profile. Seed the six general FAQs from `05-aeo-faq.md`. This is permitted and it is one of the most underused local levers |
| **Messaging** | Enable only if you will actually answer it. An unanswered message is worse than no messaging |
| **Booking or appointment link** | Point at WhatsApp |

### Before you create anything

**Search for an existing listing first.** A profile may already exist, unclaimed, created by Google from other data or by a former customer. Creating a second one produces a duplicate, which splits your signal and is painful to merge later. If a duplicate already exists, claim and merge rather than starting fresh.

I do not know whether a profile exists. It is in the Q&A.

## B2. NAP consistency

The `seo-audit` guide lists inconsistent NAP as the first local business failure mode. It is unglamorous and it is the thing that quietly caps local rankings.

### The conflict, resolved

The site and the brief said **11, Garden Groove Shopping Centre, Chikuwadi, Borivali (W)**. The Google Business Profile says **Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West**.

**Confirmed 25 August 2026: these are the same place.** Most likely Clover Grove CHS is the society and Garden Groove Shopping Centre is the commercial complex within it, which is an ordinary situation in Mumbai and an ordinary way to end up with two addresses for one shop.

**Resolution: the Google Business Profile string becomes the master record.** Two reasons, and the second is the decisive one.

1. Google's own record is the anchor for every local signal
2. **Editing the address on a live, claimed profile can trigger re verification.** The profile already works, has photos and carries reviews. Risking that to make Google match a document is the wrong trade

**The alternate name is not lost.** It goes in the "how to find us" prose on `/contact`, where it is genuinely useful, since Garden Groove is probably how people actually navigate to you. It just does not go in the NAP block, because the NAP block must be one string used identically everywhere.

### The master record

Lock this exact string. Every instance everywhere copies it character for character.

```
Shree Giriraj Real Estate
Shop No 11, Clover Grove CHS
Chikoowadi, Borivali West
Mumbai, Maharashtra 400092
+91 93249 74133
shreegiriraj1224@gmail.com
```

**Note the two spellings that changed:** Chikoowadi becomes **Chikoowadi**, and Borivali West becomes **Borivali West**. The draft HTML, the current site footer and every plan document used the old forms. All of them get corrected. This is exactly the kind of quiet inconsistency that caps local ranking.

### Consistency rules

| Element | Rule |
|---|---|
| Name | "Shree Giriraj Real Estate". Never "Shree Giriraj Realtors", "Shri Giriraj", or with a keyword suffix |
| **Borivali West** | Always spelled out. **Never "Borivali West"** |
| **Chikoowadi** | This spelling, always. **Never "Chikoowadi"** |
| **Clover Grove CHS** | The NAP building name. "Garden Groove Shopping Centre" appears only in the how to find us prose, never in a NAP block or a directory listing |
| Phone format | `+91 93249 74133`. Same spacing everywhere. Not `9324974133`, not `+919324974133`, not `093249 74133` |
| Address order | Identical everywhere |
| Pin code | 400092, always present |

### Where it must appear

| Location | Format |
|---|---|
| Google Business Profile | Master record |
| Site footer, every page | Master record, plus `LocalBusiness` schema |
| `/contact` | Master record, plus `ContactPage` and `LocalBusiness` schema |
| `/about` | Master record |
| Every directory listing | Master record |
| Email signature | Master record |
| WhatsApp Business profile | Master record |

**On the email address.** `shreegiriraj1224@gmail.com` is the verified fact and it is what goes on the site. Worth noting as a business observation rather than a task: a domain email at the new domain would carry more credibility for a firm asking for two crore decisions. Your call, and not a blocker.

## B3. Local landing pages

Four pages, specified in full in `01-architecture.md` section 5 and `02-page-specs.md` section 5.

The local SEO points specifically:

| Requirement | Implementation |
|---|---|
| One page per suburb, genuinely distinct | Four pages. Not templated with the suburb name swapped, which Google identifies as doorway pages |
| Real local content | Your Day 2 answers. Pockets, roads, what to check, what surprises people |
| Named local landmarks | Stations, Link Road, Western Express Highway, named schools and hospitals |
| `areaServed` in schema | Each page's `RealEstateAgent` block names its suburb |
| NAP on every page | Footer |
| Internal links between area pages | Section 7.2 of the architecture file |
| Distinct titles and descriptions | No templating |

**The doorway page risk is real and it is the main thing to guard against.** Four pages that differ only by suburb name are a Google guideline violation. The defence is that sections 2 and 4 of each page contain genuinely different, genuinely local content that only you can supply. This is precisely why Day 2 allocates 75 minutes to it and why that block cannot be skipped.

## B4. Local citations

Consistent NAP mentions across directories. Lower value than they were a decade ago, still a real ranking factor for local, and they are also entity corroboration for workstream A.

**Do not start until the NAP is locked and GBP is verified.** Building 30 citations with the wrong phone format creates 30 problems.

### Tier 1, essential

| Directory | Note |
|---|---|
| Google Business Profile | Done in B1 |
| Bing Places | Feeds Copilot |
| Apple Business Connect | Apple Maps. Frequently skipped in India, cheap to do |
| JustDial | **Ranks 2nd for "interior designer borivali".** Highest value non Google directory for you |
| Sulekha | Strong in Indian local services |
| IndiaMART | Real estate services category |

### Tier 2, property specific

| Directory | Note |
|---|---|
| 99acres agent profile | You cannot outrank them. Be listed on them |
| MagicBricks agent profile | Same |
| Housing.com agent profile | Same |
| CommonFloor, PropTiger | Lower traffic, still citations |

### Tier 3, general

Yellow Pages India, TradeIndia, Yelp India, Facebook Business Page, LinkedIn Company Page, local Borivali and Mumbai suburban directories.

**Realistic target: 15 to 20 quality citations in weeks 2 to 4.** Not 100. Beyond about 20, the return per listing collapses and you are spending hours for nothing. The `directory-submissions` guide covers the general approach if you want to go further.

**Time cost:** roughly 15 minutes each. Six to eight hours total, spread over three weeks. This is week 2 onward work and it is deliberately outside the 10 hours.

## B5. Review generation

**Twenty real Google reviews will do more for your visibility and your conversion than everything else in workstream B combined.** They are also the honest replacement for the 4.8★ claim you are removing.

**STARTS DAY 1. This is now the highest priority task in workstream B.**

The original plan held this until week 3 because I assumed GBP verification was pending. It is not. The profile is live and claimed, so there is nothing to wait for.

**You are at 2 reviews.** That is the real constraint on your local visibility, more than anything on the website. Review count and recency are direct local pack ranking factors, and 2 reviews is functionally a standing start. Every week you delay is a week of compounding lost.

**Targets, revised.**

| Milestone | Target | Why |
|---|---|---|
| By launch, end of Day 5 | 5 to 8 reviews | Enough to look real |
| Month 1 | **10 reviews** | The threshold at which you can display a rating on the site honestly |
| Month 3 | 20 reviews | Competitive in the local pack |
| Month 6 | 25 to 30 reviews | |

**The Day 1 action:** list every client from the last 18 months you parted from on good terms. Message the first ten. Not a broadcast, ten individual messages. Use the script below.

Ten messages typically yields three to five reviews. Two rounds gets you to the month one target.

### The programme

| Step | Detail |
|---|---|
| When to ask | At the emotional peak, which is possession or key handover, not weeks later |
| How to ask | In person or on WhatsApp, personally. Never a bulk broadcast |
| The link | Google's short review link, sent directly. Every extra tap loses people |
| What to ask for | Specifics. "If you could mention which area and what we helped with, that helps other people more than a star rating" |
| Cadence | Every completed transaction. Build it into your process, do not run it as a campaign |
| Target | 10 reviews by month 2, 25 by month 6 |

### The ask, in your voice

> "We are trying to build up our Google reviews properly rather than asking everyone at once. If you have two minutes, it would genuinely help. If you can mention which area and what we sorted out, that is more useful to the next person than just the stars."

### Rules

| Rule | Why |
|---|---|
| **Never incentivise a review** | Google policy violation. Reviews get removed and the profile can be penalised |
| **Never gate for positive sentiment** | Asking only happy clients is a policy violation. Ask everyone who completed |
| **Respond to every review, positive and negative** | Response rate is a signal, and it is visible to every future reader |
| **Respond to negatives calmly and specifically** | A well handled negative review builds more trust than a wall of five stars |
| **Never buy reviews** | Detectable, and in a market this small, socially catastrophic |

### Responding to a negative review

> "Thank you for saying so, and I am sorry the [specific thing] went the way it did. [One sentence of honest acknowledgement.] [What you did or would do differently.] If you would like to talk it through, my number is 93249 74133 and it is the same one I have had since we opened."

No defensiveness, no dispute of facts, no "we have no record of you as a client".

## B6. Local link building

Local links are worth more per link than general ones for local ranking.

| Source | Approach | Effort |
|---|---|---|
| Borivali and Mumbai suburban news sites | Comment on local property market changes when asked. Be a source | Medium |
| Local business associations, Chikoowadi and Borivali trade bodies | Membership usually carries a listing with a link | Low |
| Housing societies you have worked with | Some society websites list recommended vendors | Low |
| Local schools and clubs | Sponsorship carries a link, and it is genuinely local | Low |
| Interior and civil contractors you work with | Reciprocal listing, honestly declared | Low |
| Mumbai property bloggers and YouTubers | Offer genuine local commentary | Medium |

Not launch work. Weeks 4 onward.

## B7. Local schema

Detail in `09-technical.md`. The local specific requirements:

| Property | Value |
|---|---|
| `@type` | `RealEstateAgent`, which is a subtype of `LocalBusiness` |
| `name`, `address`, `telephone`, `email` | Master NAP, exactly |
| `geo` | Latitude and longitude of the office, taken from GBP once verified |
| `openingHoursSpecification` | Matching GBP exactly |
| `areaServed` | Four `Place` entries for the four suburbs |
| `foundingDate` | `1996` |
| `sameAs` | GBP, Facebook, Instagram, JustDial, YouTube |
| `identifier` | MahaRERA **Agent** Registration A51800005726. Label it precisely. This is the agent registration, not a project one |
| `priceRange` | Omit, or a genuine indicator. Do not invent one |
| `aggregateRating` | **Never.** Self serving review markup. See `04-social-proof.md` |

## B8. Measurement

| Metric | Where | Baseline | Target |
|---|---|---|---|
| GBP views, searches, discovery | GBP Insights | Zero | Establish month 1 |
| GBP calls | GBP Insights, and a tracked GA4 event | Zero | Growing month over month |
| Direction requests | GBP Insights | Zero | Any is a good signal |
| Local pack position for the four area queries | Manual check monthly, from a Borivali location | Absent | Top 3 by month 6 |
| Review count and rating | GBP | Zero | 10 by month 2, 25 by month 6 |
| Citation consistency | Manual audit quarterly | Zero listings | 15 to 20 consistent by month 2 |
| Organic impressions for the four area queries | Search Console | Zero | Rising from month 3 |

**Local pack position must be checked from a Borivali location or with a location override.** Checking from anywhere else gives a meaningless result, which is a common way people conclude their local SEO is not working when it is.

---

## C. Sequencing across both workstreams

| Week | Workstream A, generative | Workstream B, local |
|---|---|---|
| 1 | Schema, `llms.txt`, robots AI allows, answer first content, bylines | **GBP already live.** Optimise it: secondary categories, pin check, hours, UTM tagged link. **Review outreach begins Day 1.** NAP locked to the GBP string, four area pages live, LocalBusiness schema |
| 2 | Reddit and Quora presence begins | Second review round. Tier 1 citations. GBP photos and Products entries |
| 3 to 4 | First YouTube walkthrough | Tier 2 and 3 citations. Target 10 reviews reached. GBP Posts weekly, Q and A seeded |
| 5 to 8 | Cluster content builds topical coverage. First monthly AI visibility check | Local link building. Photographs added monthly |
| 9 to 12 | Second and third AI checks. Refresh dated content | Local pack position review. Citation audit |
| Month 6 | Target: cited on at least one query | Target: top 3 local pack, 25 reviews |

## D. What I do not know

Logged in `11-open-questions.md`.

1. **Resolved 25 August 2026.** The profile exists, is claimed, and shows 5.0 from 2 reviews. Open sub questions: whether the map pin is correctly placed given the Chikoowadi versus Sector 4 Charkop discrepancy, whether the 11am opening time is accurate, and whether a **duplicate** listing also exists under the Garden Groove address. That last one is worth ten minutes of searching, because a duplicate would be splitting your local signal invisibly
2. Whether Borivali West and Borivali East can both be served from a single profile without a second location, which they should be, but service area behaviour in dense Mumbai geography is worth verifying in practice
3. Whether `parineeinterio.in` ranks third for "interior designer borivali" through content, links or GBP proximity. The answer changes the interiors tactic materially
4. Current local pack composition for the four area queries. I pulled organic results, not local pack contents
5. Whether any of the property portals restrict agent profile links in a way that makes them nofollow and therefore weaker as citations
