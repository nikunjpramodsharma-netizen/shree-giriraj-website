# i18n Foundation & CMS Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the entire site (routing, static UI copy, and CMS content) work correctly in English, Hindi, and Marathi, with English as the unprefixed default locale and automatic browser-language detection on first visit.

**Architecture:** Adopt `next-intl` for App Router locale routing (`/`, `/hi`, `/mr`), restructure `src/app/` so visitor-facing routes live under `src/app/[locale]/` while `/studio` stays outside locale routing entirely. CMS text fields on `project`, `testimonial`, `page`, and `post` become `{en, hi, mr}` objects, unwrapped everywhere through a single `getLocalizedField` helper so the localization mechanism can be swapped later without touching page/component code.

**Tech Stack:** Next.js 14 (App Router), `next-intl` ^4.13, Sanity, Tailwind CSS, Vitest + React Testing Library (new — this project has no test runner yet).

**Source spec:** `docs/superpowers/specs/2026-07-22-localization-and-homepage-revamp-design.md`

**Relationship to the homepage revamp plan:** This plan is a prerequisite for the separate homepage-revamp plan (project grid, testimonial carousel, FAQ section, sticky mobile CTA, `teamMember`/`faq` schemas). Do not start that plan until every task here is committed — it builds directly on the `[locale]` routing structure and the `getLocalizedField` helper introduced here.

## Global Constraints

- Project root: `C:\Shree Giriraj Real Estate`. All paths below are relative to this root.
- Next.js is pinned to `^14.2.35` — **`params` props are plain synchronous objects** (`{ params }: { params: { locale: string } }`), not Promises. Do not use Next 15's `await params` pattern anywhere in this plan.
- No `.env.local` exists yet (no real Sanity project has been created — that happens later, during deployment). `src/sanity/env.ts` throws at import time when its env vars are unset, which means **`npm run build` cannot succeed in this environment** and must not be used for verification. Every structural/type-safety check in this plan uses `npx tsc --noEmit` (type-checks without executing module top-level code, so it doesn't trip `env.ts`'s `assertValue` throw) instead.
- `localePrefix: "as-needed"` — English is unprefixed (`/`, `/projects`), Hindi and Marathi are prefixed (`/hi/...`, `/mr/...`). Locale set is exactly `["en", "hi", "mr"]`, default `"en"`.
- All internal navigation links (`<Link>`) must come from `@/i18n/navigation`, not `next/link` — this is what makes hrefs automatically locale-prefixed. `next/link` is only acceptable where explicitly noted (there are no such cases in this plan).
- Every localized CMS field is read through `getLocalizedField(field, locale)` (Task 5) — never destructure `.en`/`.hi`/`.mr` directly in a component or page.
- `/studio` (Sanity Studio) is never wrapped in `NextIntlClientProvider`, the marketing `Nav`/`Footer`, or the site fonts — it is a separate, non-localized root layout branch.

---

### Task 1: Add Vitest test runner

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/lib/sanity-check.test.ts` (temporary smoke test, deleted at the end of this task)

**Interfaces:**
- Produces: `npm test` runs Vitest once; `npm run test:watch` runs it in watch mode. Later tasks' `*.test.ts`/`*.test.tsx` files are picked up automatically by this config.

- [ ] **Step 1: Install test dependencies**

Run:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Add `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add test scripts to `package.json`**

In `package.json`, add to `"scripts"` (keep existing entries):
```json
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
```

- [ ] **Step 5: Write a trivial smoke test to confirm the harness works**

Create `src/lib/sanity-check.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("vitest harness", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run the test to verify the harness works**

Run: `npm test`
Expected: `1 passed` (the `vitest harness` test).

- [ ] **Step 7: Delete the smoke test and commit**

```bash
rm "src/lib/sanity-check.test.ts"
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "Add Vitest test runner"
```

---

### Task 2: next-intl routing config and middleware

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `src/middleware.test.ts`
- Modify: `next.config.mjs`
- Modify: `messages/en.json` (created empty here, populated in Task 3)

**Interfaces:**
- Produces: `routing` object (`src/i18n/routing.ts`) — consumed by `navigation.ts`, `request.ts`, `middleware.ts`, and `[locale]/layout.tsx` (Task 4).
- Produces: `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` (`src/i18n/navigation.ts`) — consumed by every page/component with internal links (Tasks 11-16).

- [ ] **Step 1: Install next-intl**

Run: `npm install next-intl@^4.13.3`
Expected: added to `dependencies` in `package.json`.

- [ ] **Step 2: Create `src/i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "mr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
```

- [ ] **Step 3: Create `src/i18n/navigation.ts`**

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 4: Create a placeholder `messages/en.json`**

Create `messages/en.json` at the project root (not under `src/`):
```json
{}
```

- [ ] **Step 5: Create `src/i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 6: Wire the next-intl plugin into `next.config.mjs`**

Replace the full contents of `next.config.mjs`:
```js
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Write the failing middleware test**

Create `src/middleware.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import middleware from "./middleware";

describe("locale detection middleware", () => {
  it("redirects a first-time Hindi-preferring visitor to /hi", () => {
    const req = new NextRequest("https://example.com/", {
      headers: { "accept-language": "hi-IN,hi;q=0.9" },
    });
    const res = middleware(req);
    expect(res.headers.get("location")).toContain("/hi");
  });

  it("redirects a first-time Marathi-preferring visitor to /mr", () => {
    const req = new NextRequest("https://example.com/", {
      headers: { "accept-language": "mr-IN,mr;q=0.9" },
    });
    const res = middleware(req);
    expect(res.headers.get("location")).toContain("/mr");
  });

  it("leaves English visitors on the unprefixed path", () => {
    const req = new NextRequest("https://example.com/projects", {
      headers: { "accept-language": "en-US,en;q=0.9" },
    });
    const res = middleware(req);
    // "as-needed" prefix strategy: English never redirects to /en.
    expect(res.headers.get("location")).toBeNull();
  });

  it("respects an existing NEXT_LOCALE cookie over Accept-Language", () => {
    const req = new NextRequest("https://example.com/", {
      headers: { "accept-language": "hi-IN,hi;q=0.9", cookie: "NEXT_LOCALE=mr" },
    });
    const res = middleware(req);
    expect(res.headers.get("location")).toContain("/mr");
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `npm test -- src/middleware.test.ts`
Expected: FAIL — `Cannot find module './middleware'` (it doesn't exist yet).

- [ ] **Step 9: Create `src/middleware.ts`**

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npm test -- src/middleware.test.ts`
Expected: `4 passed`.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json next.config.mjs src/i18n src/middleware.ts src/middleware.test.ts messages/en.json
git commit -m "Add next-intl routing config and locale-detection middleware"
```

---

### Task 3: UI translation message catalogs

**Files:**
- Modify: `messages/en.json`
- Create: `messages/hi.json`
- Create: `messages/mr.json`
- Create: `messages/messages.test.ts`

**Interfaces:**
- Produces: namespaced translation keys (`nav.*`, `hero.*`, `services.*`, `featuredProject.*`, `testimonials.*`, `areas.*`, `leadForm.*`, `footer.*`, `whatsappFloat.*`, `projectsPage.*`, `projectDetail.*`, `blogPage.*`, `blogPost.*`) — consumed via `useTranslations`/`getTranslations` in Tasks 11-16.

- [ ] **Step 1: Write the failing key-parity test**

This test guards against the most common real bug in a 3-language setup: a key added to one file and forgotten in the others, which silently renders a missing-translation fallback string in production.

Create `messages/messages.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import en from "./en.json";
import hi from "./hi.json";
import mr from "./mr.json";

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null
      ? flattenKeys(value as Record<string, unknown>, path)
      : [path];
  });
}

describe("message catalog key parity", () => {
  it("has identical keys across en, hi and mr", () => {
    const enKeys = flattenKeys(en).sort();
    const hiKeys = flattenKeys(hi).sort();
    const mrKeys = flattenKeys(mr).sort();
    expect(hiKeys).toEqual(enKeys);
    expect(mrKeys).toEqual(enKeys);
  });

  it("has no empty string values in any catalog", () => {
    for (const [name, catalog] of [
      ["en", en],
      ["hi", hi],
      ["mr", mr],
    ] as const) {
      const empty = flattenKeys(catalog).filter(
        (path) => path.split(".").reduce((o: any, k) => o[k], catalog) === ""
      );
      expect(empty, `${name}.json has empty values at: ${empty.join(", ")}`).toEqual([]);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- messages/messages.test.ts`
Expected: FAIL — `Cannot find module './hi.json'` (files don't exist yet).

- [ ] **Step 3: Replace `messages/en.json` with the full English catalog**

```json
{
  "nav": {
    "services": "Services",
    "projects": "Projects",
    "blog": "Blog",
    "about": "About",
    "enquireNow": "Enquire Now",
    "menuLabel": "Menu",
    "brandTagline": "Real Estate · Est. {year}",
    "whatsappGenericMessage": "Hi Shree Giriraj, I'd like to know more about properties in the western suburbs.",
    "whatsappEnquireMessage": "Hi Shree Giriraj, I'd like to enquire."
  },
  "hero": {
    "headingPart1": "Your address in the western suburbs, ",
    "headingEm": "found the right way.",
    "body": "For over 25 years, families across Borivali have trusted us to buy, sell and rent homes — and to get first access to the suburb's most sought-after new launches.",
    "ctaBook": "Book a consultation",
    "ctaWhatsapp": "Chat on WhatsApp",
    "whatsappMessage": "Hi Shree Giriraj, I'd like to enquire.",
    "statYears": "Years in Borivali West",
    "statSuburbs": "Suburbs covered",
    "statRating": "Client rating",
    "featuredBadge": "Now Booking · Featured"
  },
  "services": {
    "eyebrow": "What we do",
    "heading": "One team for every kind of move",
    "resaleTitle": "Resale flats",
    "resaleBody": "Buy or sell ready-to-move homes across Borivali, Kandivali and Malad, with fair pricing and clear title checks.",
    "rentalsTitle": "Rentals",
    "rentalsBody": "Tenants and owners matched quickly — from 1 BHK starter homes to premium family residences, with agreements sorted.",
    "newProjectTitle": "New project bookings",
    "newProjectBody": "Early access to upcoming launches through our direct builder network — often before they hit the open market.",
    "redevelopmentTitle": "Redevelopment",
    "redevelopmentBody": "Guidance for societies and owners through redevelopment — from developer selection to occupancy.",
    "shopsTitle": "Shops & plots",
    "shopsBody": "Commercial shops, offices and plots for investors and business owners looking to expand in the suburbs.",
    "interiorsTitle": "Interiors & civil work",
    "interiorsBody": "Once you have the keys, our team helps with fit-outs and civil work to get your home move-in ready."
  },
  "featuredProject": {
    "eyebrow": "Featured Launch · Now Booking Through Us",
    "nowBooking": "Now Booking",
    "ctaPrice": "Get price & site visit",
    "ctaView": "View project",
    "whatsappPrefix": "Hi Shree Giriraj, I'm interested in",
    "whatsappSuffix": "Please share the current price sheet, floor availability and a site visit slot."
  },
  "testimonials": {
    "eyebrow": "What clients say",
    "heading": "Trusted by families across the suburbs"
  },
  "areas": {
    "eyebrow": "Where we work",
    "heading": "Across the western suburbs",
    "borivaliBody": "Our home turf. Resale, rentals and redevelopment across Borivali West and East.",
    "kandivaliBody": "Premium new launches and family homes off M.G. Road and Link Road.",
    "maladBody": "Growing residential and commercial options near Mindspace and the Link Road corridor."
  },
  "leadForm": {
    "eyebrow": "Let's talk",
    "headingPart1": "Tell us what you're ",
    "headingEm": "looking for.",
    "body": "Share a few details and we'll get back with matching options, honest pricing and the next available site visit — usually the same day.",
    "namePlaceholder": "Your name",
    "phonePlaceholder": "Phone number",
    "areaPlaceholder": "Preferred area (e.g. Borivali West)",
    "intentBuy": "Buy",
    "intentSell": "Sell",
    "intentRent": "Rent",
    "intentNewProject": "New project",
    "intentRedevelopment": "Redevelopment",
    "submit": "Send enquiry on WhatsApp",
    "disclaimer": "Opens WhatsApp with your details filled in. No spam, ever.",
    "whatsappGreeting": "Hi Shree Giriraj, I'd like to enquire.",
    "whatsappNameLabel": "Name",
    "whatsappIntentLabel": "Looking to",
    "whatsappAreaLabel": "Area",
    "whatsappPhoneLabel": "Phone"
  },
  "footer": {
    "description": "Interior & Civil Work · Flat, Shop, Plot & Bungalow Re-Development. Trusted property advice in Borivali West since {year}.",
    "exploreHeading": "Explore",
    "contactHeading": "Get in touch",
    "whatsappUs": "WhatsApp us",
    "whatsappMessage": "Hi Shree Giriraj!",
    "copyright": "© {year} {name} · Borivali · Kandivali · Malad",
    "rera": "MahaRERA Reg. No. {number}"
  },
  "whatsappFloat": {
    "ariaLabel": "Chat on WhatsApp",
    "message": "Hi Shree Giriraj, I'd like to enquire about a property."
  },
  "projectsPage": {
    "eyebrow": "Projects",
    "heading": "New launches & bookings",
    "body": "Handpicked residential projects across the western suburbs — many available for booking through our direct builder relationships.",
    "emptyState": "No projects added yet. Add your first one in the ",
    "studioLink": "Studio",
    "statusBooking": "Now Booking",
    "statusUpcoming": "Upcoming",
    "statusSold": "Sold Out",
    "viewDetails": "View details →"
  },
  "projectDetail": {
    "backLink": "← All projects",
    "developerLabel": "Developer: ",
    "reraLabel": "MahaRERA No. ",
    "ctaPrice": "Get price & site visit",
    "configEyebrow": "Configurations & pricing",
    "configHeading": "Homes at {name}",
    "priceSheetNote": "Exact all-inclusive pricing & floor-wise availability shared on request — ",
    "priceSheetLink": "message us for the live price sheet",
    "whatsappPriceSheet": "Hi Shree Giriraj, please share the live price sheet for {name}.",
    "whatsappSiteVisit": "Hi Shree Giriraj, I'm interested in {name}. Please share the current price sheet, floor availability and a site visit slot.",
    "amenitiesEyebrow": "Amenities",
    "amenitiesHeading": "Life at {name}",
    "galleryEyebrow": "Gallery",
    "galleryHeading": "Take a look"
  },
  "blogPage": {
    "eyebrow": "Blog",
    "heading": "Property insights for the western suburbs",
    "body": "Practical guides on buying, selling and renting in Borivali, Kandivali and Malad — plus notes on the local market.",
    "emptyState": "No posts published yet. Add your first article in the ",
    "studioLink": "Studio"
  },
  "blogPost": {
    "backLink": "← Back to blog"
  }
}
```

- [ ] **Step 4: Create `messages/hi.json`**

```json
{
  "nav": {
    "services": "सेवाएं",
    "projects": "प्रोजेक्ट्स",
    "blog": "ब्लॉग",
    "about": "हमारे बारे में",
    "enquireNow": "अभी पूछताछ करें",
    "menuLabel": "मेनू",
    "brandTagline": "रियल एस्टेट · स्थापना {year}",
    "whatsappGenericMessage": "नमस्ते श्री गिरिराज, मुझे पश्चिमी उपनगरों की प्रॉपर्टीज़ के बारे में और जानना है।",
    "whatsappEnquireMessage": "नमस्ते श्री गिरिराज, मुझे पूछताछ करनी है।"
  },
  "hero": {
    "headingPart1": "पश्चिमी उपनगरों में आपका पता, ",
    "headingEm": "सही तरीके से पाया गया।",
    "body": "25 से अधिक वर्षों से, बोरिवली भर के परिवारों ने घर खरीदने, बेचने और किराए पर लेने के लिए हम पर भरोसा किया है — और उपनगर के सबसे लोकप्रिय नए प्रोजेक्ट्स तक सबसे पहले पहुंच पाने के लिए भी।",
    "ctaBook": "परामर्श बुक करें",
    "ctaWhatsapp": "व्हाट्सएप पर चैट करें",
    "whatsappMessage": "नमस्ते श्री गिरिराज, मुझे पूछताछ करनी है।",
    "statYears": "बोरिवली वेस्ट में वर्ष",
    "statSuburbs": "कवर किए गए उपनगर",
    "statRating": "क्लाइंट रेटिंग",
    "featuredBadge": "अभी बुकिंग जारी · फीचर्ड"
  },
  "services": {
    "eyebrow": "हम क्या करते हैं",
    "heading": "हर तरह की ज़रूरत के लिए एक ही टीम",
    "resaleTitle": "रीसेल फ्लैट्स",
    "resaleBody": "बोरिवली, कांदिवली और मलाड में रेडी-टू-मूव घर खरीदें या बेचें, उचित कीमत और स्पष्ट टाइटल जांच के साथ।",
    "rentalsTitle": "किराया",
    "rentalsBody": "किरायेदारों और मालिकों का तुरंत मिलान — 1 बीएचके स्टार्टर होम से लेकर प्रीमियम फैमिली रेसिडेंस तक, एग्रीमेंट भी हम संभालते हैं।",
    "newProjectTitle": "नए प्रोजेक्ट बुकिंग",
    "newProjectBody": "हमारे सीधे बिल्डर नेटवर्क के ज़रिए आने वाले लॉन्च तक जल्दी पहुंच — अक्सर उनके ओपन मार्केट में आने से पहले ही।",
    "redevelopmentTitle": "पुनर्विकास",
    "redevelopmentBody": "सोसाइटियों और मालिकों के लिए पुनर्विकास में मार्गदर्शन — डेवलपर चयन से लेकर पजेशन तक।",
    "shopsTitle": "दुकान और प्लॉट",
    "shopsBody": "उपनगरों में विस्तार चाहने वाले निवेशकों और व्यवसाय मालिकों के लिए कमर्शियल दुकानें, ऑफिस और प्लॉट।",
    "interiorsTitle": "इंटीरियर और सिविल वर्क",
    "interiorsBody": "चाबी मिलने के बाद, हमारी टीम फिट-आउट और सिविल वर्क में मदद करती है ताकि आपका घर रहने के लिए तैयार हो जाए।"
  },
  "featuredProject": {
    "eyebrow": "फीचर्ड लॉन्च · हमारे ज़रिए अभी बुकिंग",
    "nowBooking": "अभी बुकिंग",
    "ctaPrice": "कीमत और साइट विज़िट पाएं",
    "ctaView": "प्रोजेक्ट देखें",
    "whatsappPrefix": "नमस्ते श्री गिरिराज, मुझे इसमें दिलचस्पी है:",
    "whatsappSuffix": "कृपया मौजूदा प्राइस शीट, फ्लोर उपलब्धता और साइट विज़िट स्लॉट साझा करें।"
  },
  "testimonials": {
    "eyebrow": "ग्राहक क्या कहते हैं",
    "heading": "उपनगरों भर के परिवारों का भरोसा"
  },
  "areas": {
    "eyebrow": "हम कहां काम करते हैं",
    "heading": "पश्चिमी उपनगरों में",
    "borivaliBody": "हमारा गृह क्षेत्र। बोरिवली वेस्ट और ईस्ट में रीसेल, किराया और पुनर्विकास।",
    "kandivaliBody": "एम.जी. रोड और लिंक रोड के पास प्रीमियम नए लॉन्च और फैमिली होम्स।",
    "maladBody": "मिंडस्पेस और लिंक रोड कॉरिडोर के पास बढ़ते हुए रेजिडेंशियल और कमर्शियल विकल्प।"
  },
  "leadForm": {
    "eyebrow": "बात करते हैं",
    "headingPart1": "बताइए आप क्या ",
    "headingEm": "ढूंढ रहे हैं।",
    "body": "कुछ जानकारी साझा करें और हम मिलते-जुलते विकल्प, ईमानदार कीमत और अगली उपलब्ध साइट विज़िट के साथ वापस संपर्क करेंगे — आमतौर पर उसी दिन।",
    "namePlaceholder": "आपका नाम",
    "phonePlaceholder": "फ़ोन नंबर",
    "areaPlaceholder": "पसंदीदा क्षेत्र (जैसे बोरिवली वेस्ट)",
    "intentBuy": "खरीदें",
    "intentSell": "बेचें",
    "intentRent": "किराया",
    "intentNewProject": "नया प्रोजेक्ट",
    "intentRedevelopment": "पुनर्विकास",
    "submit": "व्हाट्सएप पर पूछताछ भेजें",
    "disclaimer": "आपकी जानकारी भरकर व्हाट्सएप खोलता है। कभी कोई स्पैम नहीं।",
    "whatsappGreeting": "नमस्ते श्री गिरिराज, मुझे पूछताछ करनी है।",
    "whatsappNameLabel": "नाम",
    "whatsappIntentLabel": "इच्छुक",
    "whatsappAreaLabel": "क्षेत्र",
    "whatsappPhoneLabel": "फ़ोन"
  },
  "footer": {
    "description": "इंटीरियर और सिविल वर्क · फ्लैट, दुकान, प्लॉट और बंगला पुनर्विकास। {year} से बोरिवली वेस्ट में भरोसेमंद प्रॉपर्टी सलाह।",
    "exploreHeading": "एक्सप्लोर करें",
    "contactHeading": "संपर्क करें",
    "whatsappUs": "हमें व्हाट्सएप करें",
    "whatsappMessage": "नमस्ते श्री गिरिराज!",
    "copyright": "© {year} {name} · बोरिवली · कांदिवली · मलाड",
    "rera": "महारेरा पंजीकरण संख्या {number}"
  },
  "whatsappFloat": {
    "ariaLabel": "व्हाट्सएप पर चैट करें",
    "message": "नमस्ते श्री गिरिराज, मुझे एक प्रॉपर्टी के बारे में पूछताछ करनी है।"
  },
  "projectsPage": {
    "eyebrow": "प्रोजेक्ट्स",
    "heading": "नए लॉन्च और बुकिंग",
    "body": "पश्चिमी उपनगरों में चुनिंदा रेजिडेंशियल प्रोजेक्ट्स — कई हमारे सीधे बिल्डर संबंधों के ज़रिए बुकिंग के लिए उपलब्ध।",
    "emptyState": "अभी तक कोई प्रोजेक्ट नहीं जोड़ा गया। यहां अपना पहला जोड़ें ",
    "studioLink": "स्टूडियो",
    "statusBooking": "अभी बुकिंग जारी",
    "statusUpcoming": "जल्द आ रहा है",
    "statusSold": "बिक चुका",
    "viewDetails": "विवरण देखें →"
  },
  "projectDetail": {
    "backLink": "← सभी प्रोजेक्ट्स",
    "developerLabel": "डेवलपर: ",
    "reraLabel": "महारेरा नंबर ",
    "ctaPrice": "कीमत और साइट विज़िट पाएं",
    "configEyebrow": "कॉन्फ़िगरेशन और कीमत",
    "configHeading": "{name} में घर",
    "priceSheetNote": "सटीक ऑल-इंक्लूसिव कीमत और फ्लोर-वाइज उपलब्धता अनुरोध पर साझा की जाती है — ",
    "priceSheetLink": "लाइव प्राइस शीट के लिए हमें मैसेज करें",
    "whatsappPriceSheet": "नमस्ते श्री गिरिराज, कृपया {name} के लिए लाइव प्राइस शीट साझा करें।",
    "whatsappSiteVisit": "नमस्ते श्री गिरिराज, मुझे {name} में दिलचस्पी है। कृपया मौजूदा प्राइस शीट, फ्लोर उपलब्धता और साइट विज़िट स्लॉट साझा करें।",
    "amenitiesEyebrow": "सुविधाएं",
    "amenitiesHeading": "{name} में जीवन",
    "galleryEyebrow": "गैलरी",
    "galleryHeading": "एक नज़र डालें"
  },
  "blogPage": {
    "eyebrow": "ब्लॉग",
    "heading": "पश्चिमी उपनगरों के लिए प्रॉपर्टी जानकारी",
    "body": "बोरिवली, कांदिवली और मलाड में खरीदने, बेचने और किराए पर लेने के व्यावहारिक गाइड — साथ ही स्थानीय बाज़ार पर नोट्स।",
    "emptyState": "अभी तक कोई पोस्ट प्रकाशित नहीं हुई। यहां अपना पहला लेख जोड़ें ",
    "studioLink": "स्टूडियो"
  },
  "blogPost": {
    "backLink": "← ब्लॉग पर वापस जाएं"
  }
}
```

- [ ] **Step 5: Create `messages/mr.json`**

```json
{
  "nav": {
    "services": "सेवा",
    "projects": "प्रकल्प",
    "blog": "ब्लॉग",
    "about": "आमच्याबद्दल",
    "enquireNow": "आता चौकशी करा",
    "menuLabel": "मेनू",
    "brandTagline": "रिअल इस्टेट · स्थापना {year}",
    "whatsappGenericMessage": "नमस्कार श्री गिरिराज, मला पश्चिम उपनगरातील मालमत्तांबद्दल अधिक जाणून घ्यायचे आहे.",
    "whatsappEnquireMessage": "नमस्कार श्री गिरिराज, मला चौकशी करायची आहे."
  },
  "hero": {
    "headingPart1": "पश्चिम उपनगरातील तुमचा पत्ता, ",
    "headingEm": "योग्य मार्गाने मिळालेला.",
    "body": "25 हून अधिक वर्षांपासून, बोरिवलीतील कुटुंबांनी घर खरेदी, विक्री आणि भाड्याने देण्यासाठी आमच्यावर विश्वास ठेवला आहे — आणि उपनगरातील सर्वाधिक मागणी असलेल्या नवीन प्रकल्पांमध्ये सर्वप्रथम प्रवेश मिळवण्यासाठीही.",
    "ctaBook": "सल्लामसलत बुक करा",
    "ctaWhatsapp": "व्हॉट्सअॅपवर चॅट करा",
    "whatsappMessage": "नमस्कार श्री गिरिराज, मला चौकशी करायची आहे.",
    "statYears": "बोरिवली वेस्टमधील वर्षे",
    "statSuburbs": "समाविष्ट उपनगरे",
    "statRating": "क्लायंट रेटिंग",
    "featuredBadge": "आता बुकिंग सुरू · वैशिष्ट्यीकृत"
  },
  "services": {
    "eyebrow": "आम्ही काय करतो",
    "heading": "प्रत्येक प्रकारच्या हालचालीसाठी एकच टीम",
    "resaleTitle": "पुनर्विक्री फ्लॅट्स",
    "resaleBody": "बोरिवली, कांदिवली आणि मलाडमध्ये रेडी-टू-मूव्ह घरे खरेदी किंवा विक्री करा, योग्य किंमत आणि स्पष्ट टायटल तपासणीसह.",
    "rentalsTitle": "भाडेतत्त्वावरील घरे",
    "rentalsBody": "भाडेकरू आणि मालकांची जलद जुळणी — 1 बीएचके स्टार्टर घरांपासून ते प्रीमियम फॅमिली निवासस्थानांपर्यंत, करारही आम्हीच सांभाळतो.",
    "newProjectTitle": "नवीन प्रकल्प बुकिंग",
    "newProjectBody": "आमच्या थेट बिल्डर नेटवर्कद्वारे आगामी लाँचमध्ये लवकर प्रवेश — बऱ्याचदा ते खुल्या बाजारात येण्यापूर्वीच.",
    "redevelopmentTitle": "पुनर्विकास",
    "redevelopmentBody": "सोसायट्या आणि मालकांसाठी पुनर्विकासात मार्गदर्शन — डेव्हलपर निवडीपासून ताबा मिळेपर्यंत.",
    "shopsTitle": "दुकाने आणि भूखंड",
    "shopsBody": "उपनगरात विस्तार करू इच्छिणाऱ्या गुंतवणूकदार आणि व्यावसायिकांसाठी व्यावसायिक दुकाने, कार्यालये आणि भूखंड.",
    "interiorsTitle": "इंटिरिअर आणि सिव्हिल वर्क",
    "interiorsBody": "चावी मिळाल्यानंतर, आमची टीम फिट-आउट आणि सिव्हिल वर्कमध्ये मदत करते जेणेकरून तुमचे घर राहण्यासाठी सज्ज होईल."
  },
  "featuredProject": {
    "eyebrow": "वैशिष्ट्यीकृत लाँच · आमच्यामार्फत आता बुकिंग",
    "nowBooking": "आता बुकिंग",
    "ctaPrice": "किंमत आणि साइट व्हिजिट मिळवा",
    "ctaView": "प्रकल्प पहा",
    "whatsappPrefix": "नमस्कार श्री गिरिराज, मला यात रस आहे:",
    "whatsappSuffix": "कृपया सध्याची प्राइस शीट, मजला उपलब्धता आणि साइट व्हिजिट स्लॉट शेअर करा."
  },
  "testimonials": {
    "eyebrow": "ग्राहक काय म्हणतात",
    "heading": "उपनगरातील कुटुंबांचा विश्वास"
  },
  "areas": {
    "eyebrow": "आम्ही कुठे काम करतो",
    "heading": "पश्चिम उपनगरात",
    "borivaliBody": "आमचा मूळ भाग. बोरिवली वेस्ट आणि ईस्टमध्ये पुनर्विक्री, भाडेपट्टा आणि पुनर्विकास.",
    "kandivaliBody": "एम.जी. रोड आणि लिंक रोडजवळ प्रीमियम नवीन लाँच आणि फॅमिली होम्स.",
    "maladBody": "मिंडस्पेस आणि लिंक रोड कॉरिडॉरजवळ वाढते निवासी आणि व्यावसायिक पर्याय."
  },
  "leadForm": {
    "eyebrow": "बोलूया",
    "headingPart1": "आम्हाला सांगा तुम्ही काय ",
    "headingEm": "शोधत आहात.",
    "body": "काही तपशील शेअर करा आणि आम्ही योग्य पर्याय, प्रामाणिक किंमत आणि पुढील उपलब्ध साइट व्हिजिटसह संपर्क साधू — सहसा त्याच दिवशी.",
    "namePlaceholder": "तुमचे नाव",
    "phonePlaceholder": "फोन नंबर",
    "areaPlaceholder": "पसंतीचा भाग (उदा. बोरिवली वेस्ट)",
    "intentBuy": "खरेदी",
    "intentSell": "विक्री",
    "intentRent": "भाडे",
    "intentNewProject": "नवीन प्रकल्प",
    "intentRedevelopment": "पुनर्विकास",
    "submit": "व्हॉट्सअॅपवर चौकशी पाठवा",
    "disclaimer": "तुमची माहिती भरून व्हॉट्सअॅप उघडते. कधीही स्पॅम नाही.",
    "whatsappGreeting": "नमस्कार श्री गिरिराज, मला चौकशी करायची आहे.",
    "whatsappNameLabel": "नाव",
    "whatsappIntentLabel": "इच्छुक",
    "whatsappAreaLabel": "भाग",
    "whatsappPhoneLabel": "फोन"
  },
  "footer": {
    "description": "इंटिरिअर आणि सिव्हिल वर्क · फ्लॅट, दुकान, भूखंड आणि बंगला पुनर्विकास. {year} पासून बोरिवली वेस्टमध्ये विश्वासार्ह मालमत्ता सल्ला.",
    "exploreHeading": "एक्सप्लोर करा",
    "contactHeading": "संपर्क साधा",
    "whatsappUs": "आम्हाला व्हॉट्सअॅप करा",
    "whatsappMessage": "नमस्कार श्री गिरिराज!",
    "copyright": "© {year} {name} · बोरिवली · कांदिवली · मलाड",
    "rera": "महारेरा नोंदणी क्र. {number}"
  },
  "whatsappFloat": {
    "ariaLabel": "व्हॉट्सअॅपवर चॅट करा",
    "message": "नमस्कार श्री गिरिराज, मला एका मालमत्तेबद्दल चौकशी करायची आहे."
  },
  "projectsPage": {
    "eyebrow": "प्रकल्प",
    "heading": "नवीन लाँच आणि बुकिंग",
    "body": "पश्चिम उपनगरातील निवडक निवासी प्रकल्प — अनेक आमच्या थेट बिल्डर संबंधांद्वारे बुकिंगसाठी उपलब्ध.",
    "emptyState": "अद्याप कोणताही प्रकल्प जोडलेला नाही. तुमचा पहिला येथे जोडा ",
    "studioLink": "स्टुडिओ",
    "statusBooking": "आता बुकिंग सुरू",
    "statusUpcoming": "लवकरच येत आहे",
    "statusSold": "विकले गेले",
    "viewDetails": "तपशील पहा →"
  },
  "projectDetail": {
    "backLink": "← सर्व प्रकल्प",
    "developerLabel": "डेव्हलपर: ",
    "reraLabel": "महारेरा क्रमांक ",
    "ctaPrice": "किंमत आणि साइट व्हिजिट मिळवा",
    "configEyebrow": "कॉन्फिगरेशन आणि किंमत",
    "configHeading": "{name} येथील घरे",
    "priceSheetNote": "अचूक ऑल-इन्क्लुझिव्ह किंमत आणि मजल्यानुसार उपलब्धता विनंतीनुसार दिली जाते — ",
    "priceSheetLink": "लाइव्ह प्राइस शीटसाठी आम्हाला मेसेज करा",
    "whatsappPriceSheet": "नमस्कार श्री गिरिराज, कृपया {name} साठी लाइव्ह प्राइस शीट शेअर करा.",
    "whatsappSiteVisit": "नमस्कार श्री गिरिराज, मला {name} मध्ये रस आहे. कृपया सध्याची प्राइस शीट, मजला उपलब्धता आणि साइट व्हिजिट स्लॉट शेअर करा.",
    "amenitiesEyebrow": "सुविधा",
    "amenitiesHeading": "{name} येथील जीवन",
    "galleryEyebrow": "गॅलरी",
    "galleryHeading": "एक नजर टाका"
  },
  "blogPage": {
    "eyebrow": "ब्लॉग",
    "heading": "पश्चिम उपनगरांसाठी मालमत्ता माहिती",
    "body": "बोरिवली, कांदिवली आणि मलाडमध्ये खरेदी, विक्री आणि भाड्याने देण्यासंबंधी व्यावहारिक मार्गदर्शक — तसेच स्थानिक बाजारावरील नोंदी.",
    "emptyState": "अद्याप कोणतीही पोस्ट प्रकाशित झालेली नाही. तुमचा पहिला लेख येथे जोडा ",
    "studioLink": "स्टुडिओ"
  },
  "blogPost": {
    "backLink": "← ब्लॉगवर परत जा"
  }
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- messages/messages.test.ts`
Expected: `2 passed`.

- [ ] **Step 7: Commit**

```bash
git add messages
git commit -m "Add English, Hindi and Marathi UI translation catalogs"
```

---

### Task 4: Restructure `src/app` for locale routing

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/studio/layout.tsx`
- Move: `src/app/globals.css` → `src/app/[locale]/globals.css`
- Move: `src/app/page.tsx` → `src/app/[locale]/page.tsx` (content updated in Task 13)
- Move: `src/app/blog/` → `src/app/[locale]/blog/` (content updated in Task 15)
- Move: `src/app/projects/` → `src/app/[locale]/projects/` (content updated in Task 14)
- Move: `src/app/[slug]/` → `src/app/[locale]/[slug]/` (content updated in Task 16)
- Delete: `src/app/layout.tsx`

**Interfaces:**
- Produces: every visitor-facing route now resolves under a `{ locale: string }` param (`"en" | "hi" | "mr"`), available to `page.tsx` files as `params.locale`.
- `/studio` is now a fully independent root (own `<html>`/`<body>`), no longer wrapped in `Nav`/`Footer`/`WhatsAppFloat`/fonts — this also fixes a pre-existing bug where Sanity Studio was unnecessarily wrapped in the marketing site's chrome.

- [ ] **Step 1: Verify the current structure fails type-checking once we reference a locale param (red)**

Run: `npx tsc --noEmit`
Expected: PASS (nothing has changed yet — this just confirms the baseline is currently green before we start moving files, so any new failure after the moves is attributable to this task).

- [ ] **Step 2: Move the route folders**

```bash
mkdir -p "src/app/[locale]"
git mv src/app/page.tsx "src/app/[locale]/page.tsx"
git mv src/app/globals.css "src/app/[locale]/globals.css"
git mv src/app/blog "src/app/[locale]/blog"
git mv src/app/projects "src/app/[locale]/projects"
git mv "src/app/[slug]" "src/app/[locale]/[slug]"
```

- [ ] **Step 3: Create `src/app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Fraunces, Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shreegiriraj.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shree Giriraj Real Estate — Homes in Borivali, Kandivali & Malad",
    template: "%s | Shree Giriraj Real Estate",
  },
  description:
    "25+ years of trusted property advice in Borivali West. Resale, rentals & new project bookings across Borivali, Kandivali and Malad. MahaRERA A51800005726.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Shree Giriraj Real Estate",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <NextIntlClientProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create `src/app/studio/layout.tsx`**

```tsx
/**
 * Independent root layout for /studio. Kept outside the [locale] segment
 * on purpose — Sanity Studio is an authoring tool, not visitor-facing
 * content, so it doesn't need locale routing, the marketing Nav/Footer,
 * or the site fonts.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Delete the old root layout**

```bash
git rm src/app/layout.tsx
```

- [ ] **Step 6: Verify with typecheck (this will still fail — expected, red)**

Run: `npx tsc --noEmit`
Expected: FAIL — errors in the moved `page.tsx` files (they don't yet destructure `params.locale`, use plain `next/link`, and reference now-object-typed CMS fields as strings). This is expected; those get fixed in Tasks 11-16. Confirm the errors are limited to files under `src/app/[locale]/` and not e.g. `src/app/studio` — that would indicate the layout split above is wrong.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Restructure app directory for locale routing, split /studio into its own root layout"
```

---

### Task 5: `getLocalizedField` content helper

**Files:**
- Create: `src/lib/i18n-content.ts`
- Create: `src/lib/i18n-content.test.ts`

**Interfaces:**
- Produces: `type Locale = "en" | "hi" | "mr"`, `type LocalizedValue<T>`, `getLocalizedField<T>(field, locale, fallback?)` — consumed by every page reading a localized CMS field (Tasks 13-16) and by Sanity preview/prepare functions in Tasks 7-10.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/i18n-content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getLocalizedField } from "./i18n-content";

describe("getLocalizedField", () => {
  it("returns the value for the requested locale when present", () => {
    const field = { en: "Hello", hi: "नमस्ते", mr: "नमस्कार" };
    expect(getLocalizedField(field, "hi")).toBe("नमस्ते");
  });

  it("falls back to English when the requested locale is missing", () => {
    const field = { en: "Hello" };
    expect(getLocalizedField(field, "mr")).toBe("Hello");
  });

  it("returns undefined when the field itself is undefined", () => {
    expect(getLocalizedField(undefined, "en")).toBeUndefined();
  });

  it("returns undefined when neither the locale nor the fallback has a value", () => {
    const field = { hi: "नमस्ते" };
    expect(getLocalizedField(field, "mr")).toBeUndefined();
  });

  it("supports a custom fallback locale", () => {
    const field = { hi: "नमस्ते" };
    expect(getLocalizedField(field, "mr", "hi")).toBe("नमस्ते");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/lib/i18n-content.test.ts`
Expected: FAIL — `Cannot find module './i18n-content'`.

- [ ] **Step 3: Implement `src/lib/i18n-content.ts`**

```ts
export type Locale = "en" | "hi" | "mr";

export type LocalizedValue<T> = Partial<Record<Locale, T>>;

export function getLocalizedField<T>(
  field: LocalizedValue<T> | null | undefined,
  locale: Locale,
  fallback: Locale = "en"
): T | undefined {
  if (!field) return undefined;
  return field[locale] ?? field[fallback];
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/lib/i18n-content.test.ts`
Expected: `5 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/i18n-content.ts src/lib/i18n-content.test.ts
git commit -m "Add getLocalizedField content helper"
```

---

### Task 6: Reusable localized Sanity field builders

**Files:**
- Create: `src/sanity/schemas/lib/localizedFields.ts`
- Create: `src/sanity/schemas/lib/localizedFields.test.ts`

**Interfaces:**
- Produces: `localizedStringField(name, title)`, `localizedTextField(name, title, rows?)`, `localizedBlockContentField(name, title)` — consumed by Tasks 7-10 to define `{en, hi, mr}` fields without repeating the object boilerplate in every schema file.

- [ ] **Step 1: Write the failing tests**

Create `src/sanity/schemas/lib/localizedFields.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  localizedStringField,
  localizedTextField,
  localizedBlockContentField,
} from "./localizedFields";

function fieldNames(def: any) {
  return def.fields.map((f: any) => f.name);
}

describe("localized Sanity field builders", () => {
  it("localizedStringField produces an object field with en/hi/mr string subfields", () => {
    const def = localizedStringField("summary", "Summary");
    expect(def.name).toBe("summary");
    expect(def.title).toBe("Summary");
    expect(def.type).toBe("object");
    expect(fieldNames(def)).toEqual(["en", "hi", "mr"]);
    expect(def.fields.every((f: any) => f.type === "string")).toBe(true);
  });

  it("localizedTextField produces en/hi/mr text subfields with the given row count", () => {
    const def = localizedTextField("body", "Body", 6);
    expect(fieldNames(def)).toEqual(["en", "hi", "mr"]);
    expect(def.fields.every((f: any) => f.type === "text" && f.rows === 6)).toBe(true);
  });

  it("localizedBlockContentField produces en/hi/mr blockContent subfields", () => {
    const def = localizedBlockContentField("body", "Full description");
    expect(fieldNames(def)).toEqual(["en", "hi", "mr"]);
    expect(def.fields.every((f: any) => f.type === "blockContent")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/sanity/schemas/lib/localizedFields.test.ts`
Expected: FAIL — `Cannot find module './localizedFields'`.

- [ ] **Step 3: Implement `src/sanity/schemas/lib/localizedFields.ts`**

```ts
import { defineField } from "sanity";

export function localizedStringField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "string" },
      { name: "hi", title: "Hindi", type: "string" },
      { name: "mr", title: "Marathi", type: "string" },
    ],
  });
}

export function localizedTextField(name: string, title: string, rows = 4) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "text", rows },
      { name: "hi", title: "Hindi", type: "text", rows },
      { name: "mr", title: "Marathi", type: "text", rows },
    ],
  });
}

export function localizedBlockContentField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "blockContent" },
      { name: "hi", title: "Hindi", type: "blockContent" },
      { name: "mr", title: "Marathi", type: "blockContent" },
    ],
  });
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/sanity/schemas/lib/localizedFields.test.ts`
Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemas/lib
git commit -m "Add reusable localized Sanity field builders"
```

---

### Task 7: Localize the `project` schema and add ordering

**Files:**
- Modify: `src/sanity/schemas/project.ts`

**Interfaces:**
- Consumes: `localizedStringField`, `localizedTextField` from `@/sanity/schemas/lib/localizedFields` (Task 6).
- Produces: `project.summary`, `project.body`, `project.configurations[].note` are now `{en, hi, mr}` objects; `project.order` (number) is new — consumed by the homepage grid in the homepage-revamp plan.

- [ ] **Step 1: Replace `src/sanity/schemas/project.ts`**

```ts
import { defineType, defineField } from "sanity";
import { localizedStringField, localizedTextField } from "./lib/localizedFields";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Project name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "developer",
      title: "Developer / Builder",
      type: "string",
      description: "e.g. Ashray Group",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Now Booking", value: "booking" },
          { title: "Upcoming", value: "upcoming" },
          { title: "Sold Out", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "booking",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Off M.G. Road, Kandivali West",
    }),
    defineField({
      name: "area",
      title: "Suburb",
      type: "string",
      options: {
        list: [
          { title: "Borivali", value: "borivali" },
          { title: "Kandivali", value: "kandivali" },
          { title: "Malad", value: "malad" },
        ],
      },
    }),
    defineField({
      name: "rera",
      title: "MahaRERA No.",
      type: "string",
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first in the homepage grid when multiple projects are featured.",
      initialValue: 0,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternative text" }],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alternative text" }],
        },
      ],
    }),
    localizedTextField("summary", "Summary"),
    defineField({
      name: "configurations",
      title: "Configurations",
      type: "array",
      description:
        "Each unit type. Use the masked 'display price' (e.g. ₹2.** Cr) to keep exact figures private.",
      of: [
        {
          type: "object",
          name: "config",
          fields: [
            { name: "type", type: "string", title: "Type (e.g. 2 BHK · 766 sq.ft)" },
            {
              name: "displayPrice",
              type: "string",
              title: "Display price (masked, e.g. ₹2.** Cr)",
            },
            localizedStringField("note", "Note (e.g. All-inclusive · lower floor)"),
          ],
          preview: {
            select: { title: "type", subtitle: "displayPrice" },
          },
        },
      ],
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    localizedTextField("body", "Full description", 8),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "coverImage" },
  },
});
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by this file (errors from Task 4's page moves are still expected and unrelated).

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemas/project.ts
git commit -m "Localize project schema summary/body/note fields, add display order"
```

---

### Task 8: Localize the `testimonial` schema

**Files:**
- Modify: `src/sanity/schemas/testimonial.ts`

**Interfaces:**
- Consumes: `localizedTextField` from `@/sanity/schemas/lib/localizedFields`.
- Produces: `testimonial.quote`, `testimonial.role` are now `{en, hi, mr}` objects. `author` and `rating` stay plain (a person's name isn't translated).

- [ ] **Step 1: Replace `src/sanity/schemas/testimonial.ts`**

```ts
import { defineType, defineField } from "sanity";
import { localizedTextField, localizedStringField } from "./lib/localizedFields";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    localizedTextField("quote", "Quote"),
    defineField({
      name: "author",
      title: "Client name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    localizedStringField("role", "Role / context"),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: "featured",
      title: "Show on homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "author", subtitle: "role.en" },
  },
});
```

Note the preview selector change: `subtitle: "role.en"` (was `"role"`) — since `role` is now an object, Studio's document list needs to select the English variant specifically to show readable text instead of `[object Object]`.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by this file.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemas/testimonial.ts
git commit -m "Localize testimonial quote/role fields"
```

---

### Task 9: Localize the `page` schema

**Files:**
- Modify: `src/sanity/schemas/page.ts`

**Interfaces:**
- Consumes: `localizedStringField`, `localizedTextField`, `localizedBlockContentField`.
- Produces: `page.heroHeading`, `page.heroSubheading`, `page.body` are now `{en, hi, mr}` objects. `title`, `slug`, `seoDescription` stay plain.

- [ ] **Step 1: Replace `src/sanity/schemas/page.ts`**

```ts
import { defineType, defineField } from "sanity";
import { localizedStringField, localizedTextField, localizedBlockContentField } from "./lib/localizedFields";

/**
 * A flexible page type for content like "About", "Services", "Privacy", etc.
 * Editable entirely from the Studio without touching code.
 */
export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL path, e.g. 'about' becomes /about",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    localizedStringField("heroHeading", "Hero heading"),
    localizedTextField("heroSubheading", "Hero subheading", 2),
    localizedBlockContentField("body", "Body"),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      description: "Shown in search engine results.",
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by this file.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemas/page.ts
git commit -m "Localize page heroHeading/heroSubheading/body fields"
```

---

### Task 10: Localize the `post` schema

**Files:**
- Modify: `src/sanity/schemas/post.ts`

**Interfaces:**
- Consumes: `localizedTextField`, `localizedBlockContentField`.
- Produces: `post.excerpt`, `post.body` are now `{en, hi, mr}` objects. `title`, `slug`, `mainImage`, `author`, `categories`, `publishedAt` stay plain.

- [ ] **Step 1: Replace `src/sanity/schemas/post.ts`**

```ts
import { defineType, defineField } from "sanity";
import { localizedTextField, localizedBlockContentField } from "./lib/localizedFields";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The URL-friendly version of the title. Click Generate.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    localizedTextField("excerpt", "Excerpt", 3),
    defineField({
      name: "mainImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative text" },
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    localizedBlockContentField("body", "Body"),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", author: "author.name", media: "mainImage" },
    prepare({ title, author, media }) {
      return { title, subtitle: author ? `by ${author}` : "", media };
    },
  },
});
```

Note the `excerpt` field's original `validation: (rule) => rule.max(200)` character-count validator is dropped — it applied to a plain string and doesn't carry over cleanly to an object field. Per-language length limits can be added back later as a per-subfield concern if needed; not required for this plan's scope.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by this file.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemas/post.ts
git commit -m "Localize post excerpt/body fields"
```

---

### Task 11: Translate `Nav.tsx` and add the language toggle

**Files:**
- Create: `src/components/LanguageToggle.tsx`
- Create: `src/components/LanguageToggle.test.tsx`
- Modify: `src/components/Nav.tsx`

**Interfaces:**
- Consumes: `useLocale` (`next-intl`), `usePathname`/`useRouter` (`@/i18n/navigation`, Task 2).
- Produces: `LanguageToggle` component — consumed by `Nav.tsx` here, and reused as-is in `Footer.tsx` if desired later (not required by this plan).

- [ ] **Step 1: Write the failing `LanguageToggle` tests**

Create `src/components/LanguageToggle.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageToggle } from "./LanguageToggle";

const replace = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/projects",
  useRouter: () => ({ replace }),
}));

describe("LanguageToggle", () => {
  it("switches to Hindi when हिंदी is clicked", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(replace).toHaveBeenCalledWith("/projects", { locale: "hi" });
  });

  it("switches to Marathi when मराठी is clicked", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "मराठी" }));
    expect(replace).toHaveBeenCalledWith("/projects", { locale: "mr" });
  });

  it("marks the active locale button with aria-current", () => {
    render(<LanguageToggle />);
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "हिंदी" })).toHaveAttribute("aria-current", "false");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/components/LanguageToggle.test.tsx`
Expected: FAIL — `Cannot find module './LanguageToggle'`.

- [ ] **Step 3: Implement `src/components/LanguageToggle.tsx`**

```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "en" as const, label: "EN" },
  { code: "hi" as const, label: "हिंदी" },
  { code: "mr" as const, label: "मराठी" },
];

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          aria-current={locale === l.code}
          onClick={() => router.replace(pathname, { locale: l.code })}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === l.code
              ? "bg-brand-indigo text-white"
              : "text-brand-indigo/70 hover:text-brand-indigo"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/components/LanguageToggle.test.tsx`
Expected: `3 passed`.

- [ ] **Step 5: Replace `src/components/Nav.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site, waLink } from "@/lib/config";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#services", label: t("services") },
    { href: "/projects", label: t("projects") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-indigo/10 bg-paper/85 backdrop-blur">
      <div className="wrap flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold text-brand-indigo">
              Shree Giriraj
            </span>
            <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              {t("brandTagline", { year: site.established })}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-brand-indigo/80 transition hover:text-brand-indigo"
            >
              {l.label}
            </Link>
          ))}
          <LanguageToggle />
          <a
            href={waLink(t("whatsappGenericMessage"))}
            target="_blank"
            rel="noopener"
            className="btn btn-wa"
          >
            {t("enquireNow")}
          </a>
        </nav>

        <button
          className="p-2 md:hidden"
          aria-label={t("menuLabel")}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-brand-indigo" />
            <span className="block h-0.5 w-6 bg-brand-indigo" />
            <span className="block h-0.5 w-6 bg-brand-indigo" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-b border-brand-indigo/10 bg-paper px-6 py-5 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-brand-indigo"
            >
              {l.label}
            </Link>
          ))}
          <LanguageToggle />
          <a
            href={waLink(t("whatsappEnquireMessage"))}
            target="_blank"
            rel="noopener"
            className="btn btn-wa w-fit"
          >
            {t("enquireNow")}
          </a>
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors from `Nav.tsx` or `LanguageToggle.tsx` (errors remaining from unconverted pages are still expected at this point).

- [ ] **Step 7: Commit**

```bash
git add src/components/LanguageToggle.tsx src/components/LanguageToggle.test.tsx src/components/Nav.tsx
git commit -m "Add language toggle and translate Nav"
```

---

### Task 12: Translate `Footer.tsx` and `WhatsAppFloat.tsx`

**Files:**
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/WhatsAppFloat.tsx`

**Interfaces:**
- Consumes: `useTranslations` (`next-intl`), `Link` (`@/i18n/navigation`).

- [ ] **Step 1: Replace `src/components/Footer.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site, waLink } from "@/lib/config";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-indigo py-14 text-paper/75">
      <div className="wrap">
        <div className="grid gap-10 border-b border-white/10 pb-9 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold text-white">
              {site.name}
            </p>
            <p className="mt-2 max-w-[26em] text-sm">
              {t("description", { year: site.established })}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
              {t("exploreHeading")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#services" className="hover:text-white">{nav("services")}</Link></li>
              <li><Link href="/projects" className="hover:text-white">{nav("projects")}</Link></li>
              <li><Link href="/blog" className="hover:text-white">{nav("blog")}</Link></li>
              <li><Link href="/about" className="hover:text-white">{nav("about")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
              {t("contactHeading")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href={`tel:${site.phonePrimary}`} className="hover:text-white">{site.phonePrimary}</a></li>
              <li><a href={`tel:${site.phoneSecondary}`} className="hover:text-white">{site.phoneSecondary}</a></li>
              <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
              <li>
                <a href={waLink(t("whatsappMessage"))} target="_blank" rel="noopener" className="hover:text-white">
                  {t("whatsappUs")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <span>{t("copyright", { year, name: site.name })}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {t("rera", { number: site.rera })}
          </span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Replace `src/components/WhatsAppFloat.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { waLink } from "@/lib/config";

export function WhatsAppFloat() {
  const t = useTranslations("whatsappFloat");

  return (
    <a
      href={waLink(t("message"))}
      target="_blank"
      rel="noopener"
      aria-label={t("ariaLabel")}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition hover:scale-105"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.6-1.5-.9-2-.2-.5-.4-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2z" />
      </svg>
    </a>
  );
}
```

`WhatsAppFloat` becomes a client component (needs `useTranslations`, which requires client-side context via `NextIntlClientProvider`) — this is consistent with it already being interactive UI rendered inside the `[locale]/layout.tsx`'s provider.

- [ ] **Step 3: Note this component is used from the client-only tree**

`WhatsAppFloat` and `Footer` are both rendered directly inside `[locale]/layout.tsx`, which wraps them in `NextIntlClientProvider` (Task 4) — no additional wiring is needed for `useTranslations` to work in either.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors from either modified file.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/WhatsAppFloat.tsx
git commit -m "Translate Footer and WhatsAppFloat"
```

---

### Task 13: Localize the homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/LeadForm.tsx`

**Interfaces:**
- Consumes: `getTranslations` (`next-intl/server`), `useTranslations` (`next-intl`, client side for `LeadForm`), `getLocalizedField` (`@/lib/i18n-content`), `Link` (`@/i18n/navigation`).

- [ ] **Step 1: Replace `src/app/[locale]/page.tsx`**

```tsx
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  featuredProjectQuery,
  featuredTestimonialsQuery,
} from "@/sanity/queries";
import { site, waLink } from "@/lib/config";
import { LeadForm } from "@/components/LeadForm";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

// Re-fetch content periodically so CMS edits show up without a redeploy.
export const revalidate = 60;

type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type FeaturedProject = {
  name: string;
  slug: { current: string };
  developer?: string;
  location?: string;
  rera?: string;
  coverImage?: any;
  summary?: LocalizedValue<string>;
  configurations?: Config[];
  amenities?: string[];
} | null;

type Testimonial = {
  _id: string;
  quote: LocalizedValue<string>;
  author: string;
  role?: LocalizedValue<string>;
  rating?: number;
};

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;

  const [project, testimonials, tHero, tServices, tFeatured, tTestimonials, tAreas, tLeadForm] =
    await Promise.all([
      client.fetch<FeaturedProject>(featuredProjectQuery),
      client.fetch<Testimonial[]>(featuredTestimonialsQuery),
      getTranslations({ locale, namespace: "hero" }),
      getTranslations({ locale, namespace: "services" }),
      getTranslations({ locale, namespace: "featuredProject" }),
      getTranslations({ locale, namespace: "testimonials" }),
      getTranslations({ locale, namespace: "areas" }),
      getTranslations({ locale, namespace: "leadForm" }),
    ]);

  const services = [
    { title: tServices("resaleTitle"), body: tServices("resaleBody") },
    { title: tServices("rentalsTitle"), body: tServices("rentalsBody") },
    { title: tServices("newProjectTitle"), body: tServices("newProjectBody") },
    { title: tServices("redevelopmentTitle"), body: tServices("redevelopmentBody") },
    { title: tServices("shopsTitle"), body: tServices("shopsBody") },
    { title: tServices("interiorsTitle"), body: tServices("interiorsBody") },
  ];

  const areas = [
    { name: "Borivali", body: tAreas("borivaliBody") },
    { name: "Kandivali", body: tAreas("kandivaliBody") },
    { name: "Malad", body: tAreas("maladBody") },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <div className="wrap grid items-center gap-10 py-24 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="eyebrow text-brass-bright">
              {site.areas.join(" · ")}
            </div>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl md:text-6xl">
              {tHero("headingPart1")}
              <em className="italic text-brass-bright">{tHero("headingEm")}</em>
            </h1>
            <p className="mt-6 max-w-[30em] text-lg text-paper/80">{tHero("body")}</p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="#enquire" className="btn btn-brass">{tHero("ctaBook")}</a>
              <a
                href={waLink(tHero("whatsappMessage"))}
                target="_blank"
                rel="noopener"
                className="btn btn-outline border-paper/40 text-paper"
              >
                {tHero("ctaWhatsapp")}
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { n: "25+", l: tHero("statYears") },
                { n: "3", l: tHero("statSuburbs") },
                { n: "4.8★", l: tHero("statRating") },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-semibold text-white">{s.n}</div>
                  <div className="text-sm text-paper/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {project?.coverImage && (
            <div className="relative overflow-hidden rounded-2xl border border-brass/35 shadow-2xl">
              <Image
                src={urlFor(project.coverImage).width(800).height(1050).url()}
                alt={project.coverImage?.alt || project.name}
                width={800}
                height={1050}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-brass/40 bg-brand-indigo-deep/75 p-4 backdrop-blur">
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-brass-bright">
                  {tHero("featuredBadge")}
                </div>
                <div className="mt-0.5 font-display text-xl text-white">{project.name}</div>
                <div className="text-sm text-paper/70">{project.location}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24">
        <div className="wrap">
          <div className="mb-13 max-w-2xl">
            <div className="eyebrow">{tServices("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {tServices("heading")}
            </h2>
          </div>
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
        </div>
      </section>

      {/* FEATURED PROJECT */}
      {project && (
        <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
          <div className="wrap grid items-center gap-14 py-24 md:grid-cols-[0.82fr_1.18fr]">
            {project.coverImage && (
              <div className="relative overflow-hidden rounded-2xl border border-brass/30 shadow-2xl">
                <Image
                  src={urlFor(project.coverImage).width(760).height(1000).url()}
                  alt={project.coverImage?.alt || project.name}
                  width={760}
                  height={1000}
                  className="aspect-[3/4] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-brass px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-brand-indigo-deep">
                  {tFeatured("nowBooking")}
                </span>
              </div>
            )}
            <div>
              <div className="eyebrow">{tFeatured("eyebrow")}</div>
              <h2 className="mb-1.5 mt-4 text-4xl md:text-5xl">{project.name}</h2>
              <p className="mb-4 text-paper/70">{project.location}</p>
              {project.summary && (
                <p className="mb-6 max-w-[38em] text-paper/80">
                  {getLocalizedField(project.summary, locale)}
                </p>
              )}

              {project.configurations && project.configurations.length > 0 && (
                <div className="mb-7 grid gap-3 sm:grid-cols-2">
                  {project.configurations.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-brass/20 bg-white/5 p-4 transition hover:border-brass hover:bg-brass/5"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-brass-bright">
                        {c.type}
                      </div>
                      <div className="my-1.5 font-display text-lg text-white">
                        {c.displayPrice}
                      </div>
                      <div className="text-sm text-paper/80">
                        {getLocalizedField(c.note, locale)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {project.amenities && project.amenities.length > 0 && (
                <div className="mb-7 flex flex-wrap gap-2">
                  {project.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-paper/80"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3.5">
                <a
                  href={waLink(
                    `${tFeatured("whatsappPrefix")} ${project.name}. ${tFeatured("whatsappSuffix")}`
                  )}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-brass"
                >
                  {tFeatured("ctaPrice")}
                </a>
                <Link
                  href={`/projects/${project.slug.current}`}
                  className="btn btn-outline border-paper/40 text-paper"
                >
                  {tFeatured("ctaView")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-paper-alt py-24">
          <div className="wrap">
            <div className="eyebrow">{tTestimonials("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {tTestimonials("heading")}
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure key={testimonial._id} className="rounded-2xl bg-white p-8 shadow-sm">
                  <div className="mb-3 text-brass">{"★".repeat(testimonial.rating || 5)}</div>
                  <blockquote className="font-display text-lg text-brand-indigo">
                    “{getLocalizedField(testimonial.quote, locale)}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-muted">
                    <span className="block font-semibold text-ink">{testimonial.author}</span>
                    {getLocalizedField(testimonial.role, locale)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AREAS */}
      <section className="py-24">
        <div className="wrap">
          <div className="eyebrow">{tAreas("eyebrow")}</div>
          <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
            {tAreas("heading")}
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {areas.map((a) => (
              <div key={a.name} className="rounded-2xl border border-brand-indigo/10 bg-white p-8">
                <h3 className="text-xl text-brand-indigo">{a.name}</h3>
                <p className="mt-2 text-sm text-muted">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="enquire" className="bg-brand-indigo-deep text-paper">
        <div className="wrap grid items-center gap-14 py-24 md:grid-cols-2">
          <div>
            <div className="eyebrow text-brass-bright">{tLeadForm("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl md:text-4xl">
              {tLeadForm("headingPart1")}
              <em className="italic text-brass-bright">{tLeadForm("headingEm")}</em>
            </h2>
            <p className="mt-4 text-paper/75">{tLeadForm("body")}</p>
            <div className="mt-6 space-y-3 text-sm">
              <p>
                <a href={`tel:${site.phonePrimary}`} className="font-medium text-white">{site.phonePrimary}</a>{" "}
                ·{" "}
                <a href={`tel:${site.phoneSecondary}`} className="font-medium text-white">{site.phoneSecondary}</a>
              </p>
              <p><a href={`mailto:${site.email}`} className="text-white">{site.email}</a></p>
              <p className="text-paper/70">{site.address}</p>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Replace `src/components/LeadForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { waLink } from "@/lib/config";

export function LeadForm() {
  const t = useTranslations("leadForm");
  const intents = [
    t("intentBuy"),
    t("intentSell"),
    t("intentRent"),
    t("intentNewProject"),
    t("intentRedevelopment"),
  ];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState(intents[0]);
  const [area, setArea] = useState("");

  function handleSubmit() {
    const message =
      `${t("whatsappGreeting")}\n` +
      `${t("whatsappNameLabel")}: ${name || "-"}\n` +
      `${t("whatsappIntentLabel")}: ${intent}\n` +
      `${t("whatsappAreaLabel")}: ${area || "-"}\n` +
      `${t("whatsappPhoneLabel")}: ${phone || "-"}`;
    window.open(waLink(message), "_blank", "noopener");
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-paper/40 outline-none focus:border-brass";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
      <div className="space-y-3.5">
        <input
          className={field}
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={field}
          placeholder={t("phonePlaceholder")}
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className={field}
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
        >
          {intents.map((i) => (
            <option key={i} value={i} className="bg-brand-indigo-deep">
              {i}
            </option>
          ))}
        </select>
        <input
          className={field}
          placeholder={t("areaPlaceholder")}
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <button onClick={handleSubmit} className="btn btn-brass w-full justify-center">
          {t("submit")}
        </button>
        <p className="text-center text-xs text-paper/50">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors from `src/app/[locale]/page.tsx` or `src/components/LeadForm.tsx`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/page.tsx" src/components/LeadForm.tsx
git commit -m "Localize homepage and lead form"
```

---

### Task 14: Localize the projects pages

**Files:**
- Modify: `src/app/[locale]/projects/page.tsx`
- Modify: `src/app/[locale]/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getTranslations` (`next-intl/server`), `getLocalizedField`, `Link` (`@/i18n/navigation`).

- [ ] **Step 1: Replace `src/app/[locale]/projects/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { projectsQuery } from "@/sanity/queries";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects — New launches & bookings",
  description:
    "Explore new and upcoming residential projects across Borivali, Kandivali and Malad, booking through Shree Giriraj Real Estate.",
};

type Project = {
  _id: string;
  name: string;
  slug: { current: string };
  developer?: string;
  status?: string;
  location?: string;
  area?: string;
  featured?: boolean;
  coverImage?: any;
  summary?: LocalizedValue<string>;
};

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const [projects, t] = await Promise.all([
    client.fetch<Project[]>(projectsQuery),
    getTranslations({ locale, namespace: "projectsPage" }),
  ]);

  const statusLabel: Record<string, string> = {
    booking: t("statusBooking"),
    upcoming: t("statusUpcoming"),
    sold: t("statusSold"),
  };

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <div className="eyebrow text-brass-bright">{t("eyebrow")}</div>
          <h1 className="mt-3.5 text-4xl md:text-5xl">{t("heading")}</h1>
          <p className="mt-4 max-w-[40em] text-paper/75">{t("body")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          {(!projects || projects.length === 0) && (
            <p className="text-muted">
              {t("emptyState")}
              <Link href="/studio" className="text-brand-blue underline">
                {t("studioLink")}
              </Link>
              .
            </p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project.slug.current}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                {project.coverImage && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={urlFor(project.coverImage).width(700).height(525).url()}
                      alt={project.coverImage?.alt || project.name}
                      width={700}
                      height={525}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {project.status && (
                      <span className="absolute left-3 top-3 rounded-full bg-brass px-3 py-1 text-[0.66rem] font-bold uppercase tracking-wider text-brand-indigo-deep">
                        {statusLabel[project.status] || project.status}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl text-brand-indigo">{project.name}</h2>
                  {project.location && (
                    <p className="mt-1 text-sm text-muted">{project.location}</p>
                  )}
                  {project.summary && (
                    <p className="mt-3 flex-1 text-sm text-muted line-clamp-3">
                      {getLocalizedField(project.summary, locale)}
                    </p>
                  )}
                  <span className="mt-4 text-sm font-semibold text-brand-blue">
                    {t("viewDetails")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Replace `src/app/[locale]/projects/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { waLink } from "@/lib/config";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

export const revalidate = 60;

type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type Project = {
  name: string;
  developer?: string;
  status?: string;
  location?: string;
  rera?: string;
  coverImage?: any;
  gallery?: any[];
  summary?: LocalizedValue<string>;
  configurations?: Config[];
  amenities?: string[];
  body?: LocalizedValue<any>;
};

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(projectSlugsQuery);
    return (slugs || []).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const project = await client.fetch<Project>(projectBySlugQuery, {
    slug: params.slug,
  });
  if (!project) return {};
  return {
    title: project.name,
    description: getLocalizedField(project.summary, params.locale as Locale),
    openGraph: project.coverImage
      ? { images: [urlFor(project.coverImage).width(1200).height(630).url()] }
      : undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  const [project, t] = await Promise.all([
    client.fetch<Project>(projectBySlugQuery, { slug: params.slug }),
    getTranslations({ locale, namespace: "projectDetail" }),
  ]);
  if (!project) notFound();

  return (
    <>
      <section className="bg-brand-indigo-deep py-16 text-paper">
        <div className="wrap grid items-center gap-12 md:grid-cols-[1fr_0.9fr]">
          <div>
            <Link href="/projects" className="text-sm text-paper/60 hover:text-white">
              {t("backLink")}
            </Link>
            <h1 className="mt-5 text-4xl md:text-5xl">{project.name}</h1>
            {project.location && (
              <p className="mt-2 text-paper/70">{project.location}</p>
            )}
            {project.developer && (
              <p className="mt-1 text-sm text-paper/60">
                {t("developerLabel")}{project.developer}
              </p>
            )}
            {project.summary && (
              <p className="mt-5 max-w-[40em] text-paper/80">
                {getLocalizedField(project.summary, locale)}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3.5">
              <a
                href={waLink(t("whatsappSiteVisit", { name: project.name }))}
                target="_blank"
                rel="noopener"
                className="btn btn-brass"
              >
                {t("ctaPrice")}
              </a>
            </div>
            {project.rera && (
              <p className="mt-6 text-xs text-paper/50">
                {t("reraLabel")}{project.rera}
              </p>
            )}
          </div>

          {project.coverImage && (
            <div className="overflow-hidden rounded-2xl border border-brass/30 shadow-2xl">
              <Image
                src={urlFor(project.coverImage).width(760).height(950).url()}
                alt={project.coverImage?.alt || project.name}
                width={760}
                height={950}
                className="aspect-[4/5] w-full object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Configurations */}
      {project.configurations && project.configurations.length > 0 && (
        <section className="py-16">
          <div className="wrap">
            <div className="eyebrow">{t("configEyebrow")}</div>
            <h2 className="mt-3 text-3xl text-brand-indigo">
              {t("configHeading", { name: project.name })}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.configurations.map((c, i) => (
                <div key={i} className="rounded-2xl border border-brand-indigo/10 bg-white p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brass">
                    {c.type}
                  </div>
                  <div className="my-2 font-display text-2xl text-brand-indigo">
                    {c.displayPrice}
                  </div>
                  <div className="text-sm text-muted">{getLocalizedField(c.note, locale)}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">
              {t("priceSheetNote")}
              <a
                href={waLink(t("whatsappPriceSheet", { name: project.name }))}
                target="_blank"
                rel="noopener"
                className="font-medium text-brand-blue underline"
              >
                {t("priceSheetLink")}
              </a>
              .
            </p>
          </div>
        </section>
      )}

      {/* Amenities */}
      {project.amenities && project.amenities.length > 0 && (
        <section className="bg-paper-alt py-16">
          <div className="wrap">
            <div className="eyebrow">{t("amenitiesEyebrow")}</div>
            <h2 className="mt-3 text-3xl text-brand-indigo">
              {t("amenitiesHeading", { name: project.name })}
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {project.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-brand-indigo/15 bg-white px-4 py-2 text-sm text-brand-indigo"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      {project.body && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <PortableTextBody value={getLocalizedField(project.body, locale)} />
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="pb-20">
          <div className="wrap">
            <div className="eyebrow">{t("galleryEyebrow")}</div>
            <h2 className="mt-3 mb-8 text-3xl text-brand-indigo">{t("galleryHeading")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((img, i) => (
                <Image
                  key={i}
                  src={urlFor(img).width(600).height(450).url()}
                  alt={img?.alt || `${project.name} photo ${i + 1}`}
                  width={600}
                  height={450}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors from either file.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/projects"
git commit -m "Localize projects listing and detail pages"
```

---

### Task 15: Localize the blog pages

**Files:**
- Modify: `src/app/[locale]/blog/page.tsx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getTranslations` (`next-intl/server`), `getLocalizedField`, `Link` (`@/i18n/navigation`).

- [ ] **Step 1: Replace `src/app/[locale]/blog/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { postsQuery } from "@/sanity/queries";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Property insights for the western suburbs",
  description:
    "Guides, market notes and buying tips for Borivali, Kandivali and Malad from Shree Giriraj Real Estate.",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: LocalizedValue<string>;
  mainImage?: any;
  publishedAt: string;
  author?: string;
  categories?: string[];
};

function formatDate(d: string, locale: string) {
  return new Date(d).toLocaleDateString(locale === "en" ? "en-IN" : locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const [posts, t] = await Promise.all([
    client.fetch<Post[]>(postsQuery),
    getTranslations({ locale, namespace: "blogPage" }),
  ]);

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <div className="eyebrow text-brass-bright">{t("eyebrow")}</div>
          <h1 className="mt-3.5 text-4xl md:text-5xl">{t("heading")}</h1>
          <p className="mt-4 max-w-[40em] text-paper/75">{t("body")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          {(!posts || posts.length === 0) && (
            <p className="text-muted">
              {t("emptyState")}
              <Link href="/studio" className="text-brand-blue underline">
                {t("studioLink")}
              </Link>
              .
            </p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                {post.mainImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={urlFor(post.mainImage).width(700).height(440).url()}
                      alt={post.mainImage?.alt || post.title}
                      width={700}
                      height={440}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  {post.categories && post.categories.length > 0 && (
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brass">
                      {post.categories[0]}
                    </div>
                  )}
                  <h2 className="text-xl text-brand-indigo">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm text-muted">
                      {getLocalizedField(post.excerpt, locale)}
                    </p>
                  )}
                  <div className="mt-4 text-xs text-muted">
                    {post.author ? `${post.author} · ` : ""}
                    {formatDate(post.publishedAt, locale)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Replace `src/app/[locale]/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

export const revalidate = 60;

type Post = {
  title: string;
  excerpt?: LocalizedValue<string>;
  mainImage?: any;
  publishedAt: string;
  body?: LocalizedValue<any>;
  author?: { name: string; image?: any; bio?: string };
  categories?: string[];
};

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery);
    return (slugs || []).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await client.fetch<Post>(postBySlugQuery, { slug: params.slug });
  if (!post) return {};
  return {
    title: post.title,
    description: getLocalizedField(post.excerpt, params.locale as Locale),
    openGraph: post.mainImage
      ? { images: [urlFor(post.mainImage).width(1200).height(630).url()] }
      : undefined,
  };
}

function formatDate(d: string, locale: string) {
  return new Date(d).toLocaleDateString(locale === "en" ? "en-IN" : locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  const [post, t] = await Promise.all([
    client.fetch<Post>(postBySlugQuery, { slug: params.slug }),
    getTranslations({ locale, namespace: "blogPost" }),
  ]);
  if (!post) notFound();

  return (
    <article className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/blog" className="text-sm text-brand-blue hover:underline">
          {t("backLink")}
        </Link>

        {post.categories && post.categories.length > 0 && (
          <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-brass">
            {post.categories.join(" · ")}
          </div>
        )}
        <h1 className="mt-3 text-4xl text-brand-indigo md:text-5xl">{post.title}</h1>
        <div className="mt-4 text-sm text-muted">
          {post.author?.name ? `${post.author.name} · ` : ""}
          {formatDate(post.publishedAt, locale)}
        </div>

        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(1000).height(560).url()}
            alt={post.mainImage?.alt || post.title}
            width={1000}
            height={560}
            className="mt-8 w-full rounded-2xl object-cover"
            priority
          />
        )}

        <div className="mt-8">
          <PortableTextBody value={getLocalizedField(post.body, locale)} />
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors from either file.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/blog"
git commit -m "Localize blog listing and post pages"
```

---

### Task 16: Localize the generic `[slug]` page

**Files:**
- Modify: `src/app/[locale]/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getLocalizedField`.

- [ ] **Step 1: Replace `src/app/[locale]/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { pageBySlugQuery, pageSlugsQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

export const revalidate = 60;

type Page = {
  title: string;
  heroHeading?: LocalizedValue<string>;
  heroSubheading?: LocalizedValue<string>;
  body?: LocalizedValue<any>;
  seoDescription?: string;
};

// Reserved top-level routes that must NOT be handled by this catch-all.
// "studio" no longer needs to be listed here: it now lives outside the
// [locale] segment entirely (see src/app/studio/layout.tsx), so a request
// for /studio never reaches this route in the first place.
const RESERVED = new Set(["blog", "projects"]);

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(pageSlugsQuery);
    return (slugs || [])
      .filter((slug) => !RESERVED.has(slug))
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: params.slug });
  if (!page) return {};
  return {
    title: page.title,
    description: page.seoDescription,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (RESERVED.has(params.slug)) notFound();

  const locale = params.locale as Locale;
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: params.slug });
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

- [ ] **Step 2: Typecheck the whole project — this should now be fully clean**

Run: `npx tsc --noEmit`
Expected: PASS, no errors anywhere in the project.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: all tests pass (middleware, message catalogs, `getLocalizedField`, localized field builders, `LanguageToggle`).

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/[slug]"
git commit -m "Localize generic CMS pages, drop studio from RESERVED slugs"
```

---

### Task 17: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 2: Full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable if any pre-existed).

- [ ] **Step 4: Manual smoke test — deferred, documented for later**

`npm run dev` cannot serve real pages yet because `.env.local` doesn't exist (no Sanity project has been created — see Global Constraints). Once a Sanity project is created and `.env.local` is filled in (a step in the project's `README.md`, done during deployment setup), manually verify before considering this plan fully done:

1. `npm run dev`, visit `http://localhost:3000/` — loads in English, no `/en` in the URL.
2. Change the browser's language preference to Hindi (or clear cookies and set `Accept-Language: hi`), reload `/` — redirects to `/hi`.
3. Click "मराठी" in the nav language toggle — URL becomes `/mr/...`, all static copy (nav, hero, services, footer) switches to Marathi.
4. Visit `/hi/projects`, `/hi/blog`, `/hi/about` (after adding an `about` Page in Studio) — confirm each renders without `[object Object]` anywhere, and CMS text falls back to English where Hindi hasn't been entered yet.
5. Visit `/studio` — confirm it still loads and is NOT wrapped in the site's Nav/Footer/WhatsApp button.
6. In Studio, open a Project and confirm the Summary/Full description fields now show English/Hindi/Marathi tabs, and the Testimonial's Quote/Role fields do the same.

- [ ] **Step 5: Confirm plan completion**

All 17 tasks committed. The homepage-revamp plan can now begin — it depends on `getLocalizedField`, the `[locale]` routing structure, the `order` field on `project`, and the `localizedStringField`/`localizedTextField`/`localizedBlockContentField` builders all being in place, which they now are.
