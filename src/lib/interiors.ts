/**
 * Interiors scope builder.
 *
 * WHY THIS IS NOT A COST CALCULATOR
 *
 * The interiors cluster is the highest value commercial position on this site,
 * at roughly 2.01 dollars a click, and Livspace and HomeLane both run cost
 * calculators. The obvious move is to copy them. Two problems with that.
 *
 * First, we have no verified cost bands. Inventing them would be the exact
 * thing this whole site refuses to do, and interiors pricing is the kind of
 * number somebody actually commits money against.
 *
 * Second, and more interesting: their calculators exist to capture a lead. You
 * put in a flat size, you get a number, they get your phone. The number is not
 * the point of the tool for them.
 *
 * So this does the thing their tools cannot do without undermining themselves.
 * It produces a SCOPE, in quantities, that you take to three designers to get
 * comparable quotes back.
 *
 * That is straight out of our own interiors draft: "A quote you can actually
 * judge has three things in it: quantities, specifications and exclusions.
 * Twelve running feet of wardrobe in a named board, not bedroom wardrobes."
 * A buyer with this document in hand can compare two quotes properly, which is
 * the thing that actually protects them.
 *
 * COSTS SLOT IN LATER. Set the bands on an item and the tool starts showing
 * ranges alongside the quantities. Until then it shows scope only, which is
 * useful on its own. See COST_BANDS_READY.
 */

export type Unit = "rft" | "sqft" | "nos";

export const UNIT_LABEL: Record<Unit, string> = {
  rft: "running ft",
  sqft: "sq ft",
  nos: "nos",
};

export type ScopeItem = {
  id: string;
  group: string;
  label: string;
  unit: Unit;
  /** Default quantity for a 2 BHK, used as the starting point. */
  defaultQty: number;
  /** What to specify, so the quote is comparable rather than a lump sum. */
  specPrompt: string;
  /**
   * Cost band per unit, in rupees, once verified. NULL until then, and nothing
   * invents one. See content/PLACEHOLDERS.md.
   */
  band: { low: number; high: number } | null;
};

export const SCOPE: ScopeItem[] = [
  {
    id: "wardrobe",
    group: "Joinery",
    label: "Wardrobes",
    unit: "rft",
    defaultQty: 12,
    specPrompt: "Board type and brand, finish, shutter type, internal fittings",
    band: null,
  },
  {
    id: "kitchen",
    group: "Joinery",
    label: "Modular kitchen",
    unit: "rft",
    defaultQty: 10,
    specPrompt:
      "Carcass and shutter material, counter, hardware brand, tall units",
    band: null,
  },
  {
    id: "tvunit",
    group: "Joinery",
    label: "TV unit and storage",
    unit: "rft",
    defaultQty: 8,
    specPrompt: "Material, finish, whether wall mounted or floor standing",
    band: null,
  },
  {
    id: "beds",
    group: "Joinery",
    label: "Beds with storage",
    unit: "nos",
    defaultQty: 2,
    specPrompt: "Size, storage type, headboard finish",
    band: null,
  },
  {
    id: "ceiling",
    group: "Civil and finishes",
    label: "False ceiling",
    unit: "sqft",
    defaultQty: 300,
    specPrompt: "Full or peripheral, cove lighting, material",
    band: null,
  },
  {
    id: "painting",
    group: "Civil and finishes",
    label: "Painting",
    unit: "sqft",
    defaultQty: 1200,
    specPrompt: "Paint brand and grade, number of coats, putty included or not",
    band: null,
  },
  {
    id: "flooring",
    group: "Civil and finishes",
    label: "Flooring",
    unit: "sqft",
    defaultQty: 0,
    specPrompt: "Material, size, whether the existing floor is being removed",
    band: null,
  },
  {
    id: "electrical",
    group: "Services",
    label: "Electrical points",
    unit: "nos",
    defaultQty: 20,
    specPrompt: "New points versus shifted, switch brand, load upgrade needed",
    band: null,
  },
  {
    id: "plumbing",
    group: "Services",
    label: "Plumbing changes",
    unit: "nos",
    defaultQty: 0,
    specPrompt: "Points moved, fittings included or supplied by you",
    band: null,
  },
];

/**
 * Flip to true once real bands exist on the items above. Until then the tool
 * shows scope only and says so, rather than showing a total of zero or a made
 * up range.
 */
export const COST_BANDS_READY = SCOPE.some((i) => i.band !== null);

/**
 * Commonly outside an interiors quote, and where the budget actually goes
 * wrong. Straight from the interiors draft.
 */
export const COMMON_EXCLUSIONS = [
  "Civil work, if any wall is being moved",
  "Electrical load upgrade",
  "Plumbing changes beyond the existing points",
  "Loose furniture, curtains and appliances",
  "Society charges, debris removal and lift usage",
  "Any work needed to make good after the previous tenant",
];

/** The questions worth asking before an advance. */
export const QUOTE_QUESTIONS = [
  "Is the scope written in quantities, not as a lump sum?",
  "What is explicitly excluded?",
  "Who supervises the site day to day, and how often do they visit?",
  "What is the completion date, and what happens if it slips?",
  "Can I see a finished flat you did nearby, not a rendering?",
  "What is the payment schedule tied to, stages delivered or dates?",
];

export type Selection = Record<string, number>;

export function defaultSelection(): Selection {
  return Object.fromEntries(SCOPE.map((i) => [i.id, i.defaultQty]));
}

export type ScopeLine = {
  item: ScopeItem;
  qty: number;
  costLow: number | null;
  costHigh: number | null;
};

export function buildScope(sel: Selection): ScopeLine[] {
  return SCOPE.filter((i) => (sel[i.id] ?? 0) > 0).map((item) => {
    const qty = sel[item.id] ?? 0;
    return {
      item,
      qty,
      costLow: item.band ? Math.round(item.band.low * qty) : null,
      costHigh: item.band ? Math.round(item.band.high * qty) : null,
    };
  });
}

export function scopeTotals(lines: ScopeLine[]): {
  low: number | null;
  high: number | null;
  priced: boolean;
} {
  const priced = lines.length > 0 && lines.every((l) => l.costLow !== null);
  if (!priced) return { low: null, high: null, priced: false };
  return {
    low: lines.reduce((s, l) => s + (l.costLow ?? 0), 0),
    high: lines.reduce((s, l) => s + (l.costHigh ?? 0), 0),
    priced: true,
  };
}

export function groupsOf(lines: ScopeLine[]): string[] {
  return Array.from(new Set(lines.map((l) => l.item.group)));
}
