"use client";

import { useMemo, useState } from "react";
import { ToolResultCTA } from "@/components/ToolResultCTA";
import { MHADA_GROUPS, MHADA_TRANSFER_RATES, mhadaTransferFee, type MhadaGroup } from "@/lib/mhada-transfer-fee";
import { inr } from "@/lib/emi";

/**
 * The transfer charge for one flat, inside /blog/mhada-flat-transfer.
 *
 * Uses only the guide's own figures (lib/mhada-transfer-fee.ts). The area is
 * "sq ft" because the Board's schedule does not say carpet or built up, and
 * there is no EWS option because the schedule gives no EWS rate.
 */
export function MhadaTransferFeeWidget({ slug }: { slug: string }) {
  const [group, setGroup] = useState<MhadaGroup>("LIG");
  const [area, setArea] = useState(300);

  const r = useMemo(() => mhadaTransferFee(group, area), [group, area]);

  const message = `Hi Shree Giriraj, I need help with a MHADA transfer. Flat: ${r.areaSqft} sq ft, group: ${group}. The calculator shows ${inr(r.charge)}.`;

  return (
    <section
      aria-labelledby="mhada-fee-widget"
      className="mb-9 max-w-[68ch] rounded-2xl border border-line bg-paper"
    >
      <div className="border-b border-line px-6 py-4">
        <h2 id="mhada-fee-widget" className="text-lg text-ink">
          Work out the transfer charge for your flat
        </h2>
        <p className="mt-1 text-xs text-muted">
          Mumbai Board rates by income group, with the maximum applied.
        </p>
      </div>

      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Income group</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {MHADA_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                aria-pressed={group === g}
                className={
                  group === g
                    ? "rounded-full bg-brand-indigo px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-line px-4 py-2 text-sm text-ink/70 hover:bg-paper-alt"
                }
              >
                {g}
              </button>
            ))}
          </div>
          <span className="mt-2 block text-xs text-muted">
            {MHADA_TRANSFER_RATES[group].label}: {MHADA_TRANSFER_RATES[group].ratePerSqft} rupees a sq ft,
            maximum {inr(MHADA_TRANSFER_RATES[group].cap)}.
          </span>
        </fieldset>

        <label className="block">
          <span className="text-sm font-semibold text-ink">Flat area, sq ft</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={10}
            value={area || ""}
            placeholder="0"
            onChange={(e) => setArea(Math.max(0, Math.round(Number(e.target.value) || 0)))}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper-alt px-4 py-2.5 text-sm text-ink outline-none focus:border-bronze"
          />
          <span className="mt-1.5 block text-xs text-muted">
            We confirm with the Estate Manager whether carpet or built up area applies.
          </span>
        </label>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-bronze-deep">
            Transfer charge
          </div>
          <div className="mt-2 text-3xl tabular-nums text-ink">{inr(r.charge)}</div>
          <p className="mt-2 text-sm text-ink/60">
            {r.capApplied
              ? `${r.areaSqft} × ${r.ratePerSqft} = ${inr(r.uncapped)}, so the maximum of ${inr(r.cap)} applies.`
              : `${r.areaSqft} × ${r.ratePerSqft} rupees a sq ft.`}
          </p>
          <p className="mt-2 text-xs text-muted">
            Not included: any deposit asked with the charge, the society&apos;s own transfer fee, and for a
            sale any share of the unearned increase.
          </p>
        </div>

        <ToolResultCTA
          slug={slug}
          offer="Send us these figures and we will reply with the full cost and the papers your case needs. Free, no obligation."
          message={message}
          inputsKey={`${group}|${area}`}
          show={r.areaSqft > 0}
          buttonLabel="Get your transfer cost sheet and document checklist on WhatsApp"
        />
      </div>
    </section>
  );
}
