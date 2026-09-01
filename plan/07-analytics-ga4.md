# 07. Analytics: GA4 and GTM Implementation

Framework: `analytics` (track for decisions not data, object action naming, event properties, GTM data layer pattern, UTM conventions, validation checklist).

**Current state: zero.** No GA4, no GTM, no dataLayer, no gtag. I grepped the entire `src/` tree. Not a single conversion on this site is measurable today, which means every rupee of the ad spend you are about to commit would currently be unattributable.

---

## 1. The measurement problem you need to understand first

Your primary conversion is a WhatsApp enquiry. **A WhatsApp click is an outbound link click. It is not a lead.**

When somebody taps the WhatsApp button, all you know is that a browser opened `wa.me`. You do not know whether they sent the message, whether they were serious, or whether they were a competitor checking your number. In my experience of outbound click conversions generally, a large share never complete. I do not know your specific ratio and will not invent one, which is exactly why measuring it matters.

**Why this is dangerous with Google Ads.** If you feed `whatsapp_click` to Google Ads as your optimisation target, Smart Bidding will faithfully learn to buy the cheapest possible WhatsApp clicks. It will find you people who tap buttons. It will not find you people who buy flats. You will see a great cost per conversion and a quiet phone.

### The three tier model

| Tier | Events | Use in GA4 | Use in Google Ads |
|---|---|---|---|
| **Micro** | `whatsapp_click`, `phone_click` | Marked as conversions. Watch them | **Import as secondary. Do not bid to them** |
| **Macro** | `form_submit`, `price_sheet_request` | Marked as conversions | **Primary bidding target** |
| **Verified** | `qualified_lead` | Imported offline | **The real target once you have volume** |

**The verified tier is what makes this work.** Every form captures `gclid` in a hidden field. When a lead turns into a real conversation, you upload that `gclid` back to Google Ads as an offline conversion. Google then optimises toward people who actually became clients, not people who tapped a green button.

Without stored `gclid` this is impossible, retroactively and permanently. It is a hidden field and five minutes of work and it is the single most valuable line in this document.

**Realistic sequencing.** Weeks 1 to 4 you will not have the volume for offline conversions. Bid to `form_submit`. From roughly week 6, when you have 30 or more leads, start the weekly `gclid` upload and move bidding to `qualified_lead`.

---

## 2. Tooling

| Tool | Role | Note |
|---|---|---|
| **GTM** | All tag management | Everything goes through GTM. Nothing hardcoded except the container snippet and the dataLayer pushes |
| **GA4** | Analytics and conversion source | |
| **Google Ads** | Conversions imported from GA4, plus offline import | Do not create duplicate Google Ads native tags. Import from GA4 only, or you will double count |
| **Taboola pixel** | Fired via GTM | |
| **Search Console** | Organic query data, linked to GA4 | |

**One container, one property, one data stream.** Resist the urge to add a second measurement path. Duplicate events are the most common failure in GA4 implementations and they are invisible until your conversion counts look impossibly good.

### Next.js implementation

| Item | Approach |
|---|---|
| GTM container | `next/script` with `strategy="afterInteractive"` in the locale layout |
| Route change pageviews | App Router client side navigation does **not** automatically fire a pageview. A listener on `usePathname` and `useSearchParams` must push `page_view` manually. **This is the most commonly missed item in App Router GA4 setups** and it silently undercounts everything |
| dataLayer | Initialised before the GTM snippet |
| Consent | Consent Mode v2 configured. Section 9 |

---

## 3. Event taxonomy

Naming per the `analytics` guide: object then action, lowercase with underscores, specific rather than generic, context in parameters rather than in the event name.

### 3.1 Conversion events

| Event | Trigger | Tier | GA4 conversion | Ads |
|---|---|---|---|---|
| `whatsapp_click` | Any click on any WhatsApp link or button | Micro | Yes | Secondary, do not bid |
| `phone_click` | Any click on a `tel:` link | Micro | Yes | Secondary |
| `form_submit` | Lead form submitted successfully | **Macro** | Yes | **Primary** |
| `price_sheet_request` | Jaswanti Jewel price sheet gate submitted | **Macro** | Yes | **Primary** |
| `launch_register` | Upcoming launch register submitted | Macro | Yes | Secondary |
| `email_click` | Click on a `mailto:` link | Micro | Yes | No |
| `directions_click` | Click on the map or directions link | Micro | Yes | No |
| `qualified_lead` | **Offline import.** You mark a lead qualified in your own record | **Verified** | Imported | **Primary from week 6** |

### 3.2 Engagement events

| Event | Trigger | Purpose |
|---|---|---|
| `page_view` | Every page load and client side route change | Manual push required in App Router |
| `scroll_depth` | 25, 50, 75, 90 percent | Content engagement. Distinguishes a read from a bounce |
| `content_read` | 75% scroll plus 45 seconds on a blog or guide | A genuine read signal. Far more useful than raw pageviews |
| `faq_expand` | An FAQ accordion opened | **Tells you which objections actually matter.** Feeds back into content |
| `service_card_click` | Homepage service card clicked | Homepage routing effectiveness |
| `area_card_click` | Homepage or areas hub card clicked | Which suburb has the demand |
| `project_config_view` | A Jaswanti Jewel configuration row expanded | Which configuration draws interest. Feeds ad copy |
| `gallery_interact` | Project gallery image opened | Media engagement |
| `video_start`, `video_complete` | Embedded video | Once video exists |
| `nav_click` | Header or footer navigation click | Navigation effectiveness |
| `outbound_click` | Any click to an external domain | Includes MahaRERA and source citations |

### 3.3 Form interaction events

Form abandonment is diagnosable only if you instrument it.

| Event | Trigger | Purpose |
|---|---|---|
| `form_start` | First interaction with any form field | The denominator for abandonment |
| `form_field_error` | Validation failure | **Which field is breaking.** Usually the phone field |
| `form_abandon` | `form_start` fired, page unloaded, no `form_submit` | The abandonment number |
| `form_submit` | Successful submission | The numerator |

`form_start` to `form_submit` is your form conversion rate. If `form_field_error` clusters on the phone field, the validation is too strict for the ways Indians type phone numbers, which is a very common and very expensive bug.

### 3.4 Parameter definitions

| Parameter | Type | Values | Applies to |
|---|---|---|---|
| `click_location` | string | `header`, `hero`, `sticky_bar`, `float`, `footer`, `section_cta`, `form`, `card`, `inline` | All click events |
| `page_type` | string | `home`, `service_index`, `service_detail`, `area_index`, `area_detail`, `project_index`, `project_detail`, `blog_index`, `blog_post`, `guide`, `case_study`, `about`, `contact`, `landing_page` | All events |
| `page_slug` | string | The URL path without locale | All events |
| `service_name` | string | `rentals`, `resale-flats`, `new-project-bookings`, `redevelopment`, `shops-plots`, `interiors` | Service pages and cards |
| `area_name` | string | `borivali-west`, `borivali-east`, `kandivali`, `malad` | Area pages and cards |
| `project_name` | string | `jaswanti-jewel` | Project pages |
| `form_name` | string | `lead_form`, `price_sheet`, `launch_register`, `contact_form` | All form events |
| `form_location` | string | `homepage`, `contact_page`, `service_page`, `project_page`, `landing_page` | All form events |
| `enquiry_intent` | string | `buy`, `rent`, `sell`, `new_project`, `redevelopment`, `interiors` | `form_submit` |
| `enquiry_area` | string | The four suburb values, or `open` | `form_submit` |
| `locale` | string | `en`, `hi`, `mr`, `gu` | All events. Tells you whether the other locales are used at all |
| `scroll_percent` | number | 25, 50, 75, 90 | `scroll_depth` |
| `field_name` | string | The field that errored | `form_field_error` |
| `link_domain` | string | External domain | `outbound_click` |
| `question_text` | string | The FAQ question opened | `faq_expand` |
| `gclid` | string | Google click id | Stored, not sent to GA4 |

**No PII.** Never send name, phone number or email to GA4 as a parameter. This is both a Google policy violation and a real privacy exposure. The name and phone go to WhatsApp and to your own records, not to analytics.

### 3.5 Custom dimensions to register in GA4

GA4 will not report on a parameter until it is registered. Limit is 50 event scoped.

| Dimension | Scope | Parameter |
|---|---|---|
| Click location | Event | `click_location` |
| Page type | Event | `page_type` |
| Service name | Event | `service_name` |
| Area name | Event | `area_name` |
| Form name | Event | `form_name` |
| Enquiry intent | Event | `enquiry_intent` |
| Enquiry area | Event | `enquiry_area` |
| Locale | Event | `locale` |

`enquiry_intent` and `enquiry_area` are the two that will actually change your decisions. They tell you whether paid traffic is asking about rentals or redevelopment, and which suburb the money is in.

---

## 4. WhatsApp click tracking

The most important and most commonly botched item.

### The problem

You have **three** WhatsApp entry points: the header button, the sticky mobile bar and the floating button. Plus section CTAs and the form. If they all fire the same undifferentiated event you learn nothing about which placement works.

### Implementation

```javascript
// Fired on every WhatsApp interaction
dataLayer.push({
  event: 'whatsapp_click',
  click_location: 'sticky_bar',   // header | hero | sticky_bar | float | footer | section_cta | form
  page_type: 'area_detail',
  page_slug: '/areas/borivali-west',
  area_name: 'borivali-west',
  locale: 'en'
});
```

### Rules

| Rule | Why |
|---|---|
| **Verify the float is hidden on mobile before counting** | The build already hides it on mobile to avoid duplicating the sticky bar. If both ever render, you double count |
| Use a click listener on the link, not a page unload | `wa.me` opens in a new context. An unload based trigger will miss it |
| **Test on a real phone, on mobile data** | GTM Preview mode on desktop does not reproduce mobile behaviour. This is the single most common source of false confidence |
| Prefill the WhatsApp message with the page context | `?text=Hi, I saw the Borivali West page on your site` tells you the source even when analytics fails. A free, robust backup signal |
| Do not mark as the Ads bidding target | Section 1 |

**The prefilled message is worth doing regardless of the tracking.** It gives you source attribution inside WhatsApp itself, where you will actually be reading the messages, and it survives ad blockers and consent refusals.

---

## 5. Form tracking and gclid capture

### Hidden fields on every form

| Field | Source | Purpose |
|---|---|---|
| `gclid` | URL parameter, persisted to a first party cookie for 90 days | **Offline conversion import. Non negotiable** |
| `utm_source` | URL, persisted | Attribution |
| `utm_medium` | URL, persisted | Attribution |
| `utm_campaign` | URL, persisted | Attribution |
| `utm_content` | URL, persisted | Creative level attribution |
| `utm_term` | URL, persisted | Keyword attribution |
| `landing_page` | First page of session | Entry point |
| `referrer` | `document.referrer` | Fallback |

**Persist to a first party cookie, do not read the current URL.** A visitor arrives on an ad, browses four pages, then converts. By then the URL has no `gclid`. Capture on entry, store, read on submit.

### The submit sequence

```javascript
// 1. Push to dataLayer BEFORE opening WhatsApp
dataLayer.push({
  event: 'form_submit',
  form_name: 'lead_form',
  form_location: 'homepage',
  enquiry_intent: 'buy',
  enquiry_area: 'borivali-west',
  page_type: 'home',
  locale: 'en'
});

// 2. Then open WhatsApp
```

**Order matters.** The current build calls `window.open()` on submit. If the tag has not fired before the context switches, the event is lost. Push first, then a short delay or a tag callback, then open.

### Where the lead actually lands

The form currently opens WhatsApp prefilled and nothing else. That means **the lead exists only in your WhatsApp inbox.** No record, no backup, no gclid stored anywhere retrievable.

**Recommendation:** post the form data to a simple endpoint as well as opening WhatsApp. A Vercel serverless route writing to a Google Sheet is sufficient and costs nothing. Without it, offline conversion import is impossible because you have nowhere holding the `gclid` alongside the lead.

This is a small build item with a large consequence, and it belongs on Day 5.

---

## 6. UTM convention

Per the `analytics` guide: lowercase everything, consistent separator, specific but concise. **Underscores throughout.** Never mix separators.

### Structure

```
utm_source   = platform            google, taboola, facebook, justdial, newsletter, whatsapp
utm_medium   = channel type        cpc, display, native, social, email, referral, qr
utm_campaign = campaign name       {objective}_{theme}_{geo}
utm_content  = creative or placement variant
utm_term     = keyword             paid search only
```

### Campaign naming

`{objective}_{theme}_{geo}`

| Example | Meaning |
|---|---|
| `leads_rentals_borivali` | Lead generation, rentals theme, Borivali |
| `leads_resale_borivali` | |
| `leads_jaswanti_kandivali` | |
| `leads_interiors_borivali` | |
| `traffic_paperwork_national` | Taboola, paperwork content, national |
| `traffic_redevelopment_mumbai` | Taboola, redevelopment content |
| `brand_giriraj_borivali` | Brand defence search |

### Worked examples

```
Google Search, rentals ad group, exact match
https://www.shreegiriraj.in/lp/rent-borivali
  ?utm_source=google&utm_medium=cpc
  &utm_campaign=leads_rentals_borivali
  &utm_content=rsa_v1&utm_term=flat_for_rent_in_borivali

Taboola, TDS article
https://www.shreegiriraj.in/blog/tds-on-property-purchase
  ?utm_source=taboola&utm_medium=native
  &utm_campaign=traffic_paperwork_national
  &utm_content=tds_headline_a

Google Business Profile website link
https://www.shreegiriraj.in/contact
  ?utm_source=google&utm_medium=organic&utm_campaign=gbp_profile
```

**That last one matters more than it looks.** Without it, GBP traffic lands in `google / organic` and becomes indistinguishable from SEO traffic, so you cannot tell whether your local work is producing anything. Tag the GBP website link on day one.

### Rules

| Rule | Why |
|---|---|
| Never UTM tag internal links | It resets the session and destroys attribution |
| Lowercase always | GA4 is case sensitive. `Google` and `google` become two sources |
| Underscores only | Mixing separators fragments reporting |
| Log every UTM in a sheet | The `analytics` guide is explicit. Six months in, nobody remembers what `utm_content=v3` meant |
| Let Google Ads auto tagging handle `gclid` | Do not disable auto tagging. Use UTMs alongside it, not instead of it |

---

## 7. Google Ads and Taboola linking

### Google Ads

| Step | Detail |
|---|---|
| 1 | Link GA4 to Google Ads in GA4 Admin, Product Links |
| 2 | Enable auto tagging in Google Ads. Leave it on |
| 3 | Import `form_submit`, `price_sheet_request` as **primary** conversion actions |
| 4 | Import `whatsapp_click`, `phone_click` as **secondary**, marked "do not use for bidding" |
| 5 | Set attribution to data driven once volume permits. Last click until then |
| 6 | Configure the offline conversion import for `qualified_lead` |
| 7 | Enable enhanced conversions for leads if you are hashing phone numbers server side. **Only if you have a privacy policy live and consent handled** |

**Do not create Google Ads native conversion tags alongside GA4 imports.** Pick one path. Running both is the most common cause of doubled conversion counts, and it makes campaigns look profitable when they are not.

### Offline conversion import for `qualified_lead`

The mechanism that fixes the WhatsApp measurement problem.

| Step | Detail |
|---|---|
| 1 | Form stores `gclid` alongside the lead, in a sheet or a database |
| 2 | You mark leads qualified in your own record. Define qualified once and stick to it. Suggested: had a real conversation about a specific property or requirement |
| 3 | Weekly, upload a CSV of `gclid`, conversion name, timestamp and optional value |
| 4 | Google Ads attributes the conversion back to the click |
| 5 | Move bidding to `qualified_lead` once you have roughly 30 in 30 days |

**Define a value.** Even a rough one. A rental lead and a redevelopment lead are not worth the same, and value based bidding cannot work without it. Something like: rental 1, resale 5, new project 8, redevelopment 20, interiors 6. Relative weights, not rupees. Refine with real data.

### Taboola

| Step | Detail |
|---|---|
| 1 | Install the Taboola pixel via GTM, on all pages |
| 2 | Configure `form_submit` and `price_sheet_request` as Taboola conversion events |
| 3 | Build a retargeting audience of everyone who read a Taboola article and did not convert |
| 4 | Expect a long window. Taboola traffic converts on a later visit, rarely the first |

**Set the attribution expectation now.** If you judge Taboola on same session conversions you will switch it off in week two. Its job is to fill the top of the funnel and populate retargeting audiences. Measure it on assisted conversions and on retargeting pool growth, not on last click.

---

## 8. Search Console

| Step | Detail |
|---|---|
| 1 | Verify by **DNS TXT record**, which covers all subdomains and protocols. Do this while you are already in the registrar on Day 1 |
| 2 | Submit `sitemap.xml` once it exists, Day 5 |
| 3 | Link to GA4 in GA4 Admin, Product Links. Gives you organic query data inside GA4 |
| 4 | Set the international targeting expectation: **the International Targeting report is deprecated.** Hreflang errors surface in the Pages report and the Enhancements section, not in a dedicated report |
| 5 | Monitor weekly for the first month: Coverage, Enhancements, Core Web Vitals, Manual Actions |

**What to watch in the first month.** Not rankings. Watch for "Duplicate, Google chose a different canonical" in the Pages report. That is the signal the locale gating decision in `01-architecture.md` is or is not working. If it appears against Hindi, Marathi or Gujarati URLs, the gate has a hole in it.

---

## 9. Privacy and consent

| Item | Position |
|---|---|
| Applicable law | India's DPDP Act. **I am not a lawyer and this is not legal advice.** Verify with someone qualified before launch |
| EU or UK visitors | Unlikely at meaningful volume, but Consent Mode v2 costs nothing to configure and protects you if Google Ads ever serves outside India |
| Recommendation | Implement Consent Mode v2 with a simple banner. Analytics storage denied until consent, ad storage denied until consent |
| PII | **Never** send name, phone or email to GA4 |
| IP anonymisation | GA4 does this by default |
| Data retention | Set to 14 months, the maximum |
| Privacy policy | **Must exist before any form goes live.** A form collecting phone numbers with no privacy policy is a real exposure |

---

## 10. Validation checklist

Your Day 5 block, 0:00 to 0:30. Per the `analytics` validation checklist.

**Do this on a real phone, on mobile data, not on desktop preview.**

- [ ] GTM container loads on every page including all four locales
- [ ] `page_view` fires on initial load **and on client side route change**
- [ ] `whatsapp_click` fires from header, sticky bar and float, each with a distinct `click_location`
- [ ] `whatsapp_click` fires exactly **once** per click, not twice
- [ ] The floating WhatsApp button is confirmed hidden on mobile, so it cannot double count with the sticky bar
- [ ] `phone_click` fires on both numbers
- [ ] `form_start` fires on first field interaction
- [ ] `form_submit` fires **before** WhatsApp opens
- [ ] `gclid` captured, persisted to cookie, and present in the submitted payload. Test by appending `?gclid=test123`, browsing three pages, then submitting
- [ ] UTM parameters captured and persisted the same way
- [ ] `scroll_depth` fires at all four thresholds without duplicates
- [ ] `faq_expand` carries the question text
- [ ] All eight custom dimensions registered and populating in DebugView
- [ ] No PII in any parameter. Check the DebugView payloads field by field
- [ ] Google Ads shows imported conversions as "Recording"
- [ ] Taboola pixel fires, confirmed in the Taboola interface
- [ ] Consent Mode blocks storage before consent, then restores it after
- [ ] Search Console verified and linked to GA4

**A screenshot of tags firing in GTM Preview is not evidence.** Preview mode runs a modified page in a desktop browser. Real device, real network, DebugView.

---

## 11. Reporting

Track for decisions, not data. Four questions, four reports.

| Question | Report | Frequency |
|---|---|---|
| Which channel produces qualified leads, not clicks | Conversions by source and medium, filtered to `form_submit` and `qualified_lead` | Weekly |
| Which suburb and which service is the demand in | `enquiry_area` and `enquiry_intent` breakdown of `form_submit` | Weekly |
| Which pages produce leads | Landing page by conversion rate | Weekly |
| Is content working | `content_read` and assisted conversions by blog post | Monthly |

### The one dashboard to build

A single GA4 exploration: rows are landing page, columns are sessions, `form_submit`, `whatsapp_click`, conversion rate. Segmented by source and medium.

That answers "which page and which channel is actually producing business" in one view, and it is the only report you will genuinely look at every week. Build that first and add others only when a real question demands them.

### Metrics to deliberately ignore

Bounce rate, average session duration, pageviews as a headline, and any locale traffic report before month three. None of them will change a decision you make in the next quarter.
