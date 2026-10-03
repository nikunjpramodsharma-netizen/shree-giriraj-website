import { waLink } from "@/lib/config";
import type { PostOffer as Offer } from "@/lib/post-offers";

/**
 * The offer box on a post whose reader has a job the firm does. Shown twice:
 * compact under the short answer, where most readers decide whether to stay,
 * and in full after the questions, where the ones who read to the end are.
 */
export function PostOffer({
  offer,
  compact = false,
}: {
  offer: Offer;
  compact?: boolean;
}) {
  return (
    <aside
      className={`max-w-[68ch] rounded-xl border border-bronze/40 bg-brand-indigo text-paper ${
        compact ? "mb-9 px-6 py-5" : "mt-12 px-6 py-7 md:px-8"
      }`}
    >
      <div
        className={`font-display text-white ${
          compact ? "text-lg" : "text-xl md:text-2xl"
        }`}
      >
        {offer.heading}
      </div>
      <p className="mt-2 max-w-[60ch] text-[0.95rem] text-paper/80">{offer.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={waLink(offer.whatsapp)}
          target="_blank"
          rel="noopener"
          className="btn btn-wa"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 5 5.1-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.3-5-4.5-.1-.2-1.1-1.5-1.1-2.9s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 2 .9 2.1c.1.1.1.3 0 .5s-.2.4-.3.5l-.4.5c-.1.1-.3.3-.1.6s.6 1.1 1.4 1.8c1 .9 1.8 1.1 2.1 1.3s.4.1.6-.1.7-.8.9-1.1.4-.2.6-.1 1.5.7 1.8.9.4.2.5.3.1.6-.1 1.3z" />
          </svg>
          {offer.button}
        </a>
        <span className="text-xs text-paper/60">
          Free first conversation, no obligation.
        </span>
      </div>
    </aside>
  );
}
