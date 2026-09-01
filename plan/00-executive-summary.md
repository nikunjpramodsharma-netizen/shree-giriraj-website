# 00. Executive Summary

**Project:** Shree Giriraj Real Estate website
**Objective:** Convert Google Ads and Taboola traffic into qualified leads now, and build an organic moat (SEO, AEO, local) that produces leads without ad spend inside 6 to 12 months.
**Your budget:** 5 days, 2 hours per day, 10 supervised hours total. Claude Code does the production work between your blocks.
**Planning date:** 25 August 2026

---

## 1. The finding that reframes this plan

Your brief asked for a new website and a framework recommendation. Before planning I audited the working directory and found an existing, substantial build at `C:\Shree Giriraj Real Estate`.

It is not a prototype. It is a Next.js 14 App Router site with Sanity CMS, Tailwind, four locales, 40+ commits, a passing test suite, and copy already validated against real DataForSEO search volume.

You confirmed we extend it rather than restart, and asked me not to let quality slide as a result. So this plan is built on a full audit of what is there, not an assumption that it is good. The audit is below, split honestly into what is genuinely done, what is broken, and what is simply absent.

**The headline:** the build is sound. The marketing layer is missing almost entirely. That is actually the ideal position to be in with 10 hours, because the missing layer is the part Claude Code can produce fastest and you need to review least.

---

## 2. Audit of the existing build

### Already built and worth keeping

| Item | Evidence | Verdict |
|---|---|---|
| Next.js 14 App Router, Sanity CMS, Tailwind, Vercel ready | `package.json`, `README.md` | Keep. Correct stack, see section 3 |
| Routes: `/`, `/blog`, `/blog/[slug]`, `/projects`, `/projects/[slug]`, `/services`, `/services/[slug]`, flexible `/[slug]` | `src/app/(site)/[locale]/` | Keep. Good spine |
| Sanity Studio at `/studio`, 8 schema types (post, project, page, faq, testimonial, author, category, teamMember) | `src/sanity/schemas/` | Keep. You can publish without touching code |
| Four locales via next-intl, `localePrefix: "as-needed"` | `src/i18n/routing.ts` | Keep the mechanism, fix the SEO around it (section 2.2) |
| `next/image` used 9 times, zero raw `<img>` tags | grep of `src/` | Keep. Already the correct image strategy |
| `next/font` with `display: swap` for Fraunces and Inter | `layout.tsx` | Keep. Self hosted, no render blocking font request |
| `setRequestLocale` for static rendering per locale | `layout.tsx` | Keep. This is why the site can be statically generated |
| Six service pages with DataForSEO validated copy | `docs/superpowers/plans/2026-07-28-service-pages-and-seo-content.md` | Keep. Real volume behind the wording |
| Automated test guard enforcing the no dashes rule | commit `e4c685d` | Keep. Extend it to cover new content |
| Sticky mobile Call and WhatsApp bar | `StickyMobileCTA.tsx` | Keep. Correct for a mobile first, WhatsApp first business |

### Broken or actively harmful

| Issue | Why it matters | Fix |
|---|---|---|
| **Silent English fallback across four locales** | `getLocalizedField` falls back to English when a locale is missing. Publish an English only blog post and it renders identical English body text at four URLs with only the nav and footer translated. The `seo-audit` guide flags this exact pattern: "only boilerplate translated, main content identical across locales" produces duplicate content, and thin locale pages drag down site wide rankings through the helpful content system. Every English only post you publish makes this worse. | Gate locale route generation on the presence of real localized body content. No body in that locale, no route. See `09-technical.md` |
| **No hreflang anywhere** | Four locales, zero `alternates.languages`. Google has no signal telling it these are language variants of each other, so it treats them as competing duplicates | Full hreflang set with self reference and `x-default`, per `seo-audit` international rules |
| **No canonical URLs** | No `alternates.canonical` on any page. Combined with the above, nothing tells Google which URL is authoritative | Self referencing canonical on every page |
| **"4.8★ client rating" with no source** | `src/app/(site)/[locale]/page.tsx:282`. An aggregate rating on your own site, sourced from nowhere. Beyond the trust problem, marking this up as `AggregateRating` would breach Google's self serving review policy for LocalBusiness | Replace with the live Google Business Profile rating once reviews exist, linked to GBP so it is independently verifiable. Remove until then. See `04-social-proof.md` |
| **"25+ years" is stale** | Established 1996. In 2026 that is 30 years, not 25. A commit message already flags this as a known stale stat | Say "Since 1996". It is a fact, it never goes stale, and 30 years is self evident |

### Absent entirely

Zero of the following exist anywhere in the codebase. I grepped for every one.

- **Structured data.** No JSON-LD at all. No RealEstateAgent, LocalBusiness, FAQPage, Article, BreadcrumbList, Product, Residence
- **`sitemap.xml`.** No `app/sitemap.ts`
- **`robots.txt`.** No `app/robots.ts`. AI crawler access is therefore undefined
- **Analytics.** No GA4, no GTM, no dataLayer, no event tracking of any kind. Not a single conversion is measurable today
- **Area landing pages.** Borivali, Kandivali and Malad exist only as three cards on the homepage
- **Breadcrumbs.** No navigation trail, no BreadcrumbList schema
- **Blog content.** The routes exist. There are no posts
- **An `/about` page.** The `teamMember` schema was added for one and never used. This is your biggest E-E-A-T gap in a YMYL adjacent category
- **A `/contact` page.** Conversion happens through a homepage form only
- **Case studies.** No format, no template, no content
- **`llms.txt`**
- **Per page OG images**
- **Google Business Profile work.** Nothing started
- **A live domain.** Not deployed, not purchased

---

## 3. Stack recommendation

**Keep Next.js 14 App Router + Sanity + Tailwind on Vercel. Do not migrate. Do not upgrade to Next 15 before launch.**

Judged against your three stated criteria:

**Build speed.** The strongest argument is that it is already built. But even greenfield this is the right pick: the App Router gives you file convention `sitemap.ts` and `robots.ts`, a first class Metadata API for canonicals and hreflang, and static generation per locale. Every technical SEO item in section 2 is a small, well documented file in this stack. In WordPress they would be four plugins and a fight.

**SEO.** Static generation plus ISR means Googlebot gets fully rendered HTML with no JavaScript dependency, which the `ai-seo` guide identifies as a hard requirement for both core Search and AI agents that read the DOM. `next/image` handles responsive sizing, lazy loading and modern formats automatically, which is most of your Core Web Vitals work done by default.

**Your ability to maintain it.** This is the real argument for Sanity, and it is why I am recommending you keep paying the complexity cost of a headless CMS as a solo operator. Blog posts, projects, testimonials and FAQs are all editable at `/studio` with no code, no deploy, no Claude Code session. If content lived in code, your content pipeline would die the week you got busy. The free tier covers you.

**What I would change, after launch, not before:** upgrade Next 14.2 to 15. It is a real improvement but it is a migration, and a migration inside a 10 hour launch budget is how launches slip. Backlog it.

**On the four locales.** You chose English only for new content. Keep the four locale UI, because Borivali genuinely has Marathi, Hindi and Gujarati speaking buyers and the chrome is already fully translated. But new content must not silently fall back. See section 2.2. This is the single most important technical decision in the plan and it is architectural, so it lands on Day 1.

---

## 4. The scope cut

**The full scope does not fit in 10 supervised hours. I am not going to pretend otherwise.**

The constraint is not what Claude Code can produce. Claude Code could draft 60 blog posts. The constraints are:

1. **Facts only you have.** Verified Jaswanti Jewel pricing, real client testimonials, the MahaRERA position, whether "direct builder relationships" can be named. No amount of AI capacity substitutes for this
2. **Your review.** Real estate is regulated and YMYL adjacent. Every published claim needs your eyes. Sixty AI drafted posts you have not read is a liability, not an asset
3. **External clocks you do not control.** Google Business Profile verification in India commonly runs 1 to 2 weeks by postcard. Google Ads account verification takes days. Neither compresses because you want to launch Friday

You said you would rather launch a tight 12 page site with 10 blogs and a real content pipeline than a bloated 60 page site of thin AI filler. That is the correct instinct and it is what this plan does.

### Launches in the 5 days

| | Count | Detail |
|---|---|---|
| Core pages | 15 | Home, `/services` + 6 service pages (exist, get schema and FAQ layer), `/about`, `/contact`, `/areas` hub, `/projects` |
| Area landing pages | 4 | Borivali West, Borivali East, Kandivali, Malad. All new |
| Project page | 1 | Jaswanti Jewel, with masked or gated pricing |
| Blog posts | 10 | Drafted by Claude Code, 3 reviewed line by line by you, all 10 fact checked against the flagged claims list |
| Pillar guides | 1 | The highest value cluster hub only. The other 4 are outlined, not written |
| Paid landing pages | 3 | One per Google Ads campaign theme, `noindex` |
| Technical layer | Full | Sitemap, robots, canonicals, hreflang, locale gating, breadcrumbs, `llms.txt` |
| Schema layer | Full | RealEstateAgent, LocalBusiness, FAQPage, Article, BreadcrumbList, Residence, ItemList |
| Analytics | Full | GA4 + GTM, complete event taxonomy, conversion linking to Google Ads and Taboola, Search Console |
| Content pipeline | Full | The 50 to 60 post plan exists as a document you execute over months |

That is roughly 24 indexable pages. More than the 12 you sketched, because the area pages are cheap to produce and are the highest leverage organic asset you have.

### Carries into the backlog

| Item | Why it cannot happen this week | When |
|---|---|---|
| Posts 11 to 60 | Your review capacity, not production capacity | Weeks 2 to 26, roughly 2 posts a week |
| Pillar guides 2 to 5 | Each needs a real 4,000+ word pass and your review | Weeks 2 to 6 |
| Case studies | You do not have signed client permission yet. Intake starts Day 4 | Weeks 2 to 4 |
| Google Business Profile fully live | Postcard verification clock. Starts Day 1, completes when India Post decides | Week 2 to 3 |
| **Google Ads and Taboola actually spending** | Cannot launch before the domain resolves, conversion tracking is verified firing in GA4, and GBP is verified. Campaigns are **built and paused** by Day 5 | Week 2, after a 48 hour tracking soak |
| Local citations and directory listings | Manual, repetitive, needs NAP locked first | Weeks 2 to 4 |
| Review generation programme | Needs GBP live | Week 3 onward |
| Next.js 15 upgrade | Migration risk during launch | Month 2 |
| Service by area combination pages | 6 services × 4 areas is 24 pages. Most target terms show under 50 searches a month. Building all 24 is thin content risk, not opportunity. Build only the 2 or 3 combinations DataForSEO shows real volume for, such as rentals in Borivali at 590 a month | Month 2, data led |

### The one thing I would cut first if the week goes badly

The 10 blog posts. They are the least time critical item in the launch set, because organic content has a 3 to 6 month lag anyway. The technical layer, schema, analytics and area pages are all prerequisites for everything else and none of them can slip. If Day 4 collapses, launch with 3 posts and keep the pipeline.

---

## 5. Strategy in one page

**Positioning.** You are not a portal. Portals have more listings than you will ever have and they will always outrank you on "flats in Borivali". What they cannot do is know that a specific society has a water problem, or which builder actually delivers on time. Every page should sound like it was written by someone who has walked those buildings. That is both the honest brand and the only defensible SEO position, because it is the one thing that cannot be scraped.

**Three traffic engines, three different jobs.**

1. **Google Ads.** High intent, bottom of funnel. Points at dedicated landing pages, never the homepage. Job: leads this month
2. **Taboola.** Cold discovery traffic. Points at long form articles, never a service page. Cold traffic on a sales page burns money. Job: fill the top of the funnel cheaply and retarget
3. **Organic, local and AI.** Area pages plus the FAQ layer plus the content clusters. Job: replace the ad spend by month 6 to 12

**Why the area pages matter most.** DataForSEO already showed real, differentiated volume per suburb: flats in Malad 260 a month, real estate Kandivali 210 a month and low competition, property in Borivali West 140 a month, property in Borivali East 90 a month. Right now all four of those queries hit a single card on your homepage. Four dedicated pages is the highest ratio of organic return to build effort available to you.

**Why AEO is not a side quest.** Per the `ai-seo` guide, AI Overviews appear in roughly 45% of Google searches and cut clicks by up to 58%. For a local business the answer engine question is not "will I rank" but "when someone asks ChatGPT for a good property agent in Borivali, does my name come out". That is won with structured, answer first content, real expertise signals and third party presence, not with keyword density. The FAQ layer and the schema layer are the mechanism.

**Conversion reality check.** WhatsApp is your primary action, and a WhatsApp click is an outbound click, not a confirmed lead. Feeding that to Google Ads as your optimisation target will train the algorithm to buy curiosity, not customers. The plan tracks WhatsApp clicks as a micro conversion and bids to form submissions and calls, with an offline conversion import path for the real outcome. Detail in `07-analytics-ga4.md`.

---

## 6. Facts I need from you before anything ships

**Updated 25 August 2026. Most of this section is now answered.** Full status in `11-open-questions.md`.

| Item | Status |
|---|---|
| Domain | **`shreegiriraj.in`.** The `.com` is registered but dormant |
| MahaRERA | **Agent registration.** You act as agent, not promoter, so the project number is recommended rather than blocking |
| Developer | **Ashray** |
| Jaswanti Gold | **Out of scope.** Not handled. Now a negative keyword requirement |
| The 4.8★ | **Removed.** Your Google rating is 5.0 from 2 reviews, so 4.8 cannot be sourced to Google. Display no rating until roughly 10 reviews |
| Google Business Profile | **Exists and is claimed.** Eliminates the postcard verification clock entirely |
| Address | **Corrected to the GBP string.** Clover Grove CHS, Chikoowadi, Borivali West |
| Testimonials | Moved to the week 2 content pipeline |
| Paid campaigns | Moved out of the 5 days to a week 2 block |
| Pricing policy | Deferred. Launch default is full masking |
| Budget and lead value | Deferred. Needed before the week 2 paid block |

**The one open item that matters most: you have 2 Google reviews.** That is now the largest single constraint on your local visibility, larger than anything on the website, and it is unblocked. Review outreach starts in your Day 1 block.

### The original list, for reference

Full list in `11-open-questions.md`. The five that block work:

1. **Domain.** Not owned. The codebase defaults to `www.shreegiriraj.in`. Buy it Day 1 or tell me the alternative. Everything downstream waits on this
2. **MahaRERA. RESOLVED 25 August 2026:** `A51800005726` is the **agent** registration. It is used correctly site wide. **But it does not cover a project**, so Jaswanti Jewel's own project registration number is still required and still blocking. From the builder or the MahaRERA public register, never from a portal. See `11-open-questions.md` B2a
3. **Jaswanti Jewel pricing.** The draft shows `₹2.**Cr` masked. Confirm masked pricing stays, and give me the builder's current price sheet date so the page can say when it was last verified
4. **The 4.8★ number.** Where did it come from? If nowhere, it comes off the site on Day 1
5. **"Direct builder relationships".** Can you name any builder, or does that stay generic? A named relationship is worth ten unnamed claims for both trust and AI citation

---

## 7. What I did not verify and will not guess

Logged properly in `11-open-questions.md`. Flagged here so nothing in this plan reads as more certain than it is.

- **Competitors.** I have not researched who ranks for Borivali property terms today. Every competitive statement in this plan is reasoning from category structure, not from data. Recommend a DataForSEO SERP pull on Day 2
- **Taboola in India.** I do not know current minimum spend, whether real estate carries category restrictions, or realistic CPCs for this geography. Verify with a Taboola rep before budgeting
- **Google Ads real estate policy in India.** There may be verification or disclosure requirements for property advertising. Verify before building campaigns
- **Marathi, Hindi and Gujarati search demand.** I have no volume data for these locales. The recommendation to keep the UI but not the content is based on duplicate content risk, not on evidence that the demand is absent
- **Whether `shreegiriraj.in` is available.** Not checked
- **Current GBP status.** I do not know whether a profile exists, is claimed, is duplicated, or has reviews

---

## 8. Files in this plan

| File | Contents | Status |
|---|---|---|
| `00-executive-summary.md` | This document | Delivered |
| `01-architecture.md` | Page inventory, URLs, hierarchy, internal linking map with anchor text | Delivered |
| `02-page-specs.md` | Section by section spec for every page | Awaiting approval |
| `03-content-plan.md` | 50 to 60 posts, clustered, as a table | Awaiting approval |
| `04-social-proof.md` | Case study and testimonial templates, client intake questions | Awaiting approval |
| `05-aeo-faq.md` | Question sets per page, answer format, FAQPage schema plan | Awaiting approval |
| `06-geo-local.md` | Generative engine optimization and local SEO, as two workstreams | Awaiting approval |
| `07-analytics-ga4.md` | Event taxonomy, GTM plan, UTM convention, conversion linking | Awaiting approval |
| `08-paid-campaigns.md` | Google and Taboola landing page mapping, Quality Score requirements | Awaiting approval |
| `09-technical.md` | Stack detail, schema, Core Web Vitals, sitemap, hosting | Awaiting approval |
| `10-five-day-schedule.md` | Day by day execution plan | Delivered |
| `11-open-questions.md` | Everything I need from you, every assumption I made | Awaiting approval |

---

## 9. Which guide informed what

Per your instruction to attribute recommendations.

| Recommendation | Guide |
|---|---|
| Page hierarchy, three click rule, URL patterns, hub and spoke, anchor text discipline, no orphan pages | `site-architecture` |
| Pillar and cluster model, searchable before shareable, buyer stage keyword mapping | `content-strategy` |
| Answer first blocks of 40 to 60 words, citation and statistics weighting, query fan out, AI crawler access, third party presence, warnings against writing separately for AI | `ai-seo` |
| Hreflang self reference and reciprocity, cross locale canonical hazard, thin locale pages suppressing site wide quality, local business failure modes | `seo-audit` |
| JSON-LD over microdata, accuracy first, `@graph` composition, validation workflow | `schema` |
| Event naming in object action form, tracking for decisions rather than data, UTM conventions | `analytics` |
| Landing page conversion structure, trust signals, objection handling, form friction | `cro` |
| Campaign structure, naming conventions, prelaunch checklist | `ads` |
| Voice rules, specificity over vagueness, customer language over company language | `copywriting` |
| Gating strategy for the price sheet and area guides | `lead-magnets` |
| Assessment that service by area pages are premature | `competitors` and `programmatic-seo` thin content warnings |
