import { InView } from "@/components/motion/InView";

/**
 * The suburb as a transit diagram, wide enough to sit inside one screen.
 *
 * It reads left to right from north to south, the way a line diagram in a
 * metro coach does: the coast or creek along the top, then Metro Line 2A,
 * Link Road, S.V. Road, the Western Railway, the highway and Metro Line 7,
 * and the national park or hills along the bottom. The pockets sit between
 * the lines they actually lie between, each with its asking rate where the
 * page has one. On a dark panel the lines glow in their real colours (2A is
 * the yellow line, 7 the red), stations light in turn, and a train runs each
 * line. All of it is CSS off the `.in` class, so nothing moves until it is
 * on screen, and nothing moves at all under reduced motion.
 *
 * The data is unchanged from the first, upright version: `x` is still west
 * to east and `y` north to south on a 1000 by 620 grid. This component turns
 * that a quarter turn when it draws.
 */

export type MapPocket = { label: string; x: number; y: number; here?: boolean; muted?: boolean };
export type MapStop = { label: string; y: number };
export type AreaMapSpec = {
  station: { label: string; y: number };
  pockets: MapPocket[];
  metroWest: { label: string; stops: MapStop[] };
  metroEast: { label: string; stops: MapStop[] };
  edges: { west?: "creek" | "sea"; east?: "forest" | "hills" };
  roads?: { label: string; x: number }[];
};

const W = 1200;
const H = 560;
const LEFT = 150;
const RIGHT = W - 40;

// Rows, top to bottom.
const ROW = { metroW: 112, link: 188, sv: 252, rail: 312, weh: 388, metroE: 430 };
// West to east on the data grid becomes top to bottom here.
// Anything west of Link Road sits in the one band between the metro and the road.
const BANDS: [number, number][] = [
  [0, 148],
  [229, 148],
  [230, ROW.link],
  [380, ROW.sv],
  [500, ROW.rail],
  [770, ROW.weh],
  [810, ROW.metroE],
  [1000, 486],
];
function rowOf(x: number): number {
  for (let i = 1; i < BANDS.length; i++) {
    const [x0, y0] = BANDS[i - 1];
    const [x1, y1] = BANDS[i];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return BANDS[BANDS.length - 1][1];
}
// North to south on the data grid becomes left to right here.
const along = (y: number) => LEFT + 40 + (y / 620) * (RIGHT - LEFT - 80);

const YELLOW = "#f6c445";
const RED = "#f0625f";
const GOLD = "#d9b96a";

export function LitMap({
  spec,
  name,
  caption,
  rates = [],
}: {
  spec: AreaMapSpec;
  name: string;
  caption?: string;
  /** Asking rates by pocket, matched to the pins by name. */
  rates?: { label: string; value: number }[];
}) {
  const rateFor = (pocket: string) => {
    const p = pocket.toLowerCase();
    const hit = rates.find((r) => {
      const l = r.label.toLowerCase();
      return l.startsWith(p) || p.startsWith(l.split(",")[0]);
    });
    return hit ? `₹${Math.round(hit.value / 1000)}k` : null;
  };

  const lines = [
    { y: ROW.link, label: "Link Road", cls: "lm-road", w: 5 },
    { y: ROW.sv, label: "S.V. Road", cls: "lm-road", w: 5 },
    { y: ROW.weh, label: "Western Express Highway", cls: "lm-road", w: 8 },
  ];

  return (
    <InView className="lm mt-10 overflow-hidden rounded-3xl bg-brand-indigo-deep text-paper shadow-2xl shadow-brand-indigo/30" threshold={0.25}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-6 pt-6 md:px-8">
        <div>
          <div className="eyebrow text-bronze">{name} on one line</div>
          <p className="mt-1.5 max-w-[60ch] text-sm text-paper/70">
            North on the left, the city on the right. Two metro lines, the railway between them, and where each pocket sits.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-paper/70">
          <li className="flex items-center gap-2"><span className="h-1 w-6 rounded-full" style={{ background: YELLOW }} />Metro 2A</li>
          <li className="flex items-center gap-2"><span className="h-1 w-6 rounded-full" style={{ background: RED }} />Metro 7</li>
          <li className="flex items-center gap-2"><span className="h-1 w-6 rounded-full bg-white" />Western Railway</li>
          <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: GOLD }} />Pocket, asking rate per sq ft</li>
        </ul>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-2 block w-full min-w-[820px]"
          role="img"
          aria-label={`A transit diagram of ${name}: Metro Line 2A, the Western Railway and Metro Line 7 running north to south, with the pockets named on this page between them`}
        >
          <defs>
            <radialGradient id="lm-glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#2a3570" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#151b3d" stopOpacity="0" />
            </radialGradient>
            <filter id="lm-soft" x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <pattern id="lm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="#ffffff" strokeOpacity="0.035" />
            </pattern>
          </defs>

          <rect width={W} height={H} fill="url(#lm-grid)" />
          <ellipse cx={W / 2} cy={ROW.rail} rx="620" ry="280" fill="url(#lm-glow)" />

          {/* Edges: the coast along the top, the park or hills along the bottom */}
          {spec.edges.west && (
            <g className="lm-fade">
              <rect x="0" y="0" width={W} height="64" fill={spec.edges.west === "sea" ? "#16386a" : "#17404a"} opacity="0.55" />
              <path d={`M0 64 Q ${W / 4} 52 ${W / 2} 64 T ${W} 64`} fill="none" stroke="#7fb4e6" strokeOpacity="0.5" className="lm-wave" />
              <text x={LEFT} y="40" className="lm-t-edge" fill="#a9cdf0">
                {spec.edges.west === "sea" ? "ARABIAN SEA AND THE BEACHES" : "THE CREEK AND ITS MANGROVES"}
              </text>
            </g>
          )}
          {spec.edges.east && (
            <g className="lm-fade">
              <rect x="0" y={H - 62} width={W} height="62" fill="#1d4a33" opacity="0.6" />
              <text x={LEFT} y={H - 26} className="lm-t-edge" fill="#a8dbb9">
                {spec.edges.east === "forest" ? "SANJAY GANDHI NATIONAL PARK" : "THE HILLS AND AAREY"}
              </text>
            </g>
          )}

          {/* Direction */}
          <text x="24" y="40" className="lm-t-dir lm-fade" fill="#ffffff" fillOpacity="0.7">◂ NORTH</text>
          <text x={RIGHT} y="40" textAnchor="end" className="lm-t-dir lm-fade" fill="#ffffff" fillOpacity="0.7">SOUTH, TO ANDHERI AND THE CITY ▸</text>

          {/* Roads */}
          {lines.map((l, i) => (
            <g key={l.label} style={{ ["--i" as string]: i }}>
              <line x1={LEFT} y1={l.y} x2={RIGHT} y2={l.y} className="lm-road" pathLength={1} stroke="#ffffff" strokeOpacity="0.16" strokeWidth={l.w} strokeLinecap="round" />
              <text x={LEFT - 14} y={l.y + 4} textAnchor="end" className="lm-t-road lm-fade" fill="#ffffff" fillOpacity="0.5">{l.label}</text>
            </g>
          ))}

          {/* Western Railway */}
          <line x1={LEFT} y1={ROW.rail} x2={RIGHT} y2={ROW.rail} stroke="#ffffff" strokeWidth="10" strokeOpacity="0.25" filter="url(#lm-soft)" className="lm-fade" />
          <line x1={LEFT} y1={ROW.rail} x2={RIGHT} y2={ROW.rail} className="lm-rail" pathLength={1} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <line x1={LEFT} y1={ROW.rail} x2={RIGHT} y2={ROW.rail} className="lm-rail" pathLength={1} stroke="#151b3d" strokeWidth="1.5" strokeDasharray="0.004 0.008" />
          <text x={LEFT - 14} y={ROW.rail + 4} textAnchor="end" className="lm-t-line lm-fade" fill="#ffffff">Western Railway</text>
          <rect x="0" y="-5" width="34" height="10" rx="5" fill="#ffffff" className="lm-train lm-train-rail" style={{ ["--y" as string]: `${ROW.rail}px` }} />

          {/* Metro lines */}
          {[
            { y: ROW.metroW, m: spec.metroWest, colour: YELLOW, up: true, train: "lm-train-w" },
            { y: ROW.metroE, m: spec.metroEast, colour: RED, up: false, train: "lm-train-e" },
          ].map(({ y, m, colour, up, train }) => (
            <g key={m.label}>
              <line x1={LEFT} y1={y} x2={RIGHT} y2={y} stroke={colour} strokeWidth="10" strokeOpacity="0.35" filter="url(#lm-soft)" className="lm-fade" />
              <line x1={LEFT} y1={y} x2={RIGHT} y2={y} className="lm-metro" pathLength={1} stroke={colour} strokeWidth="4" strokeLinecap="round" />
              <text x={LEFT - 14} y={y + 4} textAnchor="end" className="lm-t-line lm-fade" fill={colour}>{m.label}</text>
              {m.stops.map((s, i) => (
                <g key={s.label} className="lm-stop" style={{ ["--i" as string]: i }} transform={`translate(${along(s.y)} ${y})`}>
                  <circle r="7" className="lm-pulse" fill="none" stroke={colour} strokeWidth="2" />
                  <circle r="6.5" fill="#151b3d" stroke={colour} strokeWidth="3" />
                  <text x="0" y={up ? -16 : 26} textAnchor="middle" className="lm-t-stop" fill={colour}>{s.label}</text>
                </g>
              ))}
              <rect x="0" y="-4.5" width="28" height="9" rx="4.5" fill={colour} className={`lm-train ${train}`} style={{ ["--y" as string]: `${y}px` }} />
            </g>
          ))}

          {/* The railway station */}
          <g className="lm-station" transform={`translate(${along(spec.station.y)} ${ROW.rail})`}>
            <circle r="22" className="lm-ring" fill="none" stroke={GOLD} strokeWidth="2" />
            <circle r="11" fill="#ffffff" stroke="#151b3d" strokeWidth="4" />
            <rect x="-74" y="-52" width="148" height="24" rx="12" fill="#ffffff" />
            <text x="0" y="-35" textAnchor="middle" className="lm-t-station" fill="#151b3d">{spec.station.label}</text>
          </g>

          {/* Pockets */}
          {spec.pockets.map((p, i) => {
            const rate = rateFor(p.label);
            const text = rate ? `${p.label} · ${rate}` : p.label;
            const w = Math.max(64, text.length * 6.9 + 20);
            return (
              <g key={p.label} className={`lm-pocket ${p.here ? "lm-here" : ""}`} style={{ ["--i" as string]: i }} transform={`translate(${along(p.y)} ${rowOf(p.x)})`}>
                <g className="lm-pocket-in">
                  <circle r="15" fill={GOLD} fillOpacity={p.here ? 0.35 : 0.16} className="lm-halo" />
                  <circle r={p.here ? 6.5 : 5} fill={p.muted ? "#c9ced8" : GOLD} stroke="#151b3d" strokeWidth="2" />
                  <rect x={-w / 2} y="11" width={w} height="21" rx="10.5" fill={p.here ? GOLD : "#ffffff"} fillOpacity={p.here ? 1 : p.muted ? 0.1 : 0.14} stroke={p.here ? "none" : "#ffffff"} strokeOpacity="0.18" />
                  <text x="0" y="25.5" textAnchor="middle" className="lm-t-pocket" fill={p.here ? "#151b3d" : "#ffffff"} fillOpacity={p.muted && !p.here ? 0.7 : 1}>
                    {text}
                  </text>
                  {p.here && (
                    <text x="0" y="-22" textAnchor="middle" className="lm-t-here" fill={GOLD}>OUR OFFICE</text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-6 pb-5 pt-1 text-xs text-paper/55 md:px-8">
        <span>{caption ?? "A diagram, not a map to scale. Pockets sit between the lines they lie between."}</span>
        <span className="md:hidden">Swipe to see the whole line ▸</span>
      </div>
    </InView>
  );
}
