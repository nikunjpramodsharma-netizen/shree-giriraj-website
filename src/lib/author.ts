import { existsSync } from "node:fs";
import { join } from "node:path";
/**
 * The blog's author.
 *
 * Confirmed by the owner on 16 September 2026: Nikunj Sharma, Senior
 * Associate at Shree Giriraj Real Estate, handling marketing and sales. He
 * authors the articles. The photograph is to follow, so `photo` is null and
 * the page renders a monogram until it arrives; a stock face never sits next
 * to a real name on this site.
 *
 * This lives in the repo rather than in Sanity because the markdown posts do,
 * and because there is no write token to create the Sanity author document.
 * A Sanity post that carries its own author still wins; this is the fallback
 * for every repo post, which today is all of them.
 */
export const AUTHOR = {
  name: "Nikunj Sharma",
  role: "Senior Associate",
  bio: "Senior Associate at Shree Giriraj Real Estate, handling marketing and sales across Borivali, Kandivali and Malad. Writes the articles here from the questions clients actually ask.",
  /** Null renders initials. */
  // Drop the file at public/team/nikunj-sharma.jpg and it appears; until then the initials show.
  photo: (existsSync(join(process.cwd(), "public", "team", "nikunj-sharma.jpg")) ? "/team/nikunj-sharma.jpg" : null) as string | null,
} as const;

export function authorInitials(): string {
  const parts = AUTHOR.name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
