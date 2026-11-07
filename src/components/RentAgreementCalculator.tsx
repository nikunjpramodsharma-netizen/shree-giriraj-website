"use client";

import { useEffect, useMemo, useState } from "react";
import { RollNumber } from "@/components/motion/RollNumber";
import { ToolResultCTA } from "@/components/ToolResultCTA";
import { readShareNumber } from "@/lib/tool-share";
import {
  calculateRentAgreement,
  LEAVE_LICENCE,
  RENT_AGREEMENT_SOURCES,
  RENT_AGREEMENT_VERIFIED_ON,
} from "@/lib/rentagreement";
import { inr } from "@/lib/emi";

/**
 * Rent agreement (leave and licence) stamp duty and registration, Mumbai.
 *
 * Every figure is from Article 36A of the Maharashtra Stamp Act and the
 * department's own Leave and License calculator; see lib/rentagreement.ts.
 * Government charges only: no drafting or service fee is shown, because the
 * firm quotes that on WhatsApp for the actual agreement.
 */

const TERMS = [11, 12, 24, 36, 60];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function RentAgreementCalculator() {
  const [rent, setRent] = useState(30_000);
  const [months, setMonths] = useState(11);
  const [increase, setIncrease] = useState(0);
  const [deposit, setDeposit] = useState(90_000);
  const [nonRefundable, setNonRefundable] = useState(0);

  // Restore a shared result from the query string, numbers only.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const r = readShareNumber(sp, "r", 0, 100_000_000);
    const m = readShareNumber(sp, "m", 1, LEAVE_LICENCE.maxMonths);
    const inc = readShareNumber(sp, "inc", 0, 100);
    const d = readShareNumber(sp, "d", 0, 1_000_000_000);
    const nr = readShareNumber(sp, "nr", 0, 1_000_000_000);
    if (r !== undefined) setRent(r);
    if (m !== undefined) setMonths(Math.round(m));
    if (inc !== undefined) setIncrease(inc);
    if (d !== undefined) setDeposit(d);
    if (nr !== undefined) setNonRefundable(nr);
  }, []);

  const r = useMemo(
    () =>
      calculateRentAgreement({
        monthlyRent: rent,
        months,
        yearlyIncreasePct: increase,
        refundableDeposit: deposit,
        nonRefundable,
      }),
    [rent, months, increase, deposit, nonRefundable],
  );

  const message = `Hi Shree Giriraj, I need a registered rent agreement for a flat in ___. Rent ${inr(rent)} a month${
    increase > 0 ? `, rising ${increase}% a year` : ""
  }, deposit ${inr(deposit)}${nonRefundable > 0 ? `, non refundable ${inr(nonRefundable)}` : ""}, term ${r.months} months. The calculator shows ${inr(r.total)} in government charges.`;

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="border-b border-line px-6 py-3 text-xs text-muted">
        Mumbai, for leave and licence agreements of up to {LEAVE_LICENCE.maxMonths} months.
        Government charges only.
      </div>

      {/* ---------------------------------------------------------- inputs */}
      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <NumberField
          label="Monthly rent"
          value={rent}
          step={1_000}
          onChange={setRent}
          hint="The rent in the first year of the agreement."
        />

        <fieldset>
          <legend className="text-sm font-semibold text-ink">Term in months</legend>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMonths(t)}
                aria-pressed={months === t}
                className={
                  months === t
                    ? "rounded-full bg-brand-indigo px-3.5 py-1.5 text-sm font-semibold text-white"
                    : "rounded-full border border-line px-3.5 py-1.5 text-sm text-ink/70 hover:bg-paper-alt"
                }
              >
                {t}
              </button>
            ))}
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={LEAVE_LICENCE.maxMonths}
              value={months || ""}
              aria-label="Term in months"
              onChange={(e) =>
                setMonths(
                  Math.min(LEAVE_LICENCE.maxMonths, Math.max(0, Math.round(Number(e.target.value) || 0))),
                )
              }
              className="w-20 rounded-xl border border-line bg-paper-alt px-3 py-1.5 text-sm text-ink outline-none focus:border-bronze"
            />
          </div>
          <span className="mt-1.5 block text-xs text-muted">
            From 1 to {LEAVE_LICENCE.maxMonths} months.
          </span>
        </fieldset>

        <NumberField
          label="Refundable deposit"
          value={deposit}
          step={10_000}
          onChange={setDeposit}
          hint="Counted as 10 percent interest a year, not in full."
        />

        <NumberField
          label="Yearly rent increase, percent"
          value={increase}
          step={1}
          max={100}
          onChange={setIncrease}
          hint="Leave at 0 if the rent stays the same for the whole term."
        />

        <NumberField
          label="Non refundable amount"
          value={nonRefundable}
          step={1_000}
          onChange={setNonRefundable}
          hint="Any premium or deposit that is not returned. Usually nil."
        />
      </div>

      {/* --------------------------------------------------------- results */}
      <div className="grid gap-px bg-line sm:grid-cols-2">
        <div className="bg-paper p-6">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-bronze-deep">
            Stamp duty
          </div>
          <div className="mt-2 text-3xl tabular-nums text-ink md:text-4xl">
            <RollNumber value={r.stampDuty} format={inr} />
          </div>
          <p className="mt-2 text-sm text-ink/60">
            {r.minimumApplied
              ? `The minimum of ${inr(LEAVE_LICENCE.minDuty)} applies.`
              : `${LEAVE_LICENCE.dutyPct}% of ${inr(r.dutiableAmount)}`}
          </p>
        </div>

        <div className="bg-paper-alt p-6">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-bronze-deep">
            Total government charges
          </div>
          <div className="mt-2 text-3xl tabular-nums text-ink md:text-4xl">
            <RollNumber value={r.total} format={inr} />
          </div>
          <p className="mt-2 text-sm text-ink/60">
            Stamp duty, registration fee and handling charge together.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <ToolResultCTA
          slug="rent-agreement-stamp-duty-calculator-mumbai"
          offer="We draft and register leave and licence agreements online. Send the rent, deposit and term and we will confirm the cost."
          message={message}
          inputsKey={`${rent}|${months}|${increase}|${deposit}|${nonRefundable}`}
          share={{
            r: rent,
            m: r.months,
            inc: increase || undefined,
            d: deposit || undefined,
            nr: nonRefundable || undefined,
          }}
          show={rent > 0}
        />

        <dl className="divide-y divide-line rounded-xl border border-line">
          {r.schedule.length > 1 && increase > 0
            ? r.schedule.map((y) => (
                <Row
                  key={y.year}
                  label={`Rent in year ${y.year}, ${y.months} months at ${inr(y.monthlyRent)}`}
                  value={y.rent}
                />
              ))
            : null}
          <Row label={`Rent for ${r.months} months`} value={r.totalRent} />
          <Row
            label={`Interest on the deposit, 10% for ${r.interestYears} ${r.interestYears === 1 ? "year" : "years"}`}
            value={r.notionalInterest}
          />
          {r.nonRefundable > 0 && <Row label="Non refundable amount" value={r.nonRefundable} />}
          <Row label="Amount the duty is charged on" value={r.dutiableAmount} />
          <Row
            label={r.minimumApplied ? "Stamp duty, minimum" : `Stamp duty at ${LEAVE_LICENCE.dutyPct}%`}
            value={r.stampDuty}
          />
          <Row label="Registration fee, urban area" value={r.registrationFee} />
          <Row label="Document handling charge" value={r.handlingCharge} />
          <Row label="Total payable" value={r.total} strong />
        </dl>

        <div className="rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            Sources read {fmtDate(RENT_AGREEMENT_VERIFIED_ON)}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {RENT_AGREEMENT_SOURCES.map((s) => (
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
            The figure shown on the IGR portal when you register is the one you pay. Treat this
            as an estimate for planning.
          </p>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step,
  max,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
  max?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        step={step}
        value={value || ""}
        placeholder="0"
        onChange={(e) => {
          const n = Math.max(0, Number(e.target.value) || 0);
          onChange(max !== undefined ? Math.min(max, n) : n);
        }}
        className="mt-1.5 w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-bronze"
      />
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Row({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 p-3.5">
      <dt className={strong ? "font-semibold text-ink" : "text-ink/70"}>{label}</dt>
      <dd className={strong ? "font-semibold tabular-nums text-ink" : "tabular-nums text-ink/80"}>
        {inr(value)}
      </dd>
    </div>
  );
}
