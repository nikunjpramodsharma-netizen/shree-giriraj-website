"use client";

import { useMemo, useState } from "react";
import {
  analyse,
  compare,
  builtUpFromCarpet,
  loadingVerdict,
  LOADING_BENCHMARKS,
  AREA_SOURCES,
  AREA_SOURCES_CHECKED_ON,
  type Flat,
} from "@/lib/area";
import { inr, inrShort } from "@/lib/emi";

/**
 * Carpet area and loading.
 *
 * Two modes. The first converts a listing into the area you can actually
 * stand on, which is what every other calculator does. The second compares
 * two flats on price per carpet foot, which none of them do and which is the
 * decision a buyer is actually making.
 *
 * The bar under the first mode exists to make loading visible. A number like
 * "40 percent" does not land. Seeing four tenths of the flat you are paying
 * for shaded out does.
 */

const VERDICT_COPY: Record<string, string> = {
  low: "Low. Unusually generous for this market.",
  normal: "Normal by national standards, and on the tight side for Mumbai.",
  high: "High, and typical of Mumbai. Worth asking what the loading buys you.",
  "very high": "Very high. Ask specifically what common areas you are paying for.",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function AreaCalculator() {
  const [mode, setMode] = useState<"one" | "compare">("one");

  // Single flat.
  const [superArea, setSuperArea] = useState(1000);
  const [loading, setLoading] = useState(40);
  const [price, setPrice] = useState(25_000_000);
  const [wallPct, setWallPct] = useState(12);

  // Comparison.
  const [a, setA] = useState<Flat>({
    label: "Flat A",
    price: 25_000_000,
    superArea: 1000,
    loadingPct: 25,
  });
  const [b, setB] = useState<Flat>({
    label: "Flat B",
    price: 24_000_000,
    superArea: 1000,
    loadingPct: 40,
  });

  const one = useMemo(
    () => analyse({ label: "This flat", price, superArea, loadingPct: loading }),
    [price, superArea, loading],
  );
  const builtUp = useMemo(
    () => builtUpFromCarpet(one.carpet, wallPct),
    [one.carpet, wallPct],
  );
  const verdict = loadingVerdict(loading);
  const carpetShare = superArea > 0 ? (one.carpet / superArea) * 100 : 0;

  const cmp = useMemo(() => compare(a, b), [a, b]);
  const winner = cmp.betterValue === "a" ? cmp.a : cmp.betterValue === "b" ? cmp.b : null;

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="flex flex-wrap gap-2 border-b border-line p-4">
        <ModeButton active={mode === "one"} onClick={() => setMode("one")}>
          Work out one flat
        </ModeButton>
        <ModeButton
          active={mode === "compare"}
          onClick={() => setMode("compare")}
        >
          Compare two flats
        </ModeButton>
      </div>

      {mode === "one" ? (
        <>
          <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
            <Slider
              label="Super built up area"
              value={superArea}
              onChange={setSuperArea}
              min={200}
              max={5000}
              step={10}
              display={`${superArea} sq ft`}
            />
            <Slider
              label="Loading"
              value={loading}
              onChange={setLoading}
              min={0}
              max={70}
              step={1}
              display={`${loading}%`}
            />
            <Slider
              label="Quoted price"
              value={price}
              onChange={setPrice}
              min={1_000_000}
              max={200_000_000}
              step={100_000}
              display={inrShort(price)}
            />
            <Slider
              label="Walls and balcony, over carpet"
              value={wallPct}
              onChange={setWallPct}
              min={0}
              max={25}
              step={1}
              display={`${wallPct}%`}
            />
          </div>

          <div className="grid gap-px bg-line sm:grid-cols-2">
            <Headline
              label="Carpet area, what you can stand on"
              value={`${one.carpet} sq ft`}
              note={`You are being charged for ${superArea} sq ft`}
            />
            <Headline
              label="Real rate, per carpet foot"
              value={inr(one.ratePerCarpetFoot)}
              note={`The listing says ${inr(one.ratePerSuperFoot)} per sq ft`}
              accent
            />
          </div>

          <div className="space-y-5 p-6">
            {/* Loading made visible. This is the whole argument in one bar. */}
            <div>
              <div
                className="flex h-8 overflow-hidden rounded-lg"
                role="img"
                aria-label={`${Math.round(carpetShare)} percent of the area you pay for is usable`}
              >
                <div
                  className="flex items-center justify-center bg-brand-indigo text-xs font-semibold text-white"
                  style={{ width: `${carpetShare}%` }}
                >
                  {Math.round(carpetShare)}%
                </div>
                <div
                  className="flex items-center justify-center bg-brass/40 text-xs font-semibold text-ink"
                  style={{ width: `${100 - carpetShare}%` }}
                >
                  {Math.round(100 - carpetShare)}%
                </div>
              </div>
              <p className="mt-2 text-sm text-ink/70">
                Dark is your flat. The rest is your share of lobbies, lifts,
                staircases and amenities, which you pay for and do not live in.
              </p>
            </div>

            <div
              className={
                verdict === "high" || verdict === "very high"
                  ? "rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink"
                  : "rounded-xl border border-line bg-paper-alt px-5 py-4 text-sm text-ink"
              }
            >
              <b>{loading}% loading.</b> {VERDICT_COPY[verdict]} Nationally{" "}
              {LOADING_BENCHMARKS.normalLow} to {LOADING_BENCHMARKS.normalHigh}%
              is considered normal, and Mumbai runs the highest in India at
              roughly {LOADING_BENCHMARKS.mumbaiLow} to{" "}
              {LOADING_BENCHMARKS.mumbaiHigh}%.
            </div>

            <dl className="divide-y divide-line rounded-xl border border-line">
              <Row label="Carpet area" value={`${one.carpet} sq ft`} />
              <Row label="Built up, approximately" value={`${builtUp} sq ft`} />
              <Row label="Super built up" value={`${superArea} sq ft`} />
              <Row
                label="You are paying for"
                value={`${superArea - one.carpet} sq ft you cannot use`}
                strong
              />
            </dl>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-px border-b border-line bg-line sm:grid-cols-2">
            <FlatInputs flat={a} onChange={setA} />
            <FlatInputs flat={b} onChange={setB} />
          </div>

          <div className="p-6">
            {/* The finding worth paying for. */}
            {cmp.headlineMisleads && winner && (
              <div className="mb-5 rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink">
                <b>The cheaper looking flat is the worse buy.</b> Once loading
                is taken out, {winner.label} costs {inr(cmp.carpetRateGap)} less
                for every square foot you can actually use, even though its
                headline rate is higher.
              </div>
            )}

            <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {[cmp.a, cmp.b].map((f) => {
                const isWinner = winner?.label === f.label;
                return (
                  <div key={f.label} className="bg-paper p-5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-ink">{f.label}</span>
                      {isWinner && (
                        <span className="rounded-full bg-brand-indigo px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
                          Better value
                        </span>
                      )}
                    </div>
                    <div className="mt-3 text-3xl tabular-nums text-ink">
                      {inr(f.ratePerCarpetFoot)}
                    </div>
                    <p className="mt-1 text-sm text-ink/60">per carpet sq ft</p>
                    <dl className="mt-4 space-y-1.5 text-sm">
                      <Line label="Headline rate" v={inr(f.ratePerSuperFoot)} />
                      <Line label="Carpet area" v={`${f.carpet} sq ft`} />
                      <Line label="Loading" v={`${f.loadingPct}%`} />
                    </dl>
                  </div>
                );
              })}
            </div>

            {winner && cmp.carpetGap > 0 && (
              <p className="mt-5 max-w-[60ch] text-sm text-ink/70">
                {winner.label} also gives you <b>{cmp.carpetGap} sq ft</b> more
                usable space. Compare flats on the rate per carpet foot, not on
                the rate in the listing.
              </p>
            )}
          </div>
        </>
      )}

      <div className="border-t border-line px-6 py-4">
        <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
          Benchmarks checked {fmtDate(AREA_SOURCES_CHECKED_ON)}
        </div>
        <ul className="mt-2 space-y-1 text-xs">
          {AREA_SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-indigo underline underline-offset-4"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">
          Loading is taken on the carpet area, so carpet equals super built up
          divided by one plus the loading. Ask for the carpet area in writing:
          under RERA it has to be stated in the agreement.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

function FlatInputs({
  flat,
  onChange,
}: {
  flat: Flat;
  onChange: (f: Flat) => void;
}) {
  const set = (patch: Partial<Flat>) => onChange({ ...flat, ...patch });
  return (
    <div className="space-y-4 bg-paper p-6">
      <input
        value={flat.label}
        onChange={(e) => set({ label: e.target.value })}
        aria-label="Name this flat"
        className="w-full rounded-xl border border-line bg-paper-alt px-4 py-2 text-sm font-semibold text-ink outline-none focus:border-brass"
      />
      <Field
        label="Price"
        value={flat.price}
        step={100_000}
        onChange={(n) => set({ price: n })}
      />
      <Field
        label="Super built up, sq ft"
        value={flat.superArea}
        step={10}
        onChange={(n) => set({ superArea: n })}
      />
      <Field
        label="Loading %"
        value={flat.loadingPct}
        step={1}
        onChange={(n) => set({ loadingPct: n })}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
}) {
  return (
    <label className="block">
      <span className="text-sm text-ink/80">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="mt-1 w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-brass"
      />
    </label>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "rounded-full bg-brand-indigo px-4 py-2 text-sm font-semibold text-white"
          : "rounded-full border border-line px-4 py-2 text-sm text-ink/70 hover:bg-paper-alt"
      }
    >
      {children}
    </button>
  );
}

function Headline({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div className={accent ? "bg-paper-alt p-6" : "bg-paper p-6"}>
      <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
        {label}
      </div>
      <div className="mt-2 text-3xl tabular-nums text-ink md:text-4xl">
        {value}
      </div>
      {note && <p className="mt-2 text-sm text-ink/60">{note}</p>}
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  display,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  display: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-sm tabular-nums text-ink/70">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-brand-indigo"
      />
    </label>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between p-3.5">
      <dt className={strong ? "font-semibold text-ink" : "text-ink/70"}>
        {label}
      </dt>
      <dd
        className={
          strong ? "font-semibold tabular-nums text-ink" : "tabular-nums text-ink/80"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function Line({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink/60">{label}</dt>
      <dd className="tabular-nums text-ink/80">{v}</dd>
    </div>
  );
}
