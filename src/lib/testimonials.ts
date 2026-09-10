/**
 * Client testimonials for the homepage, and the Google rating beside them.
 *
 * THE GATE
 *
 * TESTIMONIALS_ARE_REAL is false until the owner supplies the fifteen real
 * reviews he promised on 10 September 2026, each with a name, a location and
 * what the client bought or did with the firm. While it is false the section
 * renders fifteen visibly labelled placeholder cards, so the layout and the
 * motion can be judged now, and nobody can mistake a card for a real client.
 * An invented testimonial is a false claim about a real person's experience,
 * and in a market this small it gets noticed.
 *
 * When the real ones arrive: replace TESTIMONIALS below, flip the gate, and
 * nothing else changes.
 *
 * THE GOOGLE RATING
 *
 * The owner asked on 10 September 2026 for the Google rating to sit in this
 * section as a link to the reviews. He quoted 4.8. The profile itself, read
 * on Google Maps the same day, shows 5.0, so 5.0 is what is displayed:
 * the number on the page must match the number a visitor sees when they
 * click through. Google does not expose the count in the view we could
 * read, so no count is shown until it is confirmed. Update `value`,
 * `count` and `checkedOn` together whenever the profile changes.
 *
 * The link opens the firm's listing by its Maps identifier, which is where
 * the reviews live and where "Write a review" is. Never mark this up as
 * AggregateRating schema: Google treats a business rating itself on its own
 * site as self serving and ignores or penalises it. See schema.ts.
 */

export const TESTIMONIALS_ARE_REAL = false;

export const GOOGLE_RATING = {
  value: "5.0",
  /** Undefined until confirmed on the profile. */
  count: undefined as number | undefined,
  url: "https://www.google.com/maps/place/?cid=5587711998336126142",
  checkedOn: "10 September 2026",
} as const;

export type Testimonial = {
  quote: string;
  name: string;
  /** Suburb, and the side if known: "Borivali West". */
  location: string;
  /** What they did with the firm: "Bought a 2 BHK", "Rented a shop", "Interiors". */
  did: string;
  /** Always five on this section, by the owner's brief. */
  stars: 5;
};

/**
 * Fifteen placeholders, labelled as such in every field. They exist so the
 * marquee has the right number of cards to lay out and to time; the copy is
 * deliberately not a plausible review.
 */
export const TESTIMONIALS: Testimonial[] = Array.from({ length: 15 }, (_, i) => ({
  quote:
    "Placeholder review. The client's own words go here, exactly as they said them, once the owner shares them.",
  name: `Client ${i + 1}`,
  location: "Suburb to come",
  did: "What they did with us",
  stars: 5,
}));
