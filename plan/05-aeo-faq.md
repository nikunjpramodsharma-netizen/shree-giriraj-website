# 05. AEO and FAQ Layer

Framework: `ai-seo` (extractability, answer blocks of 40 to 60 words, the Princeton GEO ranking of optimisation methods, query fan out, what not to do), `schema` (FAQPage implementation and accuracy first).

**Every question in section 4 marked LIVE is verbatim from Google's People Also Ask, pulled 25 August 2026.** They are not invented and they are not paraphrased. Questions marked DERIVED are ones I have written from the cluster, and they are labelled so you can tell the difference.

---

## 1. What we are actually optimising for

Two different surfaces, one method.

**Google AI Overviews.** Google's own position is explicit: no special markup is required, do not chunk content for AI, do not write separate content for AI. AI Overviews run on core Search ranking. So for Google the answer is ordinary good content organisation plus strong E-E-A-T.

**Everything else.** ChatGPT, Perplexity, Claude and Copilot actively reward extractable structure: self contained answer passages, FAQ blocks, comparison tables, definition blocks. They also cite third party sources more readily than your own domain.

The happy result is that the same work serves both. Answer first paragraphs, question shaped headings and honest FAQ blocks are simply good writing. Nothing in this file involves writing a separate version of anything for a machine, which the `ai-seo` guide warns is a scaled content abuse risk.

### Two AI Overviews already confirmed

The SERP pull found `ai_overview` present on:

- **"stamp duty in mumbai"** (880 a month)
- **"society redevelopment process"** (70 a month)

These are not theoretical AEO targets. Google is already answering these queries with a generated summary and citing somebody. Currently that somebody is Ruparel, Bajaj Finserv and Tata Capital for stamp duty, and a set of small redevelopment specialist sites for redevelopment. Neither set is unassailable.

---

## 2. The answer format

Every answer on the site follows the same shape. This is the single highest leverage formatting decision in the plan.

### The rule

**Answer in the first sentence. Then expand. Never build up to the answer.**

Most writing puts context first and the answer third. That is fine for a human reading top to bottom and fatal for extraction, because a snippet or an AI engine takes the opening passage and if the opening passage is preamble, you do not get cited.

### The shape

```
[Sentence 1: the direct answer, complete and standalone]
[Sentences 2 to 3: the qualification, the number, the exception]
[Sentence 4 optional: what to do about it]
```

**40 to 60 words total.** Long enough to be complete, short enough to be lifted whole.

### Self containment test

Read the answer with the question removed and no surrounding page. Does it still make sense to somebody who has not read anything else? If it needs "as mentioned above" or "this" or "that process", it fails and gets rewritten.

### Worked example

**Bad, and this is how most agents write.**

> Stamp duty is an important consideration when buying property in Mumbai. Many buyers are unaware of the various charges involved. It is calculated on the basis of the agreement value or the ready reckoner rate. In Mumbai, the applicable rate is 6% for men and 5% for women, which includes the 1% metro cess.

The answer is in sentence four. An extraction engine takes sentence one, which says nothing.

**Good.**

> Stamp duty in Mumbai is 6% of the property value for male buyers and 5% for female buyers, which includes the 1% metro cess. Registration is a further 1%, capped at ₹30,000. The duty is calculated on the agreement value or the ready reckoner rate, whichever is higher. Verified August 2026.

54 words. The answer is complete in sentence one. It carries specific numbers, the calculation basis, and a verification date. All four of those are things the `ai-seo` guide identifies as citation drivers.

**Note the verification date.** Freshness is weighted heavily and undated content loses to dated content. Every number bearing answer on this site carries the month it was checked.

### What the Princeton GEO research says to do, applied

Ranked by measured visibility boost across Perplexity.

| Method | Boost | How it lands on this site |
|---|---|---|
| Cite sources | +40% | Link MahaRERA, the Maharashtra registration department and RBI directly. Not a summary of them, the source |
| Add statistics | +37% | Real numbers with dates in every answer that can carry one |
| Add quotations | +30% | Attributed quotes from you, named, with your role and years in the business |
| Authoritative tone | +25% | Write from thirty years of doing it, not from research |
| Improve clarity | +20% | Short sentences, one idea each |
| Technical terms | +18% | Use the actual vocabulary. Leave and licence, index 2, corpus fund, conveyance, ready reckoner |
| Keyword stuffing | **minus 10%** | **Actively harmful.** Do not repeat the target phrase. This is the opposite of old SEO habit |

That last row is worth sitting with. Repeating "property in Borivali West" through a page reduces AI visibility. The service and area pages must be written for a reader, and the DataForSEO validated phrasing used once, naturally, in the places that matter.

---

## 3. FAQPage schema plan

### Where it goes

| Page | FAQPage | Questions | Rationale |
|---|---|---|---|
| Homepage | Yes | 6 | General only, per the existing restructuring decision. Firm level, not service level |
| `/services` | Yes | 4 | Fees, exclusivity, coverage, timelines |
| Each of 6 service pages | Yes | 6 to 8 | Service specific, from PAA where available |
| Each of 4 area pages | Yes | 6 | **Verbatim from live PAA.** Highest confidence question sets on the site |
| `/projects/jaswanti-jewel` | Yes | 6 | Live PAA available |
| `/about` | No | | No natural question set. Forcing one is padding |
| `/contact` | No | | Same |
| Pillar guides | Yes | 8 to 12 | The largest FAQ blocks on the site |
| Blog posts | Conditionally | 3 to 5 | **Only where the post carries a genuine FAQ section.** Do not bolt an FAQ onto every post to farm schema |
| Case studies | No | | |
| Landing pages | Yes | 3 | Objection handling, doubles as schema |

### Implementation rules

| Rule | Why |
|---|---|
| The Q and A in the schema must be **identical** to what is visible on the page | `schema` accuracy first. Markup that does not match visible content is a violation, not a shortcut |
| Never mark up a question the page does not visibly answer | Same |
| One `FAQPage` per page maximum | Multiple blocks confuse parsers |
| Compose into the page `@graph` alongside `Service`, `BreadcrumbList` and the rest | Cleaner than separate script tags |
| Answers in schema carry the full answer, not a truncation | A truncated answer in markup is a mismatch |
| Validate every page type on Day 3 | Rich Results Test plus the Schema.org validator |

**A realistic expectation, stated plainly.** Google substantially reduced FAQ rich result display in 2023 and now shows them mainly for authoritative government and health sites. **Do not implement FAQPage schema expecting rich snippets in Google.** Implement it because the non Google AI engines parse it directly and because the underlying content structure is what wins the AI Overview anyway. If you get rich results, that is upside.

---

## 4. Question sets by page

### 4.1 Homepage, general only, 6 questions

All DERIVED. There is no PAA data for a branded query at this volume.

| # | Question | Answer notes |
|---|---|---|
| 1 | What areas does Shree Giriraj Real Estate cover | Name all four suburbs explicitly. Entity plus service area in one extractable block |
| 2 | Is Shree Giriraj Real Estate MahaRERA registered | Yes plus the number. Regulatory trust, and a query AI engines handle badly for small firms |
| 3 | How long has Shree Giriraj been operating | Since 1996. **Not "25+ years"** |
| 4 | What does an estate agent in Mumbai charge | The honest fee position. Nobody publishes this and everybody wants to know it |
| 5 | Do I have to sign anything exclusive to work with you | Direct objection handling |
| 6 | How quickly do you respond to an enquiry | Sets expectation. Reduces form abandonment |

Question 4 is the one to lean into. It is the most searched unpublished question in the category and answering it plainly is both a trust move and an AEO move.

### 4.2 Area pages, all LIVE from PAA

**Borivali West.** All four live PAA questions are price questions. That is the entire demand signal.

| # | Question | Source |
|---|---|---|
| 1 | What is the typical cost of a flat in Borivali West | **LIVE** |
| 2 | What is the best area to live in Borivali West | **LIVE** |
| 3 | What is the price range for a 1 BHK flat in Borivali West | **LIVE** |
| 4 | What is the average price of a 3 BHK flat in Borivali West, Mumbai | **LIVE** |
| 5 | What should I check before buying a flat in Borivali West | DERIVED |
| 6 | Is Borivali West better than Borivali East | DERIVED, comparison fan out |

**This creates a direct conflict with your masking policy and you need to resolve it.** Four out of four live questions ask for prices. A page that answers all four with "contact us for pricing" will not rank and will not be cited, and a competitor's answer gets used instead.

**My recommendation:** answer with genuine ranges and a verification month, and gate only the specific, current, flat by flat sheet.

> A 2 BHK in Borivali West currently sits in the ₹X to ₹Y crore range depending on the pocket, the building's age and whether it is a redevelopment. Older buildings near the station belt sit at the lower end. Newer towers off Link Road sit above it. Verified August 2026.

That answers the query, demonstrates expertise, stays honest, and still leaves you a reason to talk to them. A range is not a price sheet. **This is a commercial decision, not a technical one, and it is in the Q&A.**

**Borivali East, Kandivali, Malad.** Same six question shape, substituting the suburb. I did not pull PAA for these three individually to control research spend. **Pull them before writing those pages.** Roughly $0.002 per query. Do not reuse the Borivali West questions on the assumption they transfer.

### 4.3 Rentals service page

| # | Question | Source |
|---|---|---|
| 1 | What is the cost of a 2 BHK flat in Borivali | **LIVE**, from the rentals SERP |
| 2 | What is the price of a 1 BHK flat in Borivali | **LIVE** |
| 3 | What is the price of a 1 RK flat in Borivali | **LIVE** |
| 4 | Where is the cheapest place to rent in Mumbai | **LIVE.** Broad, but it is what people ask alongside |
| 5 | How much deposit is normal for a rental in Borivali | DERIVED. Ten months is the local norm and it shocks outsiders |
| 6 | What is the difference between a rent agreement and a leave and licence agreement | DERIVED. "rent agreement mumbai" 480 a month, "leave and license agreement mumbai" 110 |
| 7 | Do I have to register a leave and licence agreement in Maharashtra | DERIVED. Yes, and people do not know it |
| 8 | What brokerage is standard on a rental in Mumbai | DERIVED. Unpublished, universally wanted |

Note that questions 1 to 3 are price questions again. The rental market is more publishable than the sale market, so answer these with real bands.

### 4.4 Interiors service page

The highest CPC cluster on the site, and the SERP carries a local pack.

| # | Question | Source |
|---|---|---|
| 1 | How much does an interior designer charge in Mumbai | **LIVE** |
| 2 | What is the average cost of interior design | **LIVE** |
| 3 | What does a 2 BHK interior cost in Mumbai | DERIVED, from the 1,600 a month query |
| 4 | What does a modular kitchen cost in Mumbai | DERIVED, from the 390 a month query |
| 5 | What is the 70/30 rule in interior design | **LIVE.** Design theory, not commerce, but it is in the PAA set and answering it costs a paragraph |
| 6 | What interior work will a Mumbai society not permit | DERIVED. Genuinely local, genuinely useful, nobody answers it |
| 7 | How long does a 2 BHK interior fit out take | DERIVED |
| 8 | Should I do interiors before or after possession | DERIVED |

**Every commercial question here is about cost.** This is the one page where withholding numbers loses you the query outright, because your competitors on this SERP, Livspace and HomeLane, publish cost calculators. Publish real bands.

### 4.5 Redevelopment service page

AI Overview confirmed on the anchor query. Weakest competition on the site.

| # | Question | Source |
|---|---|---|
| 1 | What are the steps in the redevelopment process | **LIVE** |
| 2 | What are the 79A rules for redevelopment in Maharashtra | **LIVE.** Very specific, very local, and a genuine authority signal if answered properly |
| 3 | How many years are required for redevelopment of a society | **LIVE** |
| 4 | What are the disadvantages of redevelopment | **LIVE.** Answering this honestly is the strongest trust move available on this page |
| 5 | What is a corpus fund and how is it calculated | DERIVED, from the 210 a month query, the highest volume term in the cluster |
| 6 | What rent should members receive during redevelopment | DERIVED |
| 7 | How does a society choose a developer | DERIVED |
| 8 | What should be in the redevelopment agreement | DERIVED, from the 50 a month query |

Question 4 is the opportunity. Every developer site in that SERP is selling redevelopment. An honest answer about the downsides, written by someone with no development arm to protect, is exactly the kind of content that gets cited and exactly what a nervous committee member is searching for at 11pm.

### 4.6 Jaswanti Jewel

| # | Question | Source | Note |
|---|---|---|---|
| 1 | What is the price range at Jaswanti Jewel | **LIVE** | The dominant query. Collides with masking |
| 2 | Where is Jaswanti Jewel located | **LIVE** | Easy, factual, answer precisely |
| 3 | What is Jaswanti Jewel known for | **LIVE** | Entity definition. Feeds the knowledge graph |
| 4 | What is the price range for a 1 BHK flat in Kandivali West | **LIVE** | **The project has no 1 BHK.** Answer honestly and redirect |
| 5 | Who is the developer of Jaswanti Jewel | DERIVED | **Unblocked.** Ashray, confirmed 25 August 2026. Name them. Naming the developer is an entity signal AI engines use. **Do not mention their other projects**, which Shree Giriraj does not handle |
| 6 | What is the MahaRERA number for Jaswanti Jewel | DERIVED | **Blocked.** Required by law on the advertisement |

Question 4 needs care. Do not invent a 1 BHK. The honest answer is that the project offers 2 to 5 BHK configurations only, followed by what a 1 BHK in Kandivali West does cost. That answers the searcher's real question and keeps you accurate.

### 4.7 Resale flats, new project bookings, shops and plots

Six to eight DERIVED questions each. PAA not pulled for these, to control research spend. **Pull before writing.** The pattern is the same: lead with the price and cost questions because that is what the data shows people ask, then the process questions, then the objection questions.

### 4.8 Pillar guides

Eight to twelve questions each, the largest blocks on the site. The stamp duty and redevelopment guides carry the live PAA sets in full, since both have confirmed AI Overviews.

Live PAA for the stamp duty cluster:

- How do I calculate stamp duty in Mumbai
- What is the calculation for stamp duty
- Can I gift my flat to my mother
- What is the current stamp duty rate in Maharashtra for 2026

The third is unexpected and worth noticing. Gift deeds are a real query sitting inside the stamp duty topic and nobody in that SERP addresses them. It is post A12 in the content plan.

---

## 5. Beyond the FAQ block

FAQ schema is the smallest part of AEO. The rest is content structure and presence.

### On page

| Element | Where | Purpose |
|---|---|---|
| Answer first opening paragraph | **Every page and every post** | The most important single element. More citation value than all the schema combined |
| Definition block | Guides, service pages | Self contained "what is X" for definitional queries |
| Numbered process list | Redevelopment, buying, registration | Numbered lists beat paragraphs for process queries |
| Comparison table | `/areas`, versus posts, cost posts | Comparison content is roughly 33% of AI citations, the largest single share |
| Cost table with dates | Stamp duty, interiors, registration | Statistics carry a +37% boost. Dated statistics survive |
| Named author byline | Every post and guide | Expert attribution, +25 to 30% |
| Last updated date, displayed | Every post and guide | Freshness weighting |
| Outbound source citations | Every factual claim | +40%, the highest ranked method |

### Off page, which matters more than people expect

Per the `ai-seo` presence pillar, brands are roughly 6.5 times more likely to be cited via third party sources than their own domain.

| Source | Action | Priority |
|---|---|---|
| **Google Business Profile** | Complete, with real reviews. Detail in `06-geo-local.md` | **Highest** |
| **YouTube** | A YouTube video already ranks in the top 8 for "flats in borivali west" and short videos appear on the Jaswanti Jewel SERP. A walkthrough series is a genuine opening | High |
| **Reddit** | r/mumbai and r/india. A Reddit thread ranks 6th for "interior designer borivali". Participate honestly, do not spam | Medium |
| Quora | Answer Mumbai property questions with real depth | Medium |
| Justdial and MagicBricks agent profiles | JustDial ranks 2nd for interior designer Borivali. Your profile there is a citation source | Medium |
| Local press | Any Borivali or Mumbai suburban publication | Opportunistic |

**Note the pattern.** On three of the six SERPs I pulled, a user generated or third party source (YouTube, Facebook, Reddit) outranks every local agent. That is where the citations are.

### AI crawler access

`robots.txt` must explicitly allow the bots that cite. Blocking them means those engines cannot cite you at all.

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /
```

`CCBot` is a judgement call. It is Common Crawl, which feeds training rather than citation. Blocking it costs you nothing in citation terms. Recommendation: allow it. For a firm with no brand recognition, appearing in training data is a benefit rather than a risk.

---

## 6. Monitoring

No AI specific Search Console reporting exists. Google is explicit about this. Standard Search Console reports plus manual checks are the only options that do not cost money.

**Monthly, roughly 30 minutes, per the `ai-seo` DIY method.**

1. Take 20 priority queries. Suggested starting set: the four area price questions, stamp duty in Mumbai, society redevelopment process, corpus fund, interior designer Borivali, 2 BHK interior cost, best property agent Borivali, Jaswanti Jewel price, rent agreement Mumbai, TDS on property purchase, occupancy certificate, plus six from your own service pages
2. Run each through ChatGPT, Perplexity and Google
3. Record: is an AI Overview present, are you cited, who is cited instead, which page of theirs
4. Log month over month in a spreadsheet

The two queries where an AI Overview is already confirmed, stamp duty in Mumbai and society redevelopment process, are your baseline. If you are cited on either within six months, the AEO layer is working.

Paid monitoring tools exist (Otterly, Peec, ZipTie, LLMrefs). **Do not buy one yet.** At this site size the manual check is sufficient and the money is better spent on Google Ads.

---

## 7. What not to do

From the `ai-seo` guide, and worth stating because several are tempting.

1. **Do not write separate content for AI.** Same content serves both. Variants targeted at machines risk the scaled content abuse policy
2. **Do not chunk pages into fragments.** Normal headings and paragraphs. Google says this explicitly
3. **Do not bolt an FAQ onto every page** to farm schema. Only where a real question set exists
4. **Do not keyword stuff.** It measurably reduces AI visibility by 10%. This is the opposite of habit and it matters most on the area and service pages
5. **Do not fabricate citations or spam Reddit.** Real participation only. In a market as small as Borivali you will be recognised
6. **Do not gate the authoritative content.** AI engines cannot read what is behind a form. The price sheet gate is fine because it is a document, not an argument. Never gate a guide
7. **Do not block AI crawlers**
8. **Do not mark up an answer the page does not visibly give**

---

## 8. Priority order

If time compresses, this is the order things get done.

1. **Answer first paragraphs on every page.** Free, structural, largest single effect
2. **Area page FAQs from live PAA.** Confirmed demand, highest confidence
3. **Author bylines and last updated dates.** Cheap, and E-E-A-T is currently zero
4. **Outbound source citations.** Highest ranked GEO method at +40%
5. FAQPage schema. Real but secondary, given Google's reduced rich result display
6. Comparison tables on `/areas` and the cost posts
7. Off page presence: YouTube, Reddit, Quora. High value, but it is ongoing work rather than launch work
