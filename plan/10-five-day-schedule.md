# 10. Five Day Execution Schedule

**Your budget:** 5 days, 2 hours per day, 10 supervised hours.
**The division of labour:** Claude Code produces between your blocks, unsupervised. Your 2 hours are review gates plus the things only you can do: buy accounts, supply facts, and apply local knowledge that is not on the internet.

---

## 1. The scheduling logic

Three constraints shaped this order.

**External clocks start on Day 1.** Google Business Profile verification in India commonly runs 1 to 2 weeks by postcard. Search Console needs DNS to propagate. Google Ads account verification takes days. None of these compress. They all get started in the first 30 minutes of Day 1 so they run in the background all week.

**Architecture before content.** The locale gating decision in `01-architecture.md` section 8 must land before a single English only page is published, or every page published creates a duplicate content problem that then has to be unpicked. Similarly, URL structure and canonicals precede the pages that use them.

**Your scarcest input is local knowledge, so it gets the biggest single block.** Day 2 gives 75 minutes to the four area pages. That is the one deliverable where Claude Code genuinely cannot substitute for you. Nobody can research which buildings have water problems. Everything else on the site is checkable, correctable, or reproducible.

---

## 2. Day 1: Unblock everything

**Theme:** Nothing on this site can be measured, indexed or advertised until the domain resolves and the accounts exist. This day is almost entirely account actions.

### What Claude Code has already produced before your block

- This plan, files `00` through `11`
- A full audit of the existing build, in `00-executive-summary.md` section 2
- A branch containing the technical foundation, ready to merge once the domain is known: `app/sitemap.ts`, `app/robots.ts`, canonical and hreflang wiring, the locale gating change, `llms.txt`, breadcrumb component and BreadcrumbList schema

### Your 2 hours

| Time | Task | Notes |
|---|---|---|
| 0:00 to 0:25 | **Buy `shreegiriraj.in` and point DNS at Vercel** | `.com` is registered but dormant, so `.in` is the pick. A ccTLD is a positive geotargeting signal for an India only business. Add both apex and `www`, set apex to 301 to `www` |
| 0:25 to 0:40 | **Deploy the existing build to Vercel production** | Connect the GitHub repo, set the environment variables, **update `NEXT_PUBLIC_SITE_URL` to the `.in` domain**, add the production domain to Sanity CORS origins with credentials allowed |
| 0:40 to 1:00 | **Optimise the Google Business Profile** | **It already exists and is claimed, so there is nothing to verify and no postcard clock.** Add secondary categories, **Interior Designer especially**, since that SERP has a local pack and it is your highest CPC cluster. Verify the map pin, which currently appears near Sector 4 Charkop while the address says Chikoowadi. Confirm the 11am opening time. UTM tag the website link. **Search for a duplicate listing under the Garden Groove address** |
| 1:00 to 1:25 | **Review outreach, round one** | **The highest value 25 minutes of the week.** You have 2 reviews. That is the real cap on your local visibility. List every client from the last 18 months you parted from on good terms, message the first ten individually using the script in `06-geo-local.md` section B5. Not a broadcast. Ten messages typically yields three to five reviews |
| 1:25 to 1:45 | **GA4 property, GTM container, Search Console** | Create all three. Verify Search Console by DNS TXT record while you are already in the registrar. Submit nothing yet, the sitemap does not exist until tonight |
| 1:45 to 2:00 | **The facts pack, and one message to Ashray** | Answer the remaining items in `11-open-questions.md`. **Message your Ashray contact for Jaswanti Jewel's project MahaRERA number, the registered project name and the declared completion date.** Not a blocker any more, but it belongs on the page and it takes a minute |

**Removed from Day 1: Google Ads and Taboola account setup.** You have moved paid to the week after launch, so account creation moves with it. That freed 15 minutes, which went to review outreach.

### What Claude Code produces overnight

- Merges the technical foundation branch with the real domain baked in
- Locale gating implemented: content routes emit only locales with real translated bodies, `notFound()` otherwise
- Self referencing canonicals and full reciprocal hreflang with explicit self entry and `x-default`
- `sitemap.xml` with hreflang alternates, `robots.txt` with explicit allows for GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended and Bingbot
- `llms.txt`
- Breadcrumb component plus BreadcrumbList schema on every page below level 1
- Base schema graph: RealEstateAgent, LocalBusiness, WebSite on the homepage
- The 4.8★ stat removed and "25+ years" corrected to "Since 1996"
- Draft area pages, `/about` and `/contact` ready for your Day 2 review

### Definition of done

- [ ] `shreegiriraj.in` resolves over HTTPS, apex 301s to `www`
- [ ] Production deployment live, Sanity Studio reachable at `/studio`
- [ ] Search Console property verified, or verification pending DNS propagation
- [ ] GA4 property and GTM container created, measurement ID recorded
- [ ] **Ten review requests sent individually**
- [ ] GBP secondary categories added, including Interior Designer
- [ ] GBP map pin verified or correction submitted
- [ ] GBP checked for a duplicate listing
- [ ] GBP website link UTM tagged
- [ ] Unsourced 4.8★ claim removed from production
- [ ] Message sent to Ashray for the project MahaRERA number

**Risk:** DNS propagation may not complete inside the block. Search Console verification then finishes asynchronously. This does not block Day 2.

---

## 3. Day 2: Architecture and the local knowledge pass

**Theme:** Your highest leverage two hours of the week. The area pages are the organic engine and the one deliverable that genuinely requires you.

### What Claude Code produced overnight

- Everything in the Day 1 overnight list, merged and deployed
- Four area pages drafted at `/areas/borivali-west`, `/areas/borivali-east`, `/areas/kandivali`, `/areas/malad`, plus the `/areas` hub
- `/about` drafted with placeholders wherever a real name, date or credential is required
- `/contact` drafted with exact NAP matching the Google Business Profile
- Internal linking implemented per `01-architecture.md` section 7
- A DataForSEO SERP pull for the four area queries, showing who ranks today and what People Also Ask questions appear

### Your 2 hours

| Time | Task | Notes |
|---|---|---|
| 0:00 to 0:15 | **Verify the technical foundation** | Load `/sitemap.xml` and `/robots.txt`. Run the homepage through Google's Rich Results Test. Check that one Marathi page carries a self referencing hreflang entry. Confirm an English only page carries no hreflang at all |
| 0:15 to 1:30 | **The local knowledge pass on four area pages** | Roughly 18 minutes each. This is the block that decides whether the site sounds like a Borivali family business or a national portal. See the prompts below |
| 1:30 to 1:50 | **Review `/about`** | Supply real names and roles, the 1996 provenance document you will point to, and a photograph of the office or the team. This page carries your entire E-E-A-T load |
| 1:50 to 2:00 | **Review the SERP findings** | Confirm or correct my read on who you are actually competing with for the four area queries |

**Prompts for the area page pass.** For each suburb, answer in your own words:

1. Which specific pockets, roads or society clusters do buyers actually name when they call you about this suburb
2. What is the one thing a buyer moving here gets wrong, that you correct in almost every conversation
3. Which buildings or lanes have a known issue, water, parking, lift, society politics, that you would warn a friend about. Write what you would actually say, we will decide together what is publishable and what is legally unwise
4. What is the honest price range story for this suburb right now, and what changed in the last two years
5. Who buys here, and who sells here. Are they upgraders, investors, families moving out of a smaller flat

Answers 1, 2, 4 and 5 go straight into the pages. Answer 3 is the differentiator and needs a judgement call together, because naming a specific building's defect on a public website carries defamation risk. The publishable version is usually the pattern without the name: what to check, not who fails.

### Definition of done

- [ ] Four area pages carry at least three specifics per page that could not have been written by someone who has not worked the suburb
- [ ] No generic real estate filler survives. If a sentence would fit any suburb in India, it is cut
- [ ] `/about` names at least one real person with a role
- [ ] NAP on `/contact` matches the Google Business Profile character for character
- [ ] Every claim needing verification is flagged in the running claims list, not silently published
- [ ] Rich Results Test passes with no errors on the homepage

---

## 4. Day 3: The AEO and FAQ layer, and Jaswanti Jewel

**Theme:** This is where you get cited by AI engines rather than merely indexed. The mechanism is real answers to real questions, structured for extraction.

### What Claude Code produced overnight

- Area page corrections applied, area page schema added
- FAQ question sets drafted for the homepage, all six service pages, all four area pages and the Jaswanti Jewel page, drawn from the People Also Ask data in the SERP pull rather than invented
- Answers drafted in the 40 to 60 word answer first format the `ai-seo` guide identifies as optimal for snippet and citation extraction
- `/projects/jaswanti-jewel` rebuilt with masked pricing, amenity list and enquiry gate
- Full schema graph across every page type
- `/privacy` and `/terms`

### Your 2 hours

| Time | Task | Notes |
|---|---|---|
| 0:00 to 0:50 | **The FAQ answer pass** | The drafted answers are structurally correct but generic. Replace the substance with what you actually tell people on the phone. An AI engine cites the specific answer, never the generic one. Prioritise the paperwork and stamp duty questions, they had the strongest People Also Ask signal |
| 0:50 to 1:20 | **Jaswanti Jewel verification** | **The project MahaRERA number is confirmed blocking:** `A51800005726` is your agent registration and does not cover the project. Get the project number, the registered project name and the declared completion date from the builder or the MahaRERA register. Also confirm masked pricing, supply the price sheet date, and check every amenity against the brochure. **Message the builder on Day 1, not Day 3**, so the answer is waiting for you here |
| 1:20 to 1:45 | **Schema validation review** | Claude Code will have run every page type through the Rich Results Test and the Schema.org validator. You review the failures and confirm that nothing marked up contradicts what is visible on the page |
| 1:45 to 2:00 | **Claims checkpoint** | Walk the running claims list. Every item is either verified, softened, or removed. Nothing stays in "probably fine" |

### Definition of done

- [ ] Every FAQ answer is one you would actually give on the phone, not a generic one
- [ ] Answers lead with the direct answer in the first sentence, then expand
- [ ] FAQPage schema validates on every page carrying FAQs
- [ ] Jaswanti Jewel pricing is masked or gated, with a stated verification date
- [ ] The correct MahaRERA number for the project appears on the project page
- [ ] No `AggregateRating` or `Review` schema exists anywhere, because there is no verified review corpus yet
- [ ] Every page type validates with zero errors

---

## 5. Day 4: Content and social proof intake

**Theme:** Ten posts is the launch set. The pipeline document is the real deliverable, because it is what keeps producing after this week ends.

### What Claude Code produced overnight

- Ten blog posts drafted, clustered per `03-content-plan.md`
- One pillar guide written in full: `/guides/buying-a-flat-in-borivali`
- The other four pillar guides outlined, not written
- The full 50 to 60 post content plan as a table
- Case study template and testimonial intake script, per `04-social-proof.md`
- Every factual claim across all ten posts extracted into a single verification list

### Your 2 hours

| Time | Task | Notes |
|---|---|---|
| 0:00 to 0:15 | **Review outreach, round two** | Chase the non responders from Day 1 once, politely, and message the next ten clients. Target 5 to 8 reviews by launch |
| 0:15 to 1:20 | **Line by line review of the three highest risk posts** | The posts making factual or regulatory claims: stamp duty, MahaRERA, and society redevelopment process. These are the ones where an error is a liability, not a typo. Roughly 20 minutes each |
| 1:20 to 1:45 | **Skim the remaining seven** | You are looking for factual errors and for anything that sounds like a portal wrote it. Flag, do not fix. Claude Code applies corrections overnight |
| 1:45 to 2:00 | **Approve the content pipeline** | Agree the publishing cadence. My recommendation is two posts a week, which clears the remaining 40 to 50 posts in roughly six months and matches the organic timeline in your objective. **Testimonial and case study intake attaches to this pipeline from week 2**, per your decision |

**Changed: testimonial intake moved out of Day 4.** You have folded testimonials into the blog and case study workstream from week 2. The 20 minutes went to review outreach, which is the higher leverage social proof at this stage because it feeds the local pack as well as the page.

### Definition of done

- [ ] Second round of review requests sent, cumulative total 20 clients contacted
- [ ] Three high risk posts reviewed line by line and either approved or corrected
- [ ] Every remaining post skimmed and flagged
- [ ] No post contains an invented price, carpet area, possession date, transaction value or RERA number
- [ ] The content pipeline exists as a document with a cadence you have agreed to, including testimonial and case study intake from week 2
- [ ] The pillar guide is published and every launch post links to its hub
- [ ] The testimonials section confirmed to render nothing while the CMS is empty. Verified in a browser, not assumed

**This is the day to cut if the week has slipped.** Organic content has a three to six month lag regardless, so launching with three posts instead of ten costs you very little in month one. The technical, schema and analytics layers cannot slip, because everything else depends on them.

---

## 6. Day 5: Conversion, measurement and paid readiness

**Theme:** Measurement, final checks, and launch. **Paid work has moved out of this day entirely,** per your decision to start ads a week after the site is live.

**Why tracking still ships today even though ads do not.** GA4 must be live from the moment the site is indexed, or you lose the organic baseline. When you do launch campaigns in week 2 you will want to compare against a clean pre paid period, and you cannot reconstruct one retroactively.

### What Claude Code produced overnight

- Content corrections applied, ten posts and the pillar guide published
- GTM container built: GA4 configuration tag, all event tags, triggers and variables
- Full event taxonomy implemented per `07-analytics-ga4.md`, including WhatsApp click tracking split by page location
- **`gclid` and UTM capture with cookie persistence**, and the lead storage endpoint. These ship now even though ads are later, because a lead arriving without a stored `gclid` can never be attributed retroactively
- Sitemap submitted to Search Console
- Core Web Vitals measured on the live domain

**Moved to week 2:** the three landing pages, the Taboola pixel, Google Ads and GA4 linking, and all campaign structures.

### Your 2 hours

| Time | Task | Notes |
|---|---|---|
| 0:00 to 0:35 | **Verify tracking with your own thumb** | Open GA4 DebugView. On a real phone, on mobile data rather than office wifi, click every conversion path: header WhatsApp, sticky bar WhatsApp, floating WhatsApp, both phone numbers, the form. Confirm each fires once with the right parameters. Then test `gclid` capture: append `?gclid=test123`, browse three pages, submit the form, confirm it arrives in the payload. **Do not accept a screenshot of tags firing in preview mode as proof.** Preview mode lies about mobile |
| 0:35 to 1:00 | **Reviews: round three, and respond to every one received** | Chase remaining non responders. **Respond to every review that has come in this week, including the two you already had.** Response rate is a local ranking signal and it is visible to every future reader |
| 1:00 to 1:30 | **Walk the whole site as a visitor, on your phone** | Nobody has yet. Homepage to service to area to project to contact. You are looking for the thing that reads wrong, the tap target you cannot hit, the sentence that sounds like a portal. This catches what no checklist does |
| 1:30 to 1:55 | **Final claims verification signoff** | The complete flagged list from `02-page-specs.md` section 17. Every claim verified, softened or removed. This is the gate |
| 1:55 to 2:00 | **Launch decision** | Site goes live to index |

### Definition of done

- [ ] Every conversion event verified firing on a real mobile device, in GA4 DebugView, with correct parameters
- [ ] No event fires twice. The three WhatsApp entry points are distinguishable by parameter
- [ ] `gclid` capture verified end to end, before any ad ever runs
- [ ] Lead storage endpoint working, so leads exist somewhere other than your WhatsApp inbox
- [ ] Sitemap submitted, Search Console shows pages discovered
- [ ] Core Web Vitals measured on the live domain, results recorded against the targets in `09-technical.md`
- [ ] Every Google review received this week has a response
- [ ] Whole site walked on a real phone
- [ ] Zero unverified claims live on the site
- [ ] Signed decision to launch, recorded with a date

---

## 7. Where your 10 hours actually go

Revised after your answers of 25 August 2026.

| Activity | Hours | Share |
|---|---|---|
| Local knowledge and area pages, Day 2 | 1.25 | 12.5% |
| Content review, Day 4 | 1.4 | 14% |
| Fact verification and claims gating, across all days | 1.2 | 12% |
| Domain, deployment and accounts, Day 1 | 1.05 | 10.5% |
| **Google review generation, Days 1, 4 and 5** | **0.9** | **9%** |
| FAQ answers in your own voice, Day 3 | 0.85 | 8.5% |
| Technical and schema review | 0.9 | 9% |
| Whole site walkthrough, Day 5 | 0.5 | 5% |
| Tracking verification, Day 5 | 0.58 | 6% |
| GBP optimisation, Day 1 | 0.33 | 3% |
| About page and NAP, Day 2 | 0.33 | 3% |
| Jaswanti Jewel verification, Day 3 | 0.5 | 5% |
| Approvals and decisions | 0.21 | 2% |

**What changed.** Paid campaign review left the 10 hours entirely and became a separate week 2 block. Testimonial intake left and moved to the content pipeline. Google Business Profile work shrank, because the profile already exists and needs optimising rather than creating.

**What those hours bought.** Review generation, which was not in the original 10 hours at all, now has 54 minutes across three days. Given you are at 2 reviews and that is the single largest constraint on your local visibility, this is the best trade available in the whole schedule.

Roughly a third of your time still goes to things only you have (local knowledge, client relationships, business facts), a third to verification, and a third to setup and approvals. None of it goes to production.

---

## 8. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `shreegiriraj.in` also unavailable | Low | Blocks the week | Have `shreegirirajrealestate.in` and `shreegirirajproperties.in` as fallbacks before you sit down |
| DNS propagation delays Search Console | High | Low | Verification completes asynchronously. Does not block Days 2 to 5 |
| ~~GBP verification takes weeks~~ | **Eliminated** | | The profile already exists and is claimed. This risk is gone |
| **Review requests get few replies** | **Medium** | **Medium** | Two rounds are already scheduled. If Day 5 arrives under 5 reviews, launch anyway and keep asking. Display no rating until 10 |
| **A duplicate GBP listing exists** | Unknown | **High** | Splits your local signal invisibly. Ten minutes of searching on Day 1 rules it in or out |
| **The GBP map pin is wrong** | Medium | Medium | Chikoowadi versus Sector 4 Charkop. Damages local pack relevance and misdirects visitors. Check Day 1 |
| Jaswanti Jewel RERA number unavailable | Medium | Low | **Downgraded.** You are the agent, not the promoter, so this no longer blocks the page. Add the number when Ashray supplies it |
| ~~Testimonials not ready by Day 4~~ | **Eliminated** | | Moved to the week 2 content pipeline by your decision |
| A day slips entirely | Medium | Medium | Cut Day 4 content first, per section 5. Never cut Day 1 or Day 5 |
| Taboola has India restrictions or a minimum you will not meet | Unknown | Medium | Verify on Day 1. If Taboola is not viable, the content assets still serve organic and Google Display retargeting |

---

## 9. Week 2 and beyond, the immediate backlog

Not part of the 10 hours. Listed so the handover is clean.

### Week 2: the paid block, one more 2 hour session

You moved paid to the week after launch. That is the right call, because the site will have a week of real organic data behind it and tracking will have had a genuine soak rather than a 48 hour one. It needs its own 2 hour block.

**What Claude Code produces before it:** the three landing pages at `/lp/rent-borivali`, `/lp/buy-borivali` and `/lp/jaswanti-jewel`, all `noindex, follow`. Taboola pixel. Google Ads and GA4 linking with conversion imports. Campaign structures built and paused per `08-paid-campaigns.md`.

**Your 2 hours:**

| Time | Task |
|---|---|
| 0:00 to 0:20 | Create the Google Ads account and start identity verification. Ask Taboola about India minimums and real estate category restrictions |
| 0:20 to 0:50 | Review the three landing pages against the `cro` checklist: value proposition clear in five seconds, headline matches the ad, one primary action, trust signals above the fold, two field form |
| 0:50 to 1:20 | Review campaign structure, keywords, negatives and budgets. **Confirm the `jaswanti gold` and `gold` negatives are applied.** Confirm you are **not** bidding to WhatsApp clicks |
| 1:20 to 1:40 | Set budgets and the lead value weighting from your answer to B8 |
| 1:40 to 2:00 | Prelaunch checklist in `08-paid-campaigns.md` section 9. Unpause only when every box is ticked |

### The rest of the backlog

| Week | Item |
|---|---|
| 2 | Local citations and directory listings begin. First two blog posts from the pipeline. **Testimonial and case study intake starts**, attached to the content pipeline |
| 2 to 3 | Reviews reach the 10 threshold at which a rating can be displayed on the site. First case study published |
| 3 to 4 | Pillar guides 2 and 3 written. Second and third case studies |
| Month 2 | Next.js 15 upgrade. Service by area combination pages for the 2 or 3 combinations with proven volume. Marathi and Hindi translation of the four area pages, if the data supports it |
| Month 2 onward | AI visibility monitoring, monthly manual check across ChatGPT, Perplexity and AI Overviews for the top 20 queries, per the `ai-seo` DIY monitoring method |
| Month 3 | First content performance review. Cut what is not working, double the clusters that are |
