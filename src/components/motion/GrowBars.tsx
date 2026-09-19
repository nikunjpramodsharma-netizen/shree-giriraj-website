import { CountUp } from "@/components/motion/CountUp";
import { InView } from "@/components/motion/InView";

export type Bar = {
  label: string;
  /** Drives the bar length and the counting figure. */
  value: number;
  /** Shown after the figure, e.g. " per sq ft" or a range note. */
  note?: string;
  prefix?: string;
  suffix?: string;
};

/**
 * Horizontal bars that slide out to their length as they enter view, longest
 * first in the order given, each figure counting to its value at the end.
 * The ranking is seen before it is read, which is the whole point of showing
 * asking rates this way rather than as a paragraph.
 */
export function GrowBars({
  bars,
  max,
  tone = "light",
  footnote,
}: {
  bars: Bar[];
  max?: number;
  tone?: "light" | "dark";
  footnote?: string;
}) {
  const top = max ?? Math.max(...bars.map((b) => b.value));
  const dark = tone === "dark";
  return (
    <InView className="bars grid gap-3.5" threshold={0.3}>
      {bars.map((b, i) => (
        <div key={b.label} style={{ ["--i" as string]: i }} className="bar-row">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className={`font-semibold ${dark ? "text-white" : "text-ink"}`}>{b.label}</span>
            <span className={`tabular-nums ${dark ? "text-paper/80" : "text-ink/80"}`}>
              <CountUp value={b.value} prefix={b.prefix ?? "₹"} suffix={b.suffix ?? ""} />
              {b.note && <span className={`ml-1 text-xs ${dark ? "text-paper/55" : "text-muted"}`}>{b.note}</span>}
            </span>
          </div>
          <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-brand-indigo/10"}`}>
            <div
              className="bar-fill h-full rounded-full bg-gradient-to-r from-bronze to-bronze"
              style={{ ["--w" as string]: `${Math.max(4, (b.value / top) * 100)}%` }}
            />
          </div>
        </div>
      ))}
      {footnote && <p className={`text-xs ${dark ? "text-paper/55" : "text-muted"}`}>{footnote}</p>}
    </InView>
  );
}
