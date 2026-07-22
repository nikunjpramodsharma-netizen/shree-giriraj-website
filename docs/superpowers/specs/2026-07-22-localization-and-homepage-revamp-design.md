# Shree Giriraj Real Estate — Localization & Homepage Revamp

Date: 2026-07-22
Status: Approved by user, pending implementation plan

## Background

The site (Next.js 14 App Router + Sanity CMS + Tailwind) already has a working homepage, `/projects`, `/blog`, `/about`-style flexible pages, and a `/studio` CMS. This spec covers a revision pass to the existing design before deployment: trilingual support, a set of conversion/trust improvements, and a homepage restructure to support multiple property listings.

## Goals

1. Full content localization — English, Hindi, Marathi — with per-locale URLs for SEO, not just a UI-string toggle.
2. Close the trust/conversion gaps identified in review: single-project homepage, no team/office presence, no FAQ, no persistent mobile CTA.
3. Keep the localization mechanism swappable later without a rewrite (site owner may want to change how Sanity content is localized down the line).

## Non-goals

- Deployment (Sanity project creation, Vercel, domain) — unchanged from the existing README, happens after implementation.
- Sourcing/uploading real team photos, office photos, additional named testimonials, or additional property listings — the owner will collate these separately. This spec covers **placeholder** content for all of the above, clearly structured so real content is a drop-in replacement.

## 1. Localization

### Routing

- Adopt `next-intl` for App Router i18n.
- Locale-prefixed routing, **English as the default/unprefixed locale** (`/`, `/projects`, `/blog/...`), Hindi and Marathi prefixed (`/hi/...`, `/mr/...`). This preserves the current English URL structure and avoids an unnecessary `/en` prefix on the primary language.
- `/studio` (Sanity Studio) stays outside the locale routing — it's an authoring tool, not visitor-facing content.
- Restructure `src/app/` so visitor-facing routes live under `src/app/[locale]/...`; `src/app/studio` stays where it is.

### Language detection & switching

- **First-time visitor:** middleware reads the browser's `Accept-Language` header and redirects to the best-matching locale among `en`/`hi`/`mr` (falling back to `en`).
- **Returning visitor / explicit choice:** selecting a language via the nav toggle writes a `NEXT_LOCALE` cookie; the cookie always takes precedence over auto-detection on subsequent visits.
- **Toggle placement:** a language switcher (EN / हिंदी / मराठी) in `Nav.tsx`, visible in both desktop and mobile nav.

### UI string translation

- Static UI chrome (nav labels, buttons, form field placeholders, section headings authored in code) lives in `messages/en.json`, `messages/hi.json`, `messages/mr.json`, loaded via `next-intl`.

### CMS content translation

- Translatable fields on `project`, `post`, `testimonial`, and `page` schemas become localized objects, e.g.:
  ```ts
  summary: { en: string, hi?: string, mr?: string }
  ```
  editable side-by-side in Sanity Studio (using Sanity's object-field localization pattern, not the document-per-language plugin — simpler for a single-editor workflow with a handful of content types).
- **Fallback rule:** if a `hi` or `mr` value is empty for a given entry, render the `en` value rather than showing a blank section. This means content can be published in English first and translated incrementally.

### Swappability

- All localized-field access goes through a small helper layer (e.g. `getLocalizedField(field, locale)` in `src/lib/i18n.ts`), never accessed as `.en`/`.hi`/`.mr` directly in components/pages. If the localization mechanism changes later (e.g. moving to Sanity's document-per-language plugin, or a different fallback rule), only this helper layer and the GROQ queries change — page and component code is untouched.

## 2. Content model additions

### New schema: `teamMember`

- `name` (string), `role` (localized string), `photo` (image), `bio` (localized text), `order` (number).
- Used on `/about` (or future `/team` section) to put real people behind the 25-year-old business.
- Seed with 1-2 placeholder entries (generic silhouette image, "Team member" placeholder name) clearly flagged for replacement.

### New schema: `faq`

- `question` (localized string), `answer` (localized text), `category` (optional: loans / site visits / redevelopment / general), `order` (number).
- Seed with 5-6 real starter FAQs (loan assistance, site visit process, redevelopment basics, how masked pricing works, response time) — these can ship as real content immediately, no placeholder needed.

### Existing schema changes

- `project.summary`, `project.body`, `project.configurations[].note`, `post` body/excerpt, `testimonial.quote`/`role`, `page.heroHeading`/`heroSubheading`/`body` — all converted from plain string/text/blockContent to localized equivalents per the pattern above.
- `project`: adds an `order` field (number, mirrors `testimonial.order`) to control homepage grid ordering when multiple projects are flagged `featured`.
- `project` and `testimonial`: otherwise no structural change beyond localization — existing `featured` flags continue to drive homepage selection.

### Placeholder content

- 2-3 additional placeholder `project` entries beyond Jaswanti Jewel (placeholder cover images, obviously-fake names like "Sample Project — Replace Me"), so the homepage grid and `/projects` listing don't look empty.
- 2-3 additional placeholder `testimonial` entries, named generically ("Placeholder Client — Borivali") and flagged for replacement.
- All placeholder content is easy to find in Studio (consistent "Replace Me" / "Placeholder" naming) and safe to delete once real content lands — none of it is wired into anything beyond normal CMS queries.

## 3. Homepage restructure

- **Projects:** replace the single hero-style "featured project" section with a **3-card grid** of projects flagged `featured` in Sanity, ordered by a new `order` field on the `project` schema (mirroring the existing pattern on `testimonial`), capped at the first 3 by that order if more are flagged. Each card: cover image, name, location, lowest masked price, link to detail page. Grid links to `/projects` for the full list.
- **Testimonials:** replace the fixed 3-card grid with an **auto-rotating carousel** over all `featured` testimonials, with manual prev/next controls (keyboard/screen-reader accessible, pauses on hover/focus).
- **FAQ section:** new section between "Areas" and the lead form — accordion-style, pulling all `faq` entries ordered by `order`.
- **Sticky mobile CTA bar:** a thin bar pinned to the bottom of the viewport on mobile viewports only, with Call and WhatsApp buttons, always reachable while scrolling. Complements (does not replace) the existing `WhatsAppFloat.tsx` floating button — floating button removed on mobile once the sticky bar is present, to avoid two overlapping CTAs; unchanged on desktop.
- **Why Us / Areas sections:** unchanged.

## Open questions for implementation

- Exact `next-intl` version and Next.js 14 App Router compatibility should be verified against current package versions at build time (package.json currently pins `next@^14.2.35`).
- Sanity Studio's object-field localization is typically done by hand-rolling the `{en, hi, mr}` object fields (as described above) rather than an official plugin — implementation should confirm this renders cleanly in Studio's default UI, or add a light custom input component if needed.
