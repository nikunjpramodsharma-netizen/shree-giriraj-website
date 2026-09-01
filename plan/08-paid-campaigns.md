# 08. Paid Campaign Readiness

Framework: `ads` (account structure, naming conventions, budget allocation, bid strategy progression, prelaunch checklist), `cro` (landing page structure), `lead-magnets` (the gated offer).

**Updated 25 August 2026. All paid work has moved out of the 5 days entirely,** per your decision to start ads a week after the site is live. It now runs as a separate 2 hour block in week 2, specified in `10-five-day-schedule.md` section 9.

**This is the better sequence and it improves two things.** Tracking gets a full week of real soak rather than 48 hours, so you launch campaigns against verified measurement. And you get a clean pre paid organic baseline to compare against, which cannot be reconstructed afterwards.

**One thing still ships in the 5 days:** `gclid` and UTM capture with cookie persistence, plus the lead storage endpoint. A lead that arrives without a stored `gclid` can never be attributed retroactively, so that has to be live before any ad ever runs.

**Budget confirmed 25 August 2026: 30,000 to 50,000 rupees per month.** Full allocation, and the volume ceiling that constrains it, in section 7.

---

## 1. The CPC data, and what it tells you

Real Google Ads CPC estimates, India, pulled 25 August 2026. These are platform estimates. Your actual costs will differ, sometimes substantially, and you should treat them as relative signals rather than forecasts.

| Query | Volume | CPC | Competition | Read |
|---|---|---|---|---|
| malad west property | 110 | **$3.97** | HIGH | Somebody is paying serious money for Malad intent |
| 2 bhk interior design cost | 1,600 | **$2.28** | MEDIUM | Interiors is where the commercial money is |
| new projects in borivali | 110 | **$2.19** | from earlier research | High intent, high value |
| kandivali west flats | 390 | $1.35 | MEDIUM | |
| interior designer borivali | 480 | $1.30 | LOW | **Low competition at a high CPC. The best combination on the account** |
| new projects in kandivali | 260 | $1.02 | MEDIUM | |
| borivali west property | 140 | $0.99 | HIGH | |
| home loan eligibility | 9,900 | $0.98 | MEDIUM | Lenders bid this. Not your fight |
| under construction projects in borivali | 50 | $0.92 | MEDIUM | |
| **jaswanti jewel** | **720** | **$0.90** | **LOW** | **The single best opportunity on the account** |
| modular kitchen cost mumbai | 390 | $0.68 | MEDIUM | |
| flats in borivali west | 260 | $0.66 | MEDIUM | |
| rent agreement mumbai | 480 | $0.34 | LOW | Informational, poor lead quality |
| **flat for rent in borivali** | **480** | **$0.07** | MEDIUM | **Absurdly cheap. Real intent** |
| **1 bhk for rent in borivali** | **590** | **$0.06** | MEDIUM | **Same** |

### Three conclusions that shape the whole account

**1. Rentals traffic is almost free and you should take all of it.** Six to seven cents a click against 590 and 480 monthly searches with genuine local transactional intent. Even at a poor conversion rate the maths works. The catch is that a rental lead is worth far less than a sale lead, so rentals is a volume and relationship play: rent to someone at 26, sell to them at 32.

**2. Jaswanti Jewel is the best single opportunity on the account.** 720 searches a month, low competition, ninety cents a click, and the searcher already knows the project name and is deep in consideration. From the SERP pull, **brokers are already capturing this traffic**: `housiey.com` and a second domain `jaswanti-jewel.in` both rank. If you have a genuine booking relationship with this project, you should be the first result for its name and you currently are not.

**3. Interiors is the highest value commercial cluster.** $1.30 for "interior designer borivali" at **low** competition, and $2.28 for the cost query. The SERP has a local pack and a local independent already ranking third organically. High CPC plus low competition means advertisers value the click and few are competing. That is the definition of an opportunity.

**Redevelopment gets no search campaign.** The volume is not there (70, 50 and 210 a month against terms that are largely informational) and society decisions are made by committees over months, not by someone clicking an ad. Redevelopment leads come from content, reputation and referral. Spending search budget there would be spending it badly.

---

## 2. Account structure

Per the `ads` naming convention, adapted:

```
GOOG_{Objective}_{Theme}_{Geo}
```

| Campaign | Type | Priority | Month 1 budget | Landing page |
|---|---|---|---|---|
| `GOOG_Search_Brand_Giriraj` | Search, exact and phrase | **Essential** | Rs 1,500 | `/` |
| `GOOG_Search_Jaswanti_Kandivali` | Search, exact and phrase | **High** | Rs 10,000 | `/lp/jaswanti-jewel` |
| `GOOG_Search_Rentals_Borivali` | Search | Cheapest clicks | Rs 2,500, **volume capped** | `/lp/rent-borivali` |
| `GOOG_Search_Resale_Borivali` | Search | Core | **Month 2**, not month 1 | `/lp/buy-borivali` |
| `GOOG_Search_Interiors_Borivali` | Search | **Highest value, largest budget** | Rs 12,000 | `/services/interiors` |
| `GOOG_PMax_Local_Borivali` | Performance Max | Month 3+ | 0 | Multiple |
| `TAB_Traffic_Paperwork_National` | Taboola native | **Deferred to month 3** | 0 | Blog posts |
| `TAB_Traffic_Redevelopment_Mumbai` | Taboola native | **Deferred to month 3** | 0 | Blog posts |

### Notes on the structure

**Brand defence at 5% is not optional.** Competitors and portals will bid on your name. It is the cheapest traffic you will ever buy and losing your own brand query to a portal is an unforced error.

**Interiors points at `/services/interiors`, not a landing page.** Deliberate. That page carries real cost information, FAQ depth and local proof, which is exactly what this query wants. A stripped landing page would score worse on relevance. **This is the exception, not the rule.**

**Performance Max is deferred.** It needs conversion volume to work and you will have none for six weeks. Launching PMax with no conversion history burns budget teaching Google nothing. Revisit at month 2.

---

## 3. Campaign detail

### 3.1 `GOOG_Search_Brand_Giriraj`

| | |
|---|---|
| Landing page | `/` |
| Match types | Exact and phrase |
| Keywords | shree giriraj, shree giriraj real estate, shree giriraj borivali, shri giriraj property, plus common misspellings |
| Bid strategy | Manual CPC or maximise clicks, capped low |
| Negatives | Anything suggesting a different Giriraj business |
| Expected CPC | Very low. Brand terms with a high quality score |

### 3.2 `GOOG_Search_Jaswanti_Kandivali`

The priority campaign.

| | |
|---|---|
| Landing page | `/lp/jaswanti-jewel` |
| Ad groups | 1: project name exact. 2: project plus modifier (price, location, floor plan, review, possession). 3: competitor projects in Kandivali West |
| Keywords | jaswanti jewel, ashray jaswanti jewel, jaswanti jewel kandivali west (110 a month, **CPC $1.80**), jaswanti jewel floor plan (30 a month), jaswanti jewel price, ashray developers (210 a month, low competition, $0.77) |
| MahaRERA | **Unblocked 25 August 2026.** You act as the registered agent rather than the promoter, so your agent registration `A51800005726` goes on the landing page. **Add the project's own number too once Ashray supplies it.** Recommended rather than required, and it costs nothing |
| Bid strategy | Maximise conversions once tracking is soaked. Manual CPC for the first two weeks |
| Negatives | rent, job, career, salary, address only |
| Offer | The gated price sheet. Highest intent, lowest friction |

**On the third ad group.** Bidding on competing Kandivali West projects is legitimate and normal. Do not use competitor project names in ad copy, only as keywords, or you risk a trademark complaint.

**Note on the volume figures.** Several close variants returned no independent volume because Google Ads folds them into the parent term. The 720 a month on "jaswanti jewel" is the number that matters. "jaswanti jewel kandivali west" is separately measurable at 110 a month and carries a **$1.80 CPC, double the parent term**, which tells you that specific phrasing is the higher intent one. Bid it separately.

**"ashray developers" at 210 a month, low competition, $0.77** is worth its own ad group. Somebody searching the developer name is researching before buying, and the developer's own web presence is weak. Their site `ashraygroup.com` currently surfaces what looks like an unfinished template page showing placeholder content and a dollar price. You can outrank the builder on their own name.

### 3.2b Jaswanti Gold: excluded, and it must be negatived

Ashray has a second Kandivali West project, Jaswanti Gold, carrying 3,600 searches a month. **Shree Giriraj does not handle it. Decided 25 August 2026. No campaign targets it.**

**This is not simply an omission. It creates an active negative keyword requirement.**

Two mechanisms will send Jaswanti Gold traffic to you if you do not block it:

1. **Broad and phrase match bleed.** Bidding on "ashray developers" and "jaswanti jewel" will pull "jaswanti gold" queries, because Google treats them as closely related. That is 3,600 monthly searches of traffic you cannot service
2. **Confusion at the SERP.** The two projects share a developer, a suburb and half a name. Searchers already conflate them, and a broker microsite ranks for both

**Add to the negative keyword list on every campaign:**

```
"jaswanti gold"
gold
```

The bare `gold` negative is deliberate and worth the small collateral risk. No legitimate query for your services contains it.

**Then handle the enquiries that get through gracefully.** Some will. The honest answer is that you do not deal in that building and here is what you do cover in Kandivali West, which converts a dead end into a conversation about Jaswanti Jewel or a resale in the same area. Brief yourself on it before the campaigns go live.

### 3.3 `GOOG_Search_Rentals_Borivali`

| | |
|---|---|
| Landing page | `/lp/rent-borivali` |
| Ad groups | 1: rent Borivali. 2: rent Kandivali. 3: rent Malad. 4: BHK specific (1 BHK, 2 BHK) |
| Keywords | flat for rent in borivali, 1 bhk for rent in borivali, 2 bhk for rent in borivali west, flat on rent kandivali, rental flat malad |
| Bid strategy | Maximise clicks initially. CPCs are low enough that volume is affordable |
| Negatives | **Extensive.** free, pg, paying guest, hostel, without brokerage, no brokerage, direct owner, owner direct, nobroker, olx |
| Note | "without brokerage" and "direct owner" negatives are essential. That searcher is explicitly avoiding you and will cost you money and a bad review |

### 3.4 `GOOG_Search_Resale_Borivali`

| | |
|---|---|
| Landing page | `/lp/buy-borivali` |
| Ad groups | 1: buy Borivali West. 2: buy Borivali East. 3: buy Kandivali. 4: **buy Malad**. 5: resale specific |
| Keywords | flats in borivali west, property in borivali west, resale flat in borivali, buy flat in kandivali, kandivali west flats, malad west property |
| Bid strategy | Manual CPC first, then maximise conversions |
| Negatives | rent, rental, pg, job, loan, jobs, salary, price list free |
| **Watch** | **Malad at $3.97 needs its own ad group and its own budget cap.** At that CPC it can quietly consume the campaign. Segment it so you can see it and kill it if it does not convert |

### 3.5 `GOOG_Search_Interiors_Borivali`

| | |
|---|---|
| Landing page | `/services/interiors` |
| Ad groups | 1: interior designer Borivali. 2: interior cost. 3: modular kitchen |
| Keywords | interior designer borivali, interior designer in borivali west, 2 bhk interior design cost, modular kitchen cost mumbai, home interior mumbai |
| Bid strategy | Manual CPC. Higher CPCs need closer control early |
| Negatives | jobs, course, salary, internship, freelance, diploma |
| Note | You compete with Livspace, HomeLane and DesignCafe here. They have larger budgets and cost calculators. **You win on being local and answering the cost question honestly**, not on outspending them |

---

## 4. Landing page mapping

| Campaign | Landing page | Indexed | Why this page |
|---|---|---|---|
| Brand | `/` | Yes | Brand searchers want the real site, not a funnel |
| Jaswanti | `/lp/jaswanti-jewel` | **No** | Single offer, single action, no navigation leaks |
| Rentals | `/lp/rent-borivali` | **No** | Same |
| Resale | `/lp/buy-borivali` | **No** | Same |
| Interiors | `/services/interiors` | Yes | Depth and cost content is what this query rewards |
| Taboola | `/blog/[slug]` | Yes | Cold traffic on a sales page fails. Section 6 |

**Never point an ad at the homepage** except for brand. A homepage serves six services and four suburbs, so it is relevant to nothing specific. Quality Score punishes exactly that.

---

## 5. Quality Score requirements

Quality Score is expected clickthrough rate, ad relevance and landing page experience. You control the last two almost entirely.

### What must exist on every paid landing page

| Requirement | Detail | Component |
|---|---|---|
| **Message match** | The H1 repeats the ad headline nearly word for word. Ad says "Flats for Rent in Borivali West", H1 says the same | Ad relevance. **The largest single lever** |
| **Keyword in H1, first paragraph, title tag** | Naturally, not stuffed | Ad relevance |
| **One primary CTA** | One action. No competing buttons | Landing page experience |
| **No navigation** | Header links stripped, footer minimal. Every outbound link is a leak | Landing page experience |
| **Load under 2.5s LCP on mobile** | Google measures this directly | Landing page experience |
| **Mobile first** | Most of your traffic is on a phone on mobile data | Landing page experience |
| **Trust signals above the fold** | Since 1996, MahaRERA number, physical address | Landing page experience |
| **Privacy policy linked** | **Google Ads requires a privacy policy on lead gen pages.** Ads will be disapproved without one | Policy |
| **Original content** | Not duplicated from a service page. Google penalises thin and duplicated landing pages | Landing page experience |
| **Two field form maximum** | Name and phone | Conversion, not Quality Score, but it is what pays |
| **Working, relevant, no interstitials** | No popups on entry | Policy |

### Landing page structure

| # | Section | Contents |
|---|---|---|
| 1 | Headline | Matches the ad, near word for word |
| 2 | Subhead | The specific offer in one sentence |
| 3 | Primary CTA | WhatsApp or a two field form |
| 4 | Three proof points | Since 1996, MahaRERA registered, office in Borivali West |
| 5 | What you get | Three or four specific bullets. Not features, outcomes |
| 6 | Secondary CTA | Repeat |
| 7 | Three FAQs | The specific objections for this campaign |
| 8 | Trust footer | Address, MahaRERA, both phones, privacy link |

Nothing else. No blog links, no service grid, no "explore our other services".

### Illustrative ad copy

Google RSA limits: headlines 30 characters, descriptions 90 characters. Counts shown so you can verify.

**Rentals**

| Asset | Text | Chars |
|---|---|---|
| H1 | Flats for Rent in Borivali | 26 |
| H2 | Local Agents Since 1996 | 23 |
| H3 | 1, 2 & 3 BHK. WhatsApp Us | 25 |
| D1 | Borivali, Kandivali and Malad rentals from an office that has been here since 1996. | 82 |
| D2 | We tell you about the society and the water timing before you see the flat. | 75 |

**Jaswanti Jewel**

| Asset | Text | Chars |
|---|---|---|
| H1 | Jaswanti Jewel, Kandivali | 25 |
| H2 | Get the Live Price Sheet | 24 |
| H3 | 2, 3, 4 & 5 BHK. G+37 Tower | 27 |
| D1 | Current all inclusive pricing and floor availability, sent on WhatsApp today. | 76 |
| D2 | Booked through a MahaRERA registered agent in the western suburbs since 1996. | 76 |

Note D2 on the rentals ad. It is the differentiator from every portal ad on that SERP, and it is true.

---

## 6. Taboola: the content to conversion path

**Taboola is not Google Ads and treating it like Google Ads is how people lose money on it.**

Taboola traffic is cold, arrives mid scroll on a news site, and had no intent thirty seconds ago. It will not convert on a service page. It will convert, eventually, on a second or third visit.

### The path

```
Taboola native ad on a news site
        ↓  curiosity, money or mistake framing
Long form blog post  (/blog/[slug])
        ↓  genuine value, no hard sell
Soft conversion: area checklist, price sheet, or the guide
        ↓  or exit and get retargeted
Retargeting on Google Display or Meta
        ↓
Service or project page
        ↓
WhatsApp
```

Four steps between ad and enquiry. That is normal and it is why measurement expectations matter.

### The nine hero posts

From `03-content-plan.md` section 11, with the reasoning restated briefly.

| Post | Why it works cold |
|---|---|
| A1 TDS on property purchase | Money plus an unknown penalty. 14,800 a month |
| A2 Occupancy certificate | Loss framing. "You may be living in a flat never legally cleared" |
| A3 Carpet area versus built up | The most relatable "you are paying for space you do not have" story in Indian property |
| A4 Stamp duty in Mumbai 2026 | Money, dated, city specific |
| B1 Home loan eligibility | Everybody wants their number. 9,900 a month |
| B3 The costs nobody budgets for | Pure loss aversion. Strongest cold frame available |
| C3 The ten month deposit | Genuinely surprising. Curiosity plus money |
| E1 Corpus fund in redevelopment | Reaches society committee members, your highest value lead type |
| F1 What a 2 BHK interior actually costs | Aspirational, visual, highest CPC intent at $2.28 |

### Rules for Taboola

| Rule | Why |
|---|---|
| **Never send Taboola traffic to a service or landing page** | Cold traffic on a sales page bounces. You pay for nothing |
| Geo target Mumbai and Maharashtra for local posts, national for paperwork posts | A1, A2, A3, B1 work nationally. C3 and E1 do not |
| Every article must have a soft conversion | A checklist, the price sheet, or the guide. Not a "contact us" |
| Build a retargeting audience from day one | This is arguably the main deliverable of the Taboola spend |
| Judge on assisted conversions, never last click | Judging Taboola on last click will make you switch it off in week two, incorrectly |
| Set a strict daily cap | Taboola can spend quickly across a wide publisher network |
| Block poor publishers weekly | Taboola reports placement level. Some publishers produce clicks and nothing else. Prune them |
| Test headlines aggressively | Native is a headline medium. Creative variance dominates everything else |

### What I do not know about Taboola

**Blocking questions for Day 1.**

1. Minimum spend commitment for India. I have seen figures quoted but will not repeat an unverified number
2. Whether real estate carries category restrictions or additional verification in India
3. Realistic CPCs for this geography and category
4. Whether their India inventory is strong enough in Mumbai to be worth it at all

**Ask a Taboola representative directly on Day 1.** If the minimum is high relative to your budget, the honest answer may be that Taboola is not viable yet, and the content assets still serve organic and Google Display retargeting. That would not be a failure of the plan, it would be the plan working.

---

## 7. Budget allocation

**Confirmed 25 August 2026: ₹30,000 to ₹50,000 per month.**

All CPC figures in section 1 came back in US dollars. Converted at roughly ₹87 to the dollar, which you should sanity check against the current rate, they look like this.

| Query | Volume | CPC USD | **CPC INR** |
|---|---|---|---|
| malad west property | 110 | $3.97 | **₹345** |
| 2 bhk interior design cost | 1,600 | $2.28 | **₹198** |
| new projects in borivali | 110 | $2.19 | ₹191 |
| jaswanti jewel kandivali west | 110 | $1.80 | ₹157 |
| kandivali west flats | 390 | $1.35 | ₹117 |
| interior designer borivali | 480 | $1.30 | **₹113** |
| new projects in kandivali | 260 | $1.02 | ₹89 |
| borivali west property | 140 | $0.99 | ₹86 |
| **jaswanti jewel** | **720** | $0.90 | **₹78** |
| flats in borivali west | 260 | $0.66 | ₹57 |
| rent agreement mumbai | 480 | $0.34 | ₹30 |
| **flat for rent in borivali** | **480** | $0.07 | **₹6** |
| **1 bhk for rent in borivali** | **590** | $0.06 | **₹5** |

### The finding that matters more than the budget

**At ₹30,000 to ₹50,000 a month, your constraint is not money. It is search volume.**

Total measured monthly demand across every term you would sensibly bid on is roughly 4,000 searches. That is a hyperlocal niche, and it puts a hard ceiling on what you can usefully spend.

Rough capacity, assuming a realistic share of available clicks rather than 100% impression share:

| Cluster | Monthly searches | Clicks available to you | CPC | **Monthly spend capacity** |
|---|---|---|---|---|
| Interiors | ~2,470 | ~370 | ₹150 avg | **₹55,000** |
| Resale and area | ~1,110 | ~165 | ₹86 | **₹14,000** |
| Jaswanti Jewel | 720 | ~180 | ₹78 | **₹14,000** |
| Rentals | ~1,550 | ~310 | ₹6 | **₹1,900** |
| Brand | low | | very low | ₹1,000 |

Two things fall out of that table.

**Rentals is almost free, and it is capped.** At five to six rupees a click you could take essentially every rental click in Borivali for under ₹2,000 a month. You cannot spend more than that on it because the searches do not exist. Best value in the account by a distance. Switch it on permanently and then largely ignore it.

**Interiors is the only cluster that can absorb real budget.** It is also your highest value service, has low advertiser competition, and has a local pack you can enter. At this budget level, interiors is where the money should go.

**Malad should be cut for now.** ₹345 a click against 110 monthly searches is a small, expensive slice that would consume a meaningful share of the budget for a handful of clicks. Exclude it as its own ad group and revisit once you know your cost per lead.

### The constraint nobody warns you about

**₹40,000 a month is ₹1,333 a day. Split across five campaigns that is ₹267 each, which is too thin for Smart Bidding to ever learn.**

Google's automated bid strategies need roughly 30 conversions in 30 days per campaign before they work properly. At ₹267 a day none of your campaigns will get there, and Smart Bidding on insufficient data spends worse than manual bidding does.

Two consequences:

1. **Run fewer campaigns.** Three or four, not five
2. **Stay on manual CPC longer than the textbook says.** Manual bidding does not need the learning volume. Do not switch to Maximise Conversions or Target CPA until a single campaign can carry ₹500 a day and is producing 30 conversions a month

### Recommended structure at this budget

**Start at ₹30,000, not ₹50,000.** Hold the remaining ₹20,000 as scale budget for month 2, once you know which campaign actually produces leads. Spending the top of your range before you have a single data point is how budget gets committed to the wrong campaign.

**Month 1, ₹30,000, four campaigns:**

| Campaign | Monthly | Daily | Rationale |
|---|---|---|---|
| `GOOG_Search_Interiors_Borivali` | **₹12,000** | ₹400 | Highest value service, low competition, absorbs budget, local pack support |
| `GOOG_Search_Jaswanti_Kandivali` | **₹10,000** | ₹333 | 720 branded searches at high intent, currently going to brokers |
| `GOOG_Search_Rentals_Borivali` | **₹2,500** | ₹85 | Nearly free. Volume capped, so this is close to the maximum useful spend |
| `GOOG_Search_Brand_Giriraj` | **₹1,500** | ₹50 | Cheapest traffic you will ever buy. Do not skip it |
| Reserve | ₹4,000 | | For whichever campaign shows early promise |

**Resale is deliberately not in month 1.** It is a core service, but four campaigns is already the practical limit at this budget, and resale has the weakest combination of volume and CPC among the candidates. It goes in first when you scale.

**Month 2 onward, scaling toward ₹50,000:** add `GOOG_Search_Resale_Borivali` at roughly ₹10,000, and increase whichever month 1 campaign produced the cheapest `form_submit`. **Increase 20 to 30% at a time with 3 to 5 days between increases**, per the `ads` guide, so the algorithm can relearn.

### Taboola gets nothing at this budget

**Recommendation: zero Taboola spend in months 1 and 2. All of it to Google Search.**

Three reasons.

1. **Splitting ₹30,000 across two platforms means neither gets enough data to optimise.** You end up with two underperforming channels instead of one working one
2. **Taboola's India minimums are unverified and may on their own exceed a meaningful share of your total budget.** Still worth asking, but do not commit
3. **Taboola converts on a later visit, through retargeting.** You have no retargeting audience and no conversion history yet. It is the wrong channel to start with

**Revisit at month 3**, once Google Search is producing at a known cost per lead and you have budget headroom. The nine Taboola hero posts in section 6 stay in the content plan regardless, because they earn their place through organic and AI citation on their own.

### What this budget should produce

Honest arithmetic, with the uncertain number flagged.

At ₹30,000 a month and a blended CPC of roughly ₹90, you buy about **330 clicks a month**.

**I do not know your landing page conversion rate and will not invent one.** At a plausible 5% to 10% for local service traffic with WhatsApp as the action, that is **17 to 33 enquiries a month**, at roughly **₹900 to ₹1,800 per enquiry**.

Whether that is good depends entirely on what a lead is worth to you, which is the one number still missing. As a frame: if brokerage on a single resale transaction runs into lakhs, then even a 2% enquiry to transaction rate makes ₹1,800 a lead comfortably profitable. Interiors is the campaign most likely to pay for itself fastest, because the margin is high and the buying cycle is short.

**Measure from week 2 and do not judge it before week 4.** Ad accounts look terrible for the first fortnight regardless of how well they are built.

### Bid strategy progression

Adjusted for your budget rather than the textbook.

1. **Month 1: Manual CPC everywhere.** Not "weeks 1 to 2". At ₹1,000 a day across four campaigns you will not reach Smart Bidding thresholds inside a month
2. **Month 2: Maximise Conversions on the single best performing campaign only.** Leave the others manual
3. **Month 3 onward: Target CPA** on that campaign, once you know what a lead actually costs
4. **Later: value based bidding**, using real lead values rather than the placeholder weights in `07-analytics-ga4.md`

### The number still outstanding

**What a qualified lead is worth to you**, at least in relative terms across rentals, resale, new project, redevelopment and interiors.

You do not need it for month 1, because month 1 is manual CPC. You will need it before step 3 above, and until then the relative weights in the analytics plan stay explicitly invented.

---

## 8. Retargeting

| Audience | Source | Message | Destination |
|---|---|---|---|
| Blog readers who did not convert | Taboola and organic traffic, 90 day window | The relevant service | Service page |
| Jaswanti Jewel page visitors, no price sheet request | Site, 30 day window | "Still deciding? Here is the current price sheet" | `/lp/jaswanti-jewel` |
| Landing page visitors, no conversion | Site, 30 day window | Restate the offer | Same landing page |
| Area page visitors | Site, 60 day window | The matching service for that suburb | Service page |
| **Converters** | All conversion events | **Exclude from all prospecting** | |

That last row is the one people forget. Per the `ads` guide, showing ads to people who already enquired wastes spend and irritates a lead you are already talking to.

---

## 9. Prelaunch checklist

Adapted from the `ads` universal prelaunch checklist. **All must pass before any campaign unpauses.**

### Tracking

- [ ] GA4 to Google Ads link live
- [ ] Auto tagging enabled
- [ ] `form_submit` and `price_sheet_request` imported as **primary**
- [ ] `whatsapp_click` and `phone_click` imported as **secondary, excluded from bidding**
- [ ] **48 hours of clean data observed before unpausing.** Non negotiable
- [ ] `gclid` capture verified end to end
- [ ] Taboola pixel firing

### Landing pages

- [ ] All three live and `noindex` confirmed **in the rendered HTML**, not just intended
- [ ] Message match verified against each ad
- [ ] Mobile LCP under 2.5s, measured on the live domain
- [ ] **Privacy policy live and linked from every form.** Ads will be disapproved without it
- [ ] Forms tested end to end on a real phone
- [ ] MahaRERA **agent** registration A51800005726 visible on every landing page

### Account

- [ ] Billing set up, account verified
- [ ] Conversion tracking confirmed "Recording"
- [ ] Negative keyword lists applied per campaign
- [ ] Location targeting set to **presence, not presence or interest**. Otherwise you pay for people merely interested in Mumbai
- [ ] Ad schedule set if you only answer WhatsApp during business hours
- [ ] Daily budget caps set per campaign
- [ ] Sitelink, callout and call extensions added
- [ ] Call extension points at the primary number

### Legal and policy

- [ ] **Google Ads real estate policy for India verified.** I do not know whether property advertising carries additional verification requirements there. **Check before launch**
- [ ] MahaRERA agent registration number in ad extensions or on the landing page
- [ ] Jaswanti Jewel project MahaRERA number added if Ashray has supplied it. **Recommended, not blocking**, since you act as agent rather than promoter
- [ ] **`"jaswanti gold"` and the bare term `gold` applied as negatives on every campaign**
- [ ] No unverified claims in any ad copy. No "best", no "number one", no invented ratings

### Why the 48 hour soak

If tracking is broken and you launch anyway, you spend for two days, get zero recorded conversions, conclude the campaigns failed, and make the wrong decision. Two days of patience protects the entire budget and the decisions you make about it.

---

## 10. What I do not know

Logged in `11-open-questions.md`.

1. ~~Your budget.~~ **Answered: 30,000 to 50,000 rupees a month**
2. **What a lead is worth to you.** No target CPA is meaningful without it
3. **Taboola India minimums, category restrictions and realistic CPCs**
4. **Google Ads real estate policy in India.** Whether property advertising requires additional verification
5. **Whether you can answer WhatsApp within minutes during ad hours.** If not, ad scheduling should be tightened. Response speed is the largest determinant of lead conversion in this category and no amount of bid optimisation compensates for a four hour reply
6. Whether the Jaswanti Jewel builder restricts broker advertising on the project name. Some developers do, contractually
7. Whether competitors are currently bidding on your brand name. Worth a manual search on Day 1
