import { InView } from "@/components/motion/InView";

export type Stop = { name: string; here?: boolean };

/**
 * A route that draws itself from left to right, each stop lighting in turn
 * with its name beneath. Used for a metro line on an area page and for the
 * three steps of a service. Pure SVG and CSS; the only script is the
 * in view trigger.
 */
export function DrawLine({
  stops,
  label,
  tone = "light",
}: {
  stops: Stop[];
  label?: string;
  tone?: "light" | "dark";
}) {
  const n = stops.length;
  const w = 1000;
  const pad = 40;
  const step = n > 1 ? (w - pad * 2) / (n - 1) : 0;
  const dark = tone === "dark";
  return (
    <InView className="drawline" threshold={0.3}>
      {label && (
        <div className={`mb-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] ${dark ? "text-brass-bright" : "text-brass"}`}>
          {label}
        </div>
      )}
      <svg viewBox={`0 0 ${w} 120`} className="w-full overflow-visible" aria-hidden="true">
        <line x1={pad} y1="40" x2={w - pad} y2="40" className={dark ? "stroke-white/15" : "stroke-brand-indigo/15"} strokeWidth="4" />
        <line x1={pad} y1="40" x2={w - pad} y2="40" className="dl-track stroke-brass" strokeWidth="4" strokeLinecap="round" />
        {stops.map((s, i) => {
          const x = pad + step * i;
          return (
            <g key={s.name} className="dl-stop" style={{ ["--i" as string]: i }}>
              <circle cx={x} cy="40" r={s.here ? 11 : 8} className={s.here ? "fill-brass-bright" : dark ? "fill-white" : "fill-paper"} stroke="#b8923f" strokeWidth="4" />
              <text
                x={x}
                y="82"
                textAnchor="middle"
                className={`text-[22px] ${dark ? "fill-paper" : "fill-ink"} ${s.here ? "font-semibold" : ""}`}
                style={{ fontFamily: "inherit" }}
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>
    </InView>
  );
}
