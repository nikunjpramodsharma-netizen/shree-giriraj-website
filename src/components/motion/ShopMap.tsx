import { InView } from "@/components/motion/InView";

/**
 * Where the office is, drawn the way we would draw it for a caller: Link Road
 * running north to south, Shimpoli Road coming in from S.V. Road, the
 * Shimpoli metro at the corner, the station a little way east, and the pin
 * dropping onto the Chikoowadi shopping complex once the block is in view.
 * A schematic, and it says so; the button beneath it opens the real map.
 */
export function ShopMap({ mapsUrl }: { mapsUrl: string }) {
  return (
    <InView className="sm-map mt-8 overflow-hidden rounded-2xl border border-line bg-white" threshold={0.3}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-4">
        <div className="eyebrow">Finding the office</div>
        <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">Schematic, not to scale</div>
      </div>
      <svg viewBox="0 0 640 360" className="block w-full" role="img" aria-label="A schematic showing the office on Link Road in Chikoowadi, near the Shimpoli metro station, west of Borivali station">
        {/* Link Road, vertical */}
        <line x1="180" y1="10" x2="180" y2="350" className="lm-road" pathLength={1} stroke="#c9ced8" strokeWidth="10" strokeLinecap="round" />
        <text x="192" y="30" className="lm-label lm-fade" fill="#7a8290">New Link Road</text>
        {/* S.V. Road */}
        <line x1="440" y1="10" x2="440" y2="350" className="lm-road" pathLength={1} stroke="#c9ced8" strokeWidth="7" strokeLinecap="round" style={{ ["--i" as string]: 1 }} />
        <text x="452" y="30" className="lm-label lm-fade" fill="#7a8290">S.V. Road</text>
        {/* Shimpoli Road, horizontal */}
        <line x1="180" y1="200" x2="440" y2="200" className="lm-road" pathLength={1} stroke="#c9ced8" strokeWidth="6" strokeLinecap="round" style={{ ["--i" as string]: 2 }} />
        <text x="250" y="190" className="lm-label lm-fade" fill="#7a8290">Shimpoli Road</text>
        {/* Chikoowadi lane, up from Shimpoli Road */}
        <line x1="180" y1="120" x2="330" y2="120" className="lm-road" pathLength={1} stroke="#c9ced8" strokeWidth="5" strokeLinecap="round" style={{ ["--i" as string]: 3 }} />
        <text x="205" y="110" className="lm-label lm-fade" fill="#7a8290">Chikoowadi</text>
        {/* Railway */}
        <line x1="600" y1="10" x2="600" y2="350" className="lm-rail" pathLength={1} stroke="#151b3d" strokeWidth="5" />
        <g transform="translate(600 200)">
          <circle r="9" fill="#151b3d" stroke="#fff" strokeWidth="3" />
          <text x="-16" y="4" textAnchor="end" className="lm-label-b" fill="#151b3d">Borivali station</text>
        </g>
        {/* Metro 2A along Link Road */}
        <line x1="150" y1="10" x2="150" y2="350" className="lm-metro" pathLength={1} stroke="#2d6cdf" strokeWidth="3" strokeDasharray="10 8" />
        <g className="lm-stop" transform="translate(150 200)" style={{ ["--i" as string]: 0 }}>
          <circle r="7" fill="#fff" stroke="#2d6cdf" strokeWidth="3" />
          <circle r="7" className="lm-pulse" fill="none" stroke="#2d6cdf" strokeWidth="2" />
          <text x="-14" y="4" textAnchor="end" className="lm-label" fill="#2d6cdf">Shimpoli metro</text>
        </g>
        {/* The pin */}
        <g className="sm-pin" transform="translate(200 120)">
          <g className="sm-pin-in">
          <circle cx="0" cy="0" r="26" fill="rgba(176,141,63,0.18)" className="sm-pin-halo" />
          <path d="M0 -34 C-14 -34 -22 -22 -22 -12 C-22 4 0 12 0 12 C0 12 22 4 22 -12 C22 -22 14 -34 0 -34 Z" fill="#b08d3f" stroke="#fff" strokeWidth="2.5" />
          <circle cx="0" cy="-14" r="7" fill="#fff" />
          <text x="34" y="-8" className="lm-label-b" fill="#151b3d">Shree Giriraj Real Estate</text>
          <text x="34" y="10" className="lm-label" fill="#151b3d">Chikoowadi Shopping Centre, ground floor</text>
          </g>
        </g>
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-5">
        <p className="text-xs text-muted">Also known as Garden Groove Shopping Centre. Off New Link Road, a short walk from the Shimpoli metro.</p>
        <a href={mapsUrl} target="_blank" rel="noopener" className="btn btn-outline border-brand-indigo text-brand-indigo">
          Open in Google Maps
        </a>
      </div>
    </InView>
  );
}
