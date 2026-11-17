"use client";

import { useState } from "react";
import { waLink } from "@/lib/config";
import { track } from "@/lib/analytics";
import {
  SHORTLIST_BHK,
  SHORTLIST_SUBURBS,
  SHORTLIST_TIMING,
  shortlistMessage,
  type ShortlistIntent,
} from "@/lib/shortlist";

/**
 * The same day shortlist, as four quick choices instead of a blank chat.
 *
 * Nothing is stored and nothing is sent by the site: the button opens
 * WhatsApp with the buyer's (or tenant's) answers already written, and the
 * buyer presses send. WhatsAppRef adds "(Ref: ..., shortlist, ...)" at tap
 * time, so the lead sheet shows which page the shortlist came from.
 */
export function ShortlistForm({
  intent: initialIntent = "buy",
  suburb: initialSuburb,
  bhk: initialBhk,
  location,
}: {
  intent?: ShortlistIntent;
  /** Preselects the suburb on an area page. Must be one of SHORTLIST_SUBURBS. */
  suburb?: string;
  /** Preselects the size on a BHK page. Must be one of SHORTLIST_BHK. */
  bhk?: string;
  /** Where the form sits, for analytics, for example "listing-borivali-west-sale". */
  location: string;
}) {
  const [intent, setIntent] = useState<ShortlistIntent>(initialIntent);
  const [suburb, setSuburb] = useState(
    initialSuburb && (SHORTLIST_SUBURBS as readonly string[]).includes(initialSuburb) ? initialSuburb : SHORTLIST_SUBURBS[0],
  );
  const [bhk, setBhk] = useState<string>(
    initialBhk && (SHORTLIST_BHK as readonly string[]).includes(initialBhk) ? initialBhk : "2 BHK",
  );
  const [budget, setBudget] = useState("");
  const [timing, setTiming] = useState<string>(SHORTLIST_TIMING[0]);

  const message = shortlistMessage({ intent, suburb, bhk, budget, timing });

  return (
    <div className="rounded-2xl border border-bronze/40 bg-white p-6 md:p-7" data-shortlist-form>
      <div className="eyebrow">Same day shortlist</div>
      <h2 className="mt-2 text-2xl text-ink md:text-3xl">Tell us what you need. We send the flats that fit.</h2>
      <p className="mt-2 max-w-[60ch] text-sm text-ink/75">
        Four quick choices, then WhatsApp opens with your message written. We reply with matching flats, usually the
        same day. Free, with no obligation.
      </p>

      <div className="mt-5 flex gap-2" role="group" aria-label="Buy or rent">
        {(["buy", "rent"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={intent === v}
            onClick={() => setIntent(v)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold ${
              intent === v ? "border-brand-indigo bg-brand-indigo text-white" : "border-line bg-paper text-ink"
            }`}
          >
            {v === "buy" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-ink">
          Where
          <select value={suburb} onChange={(e) => setSuburb(e.target.value)} className={INPUT}>
            {SHORTLIST_SUBURBS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className="block text-sm text-ink">
          Size
          <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-label="Size">
            {SHORTLIST_BHK.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={bhk === b}
                onClick={() => setBhk(b)}
                className={`rounded-lg border px-3 py-2.5 text-sm ${
                  bhk === b ? "border-brand-indigo bg-brand-indigo text-white" : "border-line bg-paper text-ink"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-sm text-ink">
          {intent === "buy" ? "Budget" : "Rent a month"}
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={intent === "buy" ? "for example 1.5 crore" : "for example 45,000"}
            maxLength={40}
            className={INPUT}
          />
        </label>
        <label className="block text-sm text-ink">
          When
          <select value={timing} onChange={(e) => setTiming(e.target.value)} className={INPUT}>
            {SHORTLIST_TIMING.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <a
        href={waLink(message)}
        data-wa-cta="shortlist"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("shortlist_whatsapp", { location, intent, suburb, bhk })}
        className="btn btn-wa mt-6 inline-flex"
      >
        Send me the shortlist on WhatsApp
      </a>
    </div>
  );
}

const INPUT = "mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink";
