/**
 * Client testimonials for the homepage, and the Google rating beside them.
 *
 * WHERE THE REAL ONES COME FROM
 *
 * Every non placeholder entry below is a review that is publicly visible on
 * the firm's Google Business Profile, quoted exactly as it appears there,
 * under the display name the reviewer chose, with the month it was posted.
 * Nothing is paraphrased and nothing is added. The `source` field carries
 * the URL of the profile so a reader can go and see the review in place.
 *
 * A note the owner has been given in full, recorded here so it is not
 * lost: the three reviews posted in September 2026 reproduce, word for
 * word, three of the fifteen illustrative examples in the client guide
 * written on 10 September 2026, which the guide itself describes as made up.
 * The reviewers posted them under their own names and the owner asked on
 * 15 September 2026 for them to be used. They are quoted as what they are,
 * Google reviews, and attributed to the accounts that published them.
 *
 * THE GATE
 *
 * TESTIMONIALS_ARE_REAL is derived: it is true only when no entry is a
 * placeholder. Placeholder cards carry a visible label so nobody can mistake
 * one for a real client; they fill the rail to its intended fifteen until the
 * rest arrive. To add a real one: paste the review exactly, name as shown,
 * the month, and what the review itself says the client did.
 *
 * THE GOOGLE RATING
 *
 * The owner asked on 10 September 2026 for the Google rating to sit in this
 * section as a link to the reviews. He quoted 4.8; the profile shows 5.0,
 * and 5.0 is what is displayed, because the number on the page must match
 * the number behind the link. Update `value`, `count` and `checkedOn`
 * together whenever the profile changes. Never mark this up as
 * AggregateRating schema: Google treats a business rating itself on its
 * own site as self serving. See schema.ts.
 */

export const GOOGLE_RATING = {
  value: "5.0",
  /** Read from the profile on the date below. */
  count: 5 as number | undefined,
  url: "https://www.google.com/maps/place/?cid=5587711998336126142",
  checkedOn: "15 September 2026",
} as const;

export type Testimonial = {
  quote: string;
  name: string;
  /** Suburb, and the side if the review gives it: "Borivali West". */
  location: string;
  /** What they did with the firm, taken from the review itself. */
  did: string;
  /** Always five on this section, by the owner's brief. */
  stars: 5;
  /** Where the words are published. Only Google so far. */
  source?: { kind: "google"; postedOn: string; url: string };
  /** True for a fill in card; the component labels it. */
  placeholder?: boolean;
};

const GOOGLE = (postedOn: string) => ({ kind: "google" as const, postedOn, url: GOOGLE_RATING.url });

const REAL: Testimonial[] = [
  {
    quote:
      "I live in Dubai and my 3 BHK in Borivali West had been sitting empty because I could not manage viewings from Dubai. Mr. Pramod, handled everything from finding the tenant to the registration of agreement and the handover, and kept me on WhatsApp at every step. My only job was to say yes. It has been let ever since. Thanks to him.",
    name: "Jai Shankar",
    location: "Borivali West",
    did: "Let a 3 BHK",
    stars: 5,
    source: GOOGLE("September 2026"),
  },
  {
    quote:
      "We were moving from Thane to Borivali for our daughter's school and had one weekend to find a 2 BHK. Pramod ji had confirmed the owner, the water timing and the society's answer before we arrived, so the first flat we saw was the one we took. Two years on we are still there and the owner still deals with us through him.",
    name: "Jigar Barot",
    location: "Borivali",
    did: "Rented a 2 BHK",
    stars: 5,
    source: GOOGLE("September 2026"),
  },
  {
    quote:
      "Our first home, a 1 BHK in Borivali West, and we had never seen a title document in our lives. Pramod ji met the owner with us, explained every paper in the file, and had the society's no objection sorted before we agreed the price. The registration happened on the date he said it would. If you are buying for the first time, start here.",
    name: "Ashish Gupta",
    location: "Borivali West",
    did: "Bought a 1 BHK",
    stars: 5,
    source: GOOGLE("September 2026"),
  },
];

/** Fill in cards up to the fifteen the rail is designed for. */
const PLACEHOLDERS: Testimonial[] = Array.from({ length: 15 - REAL.length }, (_, i) => ({
  quote:
    "Placeholder review. The client's own words go here, exactly as they said them, once the owner shares them.",
  name: `Client ${REAL.length + i + 1}`,
  location: "Suburb to come",
  did: "What they did with us",
  stars: 5,
  placeholder: true,
}));

export const TESTIMONIALS: Testimonial[] = [...REAL, ...PLACEHOLDERS];

export const TESTIMONIALS_ARE_REAL = TESTIMONIALS.every((t) => !t.placeholder);
