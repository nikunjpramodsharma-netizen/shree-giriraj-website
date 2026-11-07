/**
 * MHADA Mumbai Board transfer charges, for the widget inside
 * /blog/mhada-flat-transfer.
 *
 * The figures are the guide's own (content/drafts/mhada-flat-transfer.md),
 * which takes them from the Mumbai Board's published document list for
 * transfer of tenancy rights, read on mhada.gov.in on 19 October 2026:
 * 45 rupees a sq ft for LIG (maximum 15,000), 55 for MIG (maximum 25,000)
 * and 60 for HIG (maximum 35,000).
 *
 * The schedule does not say whether the area is carpet or built up, and it
 * gives no rate for EWS flats, so the widget says "sq ft" only and offers no
 * EWS option. Nothing is added that the guide does not state.
 */

export type MhadaGroup = "LIG" | "MIG" | "HIG";

export const MHADA_TRANSFER_RATES: Record<
  MhadaGroup,
  { label: string; ratePerSqft: number; cap: number }
> = {
  LIG: { label: "Low Income Group (LIG)", ratePerSqft: 45, cap: 15_000 },
  MIG: { label: "Middle Income Group (MIG)", ratePerSqft: 55, cap: 25_000 },
  HIG: { label: "High Income Group (HIG)", ratePerSqft: 60, cap: 35_000 },
};

export const MHADA_GROUPS: MhadaGroup[] = ["LIG", "MIG", "HIG"];

export type MhadaTransferResult = {
  group: MhadaGroup;
  areaSqft: number;
  ratePerSqft: number;
  /** Area times rate, before the cap. */
  uncapped: number;
  cap: number;
  /** The transfer charge: the lower of the uncapped figure and the cap. */
  charge: number;
  capApplied: boolean;
};

export function mhadaTransferFee(group: MhadaGroup, areaSqft: number): MhadaTransferResult {
  const { ratePerSqft, cap } = MHADA_TRANSFER_RATES[group];
  const area = Math.max(0, Number(areaSqft) || 0);
  const uncapped = Math.round(area * ratePerSqft);
  const charge = Math.min(uncapped, cap);
  return {
    group,
    areaSqft: area,
    ratePerSqft,
    uncapped,
    cap,
    charge,
    capApplied: uncapped > cap,
  };
}
