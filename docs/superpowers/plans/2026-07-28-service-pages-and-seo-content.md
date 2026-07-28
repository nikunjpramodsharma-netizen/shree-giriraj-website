# Service Pages + DataForSEO Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each of the 6 homepage services its own dedicated, DataForSEO-validated page at `/services/[slug]`, and refresh the homepage hero, areas section, and the projects/blog listing intros with the same validated keyword data.

**Architecture:** Six new `page` documents in Sanity (reusing the existing generic flexible-page schema, no schema changes) rendered through two new routes (`/services` index, `/services/[slug]` detail) that mirror the existing `/projects/[slug]` and `/blog/[slug]` pattern. Homepage service cards link out to these pages. Four existing sections get their static i18n copy replaced with keyword-validated text.

**Tech Stack:** Next.js 14 App Router, Sanity CMS (via the Sanity MCP tools), next-intl, Vitest.

## Global Constraints

- All 4 locales (en, hi, mr, gu) must be populated for every piece of content before a task counts as done — no locale left in English as a fallback.
- `npx tsc --noEmit`, the full Vitest suite (`npm test`), and `npm run build` must all pass after every task. The last branch's whole-branch review found a production-build failure that `tsc`/tests/`npm run dev` alone didn't catch (a top-level `not-found.tsx` incompatible with Next's root-layout requirement) — `npm run build` is a required check now, not optional.
- Sanity project: `projectId: "rt0067kr"`, `dataset: "production"` (from `.env.local`). Use the Sanity MCP tools (`create_documents`, `publish_documents`) — every created document must be published, not left as a draft, or the site's `pageBySlugQuery` (which reads published content) won't find it.
- Service slugs are fixed and must be exactly: `resale-flats`, `rentals`, `new-project-bookings`, `redevelopment`, `shops-plots`, `interiors`.
- Content source: this plan's companion data files, `docs/superpowers/plans/2026-07-28-service-pages-content.json` and `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`. Every English string in them is grounded in the DataForSEO research summarized below — do not invent alternate copy.

## Keyword research summary (already completed — reference only)

Run via direct DataForSEO REST calls (India location_code 2356, English), since no MCP wrapper for DataForSEO is available in this environment. Key findings that shaped the copy in the content files:

- **Rentals** has by far the highest real volume: "rental flat mumbai" (12,100/mo), "flat for rent in borivali" (590/mo), "flat for rent borivali west" (390/mo).
- **Interiors**: "interior designer borivali" (480/mo), "home interior design mumbai" (140/mo), "flat interior design mumbai" (110/mo, low competition). SERP "People Also Ask" surfaced real buyer concern: interior design budget/cost — addressed directly in the interiors page body.
- **Resale flats**: "resale flat mumbai" (320/mo), "resale flat in borivali" (30/mo). SERP PAA surfaced stamp duty and valuation questions — addressed in the resale-flats page body.
- **New project bookings**: "new projects in borivali" (110/mo, but CPC $2.19 — high commercial intent), "new residential projects borivali" (10/mo, CPC $4).
- **Areas**: each of the 3 suburb cards has its own real, differentiated volume — "flats in malad" (260/mo), "real estate kandivali" (210/mo, low competition), "property in borivali west" (140/mo), "property in borivali east" (90/mo, high competition).
- **Hero**: only "real estate agent borivali" (50/mo, low competition) returned measurable volume among general terms tried.
- **Redevelopment** and most **shops-plots** variants returned no measurable Google Ads volume at all (only "shop for rent borivali" at 40/mo, low competition) — this is a real, expected result for a low-search-volume, high-consideration/referral-driven niche, not a research gap. Their page copy is written for accuracy and credibility (process, E-E-A-T) rather than exact-match density, per the design spec.
- **Blog listing intro**: thin data (only "home buying tips india", 10/mo) — real keyword opportunity here comes from actual blog articles, which are out of scope for this plan.
- **Projects listing intro**: no direct measurable terms; reuses the validated new-project-bookings terms since the two pages are topically identical (a projects list vs. a bookings-service description).

DataForSEO account balance after this research: ~$89.55 (started at $89.85; research cost ≈ $0.30).

---

### Task 1: Service page routing

**Files:**
- Modify: `src/app/(site)/[locale]/[slug]/page.tsx` (add `"services"` to `RESERVED`)
- Create: `src/app/(site)/[locale]/services/[slug]/page.tsx`
- Create: `src/app/(site)/[locale]/services/page.tsx`

**Interfaces:**
- Consumes: `pageBySlugQuery` from `@/sanity/queries` (unchanged — `pageSlugsQuery` is not used here since `generateStaticParams` uses the fixed `SERVICE_SLUGS` list, not a Sanity query); `getLocalizedField`, `type Locale`, `type LocalizedValue` from `@/lib/i18n-content`; `PortableTextBody` from `@/components/PortableTextBody`; `client` from `@/sanity/client`.
- Produces: routes `/services` and `/services/[slug]` for later tasks (homepage linking) and for the Sanity-seeding tasks (3-8) to render against.

- [ ] **Step 1: Add `"services"` to the RESERVED set**

In `src/app/(site)/[locale]/[slug]/page.tsx`, change:

```ts
const RESERVED = new Set(["blog", "projects"]);
```

to:

```ts
const RESERVED = new Set(["blog", "projects", "services"]);
```

- [ ] **Step 2: Create the service detail route**

Create `src/app/(site)/[locale]/services/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { pageBySlugQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

export const revalidate = 60;

const SERVICE_SLUGS = [
  "resale-flats",
  "rentals",
  "new-project-bookings",
  "redevelopment",
  "shops-plots",
  "interiors",
];

type ServicePage = {
  title: string;
  heroHeading?: LocalizedValue<string>;
  heroSubheading?: LocalizedValue<string>;
  body?: LocalizedValue<any>;
  seoDescription?: string;
};

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const page = await client.fetch<ServicePage>(pageBySlugQuery, { slug: params.slug });
  if (!page) return {};
  return {
    title: page.title,
    description: page.seoDescription,
  };
}

export default async function ServicePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!SERVICE_SLUGS.includes(params.slug)) notFound();

  const locale = params.locale as Locale;
  const page = await client.fetch<ServicePage>(pageBySlugQuery, { slug: params.slug });
  if (!page) notFound();

  const heroHeading = getLocalizedField(page.heroHeading, locale) || page.title;
  const heroSubheading = getLocalizedField(page.heroSubheading, locale);
  const body = getLocalizedField(page.body, locale);

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <h1 className="text-4xl md:text-5xl">{heroHeading}</h1>
          {heroSubheading && (
            <p className="mt-4 max-w-[42em] text-lg text-paper/75">{heroSubheading}</p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <PortableTextBody value={body} />
        </div>
      </section>
    </>
  );
}
```

This deliberately mirrors `src/app/(site)/[locale]/[slug]/page.tsx` — same hero/body layout — but uses a fixed `SERVICE_SLUGS` list for `generateStaticParams` instead of querying all `page` slugs, since the service set is fixed (see Global Constraints), and 404s for anything outside that list even if some other unrelated `page` document happened to share a slug.

- [ ] **Step 3: Create the services index route**

Create `src/app/(site)/[locale]/services/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const revalidate = 60;

const SERVICES = [
  { slug: "resale-flats", key: "resale" },
  { slug: "rentals", key: "rentals" },
  { slug: "new-project-bookings", key: "newProject" },
  { slug: "redevelopment", key: "redevelopment" },
  { slug: "shops-plots", key: "shops" },
  { slug: "interiors", key: "interiors" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  return {
    title: t("heading"),
  };
}

export default async function ServicesIndexPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <div className="eyebrow text-brass-bright">{t("eyebrow")}</div>
          <h1 className="mt-3.5 text-4xl md:text-5xl">{t("heading")}</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="block rounded-2xl border border-brand-indigo/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h2 className="text-xl text-brand-indigo">{t(`${s.key}Title`)}</h2>
                <p className="mt-2.5 text-[0.96rem] text-muted">{t(`${s.key}Body`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

This reuses the existing `services` i18n namespace (same titles/one-liners as the homepage cards) rather than introducing new copy for the index — the long-form, keyword-validated content lives on each detail page.

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed. The build will show `/services` and `/services/[slug]` (with the 6 static slugs) in the route output. The detail pages will 404 at this point since no Sanity content exists yet — that's expected until Tasks 3-8.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/[locale]/[slug]/page.tsx" "src/app/(site)/[locale]/services"
git commit -m "Add /services index and /services/[slug] routes"
```

---

### Task 2: Homepage service card links

**Files:**
- Modify: `src/app/(site)/[locale]/page.tsx:67-74` (the `services` array) and `:132-142` (the services grid JSX)

**Interfaces:**
- Consumes: `Link` from `@/i18n/navigation` (already imported in this file).

- [ ] **Step 1: Add a `slug` to each service entry**

In `src/app/(site)/[locale]/page.tsx`, change:

```ts
  const services = [
    { title: tServices("resaleTitle"), body: tServices("resaleBody") },
    { title: tServices("rentalsTitle"), body: tServices("rentalsBody") },
    { title: tServices("newProjectTitle"), body: tServices("newProjectBody") },
    { title: tServices("redevelopmentTitle"), body: tServices("redevelopmentBody") },
    { title: tServices("shopsTitle"), body: tServices("shopsBody") },
    { title: tServices("interiorsTitle"), body: tServices("interiorsBody") },
  ];
```

to:

```ts
  const services = [
    { slug: "resale-flats", title: tServices("resaleTitle"), body: tServices("resaleBody") },
    { slug: "rentals", title: tServices("rentalsTitle"), body: tServices("rentalsBody") },
    { slug: "new-project-bookings", title: tServices("newProjectTitle"), body: tServices("newProjectBody") },
    { slug: "redevelopment", title: tServices("redevelopmentTitle"), body: tServices("redevelopmentBody") },
    { slug: "shops-plots", title: tServices("shopsTitle"), body: tServices("shopsBody") },
    { slug: "interiors", title: tServices("interiorsTitle"), body: tServices("interiorsBody") },
  ];
```

- [ ] **Step 2: Wrap each card in a `Link`**

Change:

```tsx
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-brand-indigo/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-xl text-brand-indigo">{s.title}</h3>
                <p className="mt-2.5 text-[0.96rem] text-muted">{s.body}</p>
              </div>
            ))}
          </div>
```

to:

```tsx
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="block rounded-2xl border border-brand-indigo/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-xl text-brand-indigo">{s.title}</h3>
                <p className="mt-2.5 text-[0.96rem] text-muted">{s.body}</p>
              </Link>
            ))}
          </div>
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/[locale]/page.tsx"
git commit -m "Link homepage service cards to their dedicated /services pages"
```

---

### Task 3: Seed the Resale Flats service page

**Files:** none (Sanity content only, via MCP tools) — no test file, verified by live query + browser check.

**Interfaces:**
- Consumes: content from `docs/superpowers/plans/2026-07-28-service-pages-content.json` → `servicePages["resale-flats"]`.
- Produces: a published `page` document with `slug.current == "resale-flats"`, consumed by the Task 1 route.

- [ ] **Step 1: Convert the content-file body into Portable Text**

Read `servicePages["resale-flats"]` from `docs/superpowers/plans/2026-07-28-service-pages-content.json`. Each locale's `body` array uses this shorthand, which must be converted to Sanity's Portable Text block array:

- `{type: "h2", text}` → `{_type: "block", _key: "<unique>", style: "h2", markDefs: [], children: [{_type: "span", _key: "<unique>", text, marks: []}]}`
- `{type: "p", text}` → same but `style: "normal"`
- `{type: "ul", items}` → one block per item: `{_type: "block", _key: "<unique>", style: "normal", listItem: "bullet", level: 1, markDefs: [], children: [{_type: "span", _key: "<unique>", text: item, marks: []}]}`
- `{type: "p_cta", before, linkText, after}` → one block: `style: "normal"`, `markDefs: [{_type: "link", _key: "ctaLink", href: "<waLink>"}]`, `children: [{_type:"span","_key":"<unique>",text: before, marks: []}, {_type:"span","_key":"<unique>",text: linkText, marks: ["ctaLink"]}, {_type:"span","_key":"<unique>",text: after, marks: []}]`. Build `href` as `https://wa.me/919324974133?text=<encodeURIComponent(waLinkMessage)>` using the `waLinkMessage` field from the same content-file entry (matches `waLink()` in `src/lib/config.ts`).

`_key` values just need to be unique within their array — short incrementing strings like `"b1"`, `"b2"`, `"s1"`, `"s2"` are fine.

Do this conversion for all 4 locales (`en`, `hi`, `mr`, `gu`).

- [ ] **Step 2: Create the draft document**

Use the Sanity MCP `create_documents` tool with `resource: {projectId: "rt0067kr", dataset: "production"}`, one document with `type: "page"` and `content`:

```json
{
  "title": "<content file en.title>",
  "slug": { "_type": "slug", "current": "resale-flats" },
  "heroHeading": { "en": "...", "hi": "...", "mr": "...", "gu": "..." },
  "heroSubheading": { "en": "...", "hi": "...", "mr": "...", "gu": "..." },
  "body": { "en": [ /* converted blocks */ ], "hi": [...], "mr": [...], "gu": [...] },
  "seoDescription": "<content file seoDescription — English only, non-localized field>"
}
```

- [ ] **Step 3: Publish the document**

Use `publish_documents` with the `_id` returned from Step 2 (strip the `drafts.` prefix is not needed — pass the ID as returned; the tool publishes it).

- [ ] **Step 4: Verify via GROQ**

Query: `*[_type == "page" && slug.current == "resale-flats"][0]{title, "hi": heroHeading.hi, "bodyEnLen": length(body.en)}` using `query_documents` with `perspective: "published"`. Expected: a result with the correct title, a non-empty Hindi heading, and `bodyEnLen` matching the expected block count for this page's English body: sum, over each shorthand entry in `servicePages["resale-flats"].en.body`, 1 block for every `h2`/`p`/`p_cta` entry, or N blocks for a `ul` entry with N items (each list item becomes its own block in Portable Text). For resale-flats that works out to 12 (8 single-block entries + one 4-item list). Recompute this per-page in Tasks 4-8 — the shorthand entry count and list lengths differ per service, don't reuse 12 for every page.

- [ ] **Step 5: Browser-check**

Start the dev server, visit `/services/resale-flats` and `/hi/services/resale-flats`. Confirm the hero heading, subheading, and full body (headings, bullet list, and the closing WhatsApp link) render correctly in both locales, and the WhatsApp link opens with the pre-filled message.

No commit for this task (content lives in Sanity, not git) — note completion in the plan's progress ledger instead (see `superpowers:subagent-driven-development` / `superpowers:executing-plans` for how the ledger is maintained).

---

### Task 4: Seed the Rentals service page

Same procedure as Task 3, using `servicePages["rentals"]` from `docs/superpowers/plans/2026-07-28-service-pages-content.json`, slug `"rentals"`. Browser-check `/services/rentals` and `/hi/services/rentals`.

---

### Task 5: Seed the New Project Bookings service page

Same procedure as Task 3, using `servicePages["new-project-bookings"]` from `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`, slug `"new-project-bookings"`. Browser-check `/services/new-project-bookings` and `/mr/services/new-project-bookings`.

---

### Task 6: Seed the Redevelopment service page

Same procedure as Task 3, using `servicePages["redevelopment"]` from `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`, slug `"redevelopment"`. Browser-check `/services/redevelopment` and `/mr/services/redevelopment`.

---

### Task 7: Seed the Shops & Plots service page

Same procedure as Task 3, using `servicePages["shops-plots"]` from `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`, slug `"shops-plots"`. Browser-check `/services/shops-plots` and `/gu/services/shops-plots`.

---

### Task 8: Seed the Interiors service page

Same procedure as Task 3, using `servicePages["interiors"]` from `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`, slug `"interiors"`. Browser-check `/services/interiors` and `/gu/services/interiors`.

---

### Task 9: Homepage hero copy rewrite

**Files:**
- Modify: `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json` (the `hero` namespace: `headingPart1`, `headingEm`, `body`)
- Modify: `src/app/(site)/[locale]/page.tsx:109`

**Interfaces:** none beyond existing `hero` namespace keys — no new keys added.

- [ ] **Step 1: Update the hero copy in all 4 message catalogs**

Using `existingPageRewrites.hero` from `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`, update `headingPart1`, `headingEm`, and `body` under the `hero` key in each of `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json` to the exact strings given there (do not add or remove keys — `ctaBook`, `ctaWhatsapp`, `whatsappMessage`, `statYears`, `statSuburbs`, `statRating`, `featuredBadge` are unchanged).

- [ ] **Step 2: Fix the stale "25+" years stat**

In `src/app/(site)/[locale]/page.tsx`, find:

```ts
              {[
                { n: "25+", l: tHero("statYears") },
```

Change `"25+"` to `"30+"`. (`site.established` in `src/lib/config.ts` is `"1996"`; the copy now says "nearly 30 years" in the hero body — the stat should match.)

- [ ] **Step 3: Run the message-parity test**

Run: `npm test -- messages.test.ts`
Expected: PASS (key parity is preserved since no keys were added or removed, only values changed).

- [ ] **Step 4: Verify build and browser-check**

Run: `npx tsc --noEmit && npm run build`. Then browser-check `/` and `/hi` — confirm the new heading/body render and the stat shows "30+".

- [ ] **Step 5: Commit**

```bash
git add messages/en.json messages/hi.json messages/mr.json messages/gu.json "src/app/(site)/[locale]/page.tsx"
git commit -m "Rewrite homepage hero copy with DataForSEO-validated phrasing, fix stale 25-year stat"
```

---

### Task 10: Areas section copy rewrite

**Files:**
- Modify: `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json` (the `areas` namespace: `borivaliBody`, `kandivaliBody`, `maladBody`)

- [ ] **Step 1: Update the areas copy in all 4 message catalogs**

Using `existingPageRewrites.areas` from `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`, update `borivaliBody`, `kandivaliBody`, `maladBody` under the `areas` key in each catalog to the exact strings given there. `eyebrow` and `heading` are unchanged.

- [ ] **Step 2: Run the message-parity test, then build**

Run: `npm test -- messages.test.ts && npx tsc --noEmit && npm run build`
Expected: all pass.

- [ ] **Step 3: Browser-check**

Visit `/` and `/gu`, confirm the 3 area cards show the new copy.

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/hi.json messages/mr.json messages/gu.json
git commit -m "Rewrite homepage areas section copy with DataForSEO-validated phrasing"
```

---

### Task 11: Projects listing intro copy rewrite

**Files:**
- Modify: `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json` (the `projectsPage` namespace: `eyebrow`, `heading`, `body`)

- [ ] **Step 1: Update the projectsPage copy in all 4 message catalogs**

Using `existingPageRewrites.projectsPage` from `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`, update `eyebrow`, `heading`, `body` under the `projectsPage` key in each catalog. `emptyState`, `studioLink`, `statusBooking`, `statusUpcoming`, `statusSold`, `viewDetails` are unchanged.

- [ ] **Step 2: Run the message-parity test, then build**

Run: `npm test -- messages.test.ts && npx tsc --noEmit && npm run build`
Expected: all pass.

- [ ] **Step 3: Browser-check**

Visit `/projects` and `/mr/projects`, confirm the new hero copy renders.

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/hi.json messages/mr.json messages/gu.json
git commit -m "Rewrite projects listing intro copy with DataForSEO-validated phrasing"
```

---

### Task 12: Blog listing intro copy rewrite

**Files:**
- Modify: `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json` (the `blogPage` namespace: `eyebrow`, `heading`, `body`)

- [ ] **Step 1: Update the blogPage copy in all 4 message catalogs**

Using `existingPageRewrites.blogPage` from `docs/superpowers/plans/2026-07-28-service-pages-content-2.json`, update `eyebrow`, `heading`, `body` under the `blogPage` key in each catalog. `emptyState`, `studioLink` are unchanged.

- [ ] **Step 2: Run the message-parity test, then build**

Run: `npm test -- messages.test.ts && npx tsc --noEmit && npm run build`
Expected: all pass.

- [ ] **Step 3: Browser-check**

Visit `/blog` and `/gu/blog`, confirm the new hero copy renders.

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/hi.json messages/mr.json messages/gu.json
git commit -m "Rewrite blog listing intro copy with DataForSEO-validated phrasing"
```

---

### Task 13: Whole-plan verification

**Files:** none — verification only.

- [ ] **Step 1: Full automated check**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: all three pass with zero errors.

- [ ] **Step 2: Production-mode smoke test**

Run: `npm run start` (after the build from Step 1), then check with `curl`:
- `/services` and `/hi/services` return 200
- `/services/resale-flats`, `/services/rentals`, `/services/new-project-bookings`, `/services/redevelopment`, `/services/shops-plots`, `/services/interiors` all return 200
- `/services/not-a-real-service` returns 404 (confirms the fixed `SERVICE_SLUGS` allowlist in Task 1 works, not just "any page slug under /services")
- `/` still returns 200 and the reserved-route collision from Task 1 didn't break `/blog` or `/projects`

- [ ] **Step 3: Cross-locale browser walkthrough**

For at least 2 of the 6 service pages (rotate which ones across runs), visit all 4 locales and confirm: heading/subheading/body render with no `[object Object]`, no untranslated English leaking into hi/mr/gu pages, the bullet list and closing WhatsApp link render correctly, and clicking a homepage service card lands on the matching `/services/[slug]` page in the current locale.

- [ ] **Step 4: Update the SDD ledger**

If using `subagent-driven-development`/`executing-plans`, record in the progress ledger: all 13 tasks complete, DataForSEO research summary (link back to this plan's "Keyword research summary" section), and note that `docs/superpowers/plans/2026-07-28-service-pages-content.json` / `-2.json` are reference data, not something that needs its own test coverage.

No commit for this task (verification only, matching the pattern from the previous homepage-revamp plan's final task).
