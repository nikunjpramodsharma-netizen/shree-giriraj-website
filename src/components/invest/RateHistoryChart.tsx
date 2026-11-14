import data from "@/data/invest/rate-history.json";
import { Rich, Rupee, plain } from "./Placeholder";

type Point = { milestone: string; date: string; rate: number | string };
type ReadyPoint = Point & { rate: number };
const points = data.points as Point[];
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * Section 6. The builder's rate per sq ft over time for one illustrated
 * project, as a table plus a small line chart. Data lives in
 * src/data/invest/rate-history.json. Points are spaced evenly by milestone,
 * not by calendar, since the dates are the builder's own. While any rate is a
 * placeholder the chart frame stays empty and says so.
 */
export function RateHistoryChart() {
  const ready = points.length > 1 && points.every((p) => isNum(p.rate));

  return (
    <div>
      {ready ? (
        <Line list={points as ReadyPoint[]} />
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-bronze-deep/60 bg-paper-alt/60 px-6 text-center text-sm text-muted">
          Chart appears once rates are filled in
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <caption className="sr-only">The builder&rsquo;s rate per sq ft at each milestone</caption>
          <thead className="bg-paper-alt text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="p-4 font-semibold">Milestone</th>
              <th scope="col" className="p-4 font-semibold">Date</th>
              <th scope="col" className="p-4 font-semibold">Builder&rsquo;s rate per sq ft</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={i} className="border-t border-line">
                <th scope="row" className="p-4 font-medium text-ink"><Rich text={p.milestone} /></th>
                <td className="p-4 text-ink"><Rich text={p.date} /></td>
                <td className="p-4 text-ink"><Rupee value={p.rate} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Line({ list }: { list: ReadyPoint[] }) {
  const W = 640;
  const H = 240;
  const pad = { l: 56, r: 24, t: 20, b: 44 };
  const lo = Math.min(...list.map((p) => p.rate));
  const hi = Math.max(...list.map((p) => p.rate));
  const span = hi - lo || 1;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (list.length - 1);
  const y = (v: number) => pad.t + (1 - (v - lo) / span) * (H - pad.t - pad.b);
  const path = list.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.rate).toFixed(1)}`).join(" ");
  const label = list.map((p) => `${plain(p.milestone)}, ${plain(p.date)}: ${plain(p.rate)} per sq ft`).join(". ");

  return (
    <figure className="rounded-xl border border-line bg-paper p-4">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`The builder's rate over time. ${label}`} className="h-auto w-full">
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} className="stroke-line" />
        <text x={pad.l - 8} y={y(hi) + 4} textAnchor="end" fontSize="11" className="fill-muted">{hi.toLocaleString("en-IN")}</text>
        <text x={pad.l - 8} y={y(lo) + 4} textAnchor="end" fontSize="11" className="fill-muted">{lo.toLocaleString("en-IN")}</text>
        <path d={path} fill="none" strokeWidth={2.5} className="stroke-bronze" />
        {list.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.rate)} r={4.5} className="fill-brand-indigo" />
            <text x={x(i)} y={H - pad.b + 20} textAnchor="middle" fontSize="11" className="fill-ink">{plain(p.milestone)}</text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
