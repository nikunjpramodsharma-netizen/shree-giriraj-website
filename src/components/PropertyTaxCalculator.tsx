"use client";

import { useMemo, useState } from "react";
import {
  calculatePropertyTax,
  CONSTRUCTION_LABEL,
  CONSTRUCTION_WEIGHT,
  AGE_LABEL,
  AGE_WEIGHT,
  EXEMPT_UPTO_SQFT,
  CONCESSION_UPTO_SQFT,
  CONCESSION_PCT,
  PT_SOURCES,
  PT_VERIFIED_ON,
  type ConstructionType,
  type AgeBand,
  type UserCategory,
} from "@/lib/propertytax";
import { inr } from "@/lib/emi";

/**
 * BMC property tax.
 *
 * The tool leads with the size relief rather than with the arithmetic. A
 * residential flat of 500 sq ft carpet or less has been fully exempt since
 * January 2022, and a great many flats in Borivali, Kandivali and Malad are
 * under that line while their owners have no idea. That check needs no tax
 * rate at all, which is why it comes first and the calculation comes second.
 *
 * The 500 to 700 band is surfaced but never discounted, because we could not
 * verify it. See lib/propertytax.ts.
 */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function PropertyTaxCalculator() {
  const [carpetSqft, setCarpetSqft] = useState(650);
  const [reckonerRatePerSqft, setRate] = useState(20_000);
  const [construction, setConstruction] = useState<ConstructionType>("rcc");
  const [age, setAge] = useState<AgeBand>("post1985");
  const [user, setUser] = useState<UserCategory>("residential");
  const [taxRatePct, setTaxRatePct] = useState(0);

  const r = useMemo(
    () =>
      calculatePropertyTax({
        carpetSqft,
        reckonerRatePerSqft,
        construction,
        age,
        user,
        taxRatePct,
      }),
    [carpetSqft, reckonerRatePerSqft, construction, age, user, taxRatePct],
  );

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <Num
          label="Carpet area, sq ft"
          value={carpetSqft}
          onChange={setCarpetSqft}
          step={10}
          hint="Carpet, not super built up. This is what the relief is measured on."
        />
        <Num
          label="Ready reckoner rate, per sq ft"
          value={reckonerRatePerSqft}
          onChange={setRate}
          step={1_000}
          hint="Look it up under e-ASR on the IGR portal"
        />
        <Choice
          label="Construction"
          value={construction}
          onChange={setConstruction}
          options={
            Object.keys(CONSTRUCTION_LABEL).map((k) => ({
              id: k as ConstructionType,
              label: CONSTRUCTION_LABEL[k as ConstructionType],
            }))
          }
        />
        <Choice
          label="Age of the building"
          value={age}
          onChange={setAge}
          options={Object.keys(AGE_LABEL).map((k) => ({
            id: k as AgeBand,
            label: AGE_LABEL[k as AgeBand],
          }))}
        />
        <Choice
          label="Used as"
          value={user}
          onChange={setUser}
          options={[
            { id: "residential" as UserCategory, label: "Residential" },
            { id: "commercial" as UserCategory, label: "Commercial" },
          ]}
        />
        <Num
          label="Tax rate from your bill, %"
          value={taxRatePct}
          onChange={setTaxRatePct}
          step={0.05}
          hint="Optional. Varies by ward and category, so we do not publish one. Leave blank for capital value only."
        />
      </div>

      {/* The relief leads, because it is the useful part and needs no rate. */}
      <div className="p-6">
        {r.exemption === "exempt" && (
          <div className="rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-ink">
            <div className="text-lg font-semibold">
              This flat looks fully exempt.
            </div>
            <p className="mt-1 text-sm">
              Residential flats of {EXEMPT_UPTO_SQFT} sq ft carpet or less have
              been exempt from BMC property tax since January 2022. If you are
              being billed, that is worth taking up with the ward office.
            </p>
          </div>
        )}
        {r.exemption === "possibleConcession" && (
          <div className="rounded-xl border border-line bg-paper-alt px-5 py-4 text-ink">
            <div className="text-lg font-semibold">
              Worth asking about, but we could not confirm it.
            </div>
            <p className="mt-1 text-sm">
              Some reports describe a concession of around {CONCESSION_PCT}%
              for residential flats between {EXEMPT_UPTO_SQFT} and{" "}
              {CONCESSION_UPTO_SQFT} sq ft carpet. We could not verify it, so it
              is <b>not</b> applied to the figures below and your bill may be
              correct as issued. Ask your ward office whether anything applies
              in this band.
            </p>
          </div>
        )}
        {r.exemption === "none" && user === "residential" && (
          <div className="rounded-xl border border-line bg-paper-alt px-5 py-4 text-sm text-ink">
            Above {CONCESSION_UPTO_SQFT} sq ft carpet, so no size relief.
            Residential flats at or under {EXEMPT_UPTO_SQFT} sq ft carpet are
            exempt from BMC property tax entirely.
          </div>
        )}

        <dl className="mt-6 divide-y divide-line rounded-xl border border-line">
          <Row label="Construction weight" value={String(r.constructionWeight)} />
          <Row label="Age weight" value={String(r.ageWeight)} />
          <Row label="Capital value" value={inr(r.capitalValue)} strong />
          {r.hasTaxRate ? (
            <>
              <Row
                label="Tax before relief"
                value={inr(r.taxBeforeRelief ?? 0)}
              />
              <Row label="Tax payable" value={inr(r.taxPayable ?? 0)} strong />
            </>
          ) : (
            <div className="p-3.5 text-sm text-ink/70">
              Add the tax rate from your own bill to see a rupee figure. We do
              not publish a rate because it varies by ward and category, and a
              guess would be worse than nothing.
            </div>
          )}
        </dl>

        <div className="mt-6 rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            If you are buying, not owning
          </div>
          <p className="mt-2 text-sm text-ink/75">
            Unpaid property tax follows the property, not the person. Ask for
            the last paid receipt before you pay a token. It takes a minute and
            it tells you whether there is a problem waiting.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            Checked {fmtDate(PT_VERIFIED_ON)}
          </div>
          <ul className="mt-2 space-y-1 text-xs">
            {PT_SOURCES.map((s) => (
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
            An estimate. Your bill is issued by the BMC and is the authority.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div>
      <span className="text-sm font-semibold text-ink">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
            className={
              value === o.id
                ? "rounded-full bg-brand-indigo px-3.5 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-line px-3.5 py-2 text-sm text-ink/70 hover:bg-paper-alt"
            }
          >
            {o.label}
          </button>
        ))}
      </div>
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
        inputMode="decimal"
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
