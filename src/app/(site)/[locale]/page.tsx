import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import EnglishLink from "next/link";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  featuredProjectsGridQuery,
  allProjectsCarouselQuery,
  faqsQuery,
} from "@/sanity/queries";
import { site, waLink } from "@/lib/config";
import { HeroRotator, type HeroSlide, type HeroOpener } from "@/components/HeroRotator";
import { ChecksAccordion } from "@/components/ChecksAccordion";
import { AreaSwitcher } from "@/components/AreaSwitcher";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { projectFallback } from "@/lib/project-images";
import { AREAS } from "@/lib/areas";
import { SituationTool } from "@/components/SituationTool";
import { ServiceTrack } from "@/components/ServiceTrack";
import {
  CHECKS,
  AREA_PANELS,
  SITUATIONS,
  SITUATION_AREAS,
  PROPERTY_TYPES,
  TYPED_INTENTS,
  SERVICE_PANELS,
} from "@/lib/homepage-content";
import { ContactCTA } from "@/components/ContactCTA";
import { FAQSection } from "@/components/FAQSection";
import { TestimonialMarquee } from "@/components/TestimonialMarquee";
import { TESTIMONIALS, GOOGLE_RATING } from "@/lib/testimonials";
import { Reveal } from "@/components/Reveal";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";
import { getLowestPriceConfig } from "@/lib/project-helpers";
import type { Metadata } from "next";
import { pageUrls } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { getAllPosts } from "@/lib/posts";
import { postVisual } from "@/lib/blog";
import { graph, organizationNode, websiteNode, faqNode } from "@/lib/schema";
import { tr, localizeDeep } from "@/lib/copy-i18n";
import { CountUp } from "@/components/motion/CountUp";
import { KineticLine } from "@/components/motion/KineticLine";
import { InView } from "@/components/motion/InView";

/**
 * PLACEHOLDER PHOTOGRAPHY. Stock images from Pexels, not Borivali, Kandivali
 * or Malad. Replace with real local photography before launch.
 */
const HERO_OPENER: HeroOpener = {
  src: "/hero/00-opener.mp4",
  poster: "/hero/00-opener-poster.jpg",
};

const HERO_SLIDES: HeroSlide[] = [
  { src: "/hero/01-mumbai-towers.jpg", alt: "Residential towers in the Mumbai skyline" },
  { src: "/hero/02-highrise.jpg", alt: "Modern high rise apartment buildings" },
  { src: "/hero/03-interior.jpg", alt: "A living room with city views through full height windows" },
  { src: "/hero/04-rooftop.jpg", alt: "A rooftop pool deck overlooking the city" },
];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Self canonical, plus the full four locale cluster. The homepage is
  // genuinely translated in all four, so the whole set is correct here.
  return { ...pageUrls(params.locale, "/") };
}

// Re-fetch content periodically so CMS edits show up without a redeploy.
export const revalidate = 60;

type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type GridProject = {
  _id: string;
  name: string;
  slug: { current: string };
  location?: string;
  coverImage?: any;
  configurations?: Config[];
};

type Faq = {
  _id: string;
  question: LocalizedValue<string>;
  answer: LocalizedValue<string>;
  category?: string;
};

// Static skyline silhouettes for the Areas cards, in the site's own brand colors.
// Plain data (not JSX) so it renders via .map() inside the component, not at module scope.
// Placeholder until real Borivali/Kandivali/Malad photography is available.
type SkylineRect = { x: number; y: number; w: number; h: number; fill: string };
const AREA_SKYLINES: SkylineRect[][] = [
  [
    { x: 20, y: 60, w: 40, h: 90, fill: "#151b3d" },
    { x: 70, y: 30, w: 35, h: 120, fill: "#151b3d" },
    { x: 115, y: 70, w: 45, h: 80, fill: "#1c2450" },
    { x: 170, y: 45, w: 38, h: 105, fill: "#151b3d" },
    { x: 220, y: 80, w: 40, h: 70, fill: "#1c2450" },
    { x: 270, y: 55, w: 35, h: 95, fill: "#151b3d" },
    { x: 315, y: 75, w: 45, h: 75, fill: "#1c2450" },
    { x: 90, y: 45, w: 4, h: 4, fill: "#b8875a" },
    { x: 185, y: 65, w: 4, h: 4, fill: "#b8875a" },
    { x: 285, y: 75, w: 4, h: 4, fill: "#b8875a" },
  ],
  [
    { x: 30, y: 50, w: 42, h: 100, fill: "#151b3d" },
    { x: 85, y: 75, w: 38, h: 75, fill: "#1c2450" },
    { x: 135, y: 35, w: 40, h: 115, fill: "#151b3d" },
    { x: 188, y: 65, w: 35, h: 85, fill: "#1c2450" },
    { x: 235, y: 50, w: 42, h: 100, fill: "#151b3d" },
    { x: 290, y: 80, w: 36, h: 70, fill: "#1c2450" },
    { x: 48, y: 70, w: 4, h: 4, fill: "#b8875a" },
    { x: 150, y: 55, w: 4, h: 4, fill: "#b8875a" },
    { x: 250, y: 70, w: 4, h: 4, fill: "#b8875a" },
  ],
  [
    { x: 25, y: 70, w: 40, h: 80, fill: "#1c2450" },
    { x: 78, y: 40, w: 36, h: 110, fill: "#151b3d" },
    { x: 125, y: 60, w: 45, h: 90, fill: "#1c2450" },
    { x: 182, y: 30, w: 38, h: 120, fill: "#151b3d" },
    { x: 232, y: 65, w: 40, h: 85, fill: "#1c2450" },
    { x: 285, y: 50, w: 42, h: 100, fill: "#151b3d" },
    { x: 95, y: 55, w: 4, h: 4, fill: "#b8875a" },
    { x: 195, y: 45, w: 4, h: 4, fill: "#b8875a" },
    { x: 300, y: 65, w: 4, h: 4, fill: "#b8875a" },
  ],
  [
    { x: 18, y: 55, w: 38, h: 95, fill: "#151b3d" },
    { x: 68, y: 75, w: 40, h: 75, fill: "#1c2450" },
    { x: 118, y: 35, w: 36, h: 115, fill: "#151b3d" },
    { x: 165, y: 60, w: 42, h: 90, fill: "#1c2450" },
    { x: 218, y: 45, w: 38, h: 105, fill: "#151b3d" },
    { x: 268, y: 70, w: 40, h: 80, fill: "#1c2450" },
    { x: 320, y: 55, w: 36, h: 95, fill: "#151b3d" },
    { x: 85, y: 60, w: 4, h: 4, fill: "#b8875a" },
    { x: 235, y: 50, w: 4, h: 4, fill: "#b8875a" },
    { x: 335, y: 60, w: 4, h: 4, fill: "#b8875a" },
  ],
  [
    { x: 22, y: 65, w: 42, h: 85, fill: "#1c2450" },
    { x: 75, y: 30, w: 38, h: 120, fill: "#151b3d" },
    { x: 128, y: 55, w: 40, h: 95, fill: "#1c2450" },
    { x: 178, y: 70, w: 36, h: 80, fill: "#151b3d" },
    { x: 225, y: 40, w: 42, h: 110, fill: "#1c2450" },
    { x: 278, y: 60, w: 38, h: 90, fill: "#151b3d" },
    { x: 105, y: 50, w: 4, h: 4, fill: "#b8875a" },
    { x: 205, y: 65, w: 4, h: 4, fill: "#b8875a" },
    { x: 295, y: 55, w: 4, h: 4, fill: "#b8875a" },
  ],
];

type CompareValue = true | false | "partial";
type CompareRow = { key: string; us: CompareValue; portals: CompareValue; brokers: CompareValue };
const COMPARE_ROWS: CompareRow[] = [
  // Marks are judged against what each service actually does, 16 September
  // 2026. 99acres and MagicBricks are listing platforms: they show what owners
  // and agents upload and sell visibility. NoBroker connects tenants and
  // buyers to owners directly, verifies owners for some plans, and sells rent
  // agreement and paid plans up front. "Sometimes" is where a portal offers a
  // partial or paid version of the thing.
  { key: "row1", us: true, portals: false, brokers: false },
  { key: "row2", us: true, portals: false, brokers: "partial" },
  { key: "row3", us: true, portals: false, brokers: false },
  { key: "row4", us: true, portals: false, brokers: "partial" },
  { key: "row5", us: true, portals: "partial", brokers: false },
  { key: "row6", us: true, portals: false, brokers: "partial" },
  { key: "row7", us: true, portals: false, brokers: false },
];

function CompareMark({
  value,
  labels,
  highlight = false,
}: {
  value: CompareValue;
  labels: { yes: string; partial: string; no: string };
  highlight?: boolean;
}) {
  if (value === true) {
    return (
      <span
        className={`inline-flex items-center gap-2 text-sm font-semibold ${
          highlight ? "text-brand-indigo" : "text-muted"
        }`}
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 fill-bronze">
          <circle cx="10" cy="10" r="10" opacity="0.15" />
          <path
            d="M6 10.2l2.4 2.4L14.5 6.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {labels.yes}
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-muted">
        <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 fill-brand-indigo/15">
          <circle cx="10" cy="10" r="10" />
          <path d="M6 10h8" stroke="#1c2450" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {labels.partial}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted/70">
      <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 fill-ink/10">
        <circle cx="10" cy="10" r="10" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="#5c6072" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {labels.no}
    </span>
  );
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;

  const [
    projects,
    faqs,
    tHero,
    tServices,
    tProjectsGrid,
    tTestimonials,
    tAreas,
    tFaq,
    tLeadForm,
    tShowcase,
    tCompare,
    tHandover,
    tBlog,
  ] = await Promise.all([
      client.fetch<GridProject[]>(featuredProjectsGridQuery),
      client.fetch<Faq[]>(faqsQuery),
      getTranslations({ locale, namespace: "hero" }),
      getTranslations({ locale, namespace: "services" }),
      getTranslations({ locale, namespace: "projectsGrid" }),
      getTranslations({ locale, namespace: "testimonials" }),
      getTranslations({ locale, namespace: "areas" }),
      getTranslations({ locale, namespace: "faq" }),
      getTranslations({ locale, namespace: "leadForm" }),
      getTranslations({ locale, namespace: "showcase" }),
      getTranslations({ locale, namespace: "compare" }),
      getTranslations({ locale, namespace: "handover" }),
      getTranslations({ locale, namespace: "blogPage" }),
    ]);

  const services = [
    { slug: "resale-flats", title: tServices("resaleTitle"), body: tServices("resaleBody") },
    { slug: "rentals", title: tServices("rentalsTitle"), body: tServices("rentalsBody") },
    { slug: "new-project-bookings", title: tServices("newProjectTitle"), body: tServices("newProjectBody") },
    { slug: "investment-advisory", title: tServices("investmentAdvisoryTitle"), body: tServices("investmentAdvisoryBody") },
    { slug: "commercial-plots", title: tServices("commercialTitle"), body: tServices("commercialBody") },
    { slug: "mhada-paperwork", title: tServices("mhadaTitle"), body: tServices("mhadaBody") },
    { slug: "interiors", title: tServices("interiorsTitle"), body: tServices("interiorsBody") },
  ];

  // Core markets only. Dahisar and Goregaon are served occasionally, not as
  // core markets, so they belong on the /areas page as extended coverage
  // rather than on the homepage. Their copy stays in messages/ for that page.
  const areas = [
    { name: "Borivali", body: tAreas("borivaliBody") },
    { name: "Kandivali", body: tAreas("kandivaliBody") },
    { name: "Malad", body: tAreas("maladBody") },
  ];

  // Literal class names so Tailwind's build-time scanner can find them (dynamic template strings won't work).
  /**
   * Only posts with nothing outstanding. A draft still carrying review
   * markers is served noindex and shows what it is waiting for, so linking
   * the homepage at one would put an unfinished article in front of a client.
   */
  const journalPosts = getAllPosts().filter((p) => p.isReady).slice(0, 3);

  const revealDelays = ["delay-0", "delay-100", "delay-200"];

  // The homepage's authored content is English in homepage-content.ts and is
  // translated here, once, at the page boundary. See copy-i18n.ts for why the
  // dictionary is keyed on the English string. Anything without an entry
  // falls back to English rather than to nothing.
  const t = (s: string) => tr(locale, s);
  const checks = localizeDeep(locale, CHECKS);
  const situations = localizeDeep(locale, SITUATIONS);
  const propertyTypes = localizeDeep(locale, PROPERTY_TYPES);
  const servicePanels = localizeDeep(locale, SERVICE_PANELS);
  const areaPanels = localizeDeep(locale, AREA_PANELS);
  // Placeholder review cards translate; the three real Google reviews stay
  // in the words they were posted in, because they are quotations.
  const testimonials = localizeDeep(locale, TESTIMONIALS);

  // One project reads as chosen. A grid reads as a shelf, which is the thing
  // we are deliberately not. Prefer the flagship, fall back to the first.
  const carouselProjects = await client
    .fetch<(GridProject & { summary?: Partial<Record<"en" | "hi" | "mr" | "gu", string>> })[]>(allProjectsCarouselQuery)
    .catch(() => [] as (GridProject & { summary?: Partial<Record<"en" | "hi" | "mr" | "gu", string>> })[]);
  const featured =
    projects?.find((p) => p.slug?.current === "jaswanti-jewel") ?? projects?.[0];

  const compareLabels = {
    yes: tCompare("legendYes"),
    partial: tCompare("legendPartial"),
    no: tCompare("legendNo"),
  };


  // Project cards no longer show masked prices like "₹2.** Cr" (they show a
  // rough "From about ₹2 Cr" since 7 Nov 2026), so the CMS question that
  // quoted the mask, and its answer about masking, are reworded here. The
  // CMS write token is retired.
  const MASK_QUESTION: Record<"en" | "hi" | "mr" | "gu", string> = {
    en: "Why don't you show exact project prices online?",
    hi: "आप प्रोजेक्ट की सटीक कीमतें ऑनलाइन क्यों नहीं दिखाते?",
    mr: "तुम्ही प्रकल्पांच्या अचूक किमती ऑनलाइन का दाखवत नाही?",
    gu: "તમે પ્રોજેક્ટની ચોક્કસ કિંમતો ઓનલાઇન કેમ નથી બતાવતા?",
  };
  const MASK_ANSWER: Record<"en" | "hi" | "mr" | "gu", string> = {
    en: "We show a rough \"from about\" price online because the exact figure changes with the floor, the view and what is still available. Message us on WhatsApp and we will send the current price sheet for the unit you like.",
    hi: "हम ऑनलाइन एक मोटा \"लगभग से शुरू\" भाव दिखाते हैं, क्योंकि सटीक कीमत मंज़िल, व्यू और उपलब्धता के साथ बदलती है। WhatsApp पर मैसेज करें, हम आपकी पसंद के यूनिट की ताज़ा प्राइस शीट भेज देंगे।",
    mr: "आम्ही ऑनलाइन एक अंदाजे \"सुमारे पासून\" दर दाखवतो, कारण अचूक किंमत मजला, व्ह्यू आणि उपलब्धतेनुसार बदलते. WhatsApp वर मेसेज करा, आम्ही तुम्हाला आवडलेल्या युनिटची ताजी प्राइस शीट पाठवू.",
    gu: "અમે ઓનલાઇન એક અંદાજિત \"લગભગ થી શરૂ\" ભાવ બતાવીએ છીએ, કારણ કે ચોક્કસ કિંમત માળ, વ્યૂ અને ઉપલબ્ધતા સાથે બદલાય છે. WhatsApp પર મેસેજ કરો, અમે તમને ગમતા યુનિટની તાજી પ્રાઇસ શીટ મોકલીશું.",
  };
  // English answers saved in the CMS as one 40 plus word sentence, split for
  // reading on a phone (owner's rule: no sentence over 25 words). Keyed by the
  // start of the CMS text; the other languages keep their own text.
  const EN_ANSWER_SPLIT: [string, string][] = [
    [
      "You'll need the seller's original title deed",
      "You need the seller's original title deed and the chain of past sale agreements. You also need the society's share certificate and its No Objection Certificate (NOC), and the latest property tax and maintenance receipts. Last, an encumbrance certificate shows the flat is free of loans or legal disputes. We verify all of this before you pay any token amount.",
    ],
  ];
  // Two CMS answers rewritten in code, all four languages, on 16 November
  // 2026. The stamp duty answer said "5-6%" (a dash, and vaguer than the
  // 6 and 5 percent the resale page states), and the deposit answer said "a
  // few months" where the site's rule is two to three months in newer
  // societies. Keyed by the start of the English question.
  const ANSWER_FIX: [string, Record<"en" | "hi" | "mr" | "gu", string>][] = [
    [
      "How much is stamp duty and registration",
      {
        en: "Stamp duty on a resale flat in Mumbai is 6 percent of the agreement value for a man, and 5 percent for a woman buying in her sole name. Registration is 1 percent, capped at ₹30,000. Both are charged on the agreement value or the ready reckoner value, whichever is higher. We work out the exact figure for your flat before you commit.",
        hi: "मुंबई में रीसेल फ्लैट पर स्टाम्प ड्यूटी पुरुष खरीदार के लिए एग्रीमेंट वैल्यू का 6 प्रतिशत है, और अकेले अपने नाम पर खरीदने वाली महिला के लिए 5 प्रतिशत। रजिस्ट्रेशन 1 प्रतिशत है, अधिकतम ₹30,000। दोनों एग्रीमेंट वैल्यू या रेडी रेकनर मूल्य में से जो ज़्यादा हो, उस पर लगते हैं। तय करने से पहले हम आपके फ्लैट का सटीक आंकड़ा निकाल देते हैं।",
        mr: "मुंबईत रीसेल फ्लॅटवर मुद्रांक शुल्क पुरुष खरेदीदारासाठी कराराच्या किमतीच्या 6 टक्के आहे, आणि स्वतःच्या एकट्या नावे घेणाऱ्या महिलेसाठी 5 टक्के. नोंदणी शुल्क 1 टक्का, कमाल ₹30,000. दोन्ही कराराची किंमत किंवा रेडी रेकनर मूल्य यांपैकी जे जास्त असेल त्यावर लागतात. ठरवण्याआधी आम्ही तुमच्या फ्लॅटसाठी अचूक आकडा काढून देतो.",
        gu: "મુંબઈમાં રીસેલ ફ્લેટ પર સ્ટેમ્પ ડ્યુટી પુરુષ ખરીદનાર માટે કરાર કિંમતના 6 ટકા છે, અને પોતાના એકલા નામે ખરીદતી મહિલા માટે 5 ટકા. રજિસ્ટ્રેશન 1 ટકો, મહત્તમ ₹30,000. બંને કરાર કિંમત કે રેડી રેકનર મૂલ્યમાંથી જે વધુ હોય તેના પર લાગે છે. નક્કી કરતાં પહેલાં અમે તમારા ફ્લેટનો ચોક્કસ આંકડો કાઢી આપીએ છીએ.",
      },
    ],
    [
      "How much deposit do I need",
      {
        en: "Two to three months' rent is the norm in newer societies in Borivali, Kandivali and Malad, and more in some older buildings. No Maharashtra law caps the deposit, so it is a term you can negotiate. We tell you the going rate for the building before you commit.",
        hi: "बोरिवली, कांदिवली और मलाड की नई सोसाइटियों में दो से तीन महीने का किराया डिपॉज़िट का चलन है, और कुछ पुरानी बिल्डिंगों में ज़्यादा। महाराष्ट्र का कोई कानून डिपॉज़िट की सीमा तय नहीं करता, इसलिए इस पर बात हो सकती है। तय करने से पहले हम आपको उस बिल्डिंग का चलता भाव बता देते हैं।",
        mr: "बोरिवली, कांदिवली आणि मलाडमधील नव्या सोसायट्यांत दोन ते तीन महिन्यांचे भाडे डिपॉझिट म्हणून घेण्याचा प्रघात आहे, आणि काही जुन्या इमारतींत जास्त. महाराष्ट्रातील कोणताही कायदा डिपॉझिटवर मर्यादा घालत नाही, म्हणून त्यावर बोलणी होऊ शकते. ठरवण्याआधी आम्ही तुम्हाला त्या इमारतीचा चालू दर सांगतो.",
        gu: "બોરીવલી, કાંદિવલી અને મલાડની નવી સોસાયટીઓમાં બે થી ત્રણ મહિનાનું ભાડું ડિપોઝિટ તરીકે લેવાનું ચલણ છે, અને કેટલીક જૂની બિલ્ડિંગોમાં વધુ. મહારાષ્ટ્રનો કોઈ કાયદો ડિપોઝિટની મર્યાદા નક્કી કરતો નથી, એટલે તેના પર વાટાઘાટ થઈ શકે છે. નક્કી કરતાં પહેલાં અમે તમને એ બિલ્ડિંગનો ચાલુ દર કહી દઈએ છીએ.",
      },
    ],
  ];
  const fixedFaqs = (faqs ?? []).map((f) => {
    const q = getLocalizedField(f.question, "en") ?? "";
    const a = getLocalizedField(f.answer, "en") ?? "";
    const split = EN_ANSWER_SPLIT.find(([start]) => a.startsWith(start));
    if (split) f = { ...f, answer: { ...(f.answer as object), en: split[1] } as Faq["answer"] };
    const fix = ANSWER_FIX.find(([start]) => q.startsWith(start));
    if (fix) f = { ...f, answer: { ...(f.answer as object), ...fix[1] } as Faq["answer"] };
    const fixQ = q.includes("₹2.**");
    const fixA = fixQ || /mask exact pricing/i.test(a);
    if (!fixQ && !fixA) return f;
    return {
      ...f,
      ...(fixQ ? { question: { ...(f.question as object), ...MASK_QUESTION } as Faq["question"] } : {}),
      ...(fixA ? { answer: { ...(f.answer as object), ...MASK_ANSWER } as Faq["answer"] } : {}),
    };
  });
  // Three questions added in code on 16 November 2026, in all four
  // languages: selling, what a flat is worth, and where the office is. The
  // owner wants more buying and selling enquiries, and the homepage had no
  // answer for a seller at all. The office answer carries the exact NAP
  // string from the Google Business Profile.
  const HOME_EXTRA_FAQS: Faq[] = [
    {
      _id: "home-sell",
      question: {
        en: "Can you help me sell my flat in Borivali, Kandivali or Malad?",
        hi: "क्या आप बोरिवली, कांदिवली या मलाड में मेरा फ्लैट बेचने में मदद करते हैं?",
        mr: "बोरिवली, कांदिवली किंवा मलाडमध्ये माझा फ्लॅट विकायला तुम्ही मदत करता का?",
        gu: "શું તમે બોરીવલી, કાંદિવલી કે મલાડમાં મારો ફ્લેટ વેચવામાં મદદ કરો છો?",
      },
      answer: {
        en: "Yes. Buying and selling resale flats has been our main business since 1996. Send the building, floor and size on WhatsApp, and we reply with a fair listing price, usually the same day. We get the papers ready before the flat is shown, bring buyers we have already met, and stay with the sale through registration.",
        hi: "हाँ। रीसेल फ्लैट खरीदना और बेचना 1996 से हमारा मुख्य काम है। WhatsApp पर बिल्डिंग, मंज़िल और साइज़ भेजिए, हम उचित लिस्टिंग कीमत के साथ जवाब देते हैं, आमतौर पर उसी दिन। फ्लैट दिखाने से पहले हम कागज़ तैयार करते हैं, ऐसे खरीदार लाते हैं जिनसे हम पहले मिल चुके हैं, और रजिस्ट्रेशन तक साथ रहते हैं।",
        mr: "होय. रीसेल फ्लॅटची खरेदी आणि विक्री हा 1996 पासून आमचा मुख्य व्यवसाय आहे. WhatsApp वर इमारत, मजला आणि आकार पाठवा, आम्ही योग्य लिस्टिंग किंमत कळवतो, बहुधा त्याच दिवशी. फ्लॅट दाखवण्याआधी आम्ही कागदपत्रे तयार करतो, आधीच भेटलेले खरेदीदार आणतो, आणि नोंदणीपर्यंत सोबत राहतो.",
        gu: "હા. રીસેલ ફ્લેટની ખરીદી અને વેચાણ 1996 થી અમારો મુખ્ય ધંધો છે. WhatsApp પર બિલ્ડિંગ, માળ અને સાઇઝ મોકલો, અમે વાજબી લિસ્ટિંગ કિંમત સાથે જવાબ આપીએ છીએ, સામાન્ય રીતે એ જ દિવસે. ફ્લેટ બતાવતાં પહેલાં અમે કાગળો તૈયાર કરીએ છીએ, પહેલેથી મળેલા ખરીદનારા લાવીએ છીએ, અને રજિસ્ટ્રેશન સુધી સાથે રહીએ છીએ.",
      },
    },
    {
      _id: "home-worth",
      question: {
        en: "What is my flat worth?",
        hi: "मेरा फ्लैट कितने का है?",
        mr: "माझ्या फ्लॅटची किंमत किती?",
        gu: "મારા ફ્લેટની કિંમત કેટલી?",
      },
      answer: {
        en: "Your flat is worth what a buyer in your pocket will pay this month. We give a free fair price opinion on WhatsApp, from current asking rates in your building and lane, the floor and the carpet area. The ready reckoner rate is the government's floor for stamp duty, not the market price.",
        hi: "आपका फ्लैट उतने का है जितना आपके इलाके का खरीदार इस महीने देगा। हम WhatsApp पर मुफ़्त, उचित कीमत की राय देते हैं, आपकी बिल्डिंग और गली के माँगे जा रहे भाव, मंज़िल और कारपेट एरिया के आधार पर। रेडी रेकनर रेट स्टाम्प ड्यूटी के लिए सरकार का न्यूनतम मूल्य है, बाज़ार भाव नहीं।",
        mr: "तुमच्या परिसरातील खरेदीदार या महिन्यात जेवढे देईल, तेवढीच तुमच्या फ्लॅटची किंमत. आम्ही WhatsApp वर किमतीबद्दल मोफत, योग्य मत देतो, तुमच्या इमारतीतील आणि गल्लीतील मागितले जाणारे दर, मजला आणि कार्पेट एरिया यांवरून. रेडी रेकनर दर हे मुद्रांक शुल्कासाठी सरकारचे किमान मूल्य आहे, बाजारभाव नाही.",
        gu: "તમારા વિસ્તારનો ખરીદનાર આ મહિને જેટલું આપે, એટલી જ તમારા ફ્લેટની કિંમત. અમે WhatsApp પર કિંમત વિશે મફત, વાજબી અભિપ્રાય આપીએ છીએ, તમારી બિલ્ડિંગ અને ગલીના માંગવામાં આવતા દર, માળ અને કાર્પેટ એરિયા પરથી. રેડી રેકનર દર સ્ટેમ્પ ડ્યુટી માટે સરકારનું લઘુતમ મૂલ્ય છે, બજાર ભાવ નહીં.",
      },
    },
    {
      _id: "home-office",
      question: {
        en: "Where is your office in Borivali West?",
        hi: "बोरिवली वेस्ट में आपका दफ़्तर कहाँ है?",
        mr: "बोरिवली पश्चिममध्ये तुमचे कार्यालय कुठे आहे?",
        gu: "બોરીવલી વેસ્ટમાં તમારી ઑફિસ ક્યાં છે?",
      },
      answer: {
        en: `Shree Giriraj Real Estate is at ${site.address}, open ${site.hours.label}. The complex is also known locally as Garden Groove Shopping Centre. We are a MahaRERA registered agency, number ${site.rera}, and have worked from this office since ${site.officeSince}.`,
        hi: `श्री गिरिराज रियल एस्टेट ${site.address} पर है, सुबह 9 से रात 9 बजे तक, हफ़्ते के सातों दिन खुला। इस कॉम्प्लेक्स को स्थानीय लोग गार्डन ग्रूव शॉपिंग सेंटर भी कहते हैं। हम MahaRERA पंजीकृत एजेंसी हैं, पंजीकरण संख्या ${site.rera}, और ${site.officeSince} से इसी दफ़्तर से काम कर रहे हैं।`,
        mr: `श्री गिरिराज रिअल इस्टेट ${site.address} येथे आहे, सकाळी 9 ते रात्री 9, आठवड्याचे सातही दिवस उघडे. या संकुलाला स्थानिक लोक गार्डन ग्रूव्ह शॉपिंग सेंटर असेही म्हणतात. आम्ही MahaRERA नोंदणीकृत एजन्सी आहोत, नोंदणी क्रमांक ${site.rera}, आणि ${site.officeSince} पासून याच कार्यालयातून काम करतो.`,
        gu: `શ્રી ગિરિરાજ રિયલ એસ્ટેટ ${site.address} પર છે, સવારે 9 થી રાત્રે 9, અઠવાડિયાના સાતેય દિવસ ખુલ્લી. આ કૉમ્પ્લેક્સને સ્થાનિક લોકો ગાર્ડન ગ્રૂવ શોપિંગ સેન્ટર પણ કહે છે. અમે MahaRERA નોંધાયેલ એજન્સી છીએ, નોંધણી નંબર ${site.rera}, અને ${site.officeSince} થી આ જ ઑફિસથી કામ કરીએ છીએ.`,
      },
    },
  ];
  // Buying first (the CMS order), then selling and value, then the rest,
  // with the office last.
  const shownFaqs: Faq[] = [
    ...fixedFaqs.slice(0, 2),
    HOME_EXTRA_FAQS[0],
    HOME_EXTRA_FAQS[1],
    ...fixedFaqs.slice(2),
    HOME_EXTRA_FAQS[2],
  ];

  // Only the FAQs actually rendered on this page go into the markup. The
  // FAQSection below reads the same list, so the two cannot drift apart.
  const faqSchema = faqNode(
    shownFaqs.map((f) => ({
      question: getLocalizedField(f.question, locale) ?? "",
      answer: getLocalizedField(f.answer, locale) ?? "",
    })),
  );

  return (
    <>
      <JsonLd
        data={graph(organizationNode(), websiteNode(locale), faqSchema)}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <HeroRotator slides={HERO_SLIDES} opener={HERO_OPENER} />
        <div
          className="absolute inset-0 z-[3]"
          style={{
            background:
              "linear-gradient(100deg, rgba(21,27,61,0.88) 0%, rgba(21,27,61,0.68) 42%, rgba(21,27,61,0.28) 72%, rgba(21,27,61,0.5) 100%), linear-gradient(180deg, rgba(21,27,61,0.45) 0%, rgba(21,27,61,0) 30%, rgba(21,27,61,0.8) 100%)",
          }}
        />
        <div className="wrap relative z-[6] py-24">
          <div className="max-w-3xl">
            <div className="eyebrow text-bronze">
              {[...site.areas.map(t), t("Since {year}").replace("{year}", String(site.established))].join(" · ")}
            </div>
            {/* Two lines on purpose (owner, 20 September 2026): the offer, then
                the promise. Each part is its own block so it never wraps into
                three; the sizes step down on narrow screens to keep it so. The
                hero's accents (the line above, the promise, the rotating phrase
                and the button) are brushed bronze, the owner's choice that day. */}
            <h1 className="mt-6 text-[min(7.3vw,1.85rem)] font-semibold leading-[1.12] sm:text-5xl md:text-6xl">
              <span className="block">{tHero("headingPart1")}</span>
              <em className="block italic text-bronze">{tHero("headingEm")}</em>
            </h1>
            <p className="mt-6 max-w-[30em] text-lg text-paper/80">{tHero("body")}</p>
            <p className="mt-4 text-base text-paper/70">
              {t("Start with one line:")}{" "}
              <KineticLine
                className="font-semibold text-bronze"
                phrases={[
                  t("a 2 BHK near Chikoowadi"),
                  t("a shop on L.T. Road"),
                  t("a 1 BHK to rent in Charkop"),
                  t("a flat in Malad West that earns rent"),
                  t("a MHADA flat that needs its transfer done"),
                  t("a booking in a new launch, checked first"),
                ]}
              />
            </p>
            <div className="mt-8">
              <a
                href={waLink(tHero("whatsappMessage"))}
                target="_blank"
                rel="noopener"
                className="btn btn-bronze"
              >
                {tHero("ctaWhatsapp")}
              </a>
              {/* The promise that stands in for a listings page (owner, 21
                  September 2026): WhatsApp is the main route, and the reply
                  with matching options is what the visitor is signing up for. */}
              <p className="mt-3 max-w-[32em] text-sm text-paper/70">{tHero("whatsappPromise")}</p>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { n: t("Since {year}").replace("{year}", String(site.established)), l: tHero("statYears") },
                { n: String(site.areas.length), l: tHero("statSuburbs") },
                { n: tHero("statRera"), l: site.rera },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-semibold text-white sm:text-3xl">
                    {/^\d+$/.test(s.n) ? <CountUp value={Number(s.n)} /> : s.n}
                  </div>
                  <div className="text-sm text-paper/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* 02 SITUATION.
          Moved directly under the hero. It was fourth, below the checks and
          the areas, which put the one interactive thing on the page about
          three screens down. It is a lead magnet, so it belongs where
          attention still is. */}
      <section className="py-24">
        <div className="wrap">
          <Reveal className="mb-11 max-w-2xl">
            <div className="eyebrow">{t("Two questions")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {t("Tell us what you are looking for. We will tell you where to start.")}
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-muted">
              {t(
                "Pick what you are doing and where. We will tell you what matters most, before you speak to anybody, including us.",
              )}
            </p>
          </Reveal>
          <SituationTool
            situations={situations}
            types={propertyTypes}
            typedIntents={TYPED_INTENTS}
            areas={SITUATION_AREAS}
            locale={locale}
          />
        </div>
      </section>

      {/* 03 SERVICES */}
      <section id="services" className="bg-paper-alt py-24">
        <div className="wrap">
          <Reveal className="mb-11 max-w-2xl">
            <div className="eyebrow">{tServices("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {t("Resale is the business. The rest is what a move actually needs.")}
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-muted">
              {t(
                "Most people meet us over one flat and come back for the next three things. That is why all of it sits under one roof instead of being handed to a stranger at every step.",
              )}
            </p>
            <p className="mt-3 text-[1.04rem]">
              <Link prefetch={false} href="/services/mhada-paperwork" className="font-semibold text-brand-indigo underline underline-offset-4">
                {t("MHADA flat anywhere in Mumbai? We file its transfer and no objection certificates")}
              </Link>
            </p>
          </Reveal>
        </div>
        <ServiceTrack panels={servicePanels} locale={locale} />
      </section>

      {/* COMPARE */}
      <section className="py-24">
        <div className="wrap">
          <Reveal className="mb-13 max-w-2xl">
            <div className="eyebrow">{tCompare("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {tCompare("heading")}
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-muted">{tCompare("intro")}</p>
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto rounded-2xl border border-brand-indigo/10">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-brand-indigo/10 bg-paper-alt">
                    <th className="p-5 text-sm font-semibold text-muted">&nbsp;</th>
                    <th className="p-5 text-sm font-semibold text-brand-indigo">{tCompare("colUs")}</th>
                    <th className="p-5 text-sm font-semibold text-muted">{tCompare("colPortals")}</th>
                    <th className="p-5 text-sm font-semibold text-muted">{tCompare("colBrokers")}</th>
                  </tr>
                </thead>
                <InView as="tbody" className="cascade" threshold={0.1}>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.key}
                      style={{ ["--i" as string]: i }}
                      className={i % 2 === 1 ? "bg-paper-alt/50" : undefined}
                    >
                      <td className="p-5 text-sm text-ink">{tCompare(row.key)}</td>
                      <td className="p-5">
                        <CompareMark value={row.us} labels={compareLabels} highlight />
                      </td>
                      <td className="p-5">
                        <CompareMark value={row.portals} labels={compareLabels} />
                      </td>
                      <td className="p-5">
                        <CompareMark value={row.brokers} labels={compareLabels} />
                      </td>
                    </tr>
                  ))}
                </InView>
              </table>
            </div>
            <p className="mt-4 max-w-[70ch] text-sm text-muted">{tCompare("footnote")}</p>
          </Reveal>
        </div>
      </section>
      {/* 04 CHECKS */}
      {/* Alt tone so it separates from the compare section above it. Removing
          the people section changed the rhythm, and two flat light sections
          back to back read as one long block with no boundary. */}
      <section className="bg-paper-alt py-24">
        <div className="wrap">
          <Reveal className="mb-11 max-w-2xl">
            <div className="eyebrow">{t("Before you sign")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {t("Six things we look at that a listing will never tell you")}
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-muted">
              {t("This is the part of the job that does not fit in a photograph.")}
            </p>
          </Reveal>
          <div className="grid gap-9 md:grid-cols-[.85fr_1.15fr] md:items-start md:gap-14">
            <div className="relative aspect-[5/4] overflow-hidden rounded-xl md:sticky md:top-6">
              <Image
                src="/sections/checks.jpg"
                alt="Keys and building plans on a desk"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <ChecksAccordion checks={checks} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS. The written Google reviews on a continuous rail, with
          the Google rating linked above them. Placeholder cards until the
          owner supplies the real ones; see testimonials.ts for the gate and
          for why the rating reads 5.0. Sits between the checks and the areas
          so the proof follows the promise. */}
      <section className="overflow-hidden py-24">
        <div className="wrap">
          <Reveal className="mb-8 max-w-2xl">
            <div className="eyebrow">{tTestimonials("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {tTestimonials("heading")}
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <TestimonialMarquee
            items={testimonials}
            labels={{
              onGoogle: tTestimonials("onGoogle"),
              readReviews: tTestimonials("readReviews"),
              placeholder: tTestimonials("placeholder"),
              postedOn: tTestimonials("postedOn"),
              reviewCount: GOOGLE_RATING.count
                ? tTestimonials("reviewCount", { count: GOOGLE_RATING.count })
                : undefined,
            }}
          />
        </Reveal>
      </section>

      {/* 05 AREAS */}
      <section className="bg-brand-indigo-deep py-24 text-paper">
        <div className="wrap">
          <Reveal className="mb-11 max-w-2xl">
            <div className="eyebrow text-bronze">{tAreas("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-white md:text-4xl">
              {t("In these three suburbs since 1996, at this office since 2005")}
            </h2>
            <p className="mt-3.5 text-[1.04rem] text-paper/70">
              {t("Pick the one you are looking at.")}
            </p>
          </Reveal>
          <AreaSwitcher
            panels={areaPanels}
            locale={locale}
            // The same rotating pocket cards, with their own pictures, that each
            // suburb's page carries. The owner asked for exactly these here.
            scenes={locale === "en" ? Object.fromEntries(AREAS.map((a) => [a.slug, a.motion.pocketScenes])) : undefined}
          />
          {/* The buying and selling routes, straight from the suburbs. The
              flats for sale pages are English only, so they bypass the
              locale Link; the resale service is translated, so it keeps it. */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-sm">
            {[
              { href: "/areas/borivali-west/flats-for-sale", label: t("Flats for sale in Borivali West") },
              { href: "/areas/kandivali/flats-for-sale", label: t("Flats for sale in Kandivali West") },
              { href: "/areas/malad/flats-for-sale", label: t("Flats for sale in Malad West") },
              { href: "/areas/borivali-west/real-estate-agency", label: t("Real estate agency in Borivali West") },
              { href: "/areas/kandivali/real-estate-agency", label: t("Real estate agency in Kandivali West") },
              { href: "/areas/malad/real-estate-agency", label: t("Real estate agency in Malad West") },
            ].map((l) => (
              <EnglishLink
                key={l.href}
                prefetch={false}
                href={l.href}
                className="font-semibold text-white underline decoration-bronze underline-offset-4"
              >
                {l.label}
              </EnglishLink>
            ))}
            <Link
              prefetch={false}
              href="/services/resale-flats"
              className="font-semibold text-bronze underline underline-offset-4"
            >
              {t("Selling your flat? Get a free price opinion")}
            </Link>
          </div>
        </div>
      </section>

      {/* 07 PROJECTS. Every project in turn, two seconds each, pausing under a
          cursor. A project only appears in a language it has a page in. */}
      <ProjectCarousel
        slides={(carouselProjects ?? [])
          .filter((p) => p.slug?.current && (locale === "en" || Boolean(p.summary?.[locale as "hi" | "mr" | "gu"])))
          .map((p) => ({
            slug: p.slug.current,
            name: p.name,
            location: p.location,
            image: p.coverImage ? urlFor(p.coverImage).width(1600).height(1120).url() : projectFallback(p.slug.current),
            configs: (p.configurations ?? []).map((c) => ({
              type: (c.type ?? "").replace(/\s*[\u2013\u2014]\s*/g, " to "),
              price: c.displayPrice,
            })),
          }))}
        labels={{
          eyebrow: tProjectsGrid("eyebrow"),
          note: t("Exact all inclusive pricing and floor availability shared on request. Every figure is verified against the builder sheet before it goes out."),
          see: t("See the project"),
          viewAll: tProjectsGrid("viewAll"),
        }}
      />

      {/* FAQ */}
      <Reveal>
        <FAQSection
          faqs={shownFaqs}
          locale={locale}
          eyebrow={tFaq("eyebrow")}
          heading={tFaq("heading")}
        />
      </Reveal>
      {/* 11 JOURNAL.
          Real posts, not invented ones. This section previously advertised
          three articles that did not exist, with titles written before the
          blog did, and linked all three at /blog so they would not 404. The
          titles were still fiction on a live page.

          Now it lists genuinely publishable posts, and hides itself entirely
          when there are none, the same gate used for the team and the
          testimonials. It reappears on its own the moment a draft is
          finished. */}
      {journalPosts.length > 0 && (
        <section className="py-24">
          <div className="wrap">
            <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="eyebrow">{t("Worth reading")}</div>
                <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
                  {t("What we write when nobody is buying anything")}
                </h2>
                {locale !== "en" && (
                  <p className="mt-3.5 text-[1.04rem] text-muted">{tBlog("englishOnly")}</p>
                )}
              </div>
              <EnglishLink prefetch={false} href="/blog" className="text-sm font-semibold text-brand-blue">
                {t("All articles")}
              </EnglishLink>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {journalPosts.map((p, i) => {
                const visual = postVisual(p);
                return (
                  <Reveal key={p.slug} className={revealDelays[i % 3]}>
                    <EnglishLink prefetch={false}
                      href={"/blog/" + p.slug}
                      className="block h-full overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-[14/9]">
                        <Image
                          src={visual.image}
                          alt={visual.alt}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        {p.category && (
                          <div className="font-mono text-[0.62rem] uppercase tracking-[0.06em] text-bronze-deep">
                            {p.category}
                          </div>
                        )}
                        <h3 className="mt-2 text-lg text-brand-indigo">{p.title}</h3>
                        {p.answer && (
                          <p className="mt-1.5 line-clamp-3 text-[0.88rem] text-muted">
                            {p.answer}
                          </p>
                        )}
                      </div>
                    </EnglishLink>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* LEAD FORM */}
      <section id="enquire" className="bg-brand-indigo-deep text-paper">
        <Reveal>
        <div className="wrap grid items-center gap-14 py-24 md:grid-cols-2">
          <div>
            <div className="eyebrow text-bronze">{tLeadForm("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl md:text-4xl">
              {tLeadForm("headingPart1")}
              <em className="italic text-bronze">{tLeadForm("headingEm")}</em>
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
          <ContactCTA
            formLocation="homepage_contact"
            locale={locale}
            defaultOpen
            tone="dark"
          />
        </div>
        </Reveal>
      </section>
    </>
  );
}
