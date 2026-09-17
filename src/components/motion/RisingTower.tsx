import { InView } from "@/components/motion/InView";

/**
 * A four storey society on the left and, beside it, the tower it becomes:
 * floors drawn one above the other once the block is in view, then the
 * crane line and the roof. It says in one picture what a redevelopment
 * section says in five paragraphs, and it costs one small SVG.
 */
export function RisingTower({ caption }: { caption?: string }) {
  const floors = 13;
  return (
    <InView className="rt mt-10 rounded-3xl border border-line bg-white p-6" threshold={0.3}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="eyebrow">What redevelopment looks like</div>
        <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">Illustration</div>
      </div>
      <svg viewBox="0 0 800 420" className="mt-4 block w-full" role="img" aria-label="A four storey building beside the tower that replaces it">
        {/* ground */}
        <line x1="20" y1="392" x2="780" y2="392" stroke="#c9ced8" strokeWidth="3" />
        {/* the old society */}
        <g className="rt-old">
          <rect x="70" y="232" width="220" height="160" fill="#f3efe6" stroke="#151b3d" strokeWidth="3" />
          {[0, 1, 2, 3].map((f) => (
            <g key={f}>
              <line x1="70" y1={272 + f * 40} x2="290" y2={272 + f * 40} stroke="#151b3d" strokeWidth="1.5" opacity="0.35" />
              {[0, 1, 2, 3].map((w) => (
                <rect key={w} x={92 + w * 50} y={244 + f * 40} width="24" height="18" fill="#151b3d" opacity="0.55" />
              ))}
            </g>
          ))}
          <text x="180" y="412" textAnchor="middle" className="lm-label" fill="#151b3d">the society today, four floors, 1970s</text>
        </g>
        {/* the arrow */}
        <g className="rt-arrow">
          <line x1="320" y1="300" x2="400" y2="300" stroke="#b08d3f" strokeWidth="3" pathLength={1} className="rt-arrow-line" />
          <path d="M392 290 L404 300 L392 310" fill="none" stroke="#b08d3f" strokeWidth="3" />
        </g>
        {/* the tower */}
        <g className="rt-new">
          {Array.from({ length: floors }).map((_, f) => {
            const y = 392 - (f + 1) * 22;
            return (
              <g key={f} className="rt-floor" style={{ ["--i" as string]: f }}>
                <rect x="470" y={y} width="180" height="22" fill={f % 2 ? "#151b3d" : "#1d2650"} stroke="#fff" strokeWidth="1" />
                {[0, 1, 2, 3, 4].map((w) => (
                  <rect key={w} x={482 + w * 34} y={y + 6} width="18" height="10" fill="#b08d3f" opacity="0.85" />
                ))}
              </g>
            );
          })}
          <g className="rt-roof" style={{ ["--i" as string]: floors }}>
            <rect x="490" y={392 - floors * 22 - 14} width="140" height="14" fill="#b08d3f" />
            <line x1="560" y1={392 - floors * 22 - 14} x2="560" y2={392 - floors * 22 - 60} stroke="#151b3d" strokeWidth="3" />
            <line x1="560" y1={392 - floors * 22 - 60} x2="700" y2={392 - floors * 22 - 60} stroke="#151b3d" strokeWidth="3" />
            <line x1="690" y1={392 - floors * 22 - 60} x2="690" y2={392 - floors * 22 - 20} stroke="#151b3d" strokeWidth="2" strokeDasharray="4 4" />
          </g>
          <text x="560" y="412" textAnchor="middle" className="lm-label" fill="#151b3d">the same plot after redevelopment, with the extra FSI</text>
        </g>
      </svg>
      {caption && <p className="mt-3 text-xs text-muted">{caption}</p>}
    </InView>
  );
}
