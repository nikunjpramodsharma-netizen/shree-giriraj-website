# 14. Free Tools

Calculators as a traffic and lead channel. Measured, filtered, and prioritised by what is actually winnable.

Framework: `free-tools` (engineering as marketing), `lead-magnets` (gating strategy), `ai-seo` (machine readable answers).

---

## 1. What the data says

Thirty calculator queries measured against DataForSEO, India, English, 1 September 2026. **All thirty returned volume. Combined, 5,018,030 searches a month.**

That headline number is misleading and I am not going to build a plan on it. Filtered honestly, the addressable slice is roughly **30,000 a month**. Here is how it breaks down.

### Cut: high volume, wrong intent or unwinnable

| Query | Volume | Why it is cut |
|---|---|---|
| emi calculator | **2,740,000** | Generic. Owned by banks and aggregators. A Borivali agent will not rank, and the traffic has no property intent anyway |
| sq ft to sq m | **246,000** | A unit converter. Zero buying intent, zero relevance. Anyone landing here bounces |
| **brokerage calculator** | 33,100 | **Almost certainly stock broking, not property.** The $1.43 CPC points at Zerodha and Groww, not estate agents. Treating this as ours would be a misread of the data |

Those three alone are 3,019,100 of the 5,018,030. **Sixty percent of the headline number is not real for this business.**

### Keep: winnable, relevant, and it feeds a service

| Tool | Queries it serves | Combined | Top CPC | Feeds |
|---|---|---|---|---|
| **Stamp duty and registration calculator** | stamp duty calculator (12,100), stamp duty and registration calculator (2,900), stamp duty calculator maharashtra (720), property registration charges calculator (480), ready reckoner rate calculator (90) | **16,290** | $0.03 | Resale, paperwork cluster |
| **Home loan EMI and eligibility** | home loan emi calculator (673,000), home loan calculator (550,000), eligibility calculator (33,100), prepayment (8,100), affordability (390), LAP EMI (1,900) | **1,266,490** | $0.63 | Resale, new bookings |
| **Carpet area and loading calculator** | carpet area calculator (2,900), built up area calculator (720), area conversion (3,600) | **7,220** | $0.00 | Resale, buying cluster |
| **HRA and rent receipt** | hra calculator (22,200), hra exemption calculator (4,400), rent receipt generator (2,900), rent agreement calculator (320) | **29,820** | $0.06 | Rentals |
| **Interior cost estimator** | modular kitchen cost calculator (1,600), interior design cost calculator (1,300), home renovation cost calculator (210) | **3,110** | **$2.01** | **Interiors, highest margin** |
| **Property tax, Mumbai** | property tax calculator mumbai (210), bmc property tax calculator (140) | **350** | none | Local authority |
| Capital gains on property sale | capital gains calculator on property (1,600) | 1,600 | none | Resale, sellers |

---

## 2. Priority, and the honest case for each

### Tier 1, build these first

**1. Stamp duty and registration calculator (Maharashtra).**
16,290 a month, low competition, and it is the single most defensible tool here. National calculators handle every state badly. A Maharashtra specific one that knows the Mumbai metro cess, the female buyer concession and the ready reckoner basis beats a generic one on accuracy, which is the only thing that matters in a calculator. It also feeds the largest content cluster, where `igr maharashtra` sits at 246,000.

**2. Interior cost estimator.**
Only 3,110 a month, but at **$2.01 CPC it is the most commercially valuable query in the entire tool set**, and it feeds your highest margin service. Livspace and HomeLane both run cost calculators, which is exactly why one is needed: on that SERP, not having one is the gap. This is a lead magnet more than a traffic play.

**3. Carpet area and loading calculator.**
7,220 a month at effectively zero competition. It also does something none of the others do: it makes the loading problem visible. A buyer who types in 1,000 super built up and sees 680 carpet has just learned why your resale service exists.

### Tier 2

**4. Home loan EMI and eligibility.**
The volume is enormous and almost entirely unwinnable at the head. HDFC, Bajaj, BankBazaar and Groww own it. **Build it anyway**, for three reasons that are not about ranking: it is table stakes on a property site, it captures long tail like "home loan for resale flat" (110) and "home loan for under construction property" (140), and it is the natural conversion point at the end of cluster B posts. **Expect near zero organic traffic from it and judge it on assisted conversions instead.**

**5. HRA and rent receipt generator.**
29,820 a month, tax season heavy, and it puts you in front of every tenant in Mumbai once a year. Weak buying intent, strong repeat visit behaviour, and it feeds the rentals service which is your highest volume search cluster.

### Tier 3, cheap to add once the framework exists

**6. Property tax, Mumbai.** 350 a month. Tiny, but hyperlocal and nobody local owns it.
**7. Capital gains on a property sale.** 1,600 a month. Reaches sellers, which is half of a resale transaction and the half the rest of the site under serves.

---

## 3. How a tool differs from a blog post

This matters, because building calculators like articles wastes them.

| | Blog post | Tool |
|---|---|---|
| Job | Answer a question | Produce a result the reader wanted |
| Success | Read, then remembered | Used, then returned to |
| Conversion | Soft, later visit | **At the moment of the result** |
| Repeat visits | Rare | Common, especially seasonal ones |
| Ages | Refresh quarterly | Breaks when a rate changes |

**The conversion moment is the whole point.** Somebody who has just seen that their stamp duty is ₹4.2 lakh is, for about ten seconds, more engaged with the cost of buying a flat than they will be all month. That is where the CTA goes, not in a footer.

---

## 4. Page structure for a tool

Same for all of them, so they can share one shell.

| # | Section | Purpose |
|---|---|---|
| 1 | H1 plus a 40 to 60 word answer block | The AEO requirement. "Stamp duty in Mumbai is 6% for men and 5% for women, including the 1% metro cess." Answers the question even for a reader who never touches the calculator |
| 2 | **The calculator** | Above the fold. No email wall, no signup. Gating a calculator kills the traffic that justified building it |
| 3 | **The result, with the CTA beside it** | The conversion moment. "Your stamp duty is roughly ₹4.2 lakh. Want us to check what else this flat will cost you?" plus the `ContactCTA` |
| 4 | Optional: email me this result | The one soft capture. Optional, never blocking |
| 5 | How this is calculated | The formula, the source, the date checked. This is what makes it citable |
| 6 | What the number does not include | Registration, brokerage, society transfer, GST. Honest and useful, and it seeds the next question |
| 7 | Related reading | Three posts from the matching cluster |
| 8 | Sources and last verified date | Links to IGR Maharashtra or the primary source, with the month |

**Never gate the calculator itself.** Per the `lead-magnets` guide, a full gate suits high value bottom of funnel content. A calculator is top of funnel utility, and gating it forfeits both the traffic and the goodwill. The capture is the optional emailed result and the CTA next to the answer.

---

## 5. URL and architecture

```
/tools                          index, links to all
/tools/stamp-duty-calculator
/tools/home-loan-emi-calculator
/tools/carpet-area-calculator
/tools/interior-cost-estimator
/tools/hra-calculator
/tools/property-tax-mumbai
/tools/capital-gains-calculator
```

**A new top level section**, not buried under `/blog`. Tools and articles are different content types and mixing them makes both harder to find.

Changes this needs:
- `SERVICE_SLUGS` style constant for tool slugs in `src/lib/seo.ts`
- Sitemap entries, English only at first
- `/tools` added to the footer, and to the header once there are three or more
- Add `"tools"` to the `RESERVED` set in the flexible `[slug]` route, or `/tools` will collide the way the service slugs did

**Schema:** `SoftwareApplication` with `applicationCategory: FinanceApplication` on each tool page, plus `BreadcrumbList`, plus `FAQPage` where the page carries real questions. Not `Product`, and no `offers`.

---

## 6. Accuracy is the whole product

A calculator that is wrong is worse than no calculator, and worse than a wrong article, because people act on it.

| Rule | Why |
|---|---|
| Every rate carries a "verified [month]" line | The same discipline as the blog, and here it is load bearing |
| Rates live in one config file, not in component code | So a Maharashtra budget change is a one line edit, not a hunt |
| Show the formula | It is what makes the tool citable by AI engines rather than just used |
| State what is excluded | Stamp duty is not the total cost of buying. Saying so is honest and it opens the next conversation |
| A visible caveat | "An estimate. Confirm the final figure at registration." Not legal advice, and it should not pretend to be |

**Maintenance trigger:** any Maharashtra budget or a change to ready reckoner rates means the stamp duty tool is checked that week. It is the one that would embarrass you if it drifted.

---

## 7. Where this sits in the order

Tools come **after** the first content wave, not before. Three reasons: they are a bigger build than a post, they need the blog around them to link into, and the interior estimator in particular is far more useful once the interiors cluster exists to send readers to.

Suggested sequence, picking up from `13-blog-content-plan.md` section 12:

1. Blog waves 1 and 2, roughly 8 posts
2. **Stamp duty calculator.** Highest defensible volume, feeds the largest cluster
3. Blog wave 3
4. **Interior cost estimator.** Highest CPC, feeds the highest margin service
5. **Carpet area calculator.** Cheap once the shell exists
6. Blog wave 4 and the rest
7. EMI, HRA, property tax, capital gains as capacity allows

---

## 8. What this changes elsewhere

| File | Change |
|---|---|
| `01-architecture.md` | Add `/tools` and seven tool pages to the inventory and the internal linking map |
| `13-blog-content-plan.md` | Cluster A and B posts link to the matching tool. Cluster F posts link to the interior estimator |
| `09-technical.md` | `SoftwareApplication` schema, tool slugs reserved, sitemap entries |
| `08-paid-campaigns.md` | The interior estimator is a genuine landing page for the interiors campaign at $2.28 a click |

---

## 9. Open questions

1. **Do you want the emailed result capture?** It is the only lead capture on an otherwise ungated tool. My recommendation is yes, optional and never blocking.
2. **Interior estimator cost bands.** Same question as the F5 to F8 posts. The tool cannot exist without real numbers, so if those are not publishable this one drops out.
3. **Who owns rate accuracy?** Somebody has to check the stamp duty tool after a Maharashtra budget. If that is not going to happen reliably, the tool should show a prominent last verified date so a stale number is visible rather than silent.
