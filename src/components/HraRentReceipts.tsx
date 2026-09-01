"use client";

import { useMemo, useState } from "react";
import {
  calculateHra,
  buildReceipts,
  financialYearLabel,
  LANDLORD_PAN_THRESHOLD,
  HRA_SOURCES,
  HRA_VERIFIED_ON,
  type ReceiptPeriod,
} from "@/lib/hra";
import { inr } from "@/lib/emi";

/**
 * HRA exemption and rent receipts.
 *
 * Two jobs in one page because they are the same errand: a tenant works out
 * what they can claim, then needs the paper to claim it.
 *
 * The old regime warning sits at the very top. A reader on the new regime gets
 * nothing from any of this, and letting them work through the arithmetic
 * before finding that out would be a waste of their time and a bad look.
 *
 * Receipts print from the browser. No email wall, no account, nothing sent
 * anywhere: everything below is computed in the page and never leaves it.
 */

const BIND_COPY: Record<string, string> = {
  hra: "Your exemption is capped by the HRA your employer actually pays. Paying more rent will not increase it.",
  rent: "Your exemption is capped by the rent you pay. This is the limb most people can actually move.",
  salary:
    "Your exemption is capped at half your basic pay, which is the metro ceiling.",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function HraRentReceipts() {
  const [monthlyBasic, setMonthlyBasic] = useState(50_000);
  const [monthlyHra, setMonthlyHra] = useState(20_000);
  const [monthlyRent, setMonthlyRent] = useState(25_000);
  const [isMetro, setIsMetro] = useState(true);

  const [tenant, setTenant] = useState("");
  const [landlord, setLandlord] = useState("");
  const [landlordPan, setLandlordPan] = useState("");
  const [address, setAddress] = useState("");
  const [period, setPeriod] = useState<ReceiptPeriod>("monthly");
  const [fyStart, setFyStart] = useState(2026);

  const hra = useMemo(
    () => calculateHra({ monthlyBasic, monthlyHra, monthlyRent, isMetro }),
    [monthlyBasic, monthlyHra, monthlyRent, isMetro],
  );

  const receipts = useMemo(
    () => buildReceipts(monthlyRent, period, fyStart),
    [monthlyRent, period, fyStart],
  );

  return (
    <div className="rounded-2xl border border-line bg-paper">
      {/* The thing to say before anything else. */}
      <div className="border-b border-line bg-brass/10 px-6 py-4 text-sm text-ink print:hidden">
        <b>HRA exemption exists only under the old tax regime.</b> If you are on
        the new regime you cannot claim it, whatever the numbers below say.
      </div>

      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2 print:hidden">
        <Field
          label="Basic pay plus DA, a month"
          value={monthlyBasic}
          onChange={setMonthlyBasic}
          step={5_000}
          hint="Not your gross salary. Using gross is the most common mistake."
        />
        <Field
          label="HRA received, a month"
          value={monthlyHra}
          onChange={setMonthlyHra}
          step={2_500}
        />
        <Field
          label="Rent paid, a month"
          value={monthlyRent}
          onChange={setMonthlyRent}
          step={2_500}
        />
        <div>
          <span className="text-sm font-semibold text-ink">Where you rent</span>
          <div className="mt-2 flex gap-2">
            <Pill active={isMetro} onClick={() => setIsMetro(true)}>
              Metro, 50%
            </Pill>
            <Pill active={!isMetro} onClick={() => setIsMetro(false)}>
              Other, 40%
            </Pill>
          </div>
          <span className="mt-2 block text-xs text-muted">
            Mumbai counts as a metro, so the 50 percent limb applies.
          </span>
        </div>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 print:hidden">
        <Headline
          label="Exempt from tax, a year"
          value={inr(hra.exempt)}
          note="The least of the three limbs below"
        />
        <Headline
          label="Taxable part of your HRA"
          value={inr(hra.taxable)}
          note={`On ${inr(hra.annualHra)} of HRA received`}
          accent
        />
      </div>

      <div className="space-y-5 p-6 print:hidden">
        <dl className="divide-y divide-line rounded-xl border border-line">
          <Limb
            label="HRA actually received"
            value={hra.limbHraReceived}
            binding={hra.bindingLimb === "hra"}
          />
          <Limb
            label="Rent paid, less 10% of basic"
            value={hra.limbRentLessTenPct}
            binding={hra.bindingLimb === "rent"}
          />
          <Limb
            label={`${hra.salaryPctUsed}% of basic pay`}
            value={hra.limbSalaryPct}
            binding={hra.bindingLimb === "salary"}
          />
        </dl>

        <div className="rounded-xl border border-line bg-paper-alt px-5 py-4 text-sm text-ink">
          {BIND_COPY[hra.bindingLimb]}
        </div>

        {hra.panRequired && (
          <div className="rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink">
            <b>Your landlord&apos;s PAN is required.</b> Annual rent of{" "}
            {inr(hra.annualRent)} is above the {inr(LANDLORD_PAN_THRESHOLD)}{" "}
            threshold, so your employer will ask for it. If the landlord has no
            PAN, a signed declaration with their name and address is used
            instead.
          </div>
        )}
      </div>

      {/* ------------------------------------------------------- receipts */}
      <div className="border-t border-line p-6">
        <h3 className="text-xl text-ink print:hidden">Rent receipts</h3>
        <p className="mt-2 max-w-[60ch] text-sm text-ink/70 print:hidden">
          Fill these in and print them. Nothing is sent anywhere: it is all
          worked out in your browser and never reaches us.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 print:hidden">
          <Text label="Your name" value={tenant} onChange={setTenant} />
          <Text label="Landlord name" value={landlord} onChange={setLandlord} />
          <Text
            label="Landlord PAN"
            value={landlordPan}
            onChange={setLandlordPan}
            placeholder={hra.panRequired ? "Required at this rent" : "Optional"}
          />
          <Text
            label="Property address"
            value={address}
            onChange={setAddress}
          />
          <div>
            <span className="text-sm font-semibold text-ink">Receipts</span>
            <div className="mt-2 flex gap-2">
              <Pill
                active={period === "monthly"}
                onClick={() => setPeriod("monthly")}
              >
                Monthly, 12
              </Pill>
              <Pill
                active={period === "quarterly"}
                onClick={() => setPeriod("quarterly")}
              >
                Quarterly, 4
              </Pill>
            </div>
          </div>
          <Field
            label="Financial year starting"
            value={fyStart}
            onChange={setFyStart}
            step={1}
            hint={`Financial year ${financialYearLabel(fyStart)}, April to March`}
          />
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-6 rounded-full bg-brand-indigo px-5 py-2.5 text-sm font-semibold text-white print:hidden"
        >
          Print these receipts
        </button>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 print:grid-cols-1">
          {receipts.map((r) => (
            <div
              key={r.index}
              className="rounded-xl border border-line p-5 text-sm print:break-inside-avoid"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-ink">Rent receipt</span>
                <span className="text-muted">
                  FY {financialYearLabel(fyStart)}
                </span>
              </div>
              <p className="mt-3 text-ink/85">
                Received a sum of <b>{inr(r.amount)}</b> from{" "}
                <Blank v={tenant} w="10rem" /> towards rent for the period{" "}
                <b>
                  {r.fromMonth}
                  {r.fromMonth === r.toMonth ? "" : ` to ${r.toMonth}`}
                </b>{" "}
                for the property at <Blank v={address} w="12rem" />.
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div className="text-xs text-muted">
                  <div>
                    Landlord: <Blank v={landlord} w="8rem" />
                  </div>
                  <div className="mt-1">
                    PAN: <Blank v={landlordPan} w="7rem" />
                  </div>
                </div>
                <div className="w-32 border-t border-line pt-1 text-center text-[0.65rem] text-muted">
                  Signature
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line px-6 py-4 print:hidden">
        <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
          Rules checked {fmtDate(HRA_VERIFIED_ON)}
        </div>
        <ul className="mt-2 space-y-1 text-xs">
          {HRA_SOURCES.map((s) => (
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
          An estimate to help you plan and produce the paperwork. It is not tax
          advice, and your exemption is finally a matter for your employer and
          your chartered accountant.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

/** Shows the typed value, or a rule to write on when printing a blank. */
function Blank({ v, w }: { v: string; w: string }) {
  if (v.trim()) return <b>{v}</b>;
  return (
    <span
      className="inline-block border-b border-dotted border-ink/40 align-bottom"
      style={{ width: w }}
    />
  );
}

function Limb({
  label,
  value,
  binding,
}: {
  label: string;
  value: number;
  binding: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between p-3.5">
      <dt className={binding ? "font-semibold text-ink" : "text-ink/70"}>
        {label}
        {binding && (
          <span className="ml-2 rounded-full bg-brand-indigo px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
            Applies
          </span>
        )}
      </dt>
      <dd
        className={
          binding
            ? "font-semibold tabular-nums text-ink"
            : "tabular-nums text-ink/60"
        }
      >
        {inr(value)}
      </dd>
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

function Field({
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

function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
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
