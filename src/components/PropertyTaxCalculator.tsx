"use client";

import { useMemo, useState } from "react";
import { ToolResultCTA } from "@/components/ToolResultCTA";
import {
  calculatePropertyTax,
  BUILDING_LABEL,
  USER_LABEL,
  EXEMPT_UPTO_SQFT,
  PT_SOURCES,
  PT_VERIFIED_ON,
  type BuildingType,
  type UserCategory,
} from "@/lib/propertytax";
import { inr } from "@/lib/emi";

/**
 * BMC property tax.
 *
 * The tool leads with the 500 sq ft exemption, because a residential flat of
 * 500 sq ft carpet or less has paid nothing since January 2022 and many flats
 * in Borivali, Kandivali and Malad sit under that line. The calculation that
 * follows uses MCGM's own formula, weights and rate tables, the same ones the
 * blog post cites. See lib/propertytax.ts.
 *
 * The defaults reproduce the worked example in the blog post: 650 sq ft, 3rd
 * floor, 18 year old RCC building with a lift, Borivali West zone 83/361 at
 * 1,03,630 rupees per square metre (ready reckoner 2026 to 2027).
 */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const w = (n: number) => n.toFixed(2);

export function PropertyTaxCalculator() {
  const [carpetSqft, setCarpetSqft] = useState(650);
  const [reckonerRatePerSqm, setRate] = useState(103_630);
  const [building, setBuilding] = useState<BuildingType>("rcc");
  const [ageYears, setAgeYears] = useState(18);
  const [floor, setFloor] = useState(3);
  const [hasLift, setHasLift] = useState(true);
  const [user, setUser] = useState<UserCategory>("residential");

  const r = useMemo(
    () =>
      calculatePropertyTax({
        carpetSqft,
        reckonerRatePerSqm,
        building,
        ageYears,
        floor,
        hasLift,
        user,
      }),
    [carpetSqft, reckonerRatePerSqm, building, ageYears, floor, hasLift, user],
  );

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <Num
          label="Carpet area, sq ft"
          value={carpetSqft}
          onChange={setCarpetSqft}
          step={10}
          hint="Carpet, not super built up. The exemption is measured on this."
        />
        <Num
          label="Ready reckoner rate, per sq m"
          value={reckonerRatePerSqm}
          onChange={setRate}
          step={1_000}
          hint="The rate for your zone under e-ASR on the IGR site. It is quoted per square metre."
        />
        <Choice
          label="Used as"
          value={user}
          onChange={setUser}
          options={(Object.keys(USER_LABEL) as UserCategory[]).map((k) => ({
            id: k,
            label: USER_LABEL[k],
          }))}
        />
        <Choice
          label="Type of building"
          value={building}
          onChange={setBuilding}
          options={(Object.keys(BUILDING_LABEL) as BuildingType[]).map((k) => ({
            id: k,
            label: BUILDING_LABEL[k],
          }))}
        />
        <Num
          label="Age of the building, years"
          value={ageYears}
          onChange={setAgeYears}
          step={1}
          hint="From the occupancy certificate or the society's records."
        />
        <Num
          label="Floor"
          value={floor}
          onChange={setFloor}
          step={1}
          hint="0 for the ground floor."
        />
        <Choice
          label="Lift in the building"
          value={hasLift ? "yes" : "no"}
          onChange={(v) => setHasLift(v === "yes")}
          options={[
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ]}
        />
      </div>

      {/* The exemption leads, because it needs no rate at all. */}
      <div className="p-6">
        {r.exempt ? (
          <div className="rounded-xl border border-bronze/40 bg-bronze/10 px-5 py-4 text-ink">
            <div className="text-lg font-semibold">
              This flat looks fully exempt.
            </div>
            <p className="mt-1 text-sm">
              Homes of {EXEMPT_UPTO_SQFT} sq ft carpet or less have been exempt
              from BMC property tax since 1 January 2022. If a bill still
              arrives, the ward office can correct it.
            </p>
          </div>
        ) : user === "residential" ? (
          <div className="rounded-xl border border-line bg-paper-alt px-5 py-4 text-sm text-ink">
            Above {EXEMPT_UPTO_SQFT} sq ft carpet, so the tax applies. Homes at
            or under {EXEMPT_UPTO_SQFT} sq ft carpet pay none.
          </div>
        ) : (
          <div className="rounded-xl border border-line bg-paper-alt px-5 py-4 text-sm text-ink">
            The {EXEMPT_UPTO_SQFT} sq ft exemption is for homes only, so a shop
            or office pays the commercial rate.
          </div>
        )}

        <dl className="mt-6 divide-y divide-line rounded-xl border border-line">
          <Row label="Carpet area in sq m" value={String(r.carpetSqm)} />
          <Row label="User weight" value={w(r.userWeight)} />
          <Row label="Building type weight" value={w(r.buildingWeight)} />
          <Row label="Age weight" value={w(r.ageWeight)} />
          <Row
            label={
              building === "rcc" && hasLift
                ? "Floor weight"
                : "Floor weight (RCC with a lift only)"
            }
            value={w(r.floorWeight)}
          />
          <Row label="Capital value" value={inr(r.capitalValue)} strong />
          <Row
            label={`Tax at ${r.taxRatePct} percent a year`}
            value={inr(r.taxBeforeExemption)}
          />
          <Row label="Tax payable a year" value={inr(r.taxPayable)} strong />
        </dl>

        <div className="mt-6">
          <ToolResultCTA
            slug="bmc-property-tax-calculator"
            offer={
              r.exempt
                ? "Want us to confirm it from your bill? Free, on WhatsApp."
                : "Want us to check this against your last bill? Free, on WhatsApp."
            }
            message={
              r.exempt
                ? `Hi Shree Giriraj, I used your BMC property tax calculator. Carpet area ${carpetSqft} sq ft, ${USER_LABEL[user].toLowerCase()}, which looks exempt. Please confirm it from my bill.`
                : `Hi Shree Giriraj, I used your BMC property tax calculator. Carpet area ${carpetSqft} sq ft, ${USER_LABEL[user].toLowerCase()}, capital value ${inr(r.capitalValue)}, tax about ${inr(r.taxPayable)} a year. Can you check it against my bill?`
            }
            inputsKey={`${carpetSqft}|${reckonerRatePerSqm}|${building}|${ageYears}|${floor}|${hasLift}|${user}`}
          />
        </div>

        <div className="mt-6 rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            Why your bill can differ
          </div>
          <p className="mt-2 text-sm text-ink/75">
            The law fixes capital value for five years at a time, so your bill
            may use an older, lower reckoner rate. The water lines also depend
            on whether your connection is metered. Your bill shows the exact
            split.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-line p-5">
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
            If you are buying, not owning
          </div>
          <p className="mt-2 text-sm text-ink/75">
            Unpaid property tax stays with the flat, not the person. Ask for the
            last paid receipt before you pay a token. It takes a minute and
            keeps the sale clean.
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
            An estimate on MCGM&apos;s published formula. Your bill is issued by
            the BMC and is the authority.
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
        className="mt-1.5 w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-bronze"
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
