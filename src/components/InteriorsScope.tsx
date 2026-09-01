"use client";

import { useMemo, useState } from "react";
import {
  SCOPE,
  UNIT_LABEL,
  COMMON_EXCLUSIONS,
  QUOTE_QUESTIONS,
  COST_BANDS_READY,
  defaultSelection,
  buildScope,
  scopeTotals,
  groupsOf,
  type Selection,
} from "@/lib/interiors";
import { inr } from "@/lib/emi";

/**
 * The interiors scope builder.
 *
 * Livspace and HomeLane both run cost calculators on this query. Those exist
 * to capture a lead: you enter a flat size, you get a number, they get your
 * phone. Competing on their ground would mean inventing cost bands we have not
 * verified, which is the one thing this site does not do.
 *
 * So this does the thing their tools cannot do without undermining their own
 * business. It produces a scope in quantities that you take to three designers
 * to get comparable quotes back. It is on the buyer's side rather than the
 * industry's, and that is the whole pitch.
 */
export function InteriorsScope() {
  const [sel, setSel] = useState<Selection>(defaultSelection);
  const lines = useMemo(() => buildScope(sel), [sel]);
  const totals = useMemo(() => scopeTotals(lines), [lines]);
  const groups = useMemo(() => groupsOf(lines), [lines]);

  const set = (id: string, qty: number) =>
    setSel((s) => ({ ...s, [id]: Math.max(0, qty) }));

  return (
    <div className="rounded-2xl border border-line bg-paper">
      <div className="border-b border-line px-6 py-4 text-sm text-ink print:hidden">
        <b>This gives you a scope, not a price.</b> Take it to three designers
        and you will get three quotes you can actually compare. A single lump
        sum figure cannot be compared against anything.
      </div>

      {/* ------------------------------------------------------------ pick */}
      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2 print:hidden">
        {SCOPE.map((item) => (
          <label key={item.id} className="block">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-ink">
                {item.label}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {UNIT_LABEL[item.unit]}
              </span>
            </div>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={item.unit === "nos" ? 1 : item.unit === "rft" ? 1 : 10}
              value={sel[item.id] ?? 0}
              onChange={(e) => set(item.id, Number(e.target.value) || 0)}
              className="mt-1.5 w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-brass"
            />
            <span className="mt-1.5 block text-xs text-muted">
              Specify: {item.specPrompt}
            </span>
          </label>
        ))}
      </div>

      {/* ----------------------------------------------------------- scope */}
      <div className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-xl text-ink">Your scope</h3>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-brand-indigo px-5 py-2.5 text-sm font-semibold text-white print:hidden"
          >
            Print this scope
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-4 text-sm text-ink/60">
            Put a quantity against anything you want done and it will appear
            here.
          </p>
        ) : (
          <div className="mt-5 space-y-6">
            {groups.map((g) => (
              <div key={g}>
                <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
                  {g}
                </div>
                <table className="mt-2 w-full text-sm">
                  <tbody>
                    {lines
                      .filter((l) => l.item.group === g)
                      .map((l) => (
                        <tr key={l.item.id} className="border-t border-line">
                          <td className="py-3 pr-3">
                            <div className="font-medium text-ink">
                              {l.item.label}
                            </div>
                            <div className="mt-0.5 text-xs text-muted">
                              Specify: {l.item.specPrompt}
                            </div>
                          </td>
                          <td className="w-28 py-3 text-right tabular-nums text-ink">
                            {l.qty} {UNIT_LABEL[l.item.unit]}
                          </td>
                          {COST_BANDS_READY && (
                            <td className="w-40 py-3 text-right tabular-nums text-ink/70">
                              {l.costLow !== null
                                ? `${inr(l.costLow)} to ${inr(l.costHigh ?? 0)}`
                                : ""}
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}

            {totals.priced ? (
              <div className="rounded-xl border border-line bg-paper-alt p-5">
                <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
                  Indicative range
                </div>
                <div className="mt-1 text-2xl tabular-nums text-ink">
                  {inr(totals.low ?? 0)} to {inr(totals.high ?? 0)}
                </div>
              </div>
            ) : (
              // No invented bands. Saying why is more useful than a fake range.
              <div className="rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink print:hidden">
                <b>No prices here on purpose.</b> We have not published cost
                bands we can stand behind, and a made up range would be worse
                than none: you would anchor on it and then be surprised. Ask us
                what these quantities cost in Borivali right now and you will
                get a real answer for your flat.
              </div>
            )}
          </div>
        )}

        {/* Both lists are the actual value of the page, so they print too. */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-line p-5">
            <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
              Ask what is excluded
            </div>
            <ul className="mt-3 space-y-2 text-sm text-ink/75">
              {COMMON_EXCLUSIONS.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-brass">
                    ·
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-line p-5">
            <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
              Ask before you pay an advance
            </div>
            <ul className="mt-3 space-y-2 text-sm text-ink/75">
              {QUOTE_QUESTIONS.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-brass">
                    ·
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
