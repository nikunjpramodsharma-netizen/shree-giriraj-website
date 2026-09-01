"use client";

import { useMemo, useState } from "react";
import {
  calculateStampDuty,
  womanBuyerSaving,
  RATE_SOURCES,
  RATES_VERIFIED_ON,
  type BuyerCategory,
} from "@/lib/stampduty";
import { inr, inrShort } from "@/lib/emi";

/**
 * Mumbai stamp duty and registration.
 *
 * Three things this does that a national calculator does not.
 *
 * 1. It applies the ready reckoner floor, so a flat bought below the
 *    government valuation shows the higher duty that will actually be charged.
 * 2. It breaks the metro cess out of the headline rate, so somebody quoted
 *    "six percent" can see where the sixth point comes from.
 * 3. It shows a RANGE for joint ownership instead of inventing certainty,
 *    because the sources genuinely disagree. See lib/stampduty.ts.
 */

const CATEGORIES: { id: BuyerCategory; label: string; note: string }[] = [
  { id: "male", label: "Male buyer", note: "Sole ownership" },
  { id: "female", label: "Female buyer", note: "Sole name, residential" },
  { id: "joint", label: "Joint", note: "Man and woman together" },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function StampDutyCalculator() {
  const [agreementValue, setAgreementValue] = useState(10_000_000);
  const [reckonerValue, setReckonerValue] = useState(0);
  const [category, setCategory] = useState<BuyerCategory>("male");

  const r = useMemo(
    () => calculateStampDuty({ agreementValue, reckonerValue, category }),
    [agreementValue, reckonerValue, category],
  );

  const saving = useMemo(
    () => womanBuyerSaving(r.chargeableValue),
    [r.chargeableValue],
  );

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="border-b border-line px-6 py-3 text-xs text-muted">
        Mumbai only, inside the BMC area. Pune, Thane and Nagpur add a local
        body tax and rural rates are lower, and those are not covered here.
      </div>

      {/* ---------------------------------------------------------- inputs */}
      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-ink">
              Agreement value
            </span>
            <span className="text-sm tabular-nums text-ink/70">
              {inrShort(agreementValue)}
            </span>
          </div>
          <input
            type="range"
            min={500_000}
            max={100_000_000}
            step={100_000}
            value={agreementValue}
            onChange={(e) => setAgreementValue(Number(e.target.value))}
            className="mt-3 w-full accent-brand-indigo"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink">
            Ready reckoner value
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={100_000}
            value={reckonerValue || ""}
            placeholder="Optional, if you know it"
            onChange={(e) =>
              setReckonerValue(Math.max(0, Number(e.target.value) || 0))
            }
            className="mt-1.5 w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-brass"
          />
          <span className="mt-1.5 block text-xs text-muted">
            Duty is charged on this or the price, whichever is higher. Look it
            up under e-ASR on the IGR portal.
          </span>
        </label>

        <fieldset>
          <legend className="text-sm font-semibold text-ink">
            Who is buying
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
                className={
                  category === c.id
                    ? "rounded-full bg-brand-indigo px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-line px-4 py-2 text-sm text-ink/70 hover:bg-paper-alt"
                }
              >
                {c.label}
              </button>
            ))}
          </div>
          <span className="mt-2 block text-xs text-muted">
            {CATEGORIES.find((c) => c.id === category)?.note}
          </span>
        </fieldset>
      </div>

      {/* --------------------------------------------------------- results */}
      <div className="grid gap-px bg-line sm:grid-cols-2">
        <div className="bg-paper p-6">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
            Stamp duty
          </div>
          <div className="mt-2 text-3xl tabular-nums text-ink md:text-4xl">
            {r.isRange ? (
              <>
                {inr(r.dutyLow)}{" "}
                <span className="text-xl text-ink/50">to</span>{" "}
                {inr(r.dutyHigh)}
              </>
            ) : (
              inr(r.dutyLow)
            )}
          </div>
          <p className="mt-2 text-sm text-ink/60">
            {r.basePct}
            {r.isRange ? ` to ${r.basePctHigh}` : ""}% duty plus{" "}
            {r.metroCessPct}% metro cess
          </p>
        </div>

        <div className="bg-paper-alt p-6">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
            Duty plus registration
          </div>
          <div className="mt-2 text-3xl tabular-nums text-ink md:text-4xl">
            {r.isRange ? (
              <>
                {inr(r.totalLow)}{" "}
                <span className="text-xl text-ink/50">to</span>{" "}
                {inr(r.totalHigh)}
              </>
            ) : (
              inr(r.totalLow)
            )}
          </div>
          <p className="mt-2 text-sm text-ink/60">
            Payable in cash. A home loan will not cover it.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-6">
        {/* The reckoner floor is the single most common surprise. */}
        {r.reckonerGoverns && (
          <Callout tone="warn">
            <b>The reckoner rate is higher than your price</b>, so duty is
            charged on {inr(r.chargeableValue)}, not on what you agreed. Buying
            below the government valuation does not reduce the duty.
          </Callout>
        )}

        {/* The genuine ambiguity, stated rather than hidden. */}
        {r.isRange && (
          <Callout tone="warn">
            <b>Joint ownership is where sources disagree.</b> Some apply the
            male rate of {r.basePct}%, others a blended {r.basePctHigh}%. We are
            not going to guess, so both are shown. Budget for the higher one and
            confirm at the sub registrar office.
          </Callout>
        )}

        {category === "male" && saving > 0 && (
          <Callout>
            Buying in a woman&apos;s sole name would save{" "}
            <b>{inr(saving)}</b> in duty on this value. It has to be sole
            ownership and residential, and adding a male co owner removes it.
          </Callout>
        )}

        <dl className="divide-y divide-line rounded-xl border border-line">
          <Row label="Value duty is charged on" value={r.chargeableValue} />
          <Row
            label={`Base duty at ${r.basePct}${r.isRange ? ` to ${r.basePctHigh}` : ""}%`}
            value={r.isRange ? r.dutyHigh - r.metroCess : r.baseDuty}
          />
          <Row label={`Metro cess at ${r.metroCessPct}%`} value={r.metroCess} />
          <Row
            label={
              r.registrationIsCapped
                ? "Registration, capped"
                : "Registration at 1%"
            }
            value={r.registration}
          />
          <Row label="Total payable" value={r.totalHigh} strong />
        </dl>

        <div className="rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            Rates checked {fmtDate(RATES_VERIFIED_ON)}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {RATE_SOURCES.map((s) => (
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
          <p className="mt-3 text-xs text-muted">
            Rates change. Confirm the figure that applies to you before you
            budget on it, and treat this as an estimate rather than a quotation.
          </p>
        </div>
      </div>
    </div>
  );
}

function Callout({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "warn";
}) {
  return (
    <div
      className={
        tone === "warn"
          ? "rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink"
          : "rounded-xl border border-line bg-paper-alt px-5 py-4 text-sm text-ink"
      }
    >
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between p-3.5">
      <dt className={strong ? "font-semibold text-ink" : "text-ink/70"}>
        {label}
      </dt>
      <dd
        className={
          strong
            ? "font-semibold tabular-nums text-ink"
            : "tabular-nums text-ink/80"
        }
      >
        {inr(value)}
      </dd>
    </div>
  );
}
