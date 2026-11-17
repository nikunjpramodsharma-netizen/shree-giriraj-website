"use client";

import { useEffect, useState } from "react";
import { ToolResultCTA } from "@/components/ToolResultCTA";
import { readShareChoice, readShareNumber } from "@/lib/tool-share";
import {
  AGE_BANDS,
  FLOOR_BANDS,
  LIFT_CHOICES,
  MAX_SQFT,
  MIN_SQFT,
  VALUATION_CHECKED_ON,
  VALUATION_SUBURBS,
  askingRange,
  rangeText,
  valuationMessage,
  type AgeBand,
  type FloorBand,
  type LiftChoice,
} from "@/lib/valuation";

/**
 * "What is my flat worth?" The seller picks the suburb and pocket, types the
 * area from their agreement, and sees the asking range at the published rate
 * for that pocket. The age, floor and lift answers travel in the WhatsApp
 * message, where the firm replies with registered sales near the building.
 * See src/lib/valuation.ts for why they are not in the sum.
 */

const SUBURB_KEYS = VALUATION_SUBURBS.map((s) => s.key);

export function FlatValuationCalculator() {
  const [suburbKey, setSuburbKey] = useState(SUBURB_KEYS[0]);
  const [pocketIdx, setPocketIdx] = useState(0);
  const [area, setArea] = useState("650");
  const [age, setAge] = useState<AgeBand>("10 to 25 years");
  const [floor, setFloor] = useState<FloorBand>("4th to 10th");
  const [lift, setLift] = useState<LiftChoice>("Yes");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const s = readShareChoice(sp, "s", SUBURB_KEYS);
    if (s) setSuburbKey(s);
    const suburb = VALUATION_SUBURBS.find((x) => x.key === (s ?? SUBURB_KEYS[0]));
    const p = readShareNumber(sp, "p", 0, (suburb?.pockets.length ?? 1) - 1);
    if (p !== undefined) setPocketIdx(Math.round(p));
    const a = readShareNumber(sp, "a", MIN_SQFT, MAX_SQFT);
    if (a !== undefined) setArea(String(Math.round(a)));
    const g = readShareChoice(sp, "g", AGE_BANDS);
    if (g) setAge(g);
    const f = readShareChoice(sp, "f", FLOOR_BANDS);
    if (f) setFloor(f);
    const l = readShareChoice(sp, "l", LIFT_CHOICES);
    if (l) setLift(l);
  }, []);

  const suburb = VALUATION_SUBURBS.find((s) => s.key === suburbKey) ?? VALUATION_SUBURBS[0];
  const pocket = suburb.pockets[Math.min(pocketIdx, suburb.pockets.length - 1)];
  const sqft = Number(area.replace(/[^\d.]/g, ""));
  const range = askingRange(pocket, sqft);
  const same = pocket.low === pocket.high;

  const message = valuationMessage({
    place: suburb.place,
    pocket: pocket.label,
    sqft: range ? Math.round(sqft) : null,
    age,
    floor,
    lift,
    range,
  });

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="grid gap-5 border-b border-line p-6 sm:grid-cols-2">
        <Field label="Suburb">
          <select
            value={suburbKey}
            onChange={(e) => {
              setSuburbKey(e.target.value);
              setPocketIdx(0);
            }}
            className={SELECT}
          >
            {VALUATION_SUBURBS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.place}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pocket or rate basis">
          <select value={pocketIdx} onChange={(e) => setPocketIdx(Number(e.target.value))} className={SELECT}>
            {suburb.pockets.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Area on your agreement, sq ft">
          <input
            inputMode="numeric"
            placeholder="for example 650"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={SELECT}
          />
        </Field>
        <Field label="Age of the building">
          <select value={age} onChange={(e) => setAge(e.target.value as AgeBand)} className={SELECT}>
            {AGE_BANDS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
        <Field label="Floor">
          <select value={floor} onChange={(e) => setFloor(e.target.value as FloorBand)} className={SELECT}>
            {FLOOR_BANDS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </Field>
        <div className="block text-sm text-ink">
          Lift in the building
          <div className="mt-1.5 flex gap-2" role="group" aria-label="Lift in the building">
            {LIFT_CHOICES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={lift === c}
                onClick={() => setLift(c)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                  lift === c ? "border-brand-indigo bg-brand-indigo text-white" : "border-line bg-white text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-b border-line p-6 md:grid-cols-[1.2fr_1fr]" aria-live="polite">
        <div className="rounded-xl bg-paper-alt p-5">
          <div className="text-xs uppercase tracking-wider text-muted">Asking rate, {pocket.note}</div>
          <div className="mt-1 text-lg text-ink">
            {same
              ? `₹${pocket.low.toLocaleString("en-IN")} per sq ft`
              : `₹${pocket.low.toLocaleString("en-IN")} to ₹${pocket.high.toLocaleString("en-IN")} per sq ft`}
          </div>
          {range ? (
            <>
              <div className="mt-4 text-xs uppercase tracking-wider text-muted">
                A {Math.round(sqft).toLocaleString("en-IN")} sq ft flat here asks about
              </div>
              <div className="mt-1 font-display text-3xl font-semibold text-brand-indigo">{rangeText(range)}</div>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Enter the area from your agreement, between {MIN_SQFT} and {MAX_SQFT.toLocaleString("en-IN")} sq ft.
            </p>
          )}
        </div>
        <div className="space-y-3 text-sm text-ink/75">
          <p>
            <strong className="text-ink">Where your flat sits in that range</strong> depends on the building. A newer
            building with a lift and an upper floor usually asks towards the top; an older walk up towards the lower end.
          </p>
          <p>
            Registered prices are usually below asking. Send us the society name and we reply with recent registered
            sales near your building, which is the figure to list at.
          </p>
          <p className="text-xs text-muted">Rates read against their sources on {VALUATION_CHECKED_ON}.</p>
        </div>
      </div>

      <div className="p-6">
        <ToolResultCTA
          slug="property-valuation-calculator-mumbai"
          offer="Selling? Tell us the society and we send recent registered sales near your building, a fair listing price and what the papers need first. Free, with no obligation."
          message={message}
          buttonLabel="Get my flat's price opinion"
          inputsKey={`${suburbKey}|${pocketIdx}|${area}|${age}|${floor}|${lift}`}
          share={{
            s: suburbKey,
            p: pocketIdx,
            a: range ? Math.round(sqft) : undefined,
            g: age,
            f: floor,
            l: lift,
          }}
        />
      </div>
    </div>
  );
}

const SELECT = "mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-ink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm text-ink">
      {label}
      {children}
    </label>
  );
}
