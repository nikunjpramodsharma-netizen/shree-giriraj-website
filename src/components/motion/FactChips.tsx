import { CountUp } from "@/components/motion/CountUp";
import { InView } from "@/components/motion/InView";

export type Fact = {
  /** The number that counts up. Omit for a word chip such as "Same day". */
  value?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Shown instead of a number when there is no value. */
  text?: string;
  label: string;
};

/**
 * Three or four brass chips under a hero heading, each carrying one real
 * figure that counts to its value as the hero settles. The chips rise in
 * sequence (CSS, .cascade), a beat after the heading.
 */
export function FactChips({ facts, tone = "dark" }: { facts: Fact[]; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <InView as="ul" className="cascade mt-8 flex flex-wrap gap-2.5" threshold={0.2}>
      {facts.map((f, i) => (
        <li
          key={f.label}
          style={{ ["--i" as string]: i }}
          className={`rounded-full border px-4 py-2 ${
            dark ? "border-brass/40 bg-white/5 text-white" : "border-line bg-white text-ink"
          }`}
        >
          <span className="font-display text-lg font-semibold text-brass-bright">
            {f.value !== undefined ? (
              <CountUp value={f.value} prefix={f.prefix} suffix={f.suffix} decimals={f.decimals} />
            ) : (
              f.text
            )}
          </span>
          <span className={`ml-2 text-sm ${dark ? "text-paper/80" : "text-muted"}`}>{f.label}</span>
        </li>
      ))}
    </InView>
  );
}
