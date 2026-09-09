/**
 * The About page's readiness gate and the questions still outstanding.
 *
 * This lives in a library rather than inside the route because two places need
 * to agree about it: the page, which decides whether to emit noindex, and the
 * sitemap, which must not advertise a URL that is noindexed. Those two sat in
 * different files and drifted, so /about was submitted for indexing and told
 * Google not to index it in the same breath.
 *
 * Flip STORY_IS_WRITTEN the moment the prompts below are answered and the prose
 * replaces them. Nothing else needs changing: the page drops its draft notice
 * and the sitemap picks the URL up on the next build.
 */

export const STORY_IS_WRITTEN = false;

export type StorySection = { heading: string; prompts: string[] };

export const STORY_PROMPTS: StorySection[] = [
  {
    heading: "How it started",
    prompts: [
      "Who started it in 1996, and what were they doing before?",
      "What did Borivali look like as a property market then, compared with now?",
      "Was there a moment early on that set how you work?",
    ],
  },
  {
    heading: "How we work, and why",
    prompts: [
      "What do you do differently from a portal or a larger agency?",
      "What kind of client do you work best with, and who are you not for?",
      "Is there a deal you turned down, and why? That single answer would do more for trust than anything else on this page.",
    ],
  },
  {
    heading: "What has changed since 1996",
    prompts: [
      "What has RERA actually changed for a buyer here?",
      "What do people get wrong now that they did not get wrong before?",
    ],
  },
];

/**
 * The founder.
 *
 * Confirmed by the owner on 8 September 2026: Shree Giriraj was founded and is
 * run by Pramod Kishanlal Sharma. That is the whole of what is confirmed, so
 * that is the whole of what this says. No invented biography, no invented
 * previous career, no invented quote.
 *
 * `photo` was null until 9 September 2026, rendering a monogram: an honest
 * empty state rather than a stock face wearing somebody's real name. The
 * About hero used to do exactly that, captioning three foreign models as
 * "the Shree Giriraj team", so the rule stands: a real person's name never
 * sits next to a face that is not his.
 *
 * The portrait was supplied by the owner on 9 September 2026 and identified
 * by him as Pramod Sharma. The file he supplied carried a ChatGPT image name,
 * so it is at minimum AI processed; he chose it for the page knowingly. It is
 * stored as an 800 by 800 head and shoulders crop, because the page renders it
 * in a 96 pixel circle and a full length frame would show a lapel, not a face.
 * The null branch and the monogram stay in the component in case the photo is
 * ever pulled.
 */
export const FOUNDER = {
  name: "Pramod Kishanlal Sharma",
  role: "Founder",
  /** Null renders the monogram. */
  photo: "/team/pramod-sharma.jpg" as string | null,
} as const;

/** Initials for the placeholder monogram, derived so they cannot drift. */
export function founderInitials(): string {
  const parts = FOUNDER.name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * About page questions.
 *
 * The rest of the site carries a FAQ block on every service, tool and article
 * for answer engines, and About was the gap. Every answer here is drawn from a
 * fact already confirmed by the owner and already stated elsewhere on the site:
 * the founder, the two dates, the MahaRERA number, the address and the six
 * services. Nothing about awards, deal volume, client numbers or years of
 * "experience" beyond the two dates, because none of that is confirmed.
 *
 * The two dates are the point of the second question. In real estate since
 * 1996, at this office since 2005. The site said "the same shop since 1996"
 * in several places until the owner corrected it, so it is answered head on
 * rather than left to be inferred.
 */
export type AboutFaq = { q: string; a: string };

export const ABOUT_FAQS: AboutFaq[] = [
  {
    q: "Who runs Shree Giriraj Real Estate?",
    a: "Shree Giriraj Real Estate was founded by Pramod Kishanlal Sharma, who still runs it from the firm's shop in Chikoowadi, Borivali West. It is a family run agency rather than a franchise or a branch of a larger network, so the person who answers the phone is the person handling the file.",
  },
  {
    q: "How long has Shree Giriraj been in property?",
    a: "The firm has worked in real estate since 1996 and has operated from its current Borivali West office since 2005. Those are two different dates and the site keeps them apart: nearly thirty years in the trade, and twenty years at this particular address in Chikoowadi.",
  },
  {
    q: "Is Shree Giriraj a MahaRERA registered agent?",
    a: "Yes. The MahaRERA agent registration number is A51800005726. Maharashtra requires any agent facilitating the sale of a registered project to hold one, and the number can be checked for free on the MahaRERA portal against the firm's name before you deal with anybody.",
  },
  {
    q: "Which areas does Shree Giriraj cover?",
    a: "Borivali, Kandivali and Malad, covering both the west and east sides of each. Dahisar and Goregaon are handled occasionally rather than as core markets. The firm works three suburbs properly instead of claiming to cover the whole city, because pocket level knowledge is what actually changes a price here.",
  },
  {
    q: "What does Shree Giriraj do?",
    a: "Six things: resale flats, rentals, new project bookings, property investment advisory, commercial property and plots, and interior and civil work. Resale is the main business. The firm handles a transaction end to end, from shortlisting and site visits through negotiation, documentation and registration.",
  },
  {
    q: "Where is the office?",
    a: "Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. The commercial complex is known locally as Garden Groove Shopping Centre, which is the same place, so either name will get you to the door.",
  },
];
