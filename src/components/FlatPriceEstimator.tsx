"use client";

import { useState } from "react";
import type { EstimatorPocket } from "@/lib/flats";

/**
 * What a flat of a given size asks in a given pocket, from the published
 * per square foot rates on the page. Nothing is assumed about how big a
 * 1, 2 or 3 BHK is: the reader enters the area from the listing, because
 * that is the figure they actually have, and the result says it is an
 * asking range, not a price.
 */
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

function lakhOrCrore(n: number): string {
  if (n >= 1e7) return `${(n / 1e7).toFixed(2)} crore`;
  return `${(n / 1e5).toFixed(1)} lakh`;
}

export function FlatPriceEstimator({ pockets, place }: { pockets: EstimatorPocket[]; place: string }) {
  const [i, setI] = useState(0);
  const [area, setArea] = useState("");
  const p = pockets[i];
  const sqft = Number(area.replace(/[^\d.]/g, ""));
  const valid = sqft >= 150 && sqft <= 10000;
  const same = p.low === p.high;

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="eyebrow">What a flat here asks</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-ink">
          Pocket in {place}
          <select
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink"
          >
            {pockets.map((pk, k) => (
              <option key={pk.label} value={k}>
                {pk.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-ink">
          Area on the listing, sq ft
          <input
            inputMode="numeric"
            placeholder="for example 650"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink"
          />
        </label>
      </div>

      <div className="mt-5 rounded-xl bg-paper-alt p-5" aria-live="polite">
        <div className="text-xs uppercase tracking-wider text-muted">
          Asking rate, {p.note}
        </div>
        <div className="mt-1 text-lg text-ink">
          {same ? `${inr(p.low)} per sq ft` : `${inr(p.low)} to ${inr(p.high)} per sq ft`}
        </div>
        {valid ? (
          <>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted">A {sqft.toLocaleString("en-IN")} sq ft flat asks about</div>
            <div className="mt-1 font-display text-2xl font-semibold text-brand-indigo">
              {same ? `₹${lakhOrCrore(p.low * sqft)}` : `₹${lakhOrCrore(p.low * sqft)} to ₹${lakhOrCrore(p.high * sqft)}`}
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">Enter the area from the listing to see the asking range.</p>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">
        An asking range from published rates, not a valuation. Portals do not always say whether a rate is on carpet or
        built up area, so check the basis before comparing two flats. Stamp duty and registration come on top.
      </p>
    </div>
  );
}
