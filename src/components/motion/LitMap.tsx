import { InView } from "@/components/motion/InView";

/**
 * A schematic of one suburb that lights itself up. Not a map to navigate by
 * (it says so), but the shape a local would draw on a napkin: the railway
 * down the middle, the highway on the east, S.V. Road and Link Road on the
 * west, the two metro lines running beside them, the forest or the creek at
 * the edges. The roads draw first, the pockets pop in one at a time in the
 * order they appear in the text, the metro stations pulse, and the station
 * ring breathes. Pure CSS off the `.in` class, so nothing runs until it is
 * on screen and nothing at all runs under reduced motion.
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

const W = 1000;
const H = 620;
const RAIL_X = 500;
const WEH_X = 770;
const LINK_X = 230;
const SV_X = 380;

export function LitMap({ spec, name, caption }: { spec: AreaMapSpec; name: string; caption?: string }) {
  const roads = spec.roads ?? [
    { label: "Link Road", x: LINK_X },
    { label: "S.V. Road", x: SV_X },
    { label: "Western Express Highway", x: WEH_X },
  ];
  return (
    <InView className="lm mt-10 overflow-hidden rounded-3xl border border-line bg-white" threshold={0.25}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-6 pt-5">
        <div className="eyebrow">{name}, the shape of it</div>
        <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">Schematic, not to scale</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`A schematic of ${name}: the railway, the highway, the two metro lines and the pockets named on this page`}>
        {/* Edges */}
        {spec.edges.west && (
          <g className="lm-edge lm-edge-west">
            <rect x="0" y="0" width="70" height={H} fill={spec.edges.west === "sea" ? "#dbe7f3" : "#e3ecef"} />
            <text x="34" y={H / 2} transform={`rotate(-90 34 ${H / 2})`} textAnchor="middle" className="lm-label" fill="#5b6b7a">
              {spec.edges.west === "sea" ? "Arabian Sea" : "the creek and mangroves"}
            </text>
          </g>
        )}
        {spec.edges.east && (
          <g className="lm-edge lm-edge-east">
            <rect x={W - 110} y="0" width="110" height={H} fill="#e2efe3" />
            <text x={W - 55} y={H / 2} transform={`rotate(90 ${W - 55} ${H / 2})`} textAnchor="middle" className="lm-label" fill="#4f6b52">
              {spec.edges.east === "forest" ? "Sanjay Gandhi National Park" : "the hills"}
            </text>
          </g>
        )}

        {/* Roads */}
        {roads.map((r, i) => (
          <g key={r.label} style={{ ["--i" as string]: i }}>
            <line x1={r.x} y1="20" x2={r.x} y2={H - 20} className="lm-road" pathLength={1} stroke="#c9ced8" strokeWidth={r.x === WEH_X ? 8 : 5} strokeLinecap="round" />
            <text x={r.x + 10} y="38" className="lm-label lm-fade" fill="#7a8290">{r.label}</text>
          </g>
        ))}

        {/* Railway */}
        <line x1={RAIL_X} y1="10" x2={RAIL_X} y2={H - 10} className="lm-rail" pathLength={1} stroke="#151b3d" strokeWidth="6" />
        <line x1={RAIL_X} y1="10" x2={RAIL_X} y2={H - 10} className="lm-rail-ties" pathLength={1} stroke="#f5f0e6" strokeWidth="2" strokeDasharray="6 12" />
        <text x={RAIL_X + 12} y={H - 26} className="lm-label lm-fade" fill="#151b3d">Western Railway</text>
        <g className="lm-station" transform={`translate(${RAIL_X} ${spec.station.y})`}>
          <circle r="26" className="lm-ring" fill="none" stroke="#b08d3f" strokeWidth="2" />
          <circle r="10" fill="#151b3d" stroke="#fff" strokeWidth="3" />
          <text x="0" y="46" textAnchor="middle" className="lm-label-b" fill="#151b3d">{spec.station.label}</text>
        </g>

        {/* Metro lines */}
        {[{ x: LINK_X - 40, m: spec.metroWest, anchor: "end" as const, dx: -14 }, { x: WEH_X + 40, m: spec.metroEast, anchor: "start" as const, dx: 14 }].map(({ x, m, anchor, dx }) => (
          <g key={m.label}>
            <line x1={x} y1="20" x2={x} y2={H - 20} className="lm-metro" pathLength={1} stroke="#2d6cdf" strokeWidth="3" strokeDasharray="10 8" />
            <text x={x + dx} y="60" textAnchor={anchor} className="lm-label lm-fade" fill="#2d6cdf">{m.label}</text>
            {m.stops.map((s, i) => (
              <g key={s.label} style={{ ["--i" as string]: i }} className="lm-stop">
                <circle cx={x} cy={s.y} r="7" fill="#fff" stroke="#2d6cdf" strokeWidth="3" />
                <circle cx={x} cy={s.y} r="7" className="lm-pulse" fill="none" stroke="#2d6cdf" strokeWidth="2" />
                <text x={x + dx} y={s.y + 4} textAnchor={anchor} className="lm-label" fill="#2d6cdf">{s.label}</text>
              </g>
            ))}
          </g>
        ))}

        {/* Pockets */}
        {spec.pockets.map((p, i) => (
          <g key={p.label} className={`lm-pocket ${p.here ? "lm-here" : ""}`} style={{ ["--i" as string]: i }} transform={`translate(${p.x} ${p.y})`}>
            <g className="lm-pocket-in">
            <circle r="22" fill={p.here ? "rgba(176,141,63,0.18)" : "rgba(21,27,61,0.07)"} />
            <circle r={p.here ? 9 : 7} fill={p.here ? "#b08d3f" : "#151b3d"} stroke="#fff" strokeWidth="3" />
            <text x="0" y="40" textAnchor="middle" className={p.here ? "lm-label-b" : "lm-label"} fill={p.muted ? "#7a8290" : "#151b3d"}>
              {p.label}
            </text>
            {p.here && (
              <text x="0" y="-32" textAnchor="middle" className="lm-label-b" fill="#b08d3f">our shop</text>
            )}
            </g>
          </g>
        ))}
      </svg>
      {caption && <p className="px-6 pb-5 text-xs text-muted">{caption}</p>}
    </InView>
  );
}
