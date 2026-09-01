# 11. Open Questions and Assumptions

Everything I need from you, and everything I assumed. A flagged gap is more useful than a confident invention, so this file is deliberately long.

Three sections: **blockers** (work stops without an answer), **questions** (work proceeds but may need reversing), **assumptions** (what I decided in the absence of information).

---


**Status as of 25 August 2026.** Seven of nine original blockers resolved. Two new items opened from the Google Business Profile check.

| # | Item | Status |
|---|---|---|
| B1 | Domain | **Resolved.** `shreegiriraj.in` |
| B2 | MahaRERA | **Resolved.** Agent registration, you act as agent not promoter |
| B3 | Project name | **Resolved.** Jaswanti Jewel. Jaswanti Gold dropped |
| B4 | Developer | **Resolved.** Ashray |
| B5 | The 4.8★ | **Resolved, differently than expected.** See below |
| B6 | Pricing policy | **Deferred by you.** Launch default is full masking |
| B7 | Testimonials | **Resolved.** Moved to the week 2 content pipeline |
| B8 | Budget and lead value | **Deferred.** Needed for the week 2 paid block |
| B9 | Google Business Profile | **Resolved.** Exists and is claimed |
| **B10** | **NAP conflict** | **NEW. Resolved same day.** GBP string is the master |
| **B11** | **Review count** | **NEW. Open and urgent.** 2 reviews |

---

# PART 1: BLOCKERS

## B1. RESOLVED: the domain

**`shreegiriraj.com` is registered but dormant.** It returns no DNS records at all, so it is held and unused. Chasing it through a broker or backorder is slow and uncertain.

**Decision 25 August 2026: `shreegiriraj.in`.**

A `.in` ccTLD is the better choice here anyway, not a consolation. For a business serving four Mumbai suburbs and nowhere else, a country code TLD is a positive geotargeting signal, availability is far better, and it costs less. There is no ranking penalty versus `.com` for an India only business.

**Applied across the plan.** Canonicals, sitemap, hreflang, schema `@id` values, robots and the UTM examples all now use `www.shreegiriraj.in`. **`NEXT_PUBLIC_SITE_URL` in the codebase still defaults to the `.com` and must be changed on Day 1.**

Fallbacks if `.in` is somehow taken: `shreegirirajrealestate.in`, then `shreegirirajproperties.in`.

## B10. NEW, RESOLVED: the NAP conflict

Your Google Business Profile and every other source disagreed on your address.

| Source | Address |
|---|---|
| Site, brief, draft HTML | 11, Garden Groove Shopping Centre, Chikuwadi, Borivali (W) 400092 |
| Google Business Profile | Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West 400092 |

**Confirmed the same place.** Most likely Clover Grove CHS is the society and Garden Groove Shopping Centre is the commercial complex inside it.

**Resolution: the GBP string is the master record**, because Google's own record anchors every local signal and because editing a live claimed profile risks triggering re verification. The site changes to match Google, not the other way round.

Garden Groove is not lost. It moves to the how to find us prose on `/contact`, where it is genuinely useful, since it is probably how people actually navigate to you. It just never appears in a NAP block or a directory listing.

**Two spelling changes propagate everywhere:** Chikoowadi becomes **Chikoowadi**, and Borivali West becomes **Borivali West**. Full rules in `06-geo-local.md` section B2.

## B11. NEW AND OPEN: you have 2 Google reviews

**This is now the single largest constraint on your local visibility, and it is larger than anything on the website.**

Review count and recency are direct local pack ranking factors. Two is functionally a standing start, and the local pack is where a Borivali property searcher actually converts.

**It also resolves the 4.8★ question in a way neither of us expected.** See B5.

**Unblocked and moved to Day 1.** The original plan held review generation until week 3 because I assumed GBP verification was pending. It is not, so there is nothing to wait for. Two rounds of outreach are now scheduled inside the 5 days, in `10-five-day-schedule.md`.

**Targets:** 5 to 8 by launch, **10 by month 1**, 20 by month 3.

**Needed from you:** a list of clients from the last 18 months you parted from on good terms. Ten messages on Day 1, ten more on Day 4.

## B2. RESOLVED: agent registration, and you act as agent not promoter

**Answered 25 August 2026: `A51800005726` is the agent registration, not a project registration.** The `A` prefix is consistent with that.

**What this settles.** The number is used correctly site wide. It belongs in the footer on every page, on `/about`, on `/contact`, and as the `identifier` in the `RealEstateAgent` schema. That is already how the plan uses it and nothing changes.

**It is also an underused asset.** Plenty of people operating in this market are not registered agents. Being registered is a real differentiator and a genuine trust signal, and the plan currently treats it as a compliance footnote. Worth stating plainly on `/about` and in the homepage FAQ rather than only in small type at the bottom.

**What it does not settle.** An agent registration covers **you as an intermediary**. It does not cover **a project you advertise**. Those are separate registrations serving separate purposes, and one does not substitute for the other.

**Still blocking:**

### B2a. DOWNGRADED from blocking to recommended

If a page or an advertisement promotes a specific project, that project's own MahaRERA registration must appear on it. Your agent number sits alongside it, not instead of it.

**Where to get it, in order of reliability:**

1. **The builder.** One message to your Ashray contact. Fastest and most authoritative
2. **The MahaRERA public register** at `maharera.maharashtra.gov.in`. Search by project name and locality, and confirm the promoter is Ashray and the location is Kandivali West
3. **Not from a portal or a broker microsite.** 99acres, Housing and `jaswanti-jewel.in` may display a number, but a wrong registration number on an advertisement is a regulatory problem, not a typo. Do not copy it from a third party

**While you are there, capture these too**, because the page needs them and they are on the same register entry: the registered project name as MahaRERA holds it, the promoter's registered name, and the declared completion date. That last one matters, because a possession date from a brochure and a possession date on the register are frequently different, and the register is the one that is defensible.

**What blocks until this is answered:**

- `/projects/jaswanti-jewel` cannot publish as a project promotion page
- `GOOG_Search_Jaswanti_Kandivali`, the highest ROI campaign on the account, cannot launch
- The homepage featured project block cannot promote it by name
- The FAQ answer "what is the MahaRERA number for Jaswanti Jewel" stays unanswerable

**The fallback, if it cannot be obtained in time.** Reduce the page to a general new launches page describing what you do for new project bookings, without naming or promoting a specific project, and hold the Jaswanti campaign until the number arrives. Losing 720 monthly branded searches for a fortnight is recoverable. A regulatory complaint is a worse trade.

**Needed:** the project registration number, plus the three supporting fields above. This is the single highest value item on your Day 1 list after the domain, and it is one message to the builder.

## B3. RESOLVED, and it opened a bigger question

**Answered 25 August 2026:** Jaswanti Jewel is the featured project. **Ashray is the developer.**

Confirming the developer let me pull the wider branded set, which surfaced something material.

**"jaswanti gold" returns 3,600 searches a month, low competition, $0.14 a click. Five times the volume of "jaswanti jewel" at a sixth of the cost.**

The SERP confirms **Ashray Jaswanti Gold** is a real, separate project in Kandivali West by the same developer. 2 and 3 BHK, roughly 1,200 to 1,691 sq ft, listed on Housing, 99acres, MagicBricks, NoBroker, Sulekha, Houssed, JustDial and AddressOfChoice, with a knowledge graph and Google reviews. Housing publishes ₹3.59 Cr to ₹5.05 Cr at roughly ₹29,880 per sq ft.

**The demand is resale, not new booking.** 99acres lists resale flats, MagicBricks lists six flats for sale, NoBroker lists ready to move inventory. Sources conflict on whether construction is fully complete, so verify. That routes to your **resale flats** service.

### B3a. RESOLVED: Jaswanti Gold is out of scope

**Answered 25 August 2026: Shree Giriraj does not handle Jaswanti Gold. Dropped.**

Nothing on the site targets it, mentions it, or bids on it. The 3,600 monthly searches are irrelevant to this business.

**Two consequences that are now live requirements, not options:**

1. **Negative keywords.** `"jaswanti gold"` and the bare term `gold` go on every Google Ads campaign. Bidding on "ashray developers" and "jaswanti jewel" will otherwise bleed Gold traffic, because Google treats the terms as closely related. See `08-paid-campaigns.md` section 3.2b
2. **No cross mention anywhere.** The FAQ answer naming Ashray as the developer must not list their other projects. See `05-aeo-faq.md` section 4.6

**One finding survives the decision.** Portals publish per unit asking prices for Ashray projects, Jaswanti Jewel included. That is evidence for B6 and it stands regardless of Gold.

## B4. RESOLVED

**Ashray**, confirmed 25 August 2026. Trades as Ashray Group and Ashray Realtors.

Now flows into the project page, the schema `Residence` block, the FAQ answer to "who is the developer", and the ad keyword set. **"ashray developers" measures 210 a month at low competition and $0.77.**

**One remaining detail:** which trading name do they use publicly, Ashray Group or Ashray Realtors? Their own site is `ashraygroup.com`, but it currently surfaces what appears to be an unfinished template page showing placeholder content and a dollar price. Worth knowing which name to use, and worth noting that **the builder's own web presence is weak enough that you can outrank them on their own name.**

## B5. RESOLVED, and not as either of us expected

You said the 4.8★ was your Google rating. **It is not.**

**Your Google Business Profile shows 5.0 from 2 reviews.**

So the number on the site is wrong in both directions. It understates the rating and it implies a corpus of reviews that does not exist. Whatever its origin, it cannot be sourced to Google. **It comes off on Day 1 as planned.**

**And 5.0 is not the replacement.** A perfect score from two reviews reads as thin rather than impressive, because anyone who clicks through sees the count. Displaying it invites "only two?" and hands a reason to doubt you to a visitor who was ready to trust you.

**Rule: display no rating until roughly 10 reviews.** Until then the trust stats are "Since 1996" and the MahaRERA agent registration, both facts that need no denominator. Then display it with the count and link it to the profile, and never as `AggregateRating` schema on your own domain.

**The real conclusion is B11.** Your review count is the problem, not your rating.

---

## B5 archive: the original question

Where did this number come from?

It appears twice on the homepage (`page.tsx:282` and the why us card) with no source anywhere in the codebase.

**Plan assumes it is removed on Day 1.** Reinstate only as a live Google rating with a review count, linked to the profile, and never as `AggregateRating` schema on your own domain.

**Needed:** confirmation to remove, or the source.

## B6. DEFERRED BY YOU: pricing policy

The draft masks prices as `₹2.**Cr`. **All four live People Also Ask questions for Borivali West are price questions, and the top PAA question for "jaswanti jewel" is "what is the price range".**

A page that answers every price question with "contact us" will not rank and will not be cited. A competitor's answer gets used instead.

**My recommendation:** publish genuine ranges with a verification month, gate the exact floor by floor sheet.

**New evidence, 25 August 2026.** Housing.com already publishes ₹3.59 Cr to ₹5.05 Cr at roughly ₹29,880 per sq ft for Ashray Jaswanti Gold. 99acres, MagicBricks and NoBroker publish per unit asking prices for both Ashray projects.

**The information is already public.** Masking on your own site does not protect anything. It only makes your page less useful than the portal page, on a query where you are already competing with portals that answer it. That materially strengthens the case for publishing ranges.

**Status 25 August 2026: deferred. The launch default is therefore full masking, unchanged from the current draft.**

That is a legitimate call and the plan proceeds on it. Two consequences recorded so the trade is knowing rather than accidental:

1. The price questions on the project page and all four area pages go unanswered, and for Borivali West those four questions are the entire measured demand signal
2. The numbers are already public on Housing and 99acres, so masking is not protecting information, only making your page less complete than the portal's

**What the pages do instead:** answer with direction and context rather than figures. Which pockets sit at the top and bottom of the range and why, what has moved in two years, what makes two similar looking flats differ. Useful, defensible, and something a portal cannot write.

**Revisit trigger:** after 4 to 6 weeks of Search Console data, check impressions and average position for the price queries on the area pages. If they are not ranking, this is the most likely cause and it is cheap to reverse.

## B7. RESOLVED: testimonials move to the content pipeline

Zero real testimonials exist. The homepage currently carries an unattributed quote that appears to be placeholder copy from the draft.

**Nothing renders until you have real ones with written consent.**

**Decided 25 August 2026: testimonials attach to the blog and case study workstream from week 2.** The site launches with no testimonials section, which is a perfectly acceptable outcome and is how the build already behaves when the CMS is empty.

This freed 20 minutes of your Day 4 block, which went to review outreach.

**One consequence:** with the testimonials section empty at launch, your Google profile carries the entire social proof load, and it currently shows two reviews. That is the argument for B11.

**One process note, stated once.** Testimonials are the single content type Claude Code cannot draft. They get collected from real clients using the intake script in `04-social-proof.md` section 6, with consent captured in writing. Everything else in the content plan can be written; this has to be gathered.

## B8. PARTIALLY RESOLVED: budget confirmed, lead value still open

Every allocation in `08-paid-campaigns.md` is a percentage because I have no number.

**Needed:**
1. Monthly budget for Google Ads
2. Separate budget for Taboola, if any
3. **What a qualified lead is worth to you**, at least in relative terms across rental, resale, new project, redevelopment and interiors

Without item 3, no target CPA is meaningful and I cannot tell you whether $3.97 for a Malad click is sensible or reckless.

**Budget answered 25 August 2026: 30,000 to 50,000 rupees per month.**

**The important finding is that this budget is not your constraint. Search volume is.** Total measured demand across every term worth bidding on is roughly 4,000 searches a month. Full working in  section 7. Three consequences:

1. **Start at 30,000, not 50,000.** Hold the rest as scale budget for month 2 once you know which campaign produces
2. **Four campaigns, not five.** At 1,000 rupees a day, five campaigns is too thin for any of them to learn. Resale waits until month 2
3. **Taboola gets zero in months 1 and 2.** Splitting a small budget across two platforms leaves neither with enough data

Expected output at 30,000: roughly 330 clicks a month, and **17 to 33 enquiries if the landing pages convert at 5 to 10 percent, which is a range I am estimating rather than measuring.**

**Still open: what a qualified lead is worth to you.** Not needed for month 1, since month 1 runs on manual CPC. Needed before you move to Target CPA in month 3. Until then the placeholder weights (rental 1, resale 5, new project 8, redevelopment 20, interiors 6) stay explicitly invented.

## B9. RESOLVED: the profile exists and is claimed

Does a profile already exist for 11, Garden Groove Shopping Centre?

It may exist unclaimed, auto generated by Google, or duplicated. **Creating a second one splits your local signal and is painful to merge.**

**Answered 25 August 2026. The profile is live and claimed**, carrying photographs, set opening hours and Street View, none of which appear on an unclaimed auto generated listing.

**This eliminated the largest external clock in the plan.** I had budgeted 1 to 2 weeks for postcard verification and sequenced review generation behind it. Gone.

**Three sub questions it opened, all on the Day 1 list:**

1. **Is a duplicate listing sitting under the Garden Groove address?** A duplicate splits your local signal invisibly. Ten minutes of searching settles it
2. **Is the map pin correct?** It appears near Sector 4 Charkop while the address says Chikoowadi. A misplaced pin costs local pack relevance and misdirects visitors
3. **Is the 11am opening time accurate?** Late for property viewings if it is not. And confirm whether you work Sundays, which is a genuine local pack advantage

**Also missing: secondary categories.** Add Real Estate Consultant, Property Management Company, Commercial Real Estate Agency and **Interior Designer**. That last one is not optional: "interior designer borivali" returns a local pack, it is your highest CPC cluster at $1.30 with low competition, and you cannot appear in that pack without the category.

---

# PART 2: QUESTIONS

Work proceeds without these but may need revisiting.

## Business and facts

| # | Question | Why it matters |
|---|---|---|
| Q1 | Can you name any builder you work with directly | A named relationship is worth ten unnamed ones for trust and AI citation. Otherwise "direct builder relationships" softens to something vaguer |
| Q2 | Can you evidence "often before they hit the open market" | One concrete instance keeps the claim. Otherwise it is cut |
| Q3 | Which document proves 1996 | Not for publishing. To keep on file. Shop licence, partnership deed, GST, or the oldest agreement |
| Q4 | Who works there, with names and roles | `/about` needs real people. E-E-A-T is currently zero and the `teamMember` schema is built and unused |
| Q5 | Do you work Sundays | A genuine local pack advantage in property if you do |
| Q6 | How fast can you realistically answer WhatsApp | The largest determinant of lead conversion in this category. If it is hours, ad scheduling should be tightened |
| Q7 | Do you have real photographs of the office, the team and properties | The single largest visual credibility upgrade available, and it costs an afternoon |
| Q8 | Do you service all four suburbs equally, honestly | If Malad is really a referral only market, the page should say something different |
| Q9 | Is there an existing client list you can contact for testimonials | Determines whether B7 is achievable by Day 4 |

## Commercial and legal

| # | Question | Why it matters |
|---|---|---|
| Q10 | What do you actually charge | The homepage FAQ "what does an estate agent in Mumbai charge" is the most searched unpublished question in the category. Answering it plainly is a trust and AEO win |
| Q11 | Does the Jaswanti builder restrict broker advertising on the project name | Some developers restrict this contractually. It would kill the highest ROI campaign |
| Q12 | Is there any exclusivity or agreement clients sign | The FAQ answer depends on it |
| Q13 | Do you have professional indemnity or any relevant insurance | A credibility signal on `/about` if so |

## Technical and product

| # | Question | Why it matters |
|---|---|---|
| Q14 | Are the Hindi, Marathi and Gujarati locales actually used by anyone | If not, retiring them simplifies hreflang, sitemap, analytics and content substantially. **I have no data either way** |
| Q15 | Should the four area pages be translated to Marathi and Hindi in month 2 | Genuinely local intent, but I have no volume data for those languages |
| Q16 | Is `styled-components` used on the site or only in Sanity Studio | Two styling systems is redundant weight. If it is site side, it is worth removing |
| Q17 | Where should form leads land besides WhatsApp | **Currently nowhere.** Without a store, offline conversion import is impossible. A Google Sheet is enough |
| Q18 | Do you want a domain email | `shreegiriraj1224@gmail.com` is the verified fact and goes on the site. A domain email would carry more weight for two crore decisions |
| Q19 | Should `/en/*` redirect or 404 | Plan assumes 301 to the unprefixed URL. Confirm |

## Marketing

| # | Question | Why it matters |
|---|---|---|
| Q20 | Do you have a Facebook, Instagram or YouTube presence already | Feeds `sameAs` in schema, and YouTube is a genuine ranking opportunity given video appears on two of your six target SERPs |
| Q21 | Have you run ads before, on any platform | Existing conversion data or learned negatives would change the launch approach |
| Q22 | Who do you consider your actual competitors | I know who ranks. That is not the same as who takes business off you locally |
| Q23 | Are you willing to publish price ranges | Related to B6, but broader. It affects area pages, interiors and rentals |
| Q24 | Do you want the interiors service positioned as a standalone business | The data says it is your strongest commercial cluster: highest CPC, low competition, local pack present, a local independent already ranking. It may deserve more than one page |

---

# PART 3: ASSUMPTIONS I MADE

Everything I decided without asking. Correct any that are wrong.

## Architecture

| # | Assumption | Reversible |
|---|---|---|
| A1 | Four area pages, not six. Borivali splits West and East, Kandivali and Malad do not, because measured demand sits at suburb level | Easily |
| A2 | Area pages at `/areas/[suburb]` rather than root level, for cleaner breadcrumbs and BreadcrumbList schema | Easily, before launch |
| A3 | Pillar guides at `/guides/[slug]`, separate from `/blog/[slug]` | Moderately. Requires redirects after launch |
| A4 | No service by area combination pages at launch. Volume does not justify 24 near duplicate pages | Easily |
| A5 | No listings database or property search. You cannot out inventory a portal and stale listings damage trust | Major decision, hard to reverse |
| A6 | No comparison or versus pages naming local rivals | Easily |
| A7 | Blog categories, no tag pages | Easily |
| A8 | `/guides` and `/case-studies` in the footer only, not the header | Easily |

## Locale

| # | Assumption | Reversible |
|---|---|---|
| A9 | Keep all four locales for UI and existing pages | Yes |
| A10 | New content English only, and locale routes gated on real translated bodies rather than falling back | Yes, but **do it before publishing content** or you inherit a duplicate content cleanup |
| A11 | `x-default` points to the English homepage | Trivially |

## Content

| # | Assumption | Reversible |
|---|---|---|
| A12 | 58 posts across 6 clusters, not 5. The keyword data forced the change | Yes |
| A13 | 10 posts at launch, not 50. Your review capacity is the constraint | Yes |
| A14 | One pillar written at launch, buying, because it feeds the highest intent services | Yes |
| A15 | Two posts a week thereafter | Yes |
| A16 | The paperwork cluster is worth writing despite weak local relevance, for authority, AI citation and Taboola | Yes |
| A17 | Redevelopment gets no search ad campaign. Committee decisions are not made by clicking ads | Yes |

## Facts and claims

| # | Assumption | Reversible |
|---|---|---|
| A18 | "25+ years" is wrong and becomes "Since 1996" | Yes, but it is arithmetically wrong as written |
| A19 | The 4.8★ comes off Day 1 | Yes, if you produce a source |
| A20 | The existing homepage quote is placeholder copy and comes off | Yes, if it is real and consented |
| A21 | Masked pricing stays as the default, pending B6 | Yes |
| A22 | The project has no 1 BHK, per the brief. The PAA question about 1 BHK gets an honest redirect | Yes |
| A23 | No `AggregateRating` schema ever on your own domain | This one I would push back on if challenged. It is a Google policy position, not a preference |

## Technical

| # | Assumption | Reversible |
|---|---|---|
| A24 | Stay on Next 14 for launch, upgrade to 15 in month 2 | Yes |
| A25 | `www` is canonical, apex redirects to it | Yes, before launch. Painful after |
| A26 | No trailing slash | Yes, before launch |
| A27 | `CCBot` allowed | Trivially |
| A28 | No `/pricing.md`, because prices are deliberately masked | Trivially |
| A29 | `Residence` schema on the project, not `Product` with `offers`, while pricing is masked | Yes, once real prices publish |
| A30 | Vercel Hobby is sufficient at launch | Yes. **Check the commercial use terms** |
| A31 | Consent Mode v2 implemented, though India's DPDP Act may not require it | Yes. **I am not a lawyer. Verify** |

## Analytics and paid

| # | Assumption | Reversible |
|---|---|---|
| A32 | WhatsApp clicks tracked as a micro conversion, never as the Ads bidding target | Yes, but doing otherwise will train Smart Bidding badly |
| A33 | `form_submit` is the primary bidding target until offline conversions have volume | Yes |
| A34 | `gclid` captured and stored for offline import | **Do this from day one.** It cannot be applied retroactively |
| A35 | Underscore separated, lowercase UTMs | Yes, before any campaign runs |
| A36 | Campaigns built and paused Day 5, launched week 2 after a 48 hour soak | Yes, but launching on broken tracking wastes the budget and the decision |
| A37 | Performance Max deferred to month 2, since it needs conversion history | Yes |
| A38 | Relative lead values: rental 1, resale 5, new project 8, redevelopment 20, interiors 6. **Invented as a starting frame, not derived from your data** | Yes, and it should be replaced by your answer to B8 |

---

# PART 4: WHAT I DID NOT VERIFY

Stated so nothing in this plan reads as more certain than it is.

| # | Item | Why not | How to close |
|---|---|---|---|
| N1 | Whether `shreegiriraj.in` is available | Not checked | 30 seconds at a registrar |
| N2 | **Taboola India minimum spend, category restrictions and realistic CPCs** | No reliable source I would repeat | Ask a Taboola rep, Day 1 |
| N3 | **Google Ads real estate policy in India.** Whether property advertising needs extra verification | Not verified | Google Ads policy centre, or ask support |
| N4 | Local pack composition for the four area queries | I pulled organic results, not local pack contents | DataForSEO local pack endpoint, or a manual check from Borivali |
| N5 | PAA questions for Borivali East, Kandivali and Malad individually | Controlled research spend. Only Borivali West pulled | Roughly $0.002 per query. **Pull before writing those pages.** Do not assume Borivali West questions transfer |
| N6 | PAA for resale flats, new project bookings, shops and plots | Same | Same |
| N7 | Why `parineeinterio.in` ranks 3rd for "interior designer borivali" | Would need a backlink and on page analysis | Worth doing before investing in cluster F. The answer changes the tactic |
| N8 | Seasonality in Indian property search | Point in time volume only. Gudi Padwa and Diwali effects are real | DataForSEO historical volume |
| N9 | Organic difficulty for the target terms | I pulled Google Ads competition, which measures **advertiser** competition, not organic difficulty. Low competition on "tds on property purchase" means few advertisers, not easy ranking against established finance sites | An Ahrefs or Semrush difficulty score |
| N10 | Marathi, Hindi and Gujarati search volume | Not pulled. The English only decision rests on duplicate content risk, not on evidence about demand | DataForSEO with the relevant language codes |
| N11 | Whether portal agent profiles carry nofollow links | Not checked. Affects their citation value | Manual inspection |
| N12 | Whether competitors bid on your brand name | Not checked | Manual search, Day 1 |
| N13 | Actual conversion rate of a WhatsApp click to a real conversation | **Nobody knows this until you measure it.** I deliberately did not estimate | It is why the measurement plan exists |
| N14 | Whether Jaswanti Jewel's builder restricts broker advertising | Contractual, not public | Ask the builder |
| N15 | Who actually takes business off you locally | I know who ranks. Ranking and competing are different things | Your answer to Q22 |

---

# PART 5: THE Q&A

You offered to answer questions at the end. In priority order, these are the ones that unlock the most work.

**Resolved 25 August 2026.** B1 domain, B2 MahaRERA, B3 project name, B3a Jaswanti Gold, B4 developer, B5 the 4.8★, B7 testimonials, B9 GBP status, B10 the NAP conflict.

**Deferred by you.** B6 pricing policy, launch default is full masking. B8 budget and lead value, needed before the week 2 paid block.

**Open and urgent.** **B11, your review count.** Two reviews is the largest single constraint on your local visibility and it is now unblocked, so it starts Day 1.

**Round 2, the ones that shape the pages.** Q1 named builders, Q4 who works there, Q7 photographs, Q10 what you charge, Q24 whether interiors deserves more weight given it is your strongest commercial cluster.

**Round 2, the ones that shape the pages.** Q1 named builders, Q4 who works there, Q7 photographs, Q10 what you charge, Q23 publishing price ranges, Q24 whether interiors deserves more weight.

**Round 3, everything else.**

The single most useful thing you could tell me, beyond the blockers, is **what a lead is actually worth to you**. Almost every recommendation about budget, bidding, which cluster to prioritise and whether to chase 14,800 monthly searches for TDS rules changes depending on that number.
