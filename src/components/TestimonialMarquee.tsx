import { GOOGLE_RATING, TESTIMONIALS_ARE_REAL, type Testimonial } from "@/lib/testimonials";

/**
 * A continuously scrolling row of review cards, with the Google rating as a
 * link above it.
 *
 * MOTION
 *
 * The track holds the list twice and slides by exactly half its width, so
 * the loop is seamless; the second copy is aria-hidden so a screen reader
 * hears each review once. It runs on a CSS animation rather than script,
 * which keeps it smooth on a phone and lets it pause on hover and on focus
 * without any state. The direction is set in globals.css (TESTIMONIAL
 * MARQUEE): the owner asked for left to right, so the cards travel
 * rightwards; flipping the two keyframe values reverses it.
 *
 * Under prefers-reduced-motion the animation is off and the row becomes an
 * ordinary horizontal scroller, so the content is reachable either way.
 *
 * WHY NO SCHEMA
 *
 * Nothing here is marked up as Review or AggregateRating. Google disallows
 * self serving review markup on a business's own site, and the placeholder
 * state must never leak into structured data. See testimonials.ts.
 */
export function TestimonialMarquee({
  items,
  labels,
}: {
  items: Testimonial[];
  labels: { onGoogle: string; readReviews: string; placeholder: string };
}) {
  const rating = GOOGLE_RATING;
  return (
    <div>
      <a
        href={rating.url}
        target="_blank"
        rel="noopener"
        className="tm-google group inline-flex items-center gap-3 rounded-full border border-line bg-white px-4 py-2.5 shadow-sm transition hover:border-brass hover:shadow-md"
      >
        <GoogleMark />
        <span className="font-display text-xl font-semibold text-brand-indigo">{rating.value}</span>
        <Stars className="text-brass" />
        <span className="text-sm text-muted">
          {labels.onGoogle}
          {rating.count ? ` · ${rating.count}` : ""}
        </span>
        <span className="ml-1 text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 underline-offset-4 group-hover:decoration-brand-blue">
          {labels.readReviews}
        </span>
      </a>

      <div className="tm mt-10" aria-label="Client reviews">
        <div className="tm-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="tm-row"
              aria-hidden={copy === 1 ? "true" : undefined}
            >
              {items.map((t, i) => (
                <li key={`${copy}-${i}`} className="tm-card">
                  <figure>
                    <div className="flex items-center justify-between">
                      <Stars className="text-brass" />
                      {!TESTIMONIALS_ARE_REAL && (
                        <span className="rounded-full border border-brass/40 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wider text-brass">
                          {labels.placeholder}
                        </span>
                      )}
                    </div>
                    <blockquote className="mt-4 text-[0.98rem] leading-relaxed text-ink/85">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-indigo font-display text-sm font-semibold text-brass-bright"
                      >
                        {initials(t.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink">{t.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {t.did} · {t.location}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label="5 out of 5 stars" role="img">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.6l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7z" />
        </svg>
      ))}
    </span>
  );
}

/** The four colour G, drawn inline so nothing is fetched from Google to show it. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.5 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
      <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.7 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-10l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}
