"use client";

import { useMemo, useState } from "react";
import { computeYield, rentForTargetNetYield, type YieldInput } from "@/lib/yield";
import { inr, inrShort } from "@/lib/emi";

/**
 * Rental yield.
 *
 * Most yield calculators ask for a price and a rent, divide one by the other,
 * and stop. That number is gross yield, and on a Mumbai flat it is the most
 * flattering figure available: it ignores society maintenance, property tax,
 * the weeks between tenants, and the stamp duty, registration, brokerage and
 * fit out that are just as much capital as the price itself.
 *
 * So this one shows gross and net side by side and puts the gap between them
 * on screen as its own figure. The gap is the point of the tool.
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It never says a yield is good or bad, and
 * it carries no benchmark for Borivali, Kandivali or Malad. The site publishes
 * no expected return, because no citable source for these micro markets has
 * been verified and a suburb wide average says nothing about one flat. The
 * reverse mode is the honest version of that question: the reader supplies the
 * return they want, and the tool says what rent would have to be true.
 */

const fmtPct = (n: number) => `${n.toFixed(2)}%`;

export function RentalYieldCalculator() {
  const [mode, setMode] = useState<"yield" | "target">("yield");

  const [price, setPrice] = useState(20_000_000);
  const [monthlyRent, setMonthlyRent] = useState(50_000);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(5_000);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(12_000);
  const [annualOtherCosts, setAnnualOtherCosts] = useState(20_000);
  const [vacancyWeeks, setVacancyWeeks] = useState(4);
  const [acquisitionCosts, setAcquisitionCosts] = useState(1_400_000);
  const [targetPct, setTargetPct] = useState(3);

  const input: YieldInput = {
    price,
    monthlyRent,
    monthlyMaintenance,
    annualPropertyTax,
    annualOtherCosts,
    vacancyWeeks,
    acquisitionCosts,
  };

  const r = useMemo(() => computeYield(input), [
    price,
    monthlyRent,
    monthlyMaintenance,
    annualPropertyTax,
    annualOtherCosts,
    vacancyWeeks,
    acquisitionCosts,
  ]);

  const neededRent = useMemo(
    () => rentForTargetNetYield(input, targetPct),
    [
      price,
      monthlyMaintenance,
      annualPropertyTax,
      annualOtherCosts,
      vacancyWeeks,
      acquisitionCosts,
      targetPct,
    ],
  );

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="flex flex-wrap gap-2 border-b border-line p-4">
        <ModeButton active={mode === "yield"} onClick={() => setMode("yield")}>
          Work out the yield
        </ModeButton>
        <ModeButton active={mode === "target"} onClick={() => setMode("target")}>
          Work backwards from a target
        </ModeButton>
      </div>

      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <Slider
          label="Price of the flat"
          value={price}
          onChange={setPrice}
          min={1_000_000}
          max={150_000_000}
          step={100_000}
          display={inrShort(price)}
        />
        {mode === "yield" && (
          <Slider
            label="Monthly rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            min={0}
            max={500_000}
            step={1_000}
            display={inr(monthlyRent)}
          />
        )}
        {mode === "target" && (
          <Slider
            label="Net yield you want"
            value={targetPct}
            onChange={setTargetPct}
            min={0.5}
            max={10}
            step={0.1}
            display={fmtPct(targetPct)}
          />
        )}
        <Slider
          label="Buying costs on top of the price"
          value={acquisitionCosts}
          onChange={setAcquisitionCosts}
          min={0}
          max={20_000_000}
          step={50_000}
          display={inrShort(acquisitionCosts)}
        />
        <Slider
          label="Society maintenance, monthly"
          value={monthlyMaintenance}
          onChange={setMonthlyMaintenance}
          min={0}
          max={50_000}
          step={500}
          display={inr(monthlyMaintenance)}
        />
        <Slider
          label="Property tax, yearly"
          value={annualPropertyTax}
          onChange={setAnnualPropertyTax}
          min={0}
          max={200_000}
          step={1_000}
          display={inr(annualPropertyTax)}
        />
        <Slider
          label="Repairs, insurance and the rest, yearly"
          value={annualOtherCosts}
          onChange={setAnnualOtherCosts}
          min={0}
          max={300_000}
          step={1_000}
          display={inr(annualOtherCosts)}
        />
        <Slider
          label="Weeks empty between tenants"
          value={vacancyWeeks}
          onChange={setVacancyWeeks}
          min={0}
          max={26}
          step={1}
          display={`${vacancyWeeks} ${vacancyWeeks === 1 ? "week" : "weeks"}`}
        />
      </div>

      {mode === "yield" ? (
        <>
          <div className="grid gap-px bg-line sm:grid-cols-2">
            <Headline
              label="Gross yield, the flattering one"
              value={fmtPct(r.grossYieldPct)}
              note={`${inr(r.grossAnnualRent)} a year on the price alone`}
            />
            <Headline
              label="Net yield, after costs and capital"
              value={r.netAnnualIncome > 0 ? fmtPct(r.netYieldPct) : "Loss"}
              note={
                r.netAnnualIncome > 0
                  ? `${inr(Math.round(r.netAnnualIncome))} a year on ${inrShort(r.totalCapital)} of capital`
                  : `Costs exceed the rent by ${inr(Math.round(-r.netAnnualIncome))} a year`
              }
              accent
            />
          </div>

          <div className="space-y-5 p-6">
            {/* The gap is the argument. A bar makes it land in a way a pair of
                percentages does not. */}
            <div>
              <div
                className="flex h-8 overflow-hidden rounded-lg"
                role="img"
                aria-label={`Net yield is ${fmtPct(Math.max(0, r.netYieldPct))} of a gross ${fmtPct(r.grossYieldPct)}`}
              >
                <div
                  className="flex items-center justify-center bg-brand-indigo text-xs font-semibold text-white"
                  style={{
                    width: `${
                      r.grossYieldPct > 0
                        ? Math.max(0, Math.min(100, (r.netYieldPct / r.grossYieldPct) * 100))
                        : 0
                    }%`,
                  }}
                >
                  net
                </div>
                <div className="flex flex-1 items-center justify-center bg-brass/40 text-xs font-semibold text-ink">
                  lost to costs
                </div>
              </div>
              <p className="mt-2 text-sm text-ink/70">
                Dark is what you keep. The rest goes to maintenance, tax,
                repairs, empty weeks, and the buying costs that are capital
                just as much as the price is.
              </p>
            </div>

            <dl className="divide-y divide-line rounded-xl border border-line">
              <Row label="Rent for a full year" value={inr(r.grossAnnualRent)} />
              <Row
                label="Rent you actually collect"
                value={inr(Math.round(r.collectedAnnualRent))}
                note={`${vacancyWeeks} of 52 weeks empty`}
              />
              <Row
                label="Costs of owning it, yearly"
                value={inr(Math.round(r.annualCosts))}
              />
              <Row
                label="Net income, before tax and any loan"
                value={inr(Math.round(r.netAnnualIncome))}
              />
              <Row
                label="Total capital in"
                value={inr(r.totalCapital)}
                note="Price plus duty, registration, brokerage and fit out"
              />
              <Row
                label="Years of net income to get the capital back"
                value={
                  Number.isFinite(r.paybackYears)
                    ? `${r.paybackYears.toFixed(1)} years`
                    : "Never, at this rent"
                }
                note="Rent alone. It says nothing about resale."
              />
            </dl>

            <div className="rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink">
              <b>The gap is {fmtPct(Math.max(0, r.yieldGapPct))}.</b> That is
              how much the gross figure overstates what the flat pays you.
              Listings and brochures quote the gross number.
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-5 p-6">
          <div className="grid gap-px bg-line sm:grid-cols-2">
            <Headline
              label={`Rent needed for ${fmtPct(targetPct)} net`}
              value={neededRent === null ? "Not possible" : inr(Math.round(neededRent))}
              note="Per month, at the costs and vacancy above"
              accent
            />
            <Headline
              label="What that is a year"
              value={neededRent === null ? "—" : inr(Math.round(neededRent * 12))}
              note="Before vacancy is taken off"
            />
          </div>
          <p className="text-sm text-ink/70">
            This is the honest way round. Rather than being told what a flat
            will yield, decide the return you need and see what rent would have
            to be true for it. Then ask whether this flat, in this building,
            can genuinely command that from a tenant today. If it cannot, the
            price is the thing that has to move.
          </p>
        </div>
      )}
    </div>
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
      className={
        active
          ? "rounded-full bg-brand-indigo px-4 py-1.5 text-sm font-semibold text-white"
          : "rounded-full border border-line px-4 py-1.5 text-sm font-semibold text-ink/70 hover:border-brand-indigo/40"
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
      <div className="mt-2 text-3xl tabular-nums text-ink md:text-4xl">{value}</div>
      {note && <p className="mt-2 text-sm text-ink/60">{note}</p>}
    </div>
  );
}

function Row({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-3.5">
      <dt className="text-sm text-ink/75">
        {label}
        {note && <span className="block text-xs text-ink/50">{note}</span>}
      </dt>
      <dd className="shrink-0 tabular-nums text-ink">{value}</dd>
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
        className="mt-2 w-full accent-brand-indigo"
      />
    </label>
  );
}
