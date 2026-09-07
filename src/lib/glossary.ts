/**
 * Plain words for the terms these articles cannot avoid using.
 *
 * The drafts are written simply, but property writing carries a handful of
 * words that a first time buyer has genuinely never met. "Consideration"
 * means the price and appears in three drafts unexplained. "Sub registrar",
 * "ready reckoner rate" and "leave and licence" appear across the cluster the
 * same way, because they are so ordinary to anyone in the trade that they
 * stop looking like jargon at all. To a reader buying their first flat they
 * are a wall.
 *
 * Rather than restate a definition in every article, each post shows only the
 * terms it actually uses, picked up from its own text. A post that never says
 * "lien" never shows a definition of lien.
 *
 * Definitions are deliberately one sentence and deliberately not legal
 * drafting. They are meant to let somebody keep reading, not to be relied on.
 *
 * MATCHING: `match` holds whole words, tested against the post's plain text
 * on word boundaries. Boundaries are not fussiness. A plain substring test
 * put a definition of "lien" on eight articles, because the letters sit
 * inside the word "client", and one of the eight was about hiring an interior
 * designer. "loading" hides inside "downloading" the same way.
 *
 * Keep the patterns narrow. A term that fires on a passing mention teaches
 * the reader nothing and clutters the page.
 */

export type Term = {
  /** How the word is shown. */
  term: string;
  /** One sentence, no legal drafting, no assumed knowledge. */
  plain: string;
  /** Lowercased whole words. Any one of them present is enough. */
  match: string[];
};

/** Whole word test, so "lien" does not fire on "client". */
function mentions(hay: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(hay);
}

export const GLOSSARY: Term[] = [
  {
    term: "Consideration",
    plain:
      "The price. Documents say consideration where everyone else says what was paid.",
    match: ["consideration"],
  },
  {
    term: "Lien",
    plain:
      "A claim somebody else has on the property, usually a lender's, which has to be cleared before it can be sold free of it.",
    match: ["lien"],
  },
  {
    term: "Sub registrar",
    plain:
      "The government office where property documents are registered, and where the official record of that registration is kept.",
    match: ["sub registrar"],
  },
  {
    term: "Encumbrance",
    plain:
      "Anything attached to the property that limits it, such as a home loan against it or a court dispute over it.",
    match: ["encumbrance"],
  },
  {
    term: "Carpet area",
    plain:
      "The floor you can actually walk on inside the flat, measured wall to wall, with no balconies, walls or shared space counted in.",
    match: ["carpet area"],
  },
  {
    term: "Loading",
    plain:
      "The gap between the area you are sold and the area you can use, expressed as a percentage added on top of carpet area.",
    match: ["loading"],
  },
  {
    term: "Ready reckoner rate",
    plain:
      "The government's own valuation of property in an area, used as the floor for stamp duty even when a flat sells for less.",
    match: ["ready reckoner"],
  },
  {
    term: "Stamp duty",
    plain:
      "A state tax paid when a property document is registered, calculated on the value of the deal.",
    match: ["stamp duty"],
  },
  {
    term: "Mutation",
    plain:
      "Updating the municipal record so the tax bill comes in the new owner's name. It follows a sale, it does not create ownership.",
    match: ["mutation"],
  },
  {
    term: "Conveyance",
    plain:
      "The transfer of the land and building from the builder to the society that lives in it.",
    match: ["conveyance"],
  },
  {
    term: "Occupancy certificate",
    plain:
      "The municipal certificate saying a completed building is legally fit to live in.",
    match: ["occupancy certificate"],
  },
  {
    term: "Society",
    plain:
      "The co operative housing society: the body of flat owners that collectively runs the building.",
    match: ["housing society", "the society"],
  },
  {
    term: "Chain of title",
    plain:
      "The unbroken run of past owners, each transfer documented, that shows the person selling to you has the right to.",
    match: ["chain of title"],
  },
  {
    term: "Leave and licence",
    plain:
      "The agreement most Mumbai flats are rented on. It gives permission to occupy rather than a tenancy, and it is registered.",
    match: ["leave and licence", "leave and license"],
  },
  {
    term: "Capital value",
    plain:
      "The value the municipal corporation assigns a property, which its property tax is calculated from.",
    match: ["capital value"],
  },
  {
    term: "CTS number",
    plain:
      "The city survey number that identifies a specific piece of land in municipal records.",
    match: ["cts number"],
  },
];

/**
 * The terms a given piece of text actually uses.
 *
 * Order follows GLOSSARY rather than order of appearance, so the same two
 * terms never swap places between two articles that both use them.
 *
 * `notAbout` takes the article's title. A post called "Occupancy certificate"
 * has just spent a thousand words explaining what one is, so ending it with a
 * one line definition of the same phrase reads as though nobody checked.
 */
export function termsIn(
  text: string,
  { limit = 6, notAbout = "" }: { limit?: number; notAbout?: string } = {},
): Term[] {
  const hay = text.toLowerCase();
  const subject = notAbout.toLowerCase();
  return GLOSSARY.filter(
    (t) =>
      t.match.some((m) => mentions(hay, m)) &&
      !t.match.some((m) => mentions(subject, m)),
  ).slice(0, limit);
}
