"use client";

import { useMemo, useState } from "react";
import {
  emi,
  schedule,
  prepaymentImpact,
  upfront,
  affordability,
  inr,
  inrShort,
  monthsToYears,
} from "@/lib/emi";

/**
 * The calculator.
 *
 * DESIGN RULE: simple first, depth on request.
 *
 * Four inputs and two answers are visible immediately. Everything else lives
 * behind tabs the reader opens deliberately. Fundulator exposes stage wise
 * disbursement, three prepayment strategies and tax planning on one screen,
 * which is powerful and completely overwhelming for a first time buyer, who is
 * most of the audience here.
 *
 * NO EMAIL WALL. Gating a calculator destroys the reason for building it.
 *
 * The second headline figure, cash needed before you get the keys, is the one
 * thing no lender's calculator shows. See lib/emi.ts for why.
 */

type Tab = "cash" | "schedule" | "prepay" | "afford";

const TABS: { id: Tab; label: string }[] = [
  { id: "cash", label: "What you need upfront" },
  { id: "schedule", label: "Year by year" },
  { id: "prepay", label: "If you prepay" },
  { id: "afford", label: "What you can borrow" },
];

export function EmiCalculator() {
  // Core four.
  const [price, setPrice] = useState(10_000_000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  // Upfront costs.
  const [stampPct, setStampPct] = useState(6);
  const [registration, setRegistration] = useState(30_000);
  const [brokeragePct, setBrokeragePct] = useState(1);
  const [interiors, setInteriors] = useState(0);
  const [other, setOther] = useState(0);

  // Prepayment.
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [lumpSum, setLumpSum] = useState(0);

  // Affordability.
  const [income, setIncome] = useState(150_000);
  const [existingEmis, setExistingEmis] = useState(0);

  const [tab, setTab] = useState<Tab>("cash");

  const months = years * 12;

  const cost = useMemo(
    () =>
      upfront({
        price,
        downPaymentPct: downPct,
        stampDutyPct: stampPct,
        registration,
        brokeragePct,
        interiors,
        otherCosts: other,
      }),
    [price, downPct, stampPct, registration, brokeragePct, interiors, other],
  );

  const instalment = useMemo(
    () => emi(cost.loanAmount, rate, months),
    [cost.loanAmount, rate, months],
  );

  const sched = useMemo(
    () => schedule(cost.loanAmount, rate, months),
    [cost.loanAmount, rate, months],
  );

  const prepay = useMemo(
    () =>
      prepaymentImpact(cost.loanAmount, rate, months, {
        extraPerMonth: extraMonthly,
        lumpSum,
        lumpSumAtMonth: 12,
      }),
    [cost.loanAmount, rate, months, extraMonthly, lumpSum],
  );

  const afford = useMemo(
    () => affordability(income, existingEmis, rate, months),
    [income, existingEmis, rate, months],
  );

  const interestShare =
    sched.totalPaid > 0 ? (sched.totalInterest / sched.totalPaid) * 100 : 0;

  return (
    <div className="rounded-2xl border border-line bg-paper">
      {/* ---------------------------------------------------------- inputs */}
      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <Slider
          label="Property price"
          value={price}
          onChange={setPrice}
          min={1_000_000}
          max={100_000_000}
          step={100_000}
          display={inrShort(price)}
        />
        <Slider
          label="Down payment"
          value={downPct}
          onChange={setDownPct}
          min={5}
          max={100}
          step={1}
          display={`${downPct}%  ·  ${inrShort(cost.downPayment)}`}
        />
        <Slider
          label="Interest rate"
          value={rate}
          onChange={setRate}
          min={5}
          max={15}
          step={0.05}
          display={`${rate.toFixed(2)}% a year`}
        />
        <Slider
          label="Loan tenure"
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          display={`${years} year${years === 1 ? "" : "s"}`}
        />
      </div>

      {/* --------------------------------------------------------- answers */}
      <div className="grid gap-px bg-line sm:grid-cols-2">
        <Headline
          label="Monthly EMI"
          value={inr(instalment)}
          note={`On a ${inrShort(cost.loanAmount)} loan over ${years} years`}
        />
        {/* The differentiator. Deliberately given equal weight to the EMI. */}
        <Headline
          label="Cash you need before the keys"
          value={inr(cost.cashNeeded)}
          note={`${inrShort(cost.beyondDownPayment)} of this is on top of your down payment, and a home loan will not cover it`}
          accent
        />
      </div>

      {/* ------------------------------------------------------------ tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line p-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={
              tab === t.id
                ? "rounded-full bg-brand-indigo px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-line px-4 py-2 text-sm text-ink/70 hover:bg-paper-alt"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "cash" && (
          <div>
            <p className="mb-5 max-w-[60ch] text-sm text-ink/70">
              A home loan pays for part of the flat. It does not pay the state,
              the society or the carpenter. This is what has to come from your
              own pocket.
            </p>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <NumberField
                  label="Stamp duty"
                  suffix="%"
                  value={stampPct}
                  onChange={setStampPct}
                  step={0.5}
                  hint="Set this to the rate that applies to you. Rates differ by buyer category and change, so confirm the current figure before relying on it."
                />
                <NumberField
                  label="Registration"
                  value={registration}
                  onChange={setRegistration}
                  step={5_000}
                />
                <NumberField
                  label="Brokerage"
                  suffix="%"
                  value={brokeragePct}
                  onChange={setBrokeragePct}
                  step={0.25}
                />
                <NumberField
                  label="Interiors and furnishing"
                  value={interiors}
                  onChange={setInteriors}
                  step={50_000}
                />
                <NumberField
                  label="Society transfer, moving, anything else"
                  value={other}
                  onChange={setOther}
                  step={10_000}
                />
              </div>

              <dl className="divide-y divide-line self-start rounded-xl border border-line">
                <Row label="Down payment" value={cost.downPayment} />
                <Row label="Stamp duty" value={cost.stampDuty} />
                <Row label="Registration" value={cost.registration} />
                <Row label="Brokerage" value={cost.brokerage} />
                <Row label="Interiors" value={cost.interiors} />
                <Row label="Other" value={cost.otherCosts} />
                <Row label="Cash needed" value={cost.cashNeeded} strong />
                <Row
                  label="Total cost of buying"
                  value={cost.totalCostOfBuying}
                  strong
                />
              </dl>
            </div>
          </div>
        )}

        {tab === "schedule" && (
          <div>
            <p className="mb-4 max-w-[60ch] text-sm text-ink/70">
              Over {monthsToYears(sched.months)} you would pay{" "}
              <b>{inr(sched.totalInterest)}</b> in interest on a{" "}
              {inrShort(cost.loanAmount)} loan. That is{" "}
              <b>{interestShare.toFixed(0)}%</b> of everything you pay.
            </p>

            {/* Principal against interest, without pulling in a chart library. */}
            <div
              className="mb-6 flex h-3 overflow-hidden rounded-full bg-line"
              role="img"
              aria-label={`${interestShare.toFixed(0)} percent of your payments is interest`}
            >
              <div
                className="bg-brand-indigo"
                style={{ width: `${100 - interestShare}%` }}
              />
              <div className="bg-brass" style={{ width: `${interestShare}%` }} />
            </div>

            <div className="max-h-96 overflow-auto rounded-xl border border-line">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-paper-alt text-left">
                  <tr>
                    <th className="p-3 font-semibold">Year</th>
                    <th className="p-3 text-right font-semibold">Principal</th>
                    <th className="p-3 text-right font-semibold">Interest</th>
                    <th className="p-3 text-right font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {sched.years.map((y) => (
                    <tr key={y.year} className="border-t border-line">
                      <td className="p-3">{y.year}</td>
                      <td className="p-3 text-right tabular-nums">
                        {inr(y.principalPaid)}
                      </td>
                      <td className="p-3 text-right tabular-nums text-brass">
                        {inr(y.interestPaid)}
                      </td>
                      <td className="p-3 text-right tabular-nums">
                        {inr(y.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "prepay" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="max-w-[60ch] text-sm text-ink/70">
                Paying extra reduces the principal, so the loan finishes sooner.
                Early payments save far more than late ones, because the early
                years are almost all interest.
              </p>
              <NumberField
                label="Extra every month"
                value={extraMonthly}
                onChange={setExtraMonthly}
                step={1_000}
              />
              <NumberField
                label="One lump sum, after a year"
                value={lumpSum}
                onChange={setLumpSum}
                step={50_000}
              />
            </div>
            <div className="grid content-start gap-px rounded-xl border border-line bg-line">
              <Headline
                label="Interest saved"
                value={inr(prepay.interestSaved)}
                note="Compared with paying the EMI alone"
              />
              <Headline
                label="Loan finishes sooner by"
                value={
                  prepay.monthsSaved > 0
                    ? monthsToYears(prepay.monthsSaved)
                    : "No change yet"
                }
                note={
                  prepay.monthsSaved > 0
                    ? `${monthsToYears(prepay.newMonths)} instead of ${years} years`
                    : "Add an amount above to see the effect"
                }
              />
            </div>
          </div>
        )}

        {tab === "afford" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="max-w-[60ch] text-sm text-ink/70">
                Lenders work to a share of your income, counting the new EMI
                alongside anything you already pay. Fifty percent is used here
                as a common working assumption.
              </p>
              <NumberField
                label="Net monthly income"
                value={income}
                onChange={setIncome}
                step={10_000}
              />
              <NumberField
                label="EMIs you already pay"
                value={existingEmis}
                onChange={setExistingEmis}
                step={1_000}
              />
            </div>
            <div className="grid content-start gap-px rounded-xl border border-line bg-line">
              <Headline
                label="Comfortable EMI"
                value={inr(afford.maxEmi)}
                note="Roughly the most a lender would want you carrying"
              />
              <Headline
                label="Indicative loan"
                value={inrShort(afford.indicativeLoan)}
                note={`Over ${years} years at ${rate.toFixed(2)}%. A guide, not an offer.`}
              />
            </div>
          </div>
        )}
      </div>

      <p className="border-t border-line px-6 py-4 text-xs text-muted">
        Estimates for planning, not a quotation or an offer of credit. Your
        actual rate, eligibility and charges are set by your lender. Stamp duty
        and registration are set by the state and change from time to time.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

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
      <div className="mt-2 text-3xl text-ink tabular-nums md:text-4xl">
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
        <span className="text-sm text-ink/70 tabular-nums">{display}</span>
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

function NumberField({
  label,
  value,
  onChange,
  step,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
  suffix?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <span className="mt-1.5 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-brass"
        />
        {suffix && <span className="text-sm text-muted">{suffix}</span>}
      </span>
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
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
            ? "font-semibold text-ink tabular-nums"
            : "text-ink/80 tabular-nums"
        }
      >
        {inr(value)}
      </dd>
    </div>
  );
}
