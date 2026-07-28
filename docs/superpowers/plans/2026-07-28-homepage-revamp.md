# Homepage Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-project homepage showcase with a 3-project grid, replace the fixed testimonial grid with an auto-rotating carousel, add a real FAQ section, and add a sticky mobile Call/WhatsApp bar — closing the trust/conversion gaps identified in the original design review.

**Architecture:** Two new Sanity schemas (`faq`, `teamMember`) reusing the existing `localizedStringField`/`localizedTextField` builders; a new pure-function helper for picking the cheapest unit configuration to display on a project card; two new components (`TestimonialCarousel` — client, for the rotation state; `FAQSection` — server, using native `<details>/<summary>` so no client JS is needed for the accordion); a `StickyMobileCTA` component that needs no JS at all (pure Tailwind responsive visibility). The homepage (`src/app/[locale]/page.tsx`) is restructured to wire all of this in, and `messages/*.json` gains the new UI-chrome strings across all four languages.

**Tech Stack:** Next.js 14 (App Router), Sanity CMS, next-intl, Tailwind CSS, Vitest + React Testing Library.

**Source spec:** `docs/superpowers/specs/2026-07-22-localization-and-homepage-revamp-design.md`, sections "2. Content model additions" and "3. Homepage restructure". Section 1 (localization) is already fully implemented and is not part of this plan.

## Global Constraints

- Project root: `C:\Shree Giriraj Real Estate`. Work directly on git branch `i18n-foundation` — do not create a new branch.
- Next.js is pinned to `^14.2.35` — `params` props are plain synchronous objects (`{ params }: { params: { locale: string } }`), never `Promise`-wrapped.
- `.env.local` now exists and points at a real Sanity project (`rt0067kr`) — the dev server (`npm run dev`, port 3000) can be used for live verification in this plan, unlike the earlier i18n plan. `npx tsc --noEmit` remains the primary fast-feedback typecheck; `npm run build` is still not required for any task here.
- Locale set is `["en", "hi", "mr", "gu"]`. Every new localized Sanity field must use `localizedStringField`/`localizedTextField`/`localizedBlockContentField` from `src/sanity/schemas/lib/localizedFields.ts` — these already emit `en`/`hi`/`mr`/`gu` subfields, do not hand-roll new field objects.
- Every localized CMS field is read through `getLocalizedField(field, locale)` from `src/lib/i18n-content.ts` — never destructure `.en`/`.hi`/`.mr`/`.gu` directly.
- All internal navigation uses `Link` from `@/i18n/navigation`, never `next/link`.
- `messages/messages.test.ts` enforces identical keys across `en.json`, `hi.json`, `mr.json`, `gu.json` — every new UI string added to `en.json` must be added to all three other files in the same task, with real (not placeholder) translations.
- Seed content (placeholder projects/testimonials, real FAQs) is created via the Sanity MCP tools (`create_documents` then `publish_documents`), the same mechanism already used to seed the real Jaswanti Jewel project earlier — not a custom script, since this project has no write-capable `SANITY_API_TOKEN` configured locally.
- Placeholder content is named obviously and consistently: project names end in `— Replace Me`, testimonial authors are `Placeholder Client — <Area>`. Never let placeholder content read as real.

---

### Task 1: `getLowestPriceConfig` helper

**Files:**
- Create: `src/lib/project-helpers.ts`
- Create: `src/lib/project-helpers.test.ts`

**Interfaces:**
- Produces: `getLowestPriceConfig(configurations: Config[] | undefined): Config | undefined` where `Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> }` (matches the existing `Config` type shape already used in `src/app/[locale]/page.tsx` and `src/app/[locale]/projects/[slug]/page.tsx`) — consumed by Task 5's project grid cards to show the cheapest configuration's price on each card.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/project-helpers.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getLowestPriceConfig } from "./project-helpers";

describe("getLowestPriceConfig", () => {
  it("returns the configuration with the lowest leading price figure", () => {
    const configs = [
      { type: "3 BHK", displayPrice: "From ₹4.** Cr" },
      { type: "2 BHK · lower floor", displayPrice: "From ₹2.** Cr" },
      { type: "2 BHK · higher floor", displayPrice: "From ₹3.** Cr" },
    ];
    expect(getLowestPriceConfig(configs)?.type).toBe("2 BHK · lower floor");
  });

  it("returns undefined for an empty array", () => {
    expect(getLowestPriceConfig([])).toBeUndefined();
  });

  it("returns undefined for undefined input", () => {
    expect(getLowestPriceConfig(undefined)).toBeUndefined();
  });

  it("falls back to the first configuration when no price can be parsed", () => {
    const configs = [
      { type: "Studio", displayPrice: "Price on request" },
      { type: "Penthouse", displayPrice: "Price on request" },
    ];
    expect(getLowestPriceConfig(configs)?.type).toBe("Studio");
  });

  it("handles a single configuration", () => {
    const configs = [{ type: "2 BHK", displayPrice: "From ₹2.** Cr" }];
    expect(getLowestPriceConfig(configs)?.type).toBe("2 BHK");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/lib/project-helpers.test.ts`
Expected: FAIL — `Cannot find module './project-helpers'`.

- [ ] **Step 3: Implement `src/lib/project-helpers.ts`**

```ts
import type { LocalizedValue } from "./i18n-content";

type Config = {
  type?: string;
  displayPrice?: string;
  note?: LocalizedValue<string>;
};

/**
 * Masked prices always follow the "₹<digit>.** Cr" pattern (e.g. "From ₹2.** Cr").
 * Parses the leading digit to pick the cheapest configuration for a project card.
 * Falls back to the first configuration if no price can be parsed.
 */
export function getLowestPriceConfig(
  configurations: Config[] | undefined
): Config | undefined {
  if (!configurations || configurations.length === 0) return undefined;

  let lowest: Config | undefined;
  let lowestValue = Infinity;

  for (const config of configurations) {
    const match = config.displayPrice?.match(/₹\s*([\d.]+)/);
    if (!match) continue;
    const value = parseFloat(match[1]);
    if (!Number.isNaN(value) && value < lowestValue) {
      lowestValue = value;
      lowest = config;
    }
  }

  return lowest ?? configurations[0];
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/lib/project-helpers.test.ts`
Expected: `5 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/project-helpers.ts src/lib/project-helpers.test.ts
git commit -m "Add getLowestPriceConfig helper for project grid cards"
```

---

### Task 2: `faq` schema and query

**Files:**
- Create: `src/sanity/schemas/faq.ts`
- Modify: `src/sanity/schema.ts`
- Modify: `src/sanity/queries.ts`

**Interfaces:**
- Consumes: `localizedStringField`, `localizedTextField` from `@/sanity/schemas/lib/localizedFields`.
- Produces: `faqsQuery` (GROQ export from `src/sanity/queries.ts`) returning `{ _id, question: LocalizedValue<string>, answer: LocalizedValue<string>, category }[]` ordered by `order` ascending — consumed by Task 3's `FAQSection`.

- [ ] **Step 1: Create `src/sanity/schemas/faq.ts`**

```ts
import { defineType, defineField } from "sanity";
import { localizedStringField, localizedTextField } from "./lib/localizedFields";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    localizedStringField("question", "Question"),
    localizedTextField("answer", "Answer", 4),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Resale & Buying", value: "resale" },
          { title: "Redevelopment", value: "redevelopment" },
          { title: "Pricing", value: "pricing" },
          { title: "General", value: "general" },
        ],
        layout: "radio",
      },
      initialValue: "general",
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
    select: { title: "question.en", subtitle: "category" },
  },
});
```

- [ ] **Step 2: Register the schema in `src/sanity/schema.ts`**

Replace the full contents of `src/sanity/schema.ts`:
```ts
import { type SchemaTypeDefinition } from "sanity";

import blockContent from "./schemas/blockContent";
import category from "./schemas/category";
import post from "./schemas/post";
import project from "./schemas/project";
import testimonial from "./schemas/testimonial";
import page from "./schemas/page";
import author from "./schemas/author";
import faq from "./schemas/faq";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    post,
    project,
    testimonial,
    page,
    author,
    category,
    faq,
    // Objects
    blockContent,
  ],
};
```

- [ ] **Step 3: Add `faqsQuery` to `src/sanity/queries.ts`**

Add at the end of the file:
```ts

// ---------- FAQs ----------
export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id, question, answer, category
  }
`;
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemas/faq.ts src/sanity/schema.ts src/sanity/queries.ts
git commit -m "Add faq schema and faqsQuery"
```

---

### Task 3: FAQ section on the homepage, with real seeded content

**Files:**
- Create: `src/components/FAQSection.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json`

**Interfaces:**
- Consumes: `faqsQuery` (Task 2), `getLocalizedField`/`Locale`/`LocalizedValue` from `@/lib/i18n-content`.
- Produces: `FAQSection` component, default-exported as a named export `FAQSection`, props `{ faqs: Faq[]; locale: Locale; eyebrow: string; heading: string }` where `Faq = { _id: string; question: LocalizedValue<string>; answer: LocalizedValue<string>; category?: string }` — consumed directly in `page.tsx`.

- [ ] **Step 1: Add the `faq` namespace to all four message catalogs**

In `messages/en.json`, add a new top-level key (after `"areas"`, before `"leadForm"` — keep it adjacent to `"areas"` since that's where the section sits in the page):
```json
  "faq": {
    "eyebrow": "Common questions",
    "heading": "Answered before you have to ask"
  },
```

In `messages/hi.json`, same position:
```json
  "faq": {
    "eyebrow": "सामान्य सवाल",
    "heading": "पूछने से पहले ही जवाब"
  },
```

In `messages/mr.json`, same position:
```json
  "faq": {
    "eyebrow": "सामान्य प्रश्न",
    "heading": "विचारण्यापूर्वीच उत्तर"
  },
```

In `messages/gu.json`, same position:
```json
  "faq": {
    "eyebrow": "સામાન્ય પ્રશ્નો",
    "heading": "પૂછતા પહેલા જ જવાબ"
  },
```

- [ ] **Step 2: Run the key-parity test to verify it still passes**

Run: `npm test -- messages/messages.test.ts`
Expected: `2 passed`.

- [ ] **Step 3: Create `src/components/FAQSection.tsx`**

```tsx
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

type Faq = {
  _id: string;
  question: LocalizedValue<string>;
  answer: LocalizedValue<string>;
  category?: string;
};

export function FAQSection({
  faqs,
  locale,
  eyebrow,
  heading,
}: {
  faqs: Faq[];
  locale: Locale;
  eyebrow: string;
  heading: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24">
      <div className="wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">{heading}</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq._id}
              className="group rounded-2xl border border-brand-indigo/10 bg-white p-6 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none text-lg font-medium text-brand-indigo marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {getLocalizedField(faq.question, locale)}
                  <span className="shrink-0 text-brass transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted">
                {getLocalizedField(faq.answer, locale)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire `FAQSection` into `src/app/[locale]/page.tsx`**

In `src/app/[locale]/page.tsx`, add the import:
```ts
import { FAQSection } from "@/components/FAQSection";
import { faqsQuery } from "@/sanity/queries";
```
(merge `faqsQuery` into the existing `@/sanity/queries` import line rather than duplicating it)

Add a `Faq` type next to the existing `Testimonial` type:
```ts
type Faq = {
  _id: string;
  question: LocalizedValue<string>;
  answer: LocalizedValue<string>;
  category?: string;
};
```

Add `faqs` and `tFaq` to the `Promise.all` destructuring and array (both the client fetch and the translations fetch):
```ts
  const [project, testimonials, faqs, tHero, tServices, tFeatured, tTestimonials, tAreas, tFaq, tLeadForm] =
    await Promise.all([
      client.fetch<FeaturedProject>(featuredProjectQuery),
      client.fetch<Testimonial[]>(featuredTestimonialsQuery),
      client.fetch<Faq[]>(faqsQuery),
      getTranslations({ locale, namespace: "hero" }),
      getTranslations({ locale, namespace: "services" }),
      getTranslations({ locale, namespace: "featuredProject" }),
      getTranslations({ locale, namespace: "testimonials" }),
      getTranslations({ locale, namespace: "areas" }),
      getTranslations({ locale, namespace: "faq" }),
      getTranslations({ locale, namespace: "leadForm" }),
    ]);
```

Insert the FAQ section between the AREAS section and the LEAD FORM section (right after the AREAS `</section>` closing tag, before the `{/* LEAD FORM */}` comment):
```tsx
      {/* FAQ */}
      <FAQSection
        faqs={faqs}
        locale={locale}
        eyebrow={tFaq("eyebrow")}
        heading={tFaq("heading")}
      />

```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Seed the 6 real FAQ documents via the Sanity MCP tools**

Use `create_documents` (resource `{ projectId: "rt0067kr", dataset: "production" }`) to create 6 `faq` documents, then `publish_documents` with the returned draft IDs to make them live. Use these exact contents (order 0-5, category as shown):

1. category `"resale"`, order `0`:
   - question: `{ en: "What documents do I need to buy a resale flat?", hi: "रीसेल फ्लैट खरीदने के लिए मुझे कौन से दस्तावेज़ चाहिए?", mr: "रीसेल फ्लॅट खरेदी करण्यासाठी मला कोणती कागदपत्रे लागतील?", gu: "રીસેલ ફ્લેટ ખરીદવા માટે મારે કયા દસ્તાવેજોની જરૂર છે?" }`
   - answer: `{ en: "You'll need the seller's original title deed and chain of past sale agreements, the society's share certificate and No Objection Certificate (NOC), the latest property tax and maintenance receipts, and an encumbrance certificate confirming the flat is free of loans or legal disputes. We verify all of this before you pay any token amount.", hi: "आपको विक्रेता का मूल टाइटल डीड और पिछले सेल एग्रीमेंट की चेन, सोसाइटी का शेयर सर्टिफिकेट और नो ऑब्जेक्शन सर्टिफिकेट (NOC), नवीनतम प्रॉपर्टी टैक्स और मेंटेनेंस रसीदें, और यह पुष्टि करने वाला एनकम्ब्रेंस सर्टिफिकेट चाहिए कि फ्लैट किसी लोन या कानूनी विवाद से मुक्त है। हम टोकन राशि देने से पहले यह सब सत्यापित करते हैं।", mr: "तुम्हाला विक्रेत्याचे मूळ टायटल डीड आणि मागील विक्री कराराची साखळी, सोसायटीचे शेअर सर्टिफिकेट आणि नो ऑब्जेक्शन सर्टिफिकेट (NOC), नवीनतम मालमत्ता कर आणि देखभाल पावत्या, आणि फ्लॅट कोणत्याही कर्ज किंवा कायदेशीर वादापासून मुक्त असल्याची पुष्टी करणारे एन्कम्ब्रन्स सर्टिफिकेट लागेल. आम्ही टोकन रक्कम देण्यापूर्वी हे सर्व पडताळतो.", gu: "તમારે વેચનારનું મૂળ ટાઇટલ ડીડ અને અગાઉના વેચાણ કરારની ચેઇન, સોસાયટીનું શેર સર્ટિફિકેટ અને નો ઓબ્જેક્શન સર્ટિફિકેટ (NOC), તાજેતરની પ્રોપર્ટી ટેક્સ અને મેન્ટેનન્સ રસીદો, અને ફ્લેટ કોઈપણ લોન અથવા કાનૂની વિવાદથી મુક્ત હોવાની પુષ્ટિ કરતું એન્કમ્બ્રન્સ સર્ટિફિકેટ જોઈશે. અમે ટોકન રકમ ચૂકવતા પહેલા આ બધું ચકાસીએ છીએ." }`

2. category `"resale"`, order `1`:
   - question: `{ en: "How much is stamp duty and registration on a resale flat in Mumbai?", hi: "मुंबई में रीसेल फ्लैट पर स्टैंप ड्यूटी और रजिस्ट्रेशन कितना लगता है?", mr: "मुंबईत रीसेल फ्लॅटवर स्टॅम्प ड्युटी आणि नोंदणी किती लागते?", gu: "મુંબઈમાં રીસેલ ફ્લેટ પર સ્ટેમ્પ ડ્યુટી અને નોંધણી કેટલી લાગે છે?" }`
   - answer: `{ en: "Stamp duty in Mumbai is typically 5-6% of the agreement value, plus registration charges of 1% (capped at ₹30,000). We calculate the exact figure for your specific flat before you commit.", hi: "मुंबई में स्टैंप ड्यूटी आमतौर पर एग्रीमेंट वैल्यू का 5-6% होती है, साथ ही 1% रजिस्ट्रेशन चार्ज (अधिकतम ₹30,000)। हम आपके फ्लैट के लिए सटीक आंकड़ा प्रतिबद्ध होने से पहले ही निकाल देते हैं।", mr: "मुंबईत स्टॅम्प ड्युटी साधारणपणे कराराच्या किमतीच्या 5-6% असते, तसेच 1% नोंदणी शुल्क (कमाल ₹30,000). तुम्ही वचनबद्ध होण्यापूर्वी आम्ही तुमच्या फ्लॅटसाठी अचूक आकडा काढून देतो.", gu: "મુંબઈમાં સ્ટેમ્પ ડ્યુટી સામાન્ય રીતે કરાર કિંમતના 5-6% હોય છે, ઉપરાંત 1% નોંધણી ચાર્જ (મહત્તમ ₹30,000). તમે પ્રતિબદ્ધ થાઓ તે પહેલાં અમે તમારા ફ્લેટ માટે ચોક્કસ આંકડો કાઢી આપીએ છીએ." }`

3. category `"redevelopment"`, order `2`:
   - question: `{ en: "How does housing society redevelopment actually work?", hi: "हाउसिंग सोसाइटी पुनर्विकास असल में कैसे काम करता है?", mr: "हाउसिंग सोसायटी पुनर्विकास प्रत्यक्षात कसे काम करते?", gu: "હાઉસિંગ સોસાયટી પુનર્વિકાસ ખરેખર કેવી રીતે કામ કરે છે?" }`
   - answer: `{ en: "It starts with a society resolution to explore redevelopment, followed by a feasibility study, developer selection through a transparent tender, signing a Development Agreement, obtaining approvals, construction, and finally possession of your new home. We guide societies through every stage.", hi: "यह पुनर्विकास तलाशने के सोसाइटी प्रस्ताव से शुरू होता है, उसके बाद फिजिबिलिटी स्टडी, पारदर्शी टेंडर के ज़रिए डेवलपर चयन, डेवलपमेंट एग्रीमेंट पर हस्ताक्षर, अनुमति प्राप्त करना, निर्माण, और अंत में आपके नए घर का पजेशन। हम सोसाइटियों को हर चरण में मार्गदर्शन देते हैं।", mr: "हे पुनर्विकासाचा शोध घेण्याच्या सोसायटी ठरावाने सुरू होते, त्यानंतर फिजिबिलिटी स्टडी, पारदर्शक टेंडरद्वारे डेव्हलपर निवड, डेव्हलपमेंट अॅग्रीमेंटवर स्वाक्षरी, मंजुरी मिळवणे, बांधकाम, आणि शेवटी तुमच्या नवीन घराचा ताबा. आम्ही सोसायट्यांना प्रत्येक टप्प्यावर मार्गदर्शन करतो.", gu: "તે પુનર્વિકાસ શોધવાના સોસાયટી ઠરાવથી શરૂ થાય છે, ત્યારબાદ ફિઝિબિલિટી સ્ટડી, પારદર્શક ટેન્ડર દ્વારા ડેવલપર પસંદગી, ડેવલપમેન્ટ એગ્રીમેન્ટ પર હસ્તાક્ષર, મંજૂરીઓ મેળવવી, બાંધકામ, અને છેલ્લે તમારા નવા ઘરનો કબજો. અમે સોસાયટીઓને દરેક તબક્કે માર્ગદર્શન આપીએ છીએ." }`

4. category `"redevelopment"`, order `3`:
   - question: `{ en: "Is Section 79(A) registration mandatory for our society's redevelopment?", hi: "क्या हमारी सोसाइटी के पुनर्विकास के लिए धारा 79(A) पंजीकरण अनिवार्य है?", mr: "आमच्या सोसायटीच्या पुनर्विकासासाठी कलम 79(A) नोंदणी अनिवार्य आहे का?", gu: "અમારી સોસાયટીના પુનર્વિકાસ માટે કલમ 79(A) નોંધણી ફરજિયાત છે?" }`
   - answer: `{ en: "Section 79(A) covers the model guidelines cooperative housing societies must follow during redevelopment in Maharashtra. Most societies undertaking redevelopment need to follow this process — we can review your society's specific situation and confirm what applies.", hi: "धारा 79(A) महाराष्ट्र में पुनर्विकास के दौरान सहकारी हाउसिंग सोसाइटियों को पालन करने वाले मॉडल दिशानिर्देशों को कवर करती है। पुनर्विकास करने वाली अधिकांश सोसाइटियों को यह प्रक्रिया अपनानी होती है — हम आपकी सोसाइटी की विशेष स्थिति की समीक्षा कर सकते हैं और बता सकते हैं कि क्या लागू होता है।", mr: "कलम 79(A) महाराष्ट्रात पुनर्विकासादरम्यान सहकारी हाउसिंग सोसायट्यांनी पाळायच्या मॉडेल मार्गदर्शक तत्त्वांचा समावेश करते. पुनर्विकास करणाऱ्या बहुतेक सोसायट्यांना ही प्रक्रिया पाळावी लागते — आम्ही तुमच्या सोसायटीच्या विशिष्ट परिस्थितीचे पुनरावलोकन करून काय लागू होते ते सांगू शकतो.", gu: "કલમ 79(A) મહારાષ્ટ્રમાં પુનર્વિકાસ દરમિયાન સહકારી હાઉસિંગ સોસાયટીઓએ પાળવાના મોડેલ માર્ગદર્શિકાને આવરી લે છે. પુનર્વિકાસ કરતી મોટાભાગની સોસાયટીઓએ આ પ્રક્રિયા અનુસરવી પડે છે — અમે તમારી સોસાયટીની ચોક્કસ પરિસ્થિતિની સમીક્ષા કરીને શું લાગુ પડે છે તે જણાવી શકીએ છીએ." }`

5. category `"pricing"`, order `4`:
   - question: `{ en: "Why do your project prices show as '₹2.** Cr' instead of an exact figure?", hi: "आपके प्रोजेक्ट की कीमतें सटीक आंकड़े की बजाय '₹2.** Cr' क्यों दिखती हैं?", mr: "तुमच्या प्रकल्पाच्या किमती अचूक आकड्याऐवजी '₹2.** Cr' अशा का दिसतात?", gu: "તમારા પ્રોજેક્ટની કિંમતો ચોક્કસ આંકડાને બદલે '₹2.** Cr' કેમ દેખાય છે?" }`
   - answer: `{ en: "We mask exact pricing online because prices change with floor, view and current availability. The teaser gives you a realistic budget range — message us on WhatsApp and we'll share the current, exact price sheet for the specific unit you're interested in.", hi: "हम ऑनलाइन सटीक कीमत नहीं दिखाते क्योंकि फ्लोर, व्यू और मौजूदा उपलब्धता के साथ कीमतें बदलती हैं। यह टीज़र आपको एक वास्तविक बजट रेंज देता है — हमें व्हाट्सएप पर मैसेज करें और हम आपकी पसंद की यूनिट के लिए मौजूदा, सटीक प्राइस शीट साझा करेंगे।", mr: "आम्ही ऑनलाइन अचूक किंमत दाखवत नाही कारण मजला, दृश्य आणि सध्याच्या उपलब्धतेनुसार किमती बदलतात. हा टीझर तुम्हाला एक वास्तववादी बजेट रेंज देतो — आम्हाला व्हॉट्सअॅपवर मेसेज करा आणि आम्ही तुमच्या आवडीच्या युनिटसाठी सध्याची, अचूक प्राइस शीट शेअर करू.", gu: "અમે ઓનલાઇન ચોક્કસ કિંમત બતાવતા નથી કારણ કે માળ, વ્યુ અને હાલની ઉપલબ્ધતા સાથે કિંમતો બદલાય છે. આ ટીઝર તમને એક વાસ્તવિક બજેટ રેન્જ આપે છે — અમને વોટ્સએપ પર મેસેજ કરો અને અમે તમારી પસંદગીના યુનિટ માટે હાલની, ચોક્કસ પ્રાઇસ શીટ શેર કરીશું." }`

6. category `"general"`, order `5`:
   - question: `{ en: "How quickly will you respond after I enquire?", hi: "पूछताछ करने के बाद आप कितनी जल्दी जवाब देंगे?", mr: "चौकशी केल्यानंतर तुम्ही किती लवकर उत्तर द्याल?", gu: "ચોકશી કર્યા પછી તમે કેટલી ઝડપથી જવાબ આપશો?" }`
   - answer: `{ en: "Most enquiries get a response the same day, often within a couple of hours during business hours. Enquiries sent via WhatsApp are usually the fastest way to reach us.", hi: "ज़्यादातर पूछताछ का जवाब उसी दिन मिलता है, अक्सर बिज़नेस आवर्स के दौरान कुछ घंटों के भीतर। व्हाट्सएप पर भेजी गई पूछताछ आमतौर पर हम तक पहुंचने का सबसे तेज़ तरीका है।", mr: "बहुतेक चौकशींना त्याच दिवशी उत्तर मिळते, अनेकदा कामाच्या वेळेत काही तासांतच. व्हॉट्सअॅपद्वारे पाठवलेल्या चौकशी सहसा आमच्यापर्यंत पोहोचण्याचा सर्वात जलद मार्ग असतो.", gu: "મોટાભાગની ચોકશીઓનો જવાબ તે જ દિવસે મળે છે, ઘણીવાર બિઝનેસ અવર્સ દરમિયાન થોડા કલાકોમાં જ. વોટ્સએપ દ્વારા મોકલેલી ચોકશી સામાન્ય રીતે અમારા સુધી પહોંચવાનો સૌથી ઝડપી રસ્તો છે." }`

Do NOT set `_id` on any of these — let Sanity generate it, then publish using the returned draft IDs.

- [ ] **Step 7: Verify live**

Run `npm run dev` if not already running (port 3000), visit `http://localhost:3000/` and confirm a "Common questions" section renders between Areas and the lead form, with all 6 FAQs, each opening/closing on click. Visit `/hi`, `/mr`, `/gu` and confirm the questions and section heading are translated.

- [ ] **Step 8: Run the full test suite**

Run: `npm test`
Expected: all tests pass (no new test files in this task beyond the parity check already run in Step 2).

- [ ] **Step 9: Commit**

```bash
git add src/components/FAQSection.tsx "src/app/[locale]/page.tsx" messages/en.json messages/hi.json messages/mr.json messages/gu.json
git commit -m "Add FAQ section to homepage with 6 real seeded FAQs"
```

---

### Task 4: Project grid — replace the single featured-project section

**Files:**
- Modify: `src/sanity/queries.ts`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json`

**Interfaces:**
- Consumes: `getLowestPriceConfig` (Task 1), `getLocalizedField`/`Locale`/`LocalizedValue`, `Link` from `@/i18n/navigation`.
- Produces: `featuredProjectsGridQuery` (GROQ export) returning up to 3 projects — no other task consumes this beyond `page.tsx` itself.

This task also removes the hero's single-project side image panel: since Jaswanti Jewel has no `coverImage`, that panel currently renders nothing at all, leaving an empty gap in the hero's two-column layout — the new project grid immediately below makes that panel redundant even once projects do have images.

- [ ] **Step 1: Add `featuredProjectsGridQuery` to `src/sanity/queries.ts`**

Add near the existing `featuredProjectQuery` (keep `featuredProjectQuery` itself — it's still used by `generateMetadata`-style consumers elsewhere... actually check: grep confirms `featuredProjectQuery` is only used in `src/app/[locale]/page.tsx`. Since this task removes its only call site, delete `featuredProjectQuery` from `src/sanity/queries.ts` entirely rather than leaving dead code):

Remove the `featuredProjectQuery` export block, and add in its place:
```ts
export const featuredProjectsGridQuery = groq`
  *[_type == "project" && featured == true] | order(order asc)[0...3] {
    _id,
    name,
    slug,
    location,
    coverImage,
    configurations
  }
`;
```

- [ ] **Step 2: Typecheck (expected to fail — `page.tsx` still imports the now-deleted `featuredProjectQuery`)**

Run: `npx tsc --noEmit`
Expected: FAIL — `Module '"@/sanity/queries"' has no exported member 'featuredProjectQuery'`. This is expected; fixed in the next step.

- [ ] **Step 3: Replace the HERO and FEATURED PROJECT sections in `src/app/[locale]/page.tsx`**

Replace the imports at the top of the file:
```tsx
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  featuredProjectsGridQuery,
  featuredTestimonialsQuery,
  faqsQuery,
} from "@/sanity/queries";
import { site, waLink } from "@/lib/config";
import { LeadForm } from "@/components/LeadForm";
import { FAQSection } from "@/components/FAQSection";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";
import { getLowestPriceConfig } from "@/lib/project-helpers";
```

Replace the `Config`/`FeaturedProject` types with:
```tsx
type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type GridProject = {
  _id: string;
  name: string;
  slug: { current: string };
  location?: string;
  coverImage?: any;
  configurations?: Config[];
};
```

Update the `Faq` type block (added in Task 3) to stay as-is.

Update the `Promise.all` call — replace `featuredProjectQuery`/`FeaturedProject` with `featuredProjectsGridQuery`/`GridProject[]`, and add a `tProjectsGrid` translation fetch:
```tsx
  const [projects, testimonials, faqs, tHero, tServices, tProjectsGrid, tTestimonials, tAreas, tFaq, tLeadForm] =
    await Promise.all([
      client.fetch<GridProject[]>(featuredProjectsGridQuery),
      client.fetch<Testimonial[]>(featuredTestimonialsQuery),
      client.fetch<Faq[]>(faqsQuery),
      getTranslations({ locale, namespace: "hero" }),
      getTranslations({ locale, namespace: "services" }),
      getTranslations({ locale, namespace: "projectsGrid" }),
      getTranslations({ locale, namespace: "testimonials" }),
      getTranslations({ locale, namespace: "areas" }),
      getTranslations({ locale, namespace: "faq" }),
      getTranslations({ locale, namespace: "leadForm" }),
    ]);
```

Replace the entire HERO section (from `{/* HERO */}` through its closing `</section>`) with a single-column version that drops the now-redundant project side panel:
```tsx
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <div className="wrap py-24">
          <div className="max-w-3xl">
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
        </div>
      </section>
```

Replace the entire `{/* FEATURED PROJECT */}` section (the one keyed off `project && (...)`) with a project grid:
```tsx
      {/* PROJECTS GRID */}
      {projects && projects.length > 0 && (
        <section className="py-24">
          <div className="wrap">
            <div className="mb-13 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="eyebrow">{tProjectsGrid("eyebrow")}</div>
                <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
                  {tProjectsGrid("heading")}
                </h2>
              </div>
              <Link href="/projects" className="text-sm font-semibold text-brand-blue">
                {tProjectsGrid("viewAll")}
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {projects.map((project) => {
                const lowest = getLowestPriceConfig(project.configurations);
                return (
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
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl text-brand-indigo">{project.name}</h3>
                      {project.location && (
                        <p className="mt-1 text-sm text-muted">{project.location}</p>
                      )}
                      {lowest?.displayPrice && (
                        <p className="mt-3 font-display text-lg text-brand-indigo">
                          {lowest.displayPrice}
                        </p>
                      )}
                      <span className="mt-4 text-sm font-semibold text-brand-blue">
                        {tProjectsGrid("viewDetails")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
```

- [ ] **Step 4: Add the `projectsGrid` namespace to all four message catalogs**

`messages/en.json`, add near `featuredProject` (can sit right after it):
```json
  "projectsGrid": {
    "eyebrow": "Now Booking",
    "heading": "Featured launches across the western suburbs",
    "viewAll": "View all projects →",
    "viewDetails": "View details →"
  },
```

`messages/hi.json`:
```json
  "projectsGrid": {
    "eyebrow": "अभी बुकिंग जारी",
    "heading": "पश्चिमी उपनगरों में फीचर्ड लॉन्च",
    "viewAll": "सभी प्रोजेक्ट्स देखें →",
    "viewDetails": "विवरण देखें →"
  },
```

`messages/mr.json`:
```json
  "projectsGrid": {
    "eyebrow": "आता बुकिंग सुरू",
    "heading": "पश्चिम उपनगरातील वैशिष्ट्यीकृत लाँच",
    "viewAll": "सर्व प्रकल्प पहा →",
    "viewDetails": "तपशील पहा →"
  },
```

`messages/gu.json`:
```json
  "projectsGrid": {
    "eyebrow": "હમણાં બુકિંગ",
    "heading": "પશ્ચિમ પરાંમાં વિશેષ લોન્ચ",
    "viewAll": "બધા પ્રોજેક્ટ્સ જુઓ →",
    "viewDetails": "વિગતો જુઓ →"
  },
```

Note: `featuredProject` namespace (eyebrow/nowBooking/ctaPrice/ctaView/whatsappPrefix/whatsappSuffix) is now unused dead code in all four files — remove it in this same step (delete the whole `"featuredProject": { ... },` block from each of the four files) since nothing references it after this task.

- [ ] **Step 5: Run the key-parity test**

Run: `npm test -- messages/messages.test.ts`
Expected: `2 passed`.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Seed 2 placeholder projects via the Sanity MCP tools**

Use `create_documents` then `publish_documents` (same mechanism as Task 3, resource `{ projectId: "rt0067kr", dataset: "production" }`) to create 2 `project` documents:

Project A:
```json
{
  "name": "Sample Project — Replace Me",
  "slug": { "_type": "slug", "current": "sample-project-replace-me" },
  "status": "upcoming",
  "location": "Borivali West",
  "area": "borivali",
  "featured": true,
  "order": 1,
  "summary": { "en": "Placeholder project — replace with a real listing once available. This card demonstrates how the homepage grid displays a project without a cover image." },
  "configurations": [
    { "_type": "config", "type": "2 BHK", "displayPrice": "From ₹1.** Cr", "note": { "en": "Placeholder configuration" } }
  ]
}
```

Project B:
```json
{
  "name": "Sample Project 2 — Replace Me",
  "slug": { "_type": "slug", "current": "sample-project-2-replace-me" },
  "status": "booking",
  "location": "Kandivali West",
  "area": "kandivali",
  "featured": true,
  "order": 2,
  "summary": { "en": "Placeholder project — replace with a real listing once available." },
  "configurations": [
    { "_type": "config", "type": "3 BHK", "displayPrice": "From ₹2.** Cr", "note": { "en": "Placeholder configuration" } }
  ]
}
```

Leave `hi`/`mr`/`mr`/`gu` on `summary`/`note` unset — `getLocalizedField` falls back to `en` automatically, and this is throwaway content anyway.

- [ ] **Step 8: Verify live**

Run `npm run dev`, visit `http://localhost:3000/` and confirm: the hero is now single-column with no empty gap; a 3-card project grid renders showing Jaswanti Jewel plus the two placeholders, each with a "From ₹X.** Cr" price and a "View details →" link; a "View all projects →" link points at `/projects`. Click into a placeholder project's detail page and confirm it renders without crashing (no cover image, no gallery — the existing `/projects/[slug]` page already handles all of those fields as optional).

- [ ] **Step 9: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/sanity/queries.ts "src/app/[locale]/page.tsx" messages/en.json messages/hi.json messages/mr.json messages/gu.json
git commit -m "Replace single-project hero showcase with a 3-project grid"
```

---

### Task 5: Testimonial carousel

**Files:**
- Create: `src/components/TestimonialCarousel.tsx`
- Create: `src/components/TestimonialCarousel.test.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json`

**Interfaces:**
- Consumes: `getLocalizedField`/`Locale`/`LocalizedValue`.
- Produces: `TestimonialCarousel` component, props `{ testimonials: Testimonial[]; locale: Locale }` where `Testimonial = { _id: string; quote: LocalizedValue<string>; author: string; role?: LocalizedValue<string>; rating?: number }` (matches the existing `Testimonial` type already in `page.tsx`) — consumed directly in `page.tsx`, replacing the fixed 3-card grid.

- [ ] **Step 1: Add `testimonials.prevAriaLabel`/`nextAriaLabel` to all four message catalogs**

`messages/en.json`, inside the existing `"testimonials"` block, add two keys:
```json
  "testimonials": {
    "eyebrow": "What clients say",
    "heading": "Trusted by families across the suburbs",
    "prevAriaLabel": "Previous testimonial",
    "nextAriaLabel": "Next testimonial"
  },
```

`messages/hi.json`:
```json
  "testimonials": {
    "eyebrow": "ग्राहक क्या कहते हैं",
    "heading": "उपनगरों भर के परिवारों का भरोसा",
    "prevAriaLabel": "पिछला प्रशंसापत्र",
    "nextAriaLabel": "अगला प्रशंसापत्र"
  },
```

`messages/mr.json`:
```json
  "testimonials": {
    "eyebrow": "ग्राहक काय म्हणतात",
    "heading": "उपनगरातील कुटुंबांचा विश्वास",
    "prevAriaLabel": "मागील प्रशस्तिपत्र",
    "nextAriaLabel": "पुढील प्रशस्तिपत्र"
  },
```

`messages/gu.json`:
```json
  "testimonials": {
    "eyebrow": "ગ્રાહકો શું કહે છે",
    "heading": "પરાં ભરના પરિવારોનો વિશ્વાસ",
    "prevAriaLabel": "પાછલું પ્રશસ્તિપત્ર",
    "nextAriaLabel": "આગલું પ્રશસ્તિપત્ર"
  },
```

- [ ] **Step 2: Run the key-parity test**

Run: `npm test -- messages/messages.test.ts`
Expected: `2 passed`.

- [ ] **Step 3: Write the failing `TestimonialCarousel` tests**

Create `src/components/TestimonialCarousel.test.tsx`. Two things to note about why this test file is shaped the way it is: (1) the component's blockquote renders `“{quote}”` as three separate JSX children, so React does not merge them into one text node — `getByText` needs a regex/substring matcher, not an exact string, to match across that split; (2) fake timers are scoped to only the one test that needs them (`vi.useFakeTimers()` called locally, not globally via `beforeEach`) — combining global fake timers with `userEvent.click()` in the other tests causes `user-event` to deadlock waiting on internal timers that never resolve, so the click-based tests intentionally run under real timers with plain `userEvent.setup()`.

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestimonialCarousel } from "./TestimonialCarousel";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({ prevAriaLabel: "Previous testimonial", nextAriaLabel: "Next testimonial" })[key] ?? key,
}));

const testimonials = [
  { _id: "1", quote: { en: "Great service" }, author: "Client A", role: { en: "Borivali homeowner" }, rating: 5 },
  { _id: "2", quote: { en: "Very professional" }, author: "Client B", role: { en: "Kandivali homeowner" }, rating: 4 },
  { _id: "3", quote: { en: "Highly recommend" }, author: "Client C", role: { en: "Malad homeowner" }, rating: 5 },
];

describe("TestimonialCarousel", () => {
  it("shows the first testimonial initially", () => {
    render(<TestimonialCarousel testimonials={testimonials} locale="en" />);
    expect(screen.getByText(/Great service/)).toBeInTheDocument();
    expect(screen.queryByText(/Very professional/)).not.toBeInTheDocument();
  });

  it("advances to the next testimonial when the next button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestimonialCarousel testimonials={testimonials} locale="en" />);
    await user.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(screen.getByText(/Very professional/)).toBeInTheDocument();
  });

  it("goes back to the previous testimonial when the prev button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestimonialCarousel testimonials={testimonials} locale="en" />);
    await user.click(screen.getByRole("button", { name: "Previous testimonial" }));
    expect(screen.getByText(/Highly recommend/)).toBeInTheDocument();
  });

  it("auto-advances after the rotation interval", () => {
    vi.useFakeTimers();
    try {
      render(<TestimonialCarousel testimonials={testimonials} locale="en" />);
      expect(screen.getByText(/Great service/)).toBeInTheDocument();
      vi.advanceTimersByTime(6000);
      expect(screen.getByText(/Very professional/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not render at all when given an empty testimonials array", () => {
    const { container } = render(<TestimonialCarousel testimonials={[]} locale="en" />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `npm test -- src/components/TestimonialCarousel.test.tsx`
Expected: FAIL — `Cannot find module './TestimonialCarousel'`.

- [ ] **Step 5: Implement `src/components/TestimonialCarousel.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

const ROTATE_INTERVAL_MS = 6000;

type Testimonial = {
  _id: string;
  quote: LocalizedValue<string>;
  author: string;
  role?: LocalizedValue<string>;
  rating?: number;
};

export function TestimonialCarousel({
  testimonials,
  locale,
}: {
  testimonials: Testimonial[];
  locale: Locale;
}) {
  const t = useTranslations("testimonials");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[index];

  function goPrev() {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }

  function goNext() {
    setIndex((i) => (i + 1) % testimonials.length);
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <figure
        key={current._id}
        aria-live="polite"
        className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm"
      >
        <div className="mb-3 text-brass">{"★".repeat(current.rating || 5)}</div>
        <blockquote className="font-display text-lg text-brand-indigo">
          “{getLocalizedField(current.quote, locale)}”
        </blockquote>
        <figcaption className="mt-4 text-sm text-muted">
          <span className="block font-semibold text-ink">{current.author}</span>
          {getLocalizedField(current.role, locale)}
        </figcaption>
      </figure>

      {testimonials.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label={t("prevAriaLabel")}
            onClick={goPrev}
            className="rounded-full border border-brand-indigo/15 p-2 text-brand-indigo transition hover:bg-brand-indigo/5"
          >
            ←
          </button>
          <button
            type="button"
            aria-label={t("nextAriaLabel")}
            onClick={goNext}
            className="rounded-full border border-brand-indigo/15 p-2 text-brand-indigo transition hover:bg-brand-indigo/5"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- src/components/TestimonialCarousel.test.tsx`
Expected: `5 passed`.

- [ ] **Step 7: Wire `TestimonialCarousel` into `src/app/[locale]/page.tsx`, replacing the fixed testimonial grid**

Add the import:
```tsx
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
```

Replace the entire `{/* TESTIMONIALS */}` section's inner grid markup — keep the `eyebrow`/`heading` header, replace the `<div className="mt-10 grid gap-6 md:grid-cols-3">...</div>` block with:
```tsx
            <div className="mt-10">
              <TestimonialCarousel testimonials={testimonials} locale={locale} />
            </div>
```

- [ ] **Step 8: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 9: Seed 3 placeholder testimonials via the Sanity MCP tools**

Use `create_documents` then `publish_documents` to create 3 `testimonial` documents:
```json
{ "quote": { "en": "Placeholder testimonial — replace with a real client quote once you have one to feature." }, "author": "Placeholder Client — Borivali", "role": { "en": "Borivali homeowner" }, "rating": 5, "featured": true, "order": 1 }
```
```json
{ "quote": { "en": "Placeholder testimonial — replace with a real client quote once you have one to feature." }, "author": "Placeholder Client — Kandivali", "role": { "en": "Kandivali homeowner" }, "rating": 5, "featured": true, "order": 2 }
```
```json
{ "quote": { "en": "Placeholder testimonial — replace with a real client quote once you have one to feature." }, "author": "Placeholder Client — Malad", "role": { "en": "Malad homeowner" }, "rating": 5, "featured": true, "order": 3 }
```

- [ ] **Step 10: Verify live**

Run `npm run dev`, visit `http://localhost:3000/`, scroll to the testimonials section: confirm one testimonial shows at a time, prev/next buttons cycle through all 3, and it auto-advances after a few seconds. Hover over it and confirm it stops auto-advancing while the mouse is over it.

- [ ] **Step 11: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 12: Commit**

```bash
git add src/components/TestimonialCarousel.tsx src/components/TestimonialCarousel.test.tsx "src/app/[locale]/page.tsx" messages/en.json messages/hi.json messages/mr.json messages/gu.json
git commit -m "Replace fixed testimonial grid with an auto-rotating carousel"
```

---

### Task 6: Sticky mobile CTA bar

**Files:**
- Create: `src/components/StickyMobileCTA.tsx`
- Modify: `src/components/WhatsAppFloat.tsx`
- Modify: `messages/en.json`, `messages/hi.json`, `messages/mr.json`, `messages/gu.json`

**Interfaces:**
- Consumes: `site`, `waLink` from `@/lib/config`.
- Produces: `StickyMobileCTA` component (server component, no props) — consumed in `src/app/[locale]/layout.tsx` alongside the existing `WhatsAppFloat`.

- [ ] **Step 1: Add the `stickyCta` namespace to all four message catalogs**

`messages/en.json`, add after `whatsappFloat`:
```json
  "stickyCta": {
    "callLabel": "Call",
    "whatsappLabel": "WhatsApp"
  },
```

`messages/hi.json`:
```json
  "stickyCta": {
    "callLabel": "कॉल करें",
    "whatsappLabel": "व्हाट्सएप"
  },
```

`messages/mr.json`:
```json
  "stickyCta": {
    "callLabel": "कॉल करा",
    "whatsappLabel": "व्हॉट्सअॅप"
  },
```

`messages/gu.json`:
```json
  "stickyCta": {
    "callLabel": "કૉલ કરો",
    "whatsappLabel": "વોટ્સએપ"
  },
```

- [ ] **Step 2: Run the key-parity test**

Run: `npm test -- messages/messages.test.ts`
Expected: `2 passed`.

- [ ] **Step 3: Create `src/components/StickyMobileCTA.tsx`**

This is a server component — no client-side JS is needed since visibility is handled entirely by the `md:hidden` Tailwind breakpoint.

Use the existing `nav.whatsappEnquireMessage` translation key (already present in all four catalogs) for the WhatsApp message text, rather than a new hardcoded string:

```tsx
import { getTranslations } from "next-intl/server";
import { site, waLink } from "@/lib/config";

export async function StickyMobileCTA({ locale }: { locale: string }) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "stickyCta" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-brand-indigo/10 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
      <a
        href={`tel:${site.phonePrimary}`}
        className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-brand-indigo"
      >
        {t("callLabel")}
      </a>
      <a
        href={waLink(tNav("whatsappEnquireMessage"))}
        target="_blank"
        rel="noopener"
        className="flex flex-1 items-center justify-center gap-2 bg-whatsapp py-3.5 text-sm font-semibold text-white"
      >
        {t("whatsappLabel")}
      </a>
    </div>
  );
}
```

- [ ] **Step 4: Hide `WhatsAppFloat` on mobile (keep it on desktop)**

In `src/components/WhatsAppFloat.tsx`, find the `className` on the `<a>` element:
```tsx
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition hover:scale-105"
```
Replace with:
```tsx
      className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition hover:scale-105 md:flex"
```
(changes `flex` to `hidden md:flex` — hidden by default, flex again at the `md` breakpoint and up.)

- [ ] **Step 5: Wire `StickyMobileCTA` into `src/app/[locale]/layout.tsx`**

Add the import:
```tsx
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
```

In the returned JSX, add `<StickyMobileCTA locale={locale} />` immediately after `<WhatsAppFloat />`:
```tsx
        <NextIntlClientProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
          <StickyMobileCTA locale={locale} />
        </NextIntlClientProvider>
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Verify live**

Run `npm run dev`, visit `http://localhost:3000/`. Using the browser's responsive/device-emulation mode at a mobile width (e.g. 375px), confirm: a bottom bar with "Call" and "WhatsApp" appears and stays fixed while scrolling; the round floating WhatsApp button is NOT also visible. Switch to a desktop-width viewport and confirm the opposite: the sticky bar is gone, the round floating WhatsApp button is back.

- [ ] **Step 8: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/components/StickyMobileCTA.tsx src/components/WhatsAppFloat.tsx "src/app/[locale]/layout.tsx" messages/en.json messages/hi.json messages/mr.json messages/gu.json
git commit -m "Add sticky mobile Call/WhatsApp bar, hide floating WhatsApp button on mobile"
```

---

### Task 7: `teamMember` schema

**Files:**
- Create: `src/sanity/schemas/teamMember.ts`
- Modify: `src/sanity/schema.ts`

**Interfaces:**
- Consumes: `localizedStringField`, `localizedTextField` from `@/sanity/schemas/lib/localizedFields`.
- Produces: the `teamMember` Sanity document type, registered in the schema. Not consumed by any page in this plan — this schema exists so content can be added in Studio ahead of a future `/about` or `/team` page; no query or component work is in scope here, matching the spec's framing of this as lower priority than the homepage sections.

- [ ] **Step 1: Create `src/sanity/schemas/teamMember.ts`**

```ts
import { defineType, defineField } from "sanity";
import { localizedStringField, localizedTextField } from "./lib/localizedFields";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    localizedStringField("role", "Role"),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternative text" }],
    }),
    localizedTextField("bio", "Bio", 4),
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
    select: { title: "name", subtitle: "role.en", media: "photo" },
  },
});
```

- [ ] **Step 2: Register the schema in `src/sanity/schema.ts`**

Add the import and register it in the `types` array:
```ts
import teamMember from "./schemas/teamMember";
```
Add `teamMember,` to the `types: [...]` array (alongside `faq,`).

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Verify live**

Run `npm run dev`, visit `http://localhost:3000/studio`, confirm "Team Member" appears as a document type in the Studio's content list and can be opened to create a new entry (don't need to actually create one — just confirm the schema renders correctly with English/Hindi/Marathi/Gujarati tabs on Role and Bio).

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemas/teamMember.ts src/sanity/schema.ts
git commit -m "Add teamMember schema for future /about page use"
```

---

### Task 8: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit`
Expected: PASS, no errors anywhere.

- [ ] **Step 2: Full test suite**

Run: `npm test`
Expected: all tests pass, including the 5 new `TestimonialCarousel` tests and the 5 new `project-helpers` tests on top of the existing suite.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Full live walkthrough**

With `npm run dev` running, visit `http://localhost:3000/` and confirm, in order top to bottom: single-column hero with no empty gap; services grid (unchanged); 3-project grid (Jaswanti Jewel + 2 placeholders) with a "View all projects →" link; testimonial carousel cycling through 3 placeholder testimonials; areas grid (unchanged); FAQ accordion with 6 real questions; lead form (unchanged). Resize to mobile width and confirm the sticky Call/WhatsApp bar appears at the bottom and the floating round WhatsApp button does not. Repeat the top-to-bottom check on `/hi`, `/mr`, and `/gu` and confirm all UI chrome (including the new FAQ, project grid, and carousel labels) is translated, with FAQ question/answer text also appearing in the correct language for the 6 real FAQs.

- [ ] **Step 5: Confirm plan completion**

All 8 tasks committed on the `i18n-foundation` branch. The homepage now has: a 3-project grid, an auto-rotating testimonial carousel, a real FAQ section, and a sticky mobile CTA bar — closing the gaps identified in the original design review. Remaining known gaps (out of scope for this plan, tracked separately): `/blog` is still empty, the nav/header restructure discussion is still paused, and the branch is not yet merged to `master` or deployed.
