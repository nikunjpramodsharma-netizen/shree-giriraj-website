/**
 * Corrections for project text that was entered wrongly in the CMS.
 *
 * On 18 September 2026 the site audit found that the Gujarati summary and
 * body of one project had been saved as a copy of the English, so the
 * Gujarati page showed English and repeated the English meta description.
 * The CMS write token was retired the same day, so the correction lives here.
 *
 * A fix applies ONLY while the CMS value is still a copy of the English. The
 * moment someone saves a real translation in the Studio, the CMS wins again
 * and the entry below simply stops being used.
 */

type Localized = Partial<Record<"en" | "hi" | "mr" | "gu", unknown>>;

const FIXES: Record<string, Partial<Record<"summary" | "body", Partial<Record<"hi" | "mr" | "gu", string>>>>> = {
  "luxury-living-punit-nagar": {
    summary: {
      gu: "બોરીવલી વેસ્ટના પુનિત નગર, સાઈબાબા નગરમાં આવનારો રહેણાંક પ્રોજેક્ટ, હાલ એક્સપ્રેશન ઓફ ઇન્ટરેસ્ટ માટે ખુલ્લો.",
    },
    body: {
      gu: "બોરીવલી વેસ્ટના પુનિત નગર (સાઈબાબા નગર)માં આવનારો આ પ્રોજેક્ટ ઔપચારિક બુકિંગ પહેલાં એક્સપ્રેશન ઓફ ઇન્ટરેસ્ટના તબક્કામાં છે. બુકિંગ ખૂલે ત્યારે યુનિટની પસંદગી અને કિંમતમાં સૌથી પહેલાં પહોંચવાનો શ્રેષ્ઠ રસ્તો વહેલો રસ નોંધાવવો છે. હાલની EOI શરતો અને અપેક્ષિત સમયરેખા માટે અમારો સંપર્ક કરો.",
    },
  },
};

/**
 * English typos saved in the CMS, corrected here for the same reason as the
 * locale fixes above. Only plain text fields are touched.
 */
const ENGLISH_TYPOS: [RegExp, string][] = [[/\bnet bookings\b/g, "new bookings"]];

function fixEnglish(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const en = (value as Localized).en;
  if (typeof en !== "string") return value;
  const fixed = ENGLISH_TYPOS.reduce((t, [re, to]) => t.replace(re, to), en);
  return fixed === en ? value : { ...(value as Localized), en: fixed };
}

export function repairProjectLocales<P extends { summary?: unknown; body?: unknown } | null | undefined>(
  slug: string,
  project: P,
): P {
  if (!project) return project;
  const summary = fixEnglish(project.summary);
  const body = fixEnglish(project.body);
  if (summary !== project.summary || body !== project.body) {
    project = { ...project, summary, body } as P;
  }
  const fix = FIXES[slug];
  if (!project || !fix) return project;
  const out = { ...project } as Record<string, unknown>;
  for (const field of ["summary", "body"] as const) {
    const wanted = fix[field];
    const current = out[field] as Localized | undefined;
    if (!wanted || !current || typeof current !== "object") continue;
    const next: Localized = { ...current };
    for (const [loc, text] of Object.entries(wanted)) {
      const l = loc as "hi" | "mr" | "gu";
      if (next[l] === undefined || next[l] === null || next[l] === "" || next[l] === current.en) next[l] = text;
    }
    out[field] = next;
  }
  return out as P;
}
