/**
 * Corrections for project text that was entered wrongly in the CMS.
 *
 * The CMS write token was retired in September 2026, so corrections live
 * here and are applied every time a project page, card or meta tag is built.
 * This file is the place to look when a project page says something other
 * than what the CMS Studio shows.
 */

type Localized = Partial<Record<"en" | "hi" | "mr" | "gu", unknown>>;

type Field = "summary" | "body";
type Loc = "en" | "hi" | "mr" | "gu";

/**
 * Blissful Living and Luxury Living are NOT on MahaRERA (owner, 7 November
 * 2026). The CMS text sold them as open for booking, early bird pricing and
 * Expression of Interest bookings. These replace it in every language, always,
 * with a calm "registration awaited, register your interest" page.
 */
const INTEREST: Record<string, Partial<Record<Field, Record<Loc, string>>>> = {
  "blissful-living": {
    summary: {
      en: "An upcoming residential project on Ext. Mathuradas Road, Kandivali West. MahaRERA registration awaited. Register your interest for updates.",
      hi: "कांदिवली वेस्ट के एक्सटेंशन माथुरादास रोड पर एक आगामी रेजिडेंशियल प्रोजेक्ट। MahaRERA रजिस्ट्रेशन की प्रतीक्षा है। अपडेट के लिए अपनी रुचि दर्ज करें।",
      mr: "कांदिवली वेस्टमधील एक्सटेंशन माथुरादास रोडवरील आगामी रेसिडेन्शियल प्रकल्प. MahaRERA नोंदणीची प्रतीक्षा आहे. अपडेटसाठी तुमची आवड नोंदवा.",
      gu: "કાંદિવલી વેસ્ટના એક્સટેન્શન માથુરાદાસ રોડ પર આગામી રહેણાંક પ્રોજેક્ટ. MahaRERA નોંધણીની રાહ છે. અપડેટ માટે તમારો રસ નોંધાવો.",
    },
    body: {
      en: "Blissful Living is an upcoming residential project on Ext. Mathuradas Road, Kandivali West.\n\nMahaRERA registration awaited. Register your interest and we will send details once it is registered.",
      hi: "ब्लिसफुल लिविंग कांदिवली वेस्ट के एक्सटेंशन माथुरादास रोड पर एक आगामी रेजिडेंशियल प्रोजेक्ट है।\n\nMahaRERA रजिस्ट्रेशन की प्रतीक्षा है। अपनी रुचि दर्ज करें, रजिस्ट्रेशन होते ही हम जानकारी भेज देंगे।",
      mr: "ब्लिसफुल लिव्हिंग हा कांदिवली वेस्टमधील एक्सटेंशन माथुरादास रोडवरील आगामी रेसिडेन्शियल प्रकल्प आहे.\n\nMahaRERA नोंदणीची प्रतीक्षा आहे. तुमची आवड नोंदवा, नोंदणी झाल्यावर आम्ही तपशील पाठवू.",
      gu: "બ્લિસફુલ લિવિંગ કાંદિવલી વેસ્ટના એક્સટેન્શન માથુરાદાસ રોડ પર એક આગામી રહેણાંક પ્રોજેક્ટ છે.\n\nMahaRERA નોંધણીની રાહ છે. તમારો રસ નોંધાવો, નોંધણી થતાં જ અમે વિગતો મોકલીશું.",
    },
  },
  "luxury-living-punit-nagar": {
    summary: {
      en: "An upcoming residential project in Punit Nagar, Saibaba Nagar, Borivali West. MahaRERA registration awaited. Register your interest for updates.",
      hi: "बोरिवली वेस्ट के पुनित नगर, साईबाबा नगर में एक आगामी रेजिडेंशियल प्रोजेक्ट। MahaRERA रजिस्ट्रेशन की प्रतीक्षा है। अपडेट के लिए अपनी रुचि दर्ज करें।",
      mr: "बोरिवली वेस्टमधील पुनित नगर, साईबाबा नगर येथील आगामी रेसिडेन्शियल प्रकल्प. MahaRERA नोंदणीची प्रतीक्षा आहे. अपडेटसाठी तुमची आवड नोंदवा.",
      gu: "બોરીવલી વેસ્ટના પુનિત નગર, સાઈબાબા નગરમાં આગામી રહેણાંક પ્રોજેક્ટ. MahaRERA નોંધણીની રાહ છે. અપડેટ માટે તમારો રસ નોંધાવો.",
    },
    body: {
      en: "Luxury Living is an upcoming residential project in Punit Nagar (Saibaba Nagar), Borivali West.\n\nMahaRERA registration awaited. Register your interest and we will send details once it is registered.",
      hi: "लक्ज़री लिविंग बोरिवली वेस्ट के पुनित नगर (साईबाबा नगर) में एक आगामी रेजिडेंशियल प्रोजेक्ट है।\n\nMahaRERA रजिस्ट्रेशन की प्रतीक्षा है। अपनी रुचि दर्ज करें, रजिस्ट्रेशन होते ही हम जानकारी भेज देंगे।",
      mr: "लक्झरी लिव्हिंग हा बोरिवली वेस्टमधील पुनित नगर (साईबाबा नगर) येथील आगामी रेसिडेन्शियल प्रकल्प आहे.\n\nMahaRERA नोंदणीची प्रतीक्षा आहे. तुमची आवड नोंदवा, नोंदणी झाल्यावर आम्ही तपशील पाठवू.",
      gu: "લક્ઝરી લિવિંગ બોરીવલી વેસ્ટના પુનિત નગર (સાઈબાબા નગર)માં એક આગામી રહેણાંક પ્રોજેક્ટ છે.\n\nMahaRERA નોંધણીની રાહ છે. તમારો રસ નોંધાવો, નોંધણી થતાં જ અમે વિગતો મોકલીશું.",
    },
  },
};

/**
 * The Landmark's body is rewritten in English (short paragraphs, and the
 * station corrected: it sits by Borivali station, not Kandivali station, owner
 * 7 November 2026). The other languages get the same station fix through
 * TYPOS below.
 */
const ENGLISH_BODY: Record<string, string> = {
  "the-landmark-borivali-west": [
    "This upcoming development sits on S.V. Road in Borivali West. It is three minutes from Borivali station and five minutes from the new Link Road metro.",
    "Three towers rise 40 storeys across a 3 acre site. The ground and first levels hold retail, with podium parking and a 9th level amenity deck of 1,25,000 sq.ft.",
    "Residences run from the 10th to the 40th floor in 2, 2.5 and 3 BHK configurations.",
    "The developer's final project name is still to be confirmed. We will update this listing as soon as it is announced.",
  ].join("\n\n"),
};

/**
 * Wording saved wrongly in the CMS, corrected here for the same reason as the
 * overrides above. Only plain text fields are touched.
 *
 * "net bookings" is a typo for "new bookings". The Landmark's other-language
 * text names Kandivali station as a neighbour; the site is by Borivali station.
 */
const TYPOS: Record<Loc, [RegExp, string][]> = {
  en: [
    [/\bnet bookings\b/g, "new bookings"],
    // Hyphen joins in the Jewel summary (house rule: no dashes in prose), and
    // its 28 word sentence split in two.
    [/, infinity pool, and an automated car-parking tower\./g, ". It also has an infinity pool and an automated car parking tower."],
    [/\bsky-level\b/g, "sky level"],
    [/\bcar-parking\b/g, "car parking"],
    [/\bVaastu-compliant\b/g, "Vaastu compliant"],
    [/\bRERA-registered\b/g, "RERA registered"],
  ],
  hi: [
    [/नेट बुकिंग/g, "नई बुकिंग"],
    [/कांदिवली स्टेशन व नए/g, "नए"],
  ],
  mr: [
    [/नेट बुकिंग/g, "नवीन बुकिंग"],
    [/कांदिवली स्टेशन व नवीन/g, "नवीन"],
  ],
  gu: [
    [/નેટ બુકિંગ/g, "નવી બુકિંગ"],
    [/કાંદિવલી સ્ટેશન તથા નવા/g, "નવા"],
  ],
};

const LOCS: Loc[] = ["en", "hi", "mr", "gu"];

function fixText(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  let changed = false;
  const next: Record<string, unknown> = { ...(value as Localized) };
  for (const loc of LOCS) {
    const text = next[loc];
    if (typeof text !== "string") continue;
    const fixed = TYPOS[loc].reduce((t, [re, to]) => t.replace(re, to), text);
    if (fixed !== text) {
      next[loc] = fixed;
      changed = true;
    }
  }
  return changed ? next : value;
}

export function repairProjectLocales<P extends { summary?: unknown; body?: unknown } | null | undefined>(
  slug: string,
  project: P,
): P {
  if (!project) return project;
  let summary = fixText(project.summary);
  let body = fixText(project.body);

  const interest = INTEREST[slug];
  if (interest?.summary) summary = { ...(summary as Localized), ...interest.summary };
  if (interest?.body) body = { ...(body as Localized), ...interest.body };
  const en = ENGLISH_BODY[slug];
  if (en) body = { ...(body as Localized), en };

  if (summary !== project.summary || body !== project.body) {
    project = { ...project, summary, body } as P;
  }
  return project;
}
