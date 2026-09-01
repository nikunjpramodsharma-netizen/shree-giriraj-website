"use client";

import { useMemo, useState } from "react";
import {
  calculateCapitalGains,
  CG_RELIEFS,
  CG_SOURCES,
  CG_VERIFIED_ON,
  LONG_TERM_MONTHS,
  LTCG_RATE_NEW,
  LTCG_RATE_INDEXED,
} from "@/lib/capitalgains";
import { inr } from "@/lib/emi";

/**
 * Capital gains on a property sale.
 *
 * The interesting case is the grandfathering: someone who bought before
 * 23 July 2024 can choose between 12.5 percent flat and 20 percent with
 * indexation, and which is cheaper depends entirely on how much inflation ran
 * over their holding period. Most calculators pick one and show it. This shows
 * both and names the cheaper one, because that choice is worth real money.
 */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function CapitalGainsCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(5_000_000);
  const [purchaseDate, setPurchaseDate] = useState("2015-06-01");
  const [salePrice, setSalePrice] = useState(12_000_000);
  const [saleDate, setSaleDate] = useState("2026-06-01");
  const [transferExpenses, setTransferExpenses] = useState(200_000);
  const [improvements, setImprovements] = useState(0);
  const [isResident, setIsResident] = useState(true);
  const [ciiPurchase, setCiiPurchase] = useState(0);
  const [ciiSale, setCiiSale] = useState(0);

  const r = useMemo(
    () =>
      calculateCapitalGains({
        purchasePrice,
        purchaseDate,
        salePrice,
        saleDate,
        transferExpenses,
        improvements,
        isResidentIndividualOrHuf: isResident,
        ciiPurchase,
        ciiSale,
      }),
    [
      purchasePrice,
      purchaseDate,
      salePrice,
      saleDate,
      transferExpenses,
      improvements,
      isResident,
      ciiPurchase,
      ciiSale,
    ],
  );

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="border-b border-line bg-brass/10 px-6 py-4 text-sm text-ink">
        <b>This is tax, and tax is not our trade.</b> It follows the rules as
        published and is here to help you plan a sale. Confirm the figure with a
        chartered accountant before you file anything on it.
      </div>

      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <Num label="Purchase price" value={purchasePrice} onChange={setPurchasePrice} step={100_000} />
        <DateField label="Purchase date" value={purchaseDate} onChange={setPurchaseDate} />
        <Num label="Sale price" value={salePrice} onChange={setSalePrice} step={100_000} />
        <DateField label="Sale date" value={saleDate} onChange={setSaleDate} />
        <Num
          label="Transfer expenses"
          value={transferExpenses}
          onChange={setTransferExpenses}
          step={25_000}
          hint="Brokerage, legal fees, anything spent on the sale itself"
        />
        <Num
          label="Capital improvements"
          value={improvements}
          onChange={setImprovements}
          step={50_000}
          hint="Additions, not repairs and not repainting"
        />
        <div className="sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Selling as</span>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill active={isResident} onClick={() => setIsResident(true)}>
              Resident individual or HUF
            </Pill>
            <Pill active={!isResident} onClick={() => setIsResident(false)}>
              Anyone else
            </Pill>
          </div>
          <span className="mt-2 block text-xs text-muted">
            Only a resident individual or HUF can use the indexation option on a
            property bought before 23 July 2024.
          </span>
        </div>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2">
        <Headline
          label={r.isLongTerm ? "Long term gain" : "Short term gain"}
          value={inr(r.gain)}
          note={`Held ${Math.floor(r.holdingMonths / 12)} yr ${r.holdingMonths % 12} mo`}
        />
        <Headline
          label="Tax payable"
          value={r.taxPayable === null ? "At your slab rate" : inr(r.taxPayable)}
          note={
            r.taxPayable === null
              ? `Held ${LONG_TERM_MONTHS} months or less, so it is taxed as ordinary income`
              : r.bestOption === "withIndexation"
                ? "Using the indexation option, which is cheaper for you"
                : `At ${LTCG_RATE_NEW}% without indexation`
          }
          accent
        />
      </div>

      <div className="space-y-5 p-6">
        {!r.isLongTerm && (
          <Callout tone="warn">
            <b>This is a short term gain.</b> It is added to your income and
            taxed at your slab rate, so the figure depends on everything else
            you earn this year. Holding past {LONG_TERM_MONTHS} months changes
            the treatment entirely, which is worth knowing before you commit to
            a sale date.
          </Callout>
        )}

        {r.indexationNeedsCii && (
          <Callout tone="warn">
            <b>You have a choice worth money, and it needs two numbers.</b> You
            bought before 23 July 2024, so you may use either{" "}
            {LTCG_RATE_NEW}% without indexation or {LTCG_RATE_INDEXED}% with it.
            Enter the cost inflation index for both years below and the cheaper
            one will be picked. We do not hardcode the index: one wrong value
            would produce a confidently wrong tax figure.
          </Callout>
        )}

        {r.indexationAvailable && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Num
              label="CII, year of purchase"
              value={ciiPurchase}
              onChange={setCiiPurchase}
              step={1}
              hint="From the Income Tax Department's published table"
            />
            <Num
              label="CII, year of sale"
              value={ciiSale}
              onChange={setCiiSale}
              step={1}
            />
          </div>
        )}

        {r.isLongTerm && r.taxWithIndexation !== null && (
          <dl className="divide-y divide-line rounded-xl border border-line">
            <Opt
              label={`${LTCG_RATE_NEW}% without indexation`}
              value={r.taxNoIndexation ?? 0}
              best={r.bestOption === "noIndexation"}
            />
            <Opt
              label={`${LTCG_RATE_INDEXED}% with indexation`}
              value={r.taxWithIndexation}
              best={r.bestOption === "withIndexation"}
            />
            <div className="flex items-baseline justify-between p-3.5">
              <dt className="font-semibold text-ink">Choosing well saves</dt>
              <dd className="font-semibold tabular-nums text-ink">
                {inr(r.saving)}
              </dd>
            </div>
          </dl>
        )}

        <div className="rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            Reliefs worth asking about
          </div>
          <ul className="mt-3 space-y-2 text-sm text-ink/75">
            {CG_RELIEFS.map((x) => (
              <li key={x.section} className="flex gap-2.5">
                <span aria-hidden="true" className="text-brass">
                  ·
                </span>
                <span>
                  <b className="text-ink">{x.section}.</b> {x.what}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            Not computed here on purpose. Each carries conditions and time
            limits that a calculator would misrepresent.
          </p>
        </div>

        <Sources />
      </div>
    </div>
  );

  function Sources() {
    return (
      <div className="rounded-xl border border-line p-5">
        <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
          Rules checked {fmtDate(CG_VERIFIED_ON)}
        </div>
        <ul className="mt-2 space-y-1 text-xs">
          {CG_SOURCES.map((s) => (
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
      </div>
    );
  }
}

/* ------------------------------------------------------------------ parts */

function Opt({
  label,
  value,
  best,
}: {
  label: string;
  value: number;
  best: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between p-3.5">
      <dt className={best ? "font-semibold text-ink" : "text-ink/70"}>
        {label}
        {best && (
          <span className="ml-2 rounded-full bg-brand-indigo px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
            Cheaper
          </span>
        )}
      </dt>
      <dd className={best ? "font-semibold tabular-nums text-ink" : "tabular-nums text-ink/60"}>
        {inr(value)}
      </dd>
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

function Num({
  label,
  value,
  onChange,
  step,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="mt-1.5 w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-brass"
      />
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

/**
 * Named DateField, not Date. A component called Date shadows the global Date
 * constructor in this module scope, so new Date(iso) in fmtDate resolved to
 * this function instead. Caught by the typechecker, not by eye.
 */
function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-brass"
      />
    </label>
  );
}

function Pill({
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
