# Design: Dedicated service pages + DataForSEO-driven content

## Context

The homepage currently lists 6 services (Resale flats, Rentals, New project
bookings, Housing society redevelopment, Shops & plots, Interior design &
civil work) as static, unlinked cards — short titles and one-line
descriptions sourced from `messages/*.json`, with no dedicated page behind
any of them. Separately, one prior pass (commit `a4c0e8f`) rewrote just the
homepage services copy using validated DataForSEO keyword data; every other
page's copy (hero, areas, projects listing intro, blog listing intro) has
never been through that process.

This spec covers two things done together:

1. **Six new dedicated service pages** at `/services/[slug]`, each with
   real, DataForSEO-informed long-form content, localized into all 4
   languages (en/hi/mr/gu).
2. **A DataForSEO content refresh** of the homepage hero, the "Where we
   work" areas section, the projects-listing intro copy, and the
   blog-listing intro copy.

Blog articles and case studies are explicitly out of scope for this round
(noted by the user as later work).

## Service list and slugs

| Service | Slug |
|---|---|
| Resale flats | `resale-flats` |
| Rentals | `rentals` |
| New project bookings | `new-project-bookings` |
| Housing society redevelopment | `redevelopment` |
| Shops & plots | `shops-plots` |
| Interior design & civil work | `interiors` |

This is a fixed, curated list — not editor-managed. The homepage cards and
the `/services` index both reference these 6 slugs directly rather than
querying "which pages exist."

## Routing & content model

No Sanity schema changes. Each service page is a `page` document (the
existing generic/flexible type — `title`, `slug`, localized
`heroHeading`/`heroSubheading`/`body`, `seoDescription`), exactly like a
future `/about` page would be. Reuse over new schema because the existing
type already covers everything a service page needs, and duplicating it
would only buy structure nothing here requires yet.

New routes, mirroring the existing `/projects/[slug]` and `/blog/[slug]`
pattern (dedicated folders, not the generic `[locale]/[slug]` catch-all):

```
src/app/(site)/[locale]/services/page.tsx        — /services index (links to all 6)
src/app/(site)/[locale]/services/[slug]/page.tsx — one service page
```

`"services"` is added to the `RESERVED` set in the existing
`src/app/(site)/[locale]/[slug]/page.tsx` catch-all, the same way
`"blog"` and `"projects"` are already excluded there — otherwise a request
for `/services` would fall through to the generic-page lookup and 404.

Both new routes reuse the existing `pageBySlugQuery`/`pageSlugsQuery`
queries and the same rendering approach (`getLocalizedField`,
`PortableTextBody`) already used by the generic page route — no new query
shapes needed beyond filtering to the 6 known slugs for
`generateStaticParams` on the index.

**Homepage integration:** the 6 service cards in the homepage services
section stay as they are today (static i18n-driven titles/one-liners —
no CMS round-trip for the homepage grid itself) but each card becomes a
link to `/services/<slug>` using the fixed slug table above.

## DataForSEO content workflow

Applies to all 10 content targets: the 6 service pages, homepage hero,
areas section, projects-listing intro, blog-listing intro.

1. **Seed keywords** — obvious candidate terms per topic (e.g. for Resale
   Flats: "resale flat Borivali", "flat for sale Borivali West", "second
   hand flat Kandivali").
2. **Expand + validate** — DataForSEO keyword-ideas/related-keywords and
   search-volume lookups (India location, English language) to get real
   monthly search volume, competition, and long-tail variants per seed.
3. **Check SERP intent** — a live SERP pull for the top 1-2 validated
   keywords per page to see what's currently ranking and any "People Also
   Ask" questions, which shapes headings/content angle, not just wording.
4. **Write copy** — one primary keyword + 2-3 secondary/long-tail keywords
   per page, worked into heading, subheading and body copy — keeping
   titles short and un-stuffed, validated phrasing in the body (same
   approach as the existing services-section rewrite).
5. **Record the targets** — primary/secondary keywords chosen per page are
   noted in the implementation plan's task list (not a new CMS field), so
   future blog/case-study work can reuse the same keyword map instead of
   re-researching from scratch.

DataForSEO access: no MCP tool is available in this environment; calls go
directly to the DataForSEO REST API (`https://api.dataforseo.com/v3/...`)
over HTTP Basic Auth using the credentials in
`C:\Users\Client\.claude\dataforseo-config.json` (confirmed working,
$89.85 balance). Budget estimate: ~10 topics × 2-3 calls each ≈ 25-30
calls — comfortably inside balance.

## Localization

- English copy is the DataForSEO-validated version for all 10 content
  targets.
- Hindi/Marathi/Gujarati are natural, accurate translations of the
  validated English copy — not separately keyword-researched. Property
  search in this market concentrates in English even among hi/mr/gu
  speakers; this also matches how the services section was already done.
- Service pages use the existing `localizedStringField`/
  `localizedTextField`/`localizedBlockContentField` pattern for
  `heroHeading`/`heroSubheading`/`body` — all 4 locales populated before a
  page counts as done.
- `seoDescription` on the `page` schema stays a single non-localized field,
  matching its current (pre-existing) behavior — not expanding that scope
  here.

## Branching

New branch off `i18n-foundation` (which is not yet merged — no PR opened
yet). Keeps this work reviewable independently of the already-large
i18n-foundation branch.

## Verification

- `npx tsc --noEmit`, the existing Vitest suite, and `npm run build` all
  stay green (the last branch's whole-branch review found a production
  build failure that dev-mode + tests alone didn't catch — build is now a
  required check).
- Browser-check the `/services` index and at least 2 of the 6
  `/services/[slug]` pages across locales (en/hi/mr/gu), confirm homepage
  service cards link out correctly, and confirm the reserved-route
  handling for `/services` doesn't regress the generic-page catch-all.

## Out of scope

- Blog articles and case studies (explicitly later work).
- A dedicated `service` Sanity schema (reusing `page` instead).
- Per-language (hi/mr/gu) keyword research.
- Localizing `seoDescription`.
- FAQ question rewrites (existing 6 FAQs are left as-is).
