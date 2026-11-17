/**
 * The same day shortlist form's choices and the message it writes.
 * Flat finding is Borivali, Kandivali and Malad only, so those are the only
 * places offered.
 */

export type ShortlistIntent = "buy" | "rent";

export const SHORTLIST_SUBURBS = [
  "Borivali West",
  "Borivali East",
  "Kandivali West",
  "Kandivali East",
  "Malad West",
  "Malad East",
  "Any of these",
] as const;

export const SHORTLIST_BHK = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK or larger"] as const;

export const SHORTLIST_TIMING = ["Within a month", "In 1 to 3 months", "Just starting to look"] as const;

/** An area slug to the form's suburb wording, for preselecting on area pages. */
export const SHORTLIST_SUBURB_FOR_AREA: Record<string, string> = {
  "borivali-west": "Borivali West",
  kandivali: "Kandivali West",
  "kandivali-west": "Kandivali West",
  malad: "Malad West",
  "malad-west": "Malad West",
};

export function shortlistMessage(v: {
  intent: ShortlistIntent;
  suburb: string;
  bhk: string;
  budget: string;
  timing: string;
}): string {
  const where = v.suburb === "Any of these" ? "Borivali, Kandivali or Malad" : v.suburb;
  const budget = v.budget.trim().replace(/\s+/g, " ").slice(0, 40) || "___";
  const verb = v.intent === "buy" ? "buy" : "rent";
  const money = v.intent === "buy" ? `Budget: ${budget}.` : `Rent: ${budget} a month.`;
  return [
    "Hi Shree Giriraj, please send me a shortlist.",
    `I want to ${verb} a ${v.bhk} in ${where}. ${money}`,
    `Timing: ${v.timing.toLowerCase()}.`,
  ].join("\n");
}
