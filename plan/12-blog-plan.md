# 12. Blog Plan

How the blog actually runs. The topic list lives in `03-content-plan.md`; this is the operating manual for turning it into published pages.

Written after the technical layer went in, so it assumes canonicals, hreflang, locale gating, `BlogPosting` schema and breadcrumbs already work.

---

## 1. Where the blog stands today

Queried directly against Sanity, not assumed.

| Thing | Count | Note |
|---|---|---|
| Blog posts | **0** | The routes work. There is nothing in them |
| Authors | **0** | The `author` schema exists and is empty |
| Categories | **0** | The `category` schema exists and is empty |
| FAQs | 6 | Used on the homepage |
| Testimonials | 3 | All placeholders. Now filtered out in code |

**What already works:** `/blog` and `/blog/[slug]` routes, `BlogPosting` and `BreadcrumbList` schema, canonical and hreflang, visible breadcrumbs, locale gating so English only posts do not create four duplicate URLs, and Portable Text rendering.

**What is missing from the post template:** related posts, an in post enquiry CTA, a displayed updated date, a table of contents, an FAQ block, and outbound source citations. All six matter for AEO and none of them exist.

**Also missing:** category pages, pagination, and a reading time. Pagination only matters past roughly 20 posts, so it is not urgent.

---

## 2. Build this before post one

Six items. None is large, and writing posts into a template that lacks them means going back over every post later.

| # | Item | Why it earns its place |
|---|---|---|
| 1 | **Author document plus byline** | Named authorship is the single largest E-E-A-T signal available, worth a 25 to 30% citation lift per the `ai-seo` guide. None of the three competitors names a human anywhere. Needs one real person from you |
| 2 | **Answer block at the top** | A 40 to 60 word direct answer before any preamble. The most important formatting decision on the whole site for AI citation |
| 3 | **Displayed "last updated" date** | Freshness is weighted heavily and undated content loses to dated content. Also forces the refresh discipline in section 7 |
| 4 | **Source citations** | Outbound links to MahaRERA and the Maharashtra registration department. Citing sources is the highest ranked GEO method at plus 40% |
| 5 | **Related posts** | Three per post, cluster first. This is what makes the hub and spoke structure real rather than theoretical |
| 6 | **In post `ContactCTA`** | Soft, contextual, below the fold. The dual WhatsApp and form component we just built, dropped in at the end |

Two more that are worth doing but can wait: a table of contents on posts over 1,500 words, and an FAQ block on the posts that have a genuine question set.

---

## 3. The post template

Order matters. This is the shape every post follows.

| # | Element | Rule |
|---|---|---|
| 1 | H1 | Matches the target query phrasing, not a clever headline |
| 2 | Byline and dates | Named author, published date, **last updated** date |
| 3 | **Answer block** | 40 to 60 words. Answers the title question completely, before any context. If it needs the heading to make sense, rewrite it |
| 4 | Body | H2 and H3 phrased as questions where natural. One idea per paragraph |
| 5 | A table or a number | Where the topic supports it. Statistics carry a plus 37% citation lift, and tables are roughly a third of all AI citations |
| 6 | Sources | Links to the primary source, not to a summary of it. With the date checked |
| 7 | Local specifics | What differs in Borivali, Kandivali or Malad. The part no national publisher can write |
| 8 | Cluster link | Back to the pillar guide, descriptive anchor |
| 9 | Related posts | Three |
| 10 | `ContactCTA` | Soft. Cold readers convert on a later visit, not this one |

### The answer block, worked

**Wrong.** Builds up to the answer, so an extraction engine takes sentence one and gets nothing.

> Stamp duty is an important consideration when buying property in Mumbai. Many buyers are unaware of the various charges involved. It is calculated on the basis of the agreement value or the ready reckoner rate.

**Right.** Complete in the first sentence, carries numbers, carries a verification date.

> Stamp duty in Mumbai is 6% of the property value for male buyers and 5% for female buyers, which includes the 1% metro cess. Registration is a further 1%, capped at ₹30,000. It is calculated on the agreement value or the ready reckoner rate, whichever is higher. Verified August 2026.

**Every number bearing sentence carries the month it was checked.** That is what makes the refresh cycle in section 7 enforceable rather than aspirational.

---

## 4. Categories are the clusters

Create six category documents in Sanity, matching `03-content-plan.md` exactly. Nothing else becomes a category, or the taxonomy stops meaning anything within a month.

| Category | Posts planned | Pillar |
|---|---|---|
| Paperwork, registration and tax | 12 | `/guides/property-paperwork-mumbai` |
| Home loans and money | 8 | `/guides/home-loans-for-mumbai-property` |
| Renting | 10 | `/guides/renting-in-the-western-suburbs` |
| Buying | 12 | `/guides/buying-a-flat-in-borivali` |
| Society redevelopment | 8 | `/guides/society-redevelopment-mumbai` |
| Interiors and moving in | 8 | `/guides/home-interiors-mumbai` |

**One category per post.** Multiple categories feels flexible and produces a mess that nobody can navigate.

**Category pages are deliberately deferred.** With 10 posts they would be thinner than the blog index itself. Build them at roughly 25 posts, when a reader genuinely needs to filter.

---

## 5. The launch ten

From `03-content-plan.md` section 10, with the real volumes.

| # | Post | Cluster | Volume | Why it is in the launch set |
|---|---|---|---|---|
| 1 | TDS on property purchase | Paperwork | **14,800** | Largest term in the whole dataset, low competition |
| 2 | Occupancy certificate | Paperwork | **12,100** | Loss framing, low competition |
| 3 | Carpet area versus built up | Paperwork | **3,600** | The most relatable misled buyer story in Indian property |
| 4 | Stamp duty in Mumbai 2026 | Paperwork | 880 | **AI Overview confirmed live on this query** |
| 5 | How to check a MahaRERA registration | Paperwork | 30 | Low volume, high credibility, links to the project page |
| 6 | Home loan eligibility | Money | **9,900** | Taboola hero |
| 7 | The costs nobody budgets for | Money | none measured | Converts. Feeds the resale service |
| 8 | The ten month deposit | Renting | none measured | Local, converting, genuinely uncopyable |
| 9 | What to check before buying a resale flat in Borivali | Buying | none measured | Most local and most converting post in the set |
| 10 | What a 2 BHK interior actually costs | Interiors | **1,600** | Highest CPC cluster at $2.28 |

**The honest caveat, restated because it will matter in month one.** Posts 1, 2, 3 and 6 are national queries. Somebody in Coimbatore searching TDS rules will never buy a flat in Borivali. They earn their place through topical authority, AI citation and Taboola inventory, not through leads. **If you judge them on enquiries in month one you will conclude they failed.** Posts 7, 8, 9 and 10 are the ones that convert.

---

## 6. Production workflow

The constraint is your review time, not writing capacity.

| Stage | Who | What |
|---|---|---|
| 1. Brief | Claude Code | Target query, intent, answer block, outline, sources to cite |
| 2. Draft | Claude Code | Full post to the section 3 template |
| 3. **Fact extraction** | Claude Code | Every checkable claim pulled into a list with its source |
| 4. **Fact review** | **You** | Confirm, correct or cut each one. **This is the gate** |
| 5. Local pass | **You** | Add the thing only you know. One specific per post is enough |
| 6. Publish | Claude Code | Into Sanity, category assigned, related posts linked |
| 7. Verify | Claude Code | Schema validates, canonical correct, links resolve |

**Your time: roughly 20 minutes per post**, concentrated in stages 4 and 5. Two posts a week is about 40 minutes of your week.

### The three risk tiers

Not every post needs the same scrutiny, and pretending otherwise is how review becomes a bottleneck you abandon.

- **High risk, line by line.** Anything with a rate, a legal process or a registration number. Posts 1, 2, 4, 5. An error here is a liability, not a typo
- **Medium, skim for accuracy.** Posts 3, 6, 7
- **Low, skim for voice.** Posts 8, 9, 10. These are your opinions, so the risk is sounding generic rather than being wrong

---

## 7. Refresh, which is not optional

Undated content loses to dated content, and a wrong number is worse than no number.

| Trigger | Action |
|---|---|
| Maharashtra changes stamp duty or registration rates | Update post 4 that week. It is the AI Overview target |
| Any budget or rule change affecting TDS | Update post 1 |
| Every quarter | Re check every number bearing post, update the verified date |
| Every six months | Re read the top five by traffic, cut what is stale |

The "verified [month]" line in each answer block is what makes this auditable. Without it you cannot tell which posts have drifted.

---

## 8. Internal linking rules

- Every post links **back to its pillar** with a descriptive anchor
- Every post links to **at least one service page**, where genuinely relevant
- Every post links to **two or three sibling posts** in the same cluster
- Local posts link to the relevant **area page** once those exist
- No "click here", no "read more", no bare URLs
- Roughly 5 to 10 internal links per 1,000 words

**Flip `JOURNAL_POSTS_READY` to `true` in `src/lib/homepage-content.ts`** in the same commit as the first published post. Until then the homepage journal cards point at `/blog` rather than at 404s.

---

## 9. Measurement

Four questions, checked monthly. Not pageviews.

| Question | Where |
|---|---|
| Which posts bring impressions | Search Console, query and page report |
| Which posts are actually read | GA4 `content_read`, 75% scroll plus 45 seconds |
| Which posts assist an enquiry | GA4 assisted conversions, not last click |
| Are we cited by AI engines | Manual monthly check on the 20 priority queries, per `05-aeo-faq.md` |

**Baseline to beat:** stamp duty in Mumbai and society redevelopment process both return AI Overviews today, cited to somebody else. Being cited on either within six months means the AEO layer worked.

**Do not expect anything in month one.** Organic content has a three to six month lag. The first honest read is month four.

---

## 10. What blocks this

| # | Blocker | Needed from you |
|---|---|---|
| 1 | **No author exists** | One real name, a role, a one line bio and ideally a photograph. Without it every post is unattributed, which is the E-E-A-T gap we are trying to exploit against competitors |
| 2 | **Your fee position** | Post 7 and the FAQ both need it |
| 3 | **The local specifics** | Stage 5 of the workflow. Roughly one per post, in your words |
| 4 | Analytics not built | GA4 and GTM are still outstanding, so `content_read` and assisted conversions cannot be measured yet |

Item 1 is the real blocker. Everything else can start without it, but publishing ten unattributed posts and adding a byline later wastes the freshness signal on the re publish.

---

## 11. Suggested order

1. Create the author document and the six categories. Roughly 20 minutes, mostly yours
2. Extend the post template with the six items in section 2
3. Draft posts 9, 8 and 10 first. **They are the local converting ones**, they need the least fact checking, and they prove the pipeline works before the high risk regulatory posts
4. Then posts 1, 2, 3, 6, the volume plays
5. Then 4, 5, 7, the high risk ones, once the review rhythm is established
6. Flip `JOURNAL_POSTS_READY`, then move to two a week
