# 09. Technical Baseline

Framework: `seo-audit` (crawlability, indexation, Core Web Vitals, mobile, URL structure, international SEO), `schema` (JSON-LD, accuracy first, `@graph` composition, validation), `ai-seo` (crawler access, agentic rendering).

---

## 1. Stack decision

**Keep Next.js 14 App Router + Sanity CMS + Tailwind on Vercel.**

Judged against your three criteria.

### Build speed

The strongest argument is that it exists and works. But even greenfield this is the right choice for this project. Every technical SEO item in this document is a small, well documented file in the App Router:

| Requirement | Next.js App Router |
|---|---|
| Sitemap | `app/sitemap.ts`, a file convention |
| Robots | `app/robots.ts`, a file convention |
| Canonical and hreflang | Metadata API `alternates` |
| Per page OG images | `opengraph-image.tsx` |
| Static generation per locale | `generateStaticParams` plus `setRequestLocale`, already implemented |
| Structured data | A server rendered component |

In WordPress each of those is a plugin, a settings screen and an argument with a theme.

### SEO

- **Static generation with ISR.** Googlebot and AI crawlers receive fully rendered HTML with no JavaScript dependency. Per `ai-seo`, agents that read the DOM or the accessibility tree need this, and JavaScript only rendering loses both audiences
- **`next/image`.** Already used nine times with zero raw `<img>` tags. Automatic responsive sizing, lazy loading, modern formats. Most of the LCP and CLS work is done by default
- **`next/font`.** Fraunces and Inter self hosted with `display: swap`. No render blocking third party font request, no layout shift
- **Metadata API.** Canonicals and hreflang are typed and colocated with the page, not managed in a plugin

### Maintainability, which is the real argument for Sanity

As a solo operator, the risk is not that the site is hard to build. It is that content stops the week you get busy. Sanity Studio at `/studio` means blog posts, projects, testimonials and FAQs are published without code, without a deploy and without a Claude Code session. The free tier covers you comfortably at this scale.

If content lived in the repository, your content pipeline would have a dependency on developer time forever. That is the failure mode that kills the organic strategy.

### What to change, and when

| Change | When | Why not now |
|---|---|---|
| Next 14.2 to Next 15 | Month 2 | A migration during a launch week is how launches slip. Real improvement, no urgency |
| Consider Vercel Pro | When traffic justifies it | Hobby is fine at launch. Note the commercial use terms if you have not already |
| Image CDN beyond `next/image` | Not needed | `next/image` on Vercel already optimises and caches |

**Rejected alternatives, briefly.** WordPress: better for a non technical editor, worse for Core Web Vitals, plugin maintenance burden, and you are technical enough not to need it. Webflow: fast to design, expensive at content scale, weaker programmatic control over schema and hreflang. Astro: excellent for content sites, but it would mean rebuilding what exists for a marginal performance gain.

---

## 2. Indexation and crawlability

### `app/robots.ts`

Explicit allows for the AI crawlers that cite. Per `ai-seo`, blocking them means those engines cannot cite you at all.

```
User-agent: *
Allow: /
Disallow: /studio
Disallow: /lp/
Disallow: /api/

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

Sitemap: https://www.shreegiriraj.in/sitemap.xml
```

`CCBot` is left allowed. It feeds training rather than citation, and for a firm with no brand recognition, presence in training data is a benefit.

**`/studio` must be disallowed.** The Sanity Studio route should never be indexed.

### `app/sitemap.ts`

| Requirement | Implementation |
|---|---|
| All indexable URLs | Static routes plus dynamic slugs from Sanity |
| Absolute URLs | Full protocol and domain. Relative URLs invalidate hreflang clusters |
| `lastModified` | From the Sanity `_updatedAt` field, not a build timestamp |
| Hreflang alternates | `alternates.languages` per URL, **only for locales that genuinely exist** |
| **Self referencing alternate** | **`alternates.languages` does not auto include the current URL.** Add it explicitly. This is a known silent failure |
| Exclusions | `/lp/*`, `/studio`, `/api/*` |
| Priority and changefreq | Omit. Google ignores both |

### `/llms.txt`

Plain language description of the business, service area and key page links. Not required by Google, materially useful for non Google AI engines.

**No `/pricing.md`.** The `ai-seo` guide recommends one but it assumes published pricing. Yours is deliberately masked. A deliberate deviation, noted.

---

## 3. Canonical and hreflang

The area of highest current risk. Neither exists today, across four locales.

### Canonical rules

| Rule | Detail |
|---|---|
| Every page self canonicalises | `/mr/services/rentals` canonicalises to itself |
| **Never cross locale canonical** | Canonicalising Marathi to English suppresses the Marathi version entirely |
| Canonical must appear in the hreflang set | If it does not, **all hreflang for that cluster is ignored** |
| Consistent protocol and host | `https://www.` everywhere. A mismatch between canonical, hreflang and sitemap discards the cluster |
| Paginated pages self canonicalise | Never canonical page 2 to page 1 |
| Landing pages | `noindex, follow`, self canonical |

### Hreflang rules

| Rule | Detail |
|---|---|
| Self referencing entry required | **Missing it causes Google to ignore the entire cluster.** The most common hreflang failure |
| Reciprocal | If A points to B, B must point back. Otherwise the pair is dropped |
| Valid codes | `en`, `hi`, `mr`, `gu`. No region suffixes |
| `x-default` | Points to the English homepage |
| **Only for locales that exist** | An English only blog post carries **no hreflang at all**. Correct, rather than pointing at three URLs that 404 |
| All targets return 200 and are indexable | A 404 or redirect target invalidates the cluster |
| HTML and sitemap must agree | Conflicting annotations cause the pair to be dropped |

### The locale gating change

The most consequential code change in the plan. Detail in `01-architecture.md` section 8.

**Problem.** `getLocalizedField` in `src/lib/i18n-content.ts` silently falls back to English. English only content therefore renders identical English bodies at four URLs with only chrome translated. Per `seo-audit`, that is "only boilerplate translated, main content identical across locales", producing duplicates and thin locale pages that suppress site wide quality through the helpful content system.

**Fix.**

```
1. Add a new helper alongside getLocalizedField, do not change it.
   getLocalizedBody() returns undefined rather than falling back.

2. generateStaticParams for content routes emits only locales
   where getLocalizedBody() returns content.

3. The page component calls notFound() when the localized body
   is absent, rather than rendering an English fallback.

4. generateMetadata emits alternates.languages containing only
   the locales that were generated, plus a self reference.
```

`getLocalizedField` keeps its fallback for UI strings and short metadata, where falling back is correct and harmless. The distinction between chrome and body is the whole point and it must be enforced by two differently named functions, not by a flag.

### Redirects

| From | To | Type |
|---|---|---|
| `http://*` | `https://*` | 301 |
| Apex domain | `www` | 301 |
| Trailing slash | Without | 301 |
| Uppercase path | Lowercase | 301 |
| **`/en/*`** | **`/*`** | **301** |

The last one is easy to miss. `localePrefix` is `as-needed`, so English is unprefixed. If `/en/` also resolves, you have a complete duplicate of the English site.

---

## 4. Schema plan

JSON-LD only, server rendered, composed into a single `@graph` per page. Per the `schema` guide: accuracy first, only mark up what is visibly on the page, validate everything.

### Per page type

| Page | Schema types |
|---|---|
| Homepage | `RealEstateAgent`, `WebSite`, `FAQPage` |
| `/services` | `ItemList` of `Service`, `BreadcrumbList` |
| Service detail | `Service`, `FAQPage`, `BreadcrumbList` |
| `/areas` | `ItemList`, `BreadcrumbList` |
| Area detail | `RealEstateAgent` with `areaServed`, `Place`, `FAQPage`, `BreadcrumbList` |
| `/projects` | `ItemList`, `BreadcrumbList` |
| `/projects/jaswanti-jewel` | `Residence`, `FAQPage`, `BreadcrumbList` |
| `/about` | `AboutPage`, `RealEstateAgent`, `Person` per named individual |
| `/contact` | `ContactPage`, `LocalBusiness` |
| Blog post | `BlogPosting`, `BreadcrumbList`, conditionally `FAQPage` |
| Pillar guide | `Article`, `FAQPage`, `BreadcrumbList` |
| Case study | `Article`, `BreadcrumbList`, conditionally `Review` |
| Landing pages | `FAQPage` only. `noindex` anyway |
| Legal | `WebPage` |

### The organisation block

`RealEstateAgent` is a subtype of `LocalBusiness`, so it satisfies both requirements without duplication.

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": "https://www.shreegiriraj.in/#organization",
  "name": "Shree Giriraj Real Estate",
  "url": "https://www.shreegiriraj.in",
  "logo": "https://www.shreegiriraj.in/logo.png",
  "image": "https://www.shreegiriraj.in/office.jpg",
  "telephone": "+919324974133",
  "email": "shreegiriraj1224@gmail.com",
  "foundingDate": "1996",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop No 11, Clover Grove CHS, Chikoowadi",
    "addressLocality": "Borivali West",
    "addressRegion": "Maharashtra",
    "postalCode": "400092",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "PENDING_GBP_VERIFICATION",
    "longitude": "PENDING_GBP_VERIFICATION"
  },
  "areaServed": [
    { "@type": "Place", "name": "Borivali West, Mumbai" },
    { "@type": "Place", "name": "Borivali East, Mumbai" },
    { "@type": "Place", "name": "Kandivali, Mumbai" },
    { "@type": "Place", "name": "Malad, Mumbai" }
  ],
  "identifier": {
    "@type": "PropertyValue",
    "name": "MahaRERA Agent Registration",
    "value": "A51800005726"
  },
  "sameAs": ["PENDING: GBP, Facebook, Instagram, JustDial, YouTube"]
}
```

**Deliberately absent: `aggregateRating`.** Self serving review markup for `LocalBusiness` is disallowed by Google and there is no verified review corpus. See `04-social-proof.md`.

**Deliberately absent: `priceRange`.** Do not invent one. Omitting a property is always safer than guessing it.

`geo` and `sameAs` stay as explicit placeholders until GBP verification supplies real values. **A placeholder that is visibly a placeholder is safe. A plausible invented coordinate is not.**

### Jaswanti Jewel

`Residence` only. **No `Product`, no `offers`.**

Reason: pricing is masked. Marking up a masked or approximate price is inaccurate structured data, which the `schema` guide's accuracy first principle rules out and which risks a manual action. If you later publish real, current, unmasked prices, `Product` with `offers` becomes appropriate. Not before.

The project's own MahaRERA number goes in `identifier` on this page. It is currently unknown and is a hard blocker on publishing the page.

### Validation

| Step | Tool |
|---|---|
| Every page type validated | Google Rich Results Test |
| Full graph validated | validator.schema.org |
| Monitoring | Search Console Enhancements, weekly for month one |
| Rule | Zero errors before launch. Warnings assessed individually |

**A realistic expectation.** Google substantially reduced FAQ rich result display in 2023. Implement `FAQPage` because non Google AI engines parse it and because the content structure wins the AI Overview regardless. Do not implement it expecting stars and dropdowns in Google.

---

## 5. Core Web Vitals

### Targets

Measured at the 75th percentile on **mobile**, which is where your traffic is.

| Metric | Target | Stretch | Notes |
|---|---|---|---|
| **LCP** | under 2.5s | under 2.0s | Usually the hero image. `next/image` with `priority` on it |
| **INP** | under 200ms | under 100ms | Replaced FID. Watch the mobile nav toggle and FAQ accordions |
| **CLS** | under 0.1 | under 0.05 | `next/font` with `display: swap` plus explicit image dimensions already handles most of this |
| **TTFB** | under 800ms | under 600ms | Static generation plus Vercel edge. Should be comfortable |
| Total page weight | under 1.5MB | under 1MB | Images are the risk |

**Paid landing pages are held to the stretch targets.** Landing page experience is a direct Quality Score input, so LCP under 2.0s on those three pages is a commercial requirement, not a nicety.

### Measurement

| Source | Use |
|---|---|
| **Search Console Core Web Vitals report** | Field data, real users. **The only one that counts for ranking** |
| PageSpeed Insights | Both lab and field. Per URL diagnosis |
| Lighthouse in Chrome | Lab only. Useful for iterating, not for judging |
| Vercel Analytics | Real user monitoring if you enable it |

**Lab scores are not field data.** A Lighthouse 98 on a fast laptop tells you nothing about a Borivali buyer on 4G. Judge on Search Console field data from month two, once you have enough traffic for it to populate.

### Risks specific to this build

| Risk | Mitigation |
|---|---|
| Hero images on every page template | `priority` on the LCP image only, lazy load everything below the fold |
| Jaswanti Jewel gallery | Lazy load, correct `sizes`, do not load full resolution into thumbnails |
| `styled-components` in the dependency list alongside Tailwind | **Worth investigating.** Two styling systems is redundant weight and styled-components adds runtime cost. If it is only a Sanity Studio dependency it is fine, since Studio is not indexed. If it is used on the site, consider removing it |
| Sanity image URLs | Use `@sanity/image-url` with explicit width and format parameters. Do not serve originals |
| Four locale font subsets | Devanagari and Gujarati subsets are large. Load them **only** for those locales, never on the English pages |

That last one is a real and easily missed cost. Loading Devanagari glyphs for an English page is pure waste on the metric that matters most.

---

## 6. Image strategy

| Rule | Detail |
|---|---|
| Always `next/image` | Never a raw `<img>`. Currently at nine to zero, keep it there |
| Formats | AVIF then WebP, with automatic fallback. Handled by `next/image` |
| Explicit dimensions | Every image. Prevents CLS |
| `sizes` attribute | On every responsive image. Without it the browser downloads far more than needed |
| `priority` | LCP image only, one per page |
| Alt text | Descriptive and specific. "Two bedroom flat in Borivali West with a Link Road view", not "flat" |
| Sanity images | `@sanity/image-url` with width, quality and format parameters |
| Static images | Currently in `public/`. Fine at this volume |
| Photography | **Real photographs of real properties and the real office.** Stock imagery of generic apartment blocks actively undermines the "we know these buildings" positioning |
| File naming | Descriptive slugs. `borivali-west-society-exterior.jpg` |
| OG images | Per page via `opengraph-image.tsx`. Currently absent site wide |

**On photography.** This is a content decision with a technical wrapper. The single biggest visual credibility upgrade available is a set of real photographs: the office, the signboard, the team, the actual buildings. It costs a phone and an afternoon. It is worth more than any performance optimisation on this list.

---

## 7. Mobile first requirements

Most of your traffic will be on a phone, on mobile data, in India. Non negotiable.

| Requirement | Status |
|---|---|
| Responsive across all breakpoints | Built |
| Sticky mobile Call and WhatsApp bar | Built |
| Floating WhatsApp hidden on mobile to avoid duplication | Built. **Verify it holds, for analytics accuracy as well as UX** |
| Tap targets 48px minimum | Verify |
| Body text 16px minimum | Verify. Prevents iOS zoom on input focus |
| Forms usable one handed | Verify |
| Phone input uses `type="tel"` with the numeric keypad | **Verify.** A text keyboard on a phone field is a real conversion cost |
| No horizontal scroll at 320px | Verify |
| Test on real devices, on mobile data | Day 5 |
| Landing pages mobile first by design | Build |

**Test on mobile data, not office wifi.** A site that feels instant on fibre can be unusable on a congested 4G cell in Borivali at 7pm.

---

## 8. Hosting and deployment

| Item | Decision |
|---|---|
| Host | Vercel. GitHub connected, deploy on push to main |
| Domain | Both apex and `www` added, apex 301 to `www` |
| SSL | Automatic |
| Preview deployments | Every branch. **Ensure previews are `noindex`**, Vercel does this by default, verify it |
| Environment variables | From `.env.local` into Vercel project settings |
| Sanity CORS | Production domain added with credentials allowed. Easy to forget, breaks Studio |
| ISR | `revalidate = 60` already set on content routes. Reasonable |
| Region | Default is fine. Consider `bom1` (Mumbai) for TTFB if it proves an issue |
| Cloudflare | **Not needed.** Vercel provides CDN, SSL and DDoS protection. The existing README says this and it is correct |

---

## 9. Security and hygiene

| Item | Detail |
|---|---|
| `/studio` | `noindex`, disallowed in robots, authentication enforced by Sanity |
| Environment variables | Never committed. `.env.local` is gitignored, verified |
| **Sanity write token** | If a form ever posts to Sanity, the token must be server side only, never `NEXT_PUBLIC_` |
| Form endpoint | Rate limited. A public form with no rate limit will be spammed |
| Security headers | CSP, `X-Frame-Options`, `X-Content-Type-Options` via `next.config.mjs` |
| Dependency updates | Monthly `npm audit` |
| **Privacy policy** | **Required before any form goes live.** Google Ads also requires it on lead gen pages |

---

## 10. Testing gates

The repository already has Vitest and an automated no dashes guard. Extend it.

| Gate | Command | When |
|---|---|---|
| Type check | `npx tsc --noEmit` | Every change |
| Unit tests | `npm test` | Every change |
| **Production build** | `npm run build` | **Every change.** The service pages plan notes a build failure that `tsc`, tests and `npm run dev` all missed |
| No dashes guard | Existing test | Every change. **Extend to cover Sanity content, not only code strings** |
| Schema validation | Rich Results Test | Day 3 and before every launch |
| Lighthouse mobile | Manual | Day 5 |

**Extending the dashes guard to CMS content matters.** The rule was caught late last time, after 117 em dashes had shipped across six published Sanity pages. Code level tests will not catch content typed into Studio. A build time check that fetches published content and fails on a dash would.

---

## 11. Launch checklist

- [ ] Domain resolving, HTTPS, apex 301 to `www`
- [ ] All five redirect rules live, including `/en/*`
- [ ] `robots.txt` live with AI crawler allows and `/studio` disallowed
- [ ] `sitemap.xml` live, absolute URLs, hreflang alternates including self references
- [ ] `llms.txt` live
- [ ] Canonical on every page, self referencing
- [ ] Hreflang correct, reciprocal, `x-default` present, only for locales that exist
- [ ] **Locale gating verified: an English only post returns 404 at `/mr/blog/[slug]`, not an English fallback**
- [ ] Schema validating with zero errors on every page type
- [ ] No `aggregateRating` anywhere
- [ ] No `Product` or `offers` on Jaswanti Jewel while pricing is masked
- [ ] Core Web Vitals measured on the live domain against section 5 targets
- [ ] All three landing pages `noindex` confirmed in rendered HTML
- [ ] `/studio` `noindex` confirmed
- [ ] Preview deployments `noindex` confirmed
- [ ] Mobile tested on a real device on mobile data
- [ ] Privacy policy live and linked from every form
- [ ] Search Console verified, sitemap submitted
- [ ] `npm run build`, `npm test` and `npx tsc --noEmit` all passing
