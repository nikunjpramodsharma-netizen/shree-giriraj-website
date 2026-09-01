# 04. Case Studies and Testimonials

Framework: `cro` (trust signals and social proof placement, objection handling), `content-strategy` (case study structure), plus the facts discipline in your brief.

---

## 1. The rule that governs this entire file

**Nothing in this document may be filled in by Claude Code, by you from memory, or by inference from a WhatsApp conversation.**

Every testimonial and every case study on this site must trace back to a named real client who has given written consent. There are three reasons, in descending order of how much they should worry you.

1. **It is a lie otherwise.** A fabricated testimonial is fraud, not marketing
2. **Structured data exposure.** `Review` and `AggregateRating` markup on invented reviews is a Google structured data policy violation and a manual action risk. It is also self serving review markup, which Google has disallowed for LocalBusiness since 2019 regardless of whether the reviews are real
3. **You will get caught.** Borivali is a small market. A fake quote attributed to "a Borivali homeowner" is fine until somebody asks which one

The existing site already carries one violation of this: `Rated 4.8★ by our clients` in the homepage trust card, with no source anywhere in the codebase. It comes off on Day 1.

---

## 2. Audit of what exists today

| Asset | Where | Status |
|---|---|---|
| "4.8★ client rating" hero stat | `src/app/(site)/[locale]/page.tsx:282` | **Remove Day 1.** Unsourced |
| "Rated 4.8★ by our clients" | Homepage why us card | **Remove Day 1.** Same number, same absence of source |
| "They didn't just show us flats..." quote | Homepage why us card, attributed to "A Borivali homeowner" | **Remove or substantiate Day 1.** Anonymous attribution is acceptable only if the quote is real and consent exists. If it came from the draft HTML as placeholder copy, it is placeholder copy and must go |
| `testimonial` Sanity schema | `src/sanity/schemas/` | **Keep.** The mechanism is correct. It just has nothing real in it |
| `TestimonialCarousel` component | `src/components/` | **Keep, but it must render nothing when the CMS is empty.** Verify it degrades to an absent section, not to an empty carousel or placeholder |

---

## 3. What the 4.8★ claim actually needs

**Updated 25 August 2026.** You said the 4.8★ came from your Google rating. It did not, or at least it does not now.

**Your Google Business Profile shows 5.0 from 2 reviews.**

So the number on the site is wrong in both directions: it understates the rating and it implies a review corpus that does not exist. Whatever its origin, it cannot be sourced to Google and it comes off on Day 1 as planned.

**And 5.0 is not the replacement.** A perfect score from two reviews reads as thin rather than impressive, because anyone who clicks through sees the count. Displaying it invites "only two?" and gives a visitor who was ready to trust you a reason not to.

**Do not display any rating until you have roughly 10 reviews.** Until then use "Since 1996" and the MahaRERA agent registration, both of which are facts that need no denominator.

**The real conclusion: your review count is the problem, not your rating.** Getting from 2 to 10 reviews will do more for both trust and local ranking than every testimonial on this page. That programme has moved to Day 1 in `06-geo-local.md` section B5, because the profile is already verified and there is nothing to wait for.

The general principle below still stands for when you do reach the threshold.

**To display an average rating on your own website you need all four of:**

1. A real corpus of ratings, with a stated count. "4.8 from 34 reviews" is a claim. "4.8★" alone is not, because there is no denominator
2. A named, independently verifiable source. In practice this means Google Business Profile
3. A link to that source so a visitor can check it
4. The number to be current, and a process to keep it current

**What I recommend instead.** Do not compute your own rating. Once the Google Business Profile is verified and has reviews, display the live figure with the count and link it to the profile:

> **4.6 on Google, from 27 reviews.** [Read them on Google]

That is verifiable, self updating in credibility terms, and it does the trust job better than a number you asserted.

**What you must not do:** mark it up as `AggregateRating` in your own site's schema. Google's review snippet guidelines prohibit self serving reviews for `LocalBusiness` and `Organization`. Your Google rating already shows in the local pack. Duplicating it as structured data on your own domain risks a manual action and gains nothing.

**Until GBP has reviews, the honest replacement stat is one of:**

- "Since 1996"
- "Three suburbs, one office"
- "MahaRERA A51800005726"

All three are facts.

---

## 4. What the "25+ years" claim needs

**It is wrong before it is unsubstantiated.** Established 1996, and it is 2026. That is 30 years. A commit in the repository already flags it as a stale stat.

**Recommended fix: stop stating a year count. State the year.**

> Since 1996.

A year count needs updating annually and goes stale silently, which is exactly what happened here. A founding year never does, and 30 years is self evident to any reader who can subtract.

**Substantiation to keep on file,** not to publish, but to produce if ever challenged. Any one of:

- Shop and establishment licence with the original registration date
- The partnership deed or proprietorship registration
- GST or older service tax registration
- The oldest registered agreement your office executed
- An old letterhead, signboard photograph or trade licence

Keep a scan of one in the business records. You will most likely never need it, but a firm claiming 30 years should be able to prove 30 years.

---

## 5. Testimonials: how many, and of what kind

### The launch target

**Revised 25 August 2026: zero at launch. You have moved testimonials into the content and case study workstream, which runs from week 2.**

That is a defensible call and it frees roughly 20 minutes of your Day 4 block. Launching with no testimonials section is a smaller credibility problem than launching with vague ones, and the site is built to render nothing when the CMS is empty.

**Two things that follow from the change.**

**Google reviews now carry the entire social proof load at launch.** With the testimonials section empty, the only third party validation a visitor can find is your Google profile, which currently shows two reviews. That is the argument for starting review outreach on Day 1 rather than week 3.

**One caution on wording, offered once.** You said you would "make those with the blogs and case study". To be unambiguous about the workflow rather than about your intent: testimonials get **collected** from real clients using the intake script in section 6, with consent captured in writing. They are the one content type Claude Code cannot draft, and a fabricated one is fraud rather than marketing. Everything else in the content plan can be written; this has to be gathered.

The original guidance below still applies for when you do collect them in week 2 onward.

### The mix you want

Not three buyers. Three different proofs of range.

| # | Client type | What it proves | Priority |
|---|---|---|---|
| 1 | A resale buyer or seller | Your core transaction, end to end | Essential |
| 2 | A landlord or a tenant | That rentals are a real service, not a sideline. Rentals is your highest volume search cluster | Essential |
| 3 | A new project booking, ideally Jaswanti Jewel | Directly supports the project page and the highest CPC campaign | Essential |
| 4 | A society redevelopment committee member | The highest value lead type you have. One of these is worth several of the others | High value, harder to get |
| 5 | An interiors client | Highest margin service, highest CPC cluster | Valuable |

Three from rows 1 to 3 is the launch bar. Rows 4 and 5 are week 2 to 4.

### Where they appear

Per `cro`, social proof belongs near CTAs and immediately after benefit claims, not in an isolated carousel nobody scrolls to.

| Placement | Which testimonial | Why |
|---|---|---|
| Homepage, after the why us section | The strongest one, full length | Immediately after the claims it substantiates |
| Each service page, section 7 | The one matching that service | Relevance beats strength |
| Area pages | Any client from that suburb | Local proof for local intent |
| Jaswanti Jewel page | The project booking one | Directly answers "should I book through a broker" |
| Landing pages | One short line, above the fold | Cold paid traffic needs proof early |

---

## 6. Testimonial intake script

Use this on a call. Do not send it as a form. People write "great service" and say something useful.

**Opening.**

> "We are putting up a new website and I would rather have three real client stories on it than the usual empty praise. Would you be alright if I asked you five or six questions about your experience and put some of it on the site? You can see it before it goes up, and you can tell me exactly how you want your name shown, or not shown at all."

**The questions.**

| # | Question | What you are extracting |
|---|---|---|
| 1 | Before you came to us, what were you actually trying to sort out, and what was making it difficult | The problem in their words. This is the opening line of the testimonial |
| 2 | Had you tried anything else first, a portal, another agent, doing it yourself | The alternative. Makes the choice meaningful |
| 3 | Was there a moment where you thought this might not work out | The tension. A testimonial with no difficulty in it reads as fake, because it is unusual |
| 4 | What did we actually do that you would not have known to do yourself | The specific value. This is the sentence that does the persuading |
| 5 | How long did the whole thing take from first call to keys | Concrete detail. Timelines are believable and checkable |
| 6 | If a neighbour asked you whether to call us, what would you say | The closing line, in their voice |
| 7 | Is there anything we got wrong or could have done better | Ask this. You will get a better testimonial from someone who has been allowed to be honest, and you will learn something |

**Consent, asked explicitly and recorded.**

| # | Question |
|---|---|
| 8 | How would you like to be shown. Full name, first name and initial, first name and area, or just "a client in Borivali West" |
| 9 | Can we mention the area, the building type, and roughly what the flat was, without the exact address |
| 10 | Are you comfortable with a photograph, or would you rather not |
| 11 | Can I send you the exact wording before it goes live |

**Record the consent in writing.** A WhatsApp message from them saying "yes, you can use that with my first name and area" is sufficient and is what you will realistically get. Screenshot it and keep it in a folder. Do not rely on remembering a phone call.

### Attribution formats, in descending order of persuasive force

1. Full name, area, photograph. **Strongest**
2. Full name, area, no photograph
3. First name and surname initial, area. "Rajesh M., Borivali West"
4. First name, area, plus the transaction type. "Priya, Kandivali, resale purchase 2025"
5. Area and transaction only. "A landlord in Malad". **Weakest, and the floor.** Below this, do not publish

---

## 7. Testimonial template

Assembled from the intake answers. Roughly 60 to 100 words. Longer than a pull quote, shorter than a story.

```
[Sentence 1: the problem, in their words, from question 1]
[Sentence 2: the specific thing you did that they would not have known, from question 4]
[Sentence 3: the outcome, with a timeline or a concrete detail, from question 5]
[Sentence 4 optional: what they would tell a neighbour, from question 6]

Attribution: [Name], [Area], [transaction type and year]
```

**Worked example, using the format with placeholder content clearly marked.**

> "[PLACEHOLDER, from question 1: we had been trying to sell the Chikoowadi flat for eight months and the two agents before had only brought people who were not serious.] [PLACEHOLDER, from question 4: they told us to sort the society NOC before listing rather than after, which is the reason the deal did not collapse at the last minute like the previous one had.] [PLACEHOLDER, from question 5: registered within eleven weeks of the first call.]"
>
> **[PLACEHOLDER NAME], [PLACEHOLDER AREA], [PLACEHOLDER transaction and year]**

Every bracketed section stays bracketed in the CMS until a real answer replaces it. Claude Code will seed the Sanity documents with these placeholders and they will not render on the front end while they contain the word PLACEHOLDER.

---

## 8. Case study format

Longer, one per major service, published at `/case-studies/[slug]`. These are the `content-strategy` "challenge, solution, results, learnings" structure with one addition that matters.

### Structure

| # | Section | Words | Contents |
|---|---|---|---|
| 1 | Title | | The situation, not the outcome. "A Chikoowadi family who had to sell before they could buy" beats "Successful sale in Borivali West" |
| 2 | Summary box | 60 | Situation, what we did, outcome, timeline. Scannable, and the block an AI engine extracts |
| 3 | The situation | 250 | Who, what they needed, what constrained them. Anonymised to the agreed level |
| 4 | What made it difficult | 200 | The real obstacle. Title issue, society resistance, loan shortfall, timing mismatch |
| 5 | What we did | 400 | Step by step. Specific. This is the section that demonstrates competence |
| 6 | **What went wrong** | 150 | **Include this.** Something always goes wrong. A case study without a setback reads as fiction and readers discount the whole thing |
| 7 | Outcome | 150 | What happened, over what timeline. Figures only where consented |
| 8 | What we would tell the next person | 150 | The transferable lesson. This is the part that gets cited and shared |
| 9 | Client quote | 60 | Verbatim, attributed as agreed |
| 10 | Service link | | To the relevant service page |

Roughly 1,400 words.

### Section 6 is the one people cut, and it is the one that works

Every agent's case studies read the same: client had a problem, we solved it, client was delighted. Readers have learned to discount that entire genre. A case study that says "the buyer's loan came in eleven lakh short three days before registration and here is what we did about it" is believed, because nobody makes up a problem they then had to fix.

### Facts discipline for case studies

| Element | Rule |
|---|---|
| Client name | Only at the consented level from section 6 |
| Building or society name | **Never**, unless the client explicitly agrees in writing. Naming a society in a story about its resistance to a sale is a reputational and legal risk to you |
| Transaction value | **Only with explicit consent.** Otherwise describe without figures. "A two bedroom resale in Borivali West" carries the information without the number |
| Carpet area | Only if consented and only if you have it from the agreement |
| Dates | Month and year is enough. "Registered in March 2025" |
| Timeline claims | Must be from the actual file, not remembered |
| Any figure at all | If you cannot point to the document it came from, it does not go in |

### How many before launch

**Zero.** Case studies do not block launch.

The intake starts on Day 4 and the first case study publishes in week 2 to 4, once you have consent and have had time to write it properly. A rushed case study is worse than none, because the sections that make it credible, 4 and 6, are the ones that get thin when you are in a hurry.

Target: **three by week 6.** One resale, one rental or landlord, one redevelopment. Redevelopment is the most valuable of the three by a wide margin, because a society committee reading a redevelopment case study is your highest value lead type on the site.

---

## 9. Schema position

| Asset | Schema | Condition |
|---|---|---|
| Testimonial | `Review` nested in the page's `@graph` | **Only** with a real named client and written consent. Never with an anonymous attribution |
| Aggregate rating | `AggregateRating` | **Never on your own domain.** Self serving review markup for LocalBusiness. The GBP rating already surfaces in the local pack |
| Case study | `Article` | Always |
| Case study client quote | `Review` | Only with consent and named attribution |

If in doubt on any of these, publish the content without the markup. The content does the persuading. The markup only ever added a star rating that Google may not have shown anyway.

---

## 10. Google reviews, which matter more than any of this

Blunt assessment: **for a local business, twenty real Google reviews will do more for both trust and rankings than five beautifully written testimonials on your own site.**

Your own testimonials are marketing. Google reviews are evidence. They feed the local pack, they show in the knowledge panel, and per the `ai-seo` third party presence pillar, AI engines cite third party sources more readily than your own domain.

The review generation programme sits in `06-geo-local.md`, because it is a local SEO workstream rather than a website one. But note the sequencing: it cannot start until the Google Business Profile is verified, which is why that clock starts in the first hour of Day 1.

---

## 11. Day 4 deliverable

By the end of your Day 4 block:

- [ ] Three past clients contacted, or three calls booked with dates
- [ ] Intake script used, answers recorded
- [ ] Consent captured in writing for each, with the attribution format they chose
- [ ] The `testimonial` documents in Sanity either populated with real content or left with visible PLACEHOLDER text
- [ ] The homepage testimonial section renders nothing if the CMS is empty. Verified in the browser, not assumed
- [ ] One case study subject identified and permission sought

If you get zero of three, the site launches without a testimonials section. That is a normal outcome for week one and it is recoverable in week two. Inventing one is not recoverable.
