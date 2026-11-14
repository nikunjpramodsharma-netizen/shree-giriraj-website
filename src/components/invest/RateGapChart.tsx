import data from "@/data/invest/rate-gap.json";
import { Rich, Rupee, plain } from "./Placeholder";

type Row = {
  name: string;
  location: string;
  publicRate: number | string;
  ourRate: number | string;
  gap: number | string;
};
type ReadyRow = Row & { publicRate: number; ourRate: number };

const rows = data.projects as Row[];
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * Section 3. Public sheet rate against our booking rate, one pair of bars per
 * live project. Data lives in src/data/invest/rate-gap.json and is updated
 * monthly. The table is always shown and carries every number; the chart is a
 * picture of the same figures. While any rate is still a placeholder the chart
 * frame stays empty and says so.
 */
export function RateGapChart() {
  const ready = rows.length > 0 && rows.every((r) => isNum(r.publicRate) && isNum(r.ourRate));

  return (
    <div>
      {ready ? (
        <Bars list={rows as ReadyRow[]} />
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-bronze-deep/60 bg-paper-alt/60 px-6 text-center text-sm text-muted">
          Chart appears once rates are filled in
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">Public sheet rate and our booking rate per sq ft, by project</caption>
          <thead className="bg-paper-alt text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="p-4 font-semibold">Project</th>
              <th scope="col" className="p-4 font-semibold">Public sheet rate</th>
              <th scope="col" className="p-4 font-semibold">Our booking rate</th>
              <th scope="col" className="p-4 font-semibold">Gap per sq ft</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-line">
                <th scope="row" className="p-4 font-medium text-ink">
                  <Rich text={r.name} />, <Rich text={r.location} />
                </th>
                <td className="p-4 text-ink"><Rupee value={r.publicRate} /></td>
                <td className="p-4 text-ink"><Rupee value={r.ourRate} /></td>
                <td className="p-4 text-ink"><Rupee value={r.gap} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-[70ch] text-sm text-muted">
        Rates per sq ft carpet, all inclusive except stamp duty and registration. Updated{" "}
        <Rich text={data.updated} />. Exact unit pricing shared on WhatsApp against the builder&rsquo;s sheet.
      </p>
    </div>
  );
}

function Bars({ list }: { list: ReadyRow[] }) {
  const max = Math.max(...list.flatMap((r) => [r.publicRate, r.ourRate]));
  const W = 640;
  const left = 150;
  const barMax = W - left - 120;
  const groupH = 70;
  const H = list.length * groupH + 20;
  const label = list
    .map((r) => `${plain(r.name)}: public sheet ${plain(r.publicRate)}, our booking rate ${plain(r.ourRate)} per sq ft`)
    .join(". ");

  return (
    <figure className="rounded-xl border border-line bg-paper p-4">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Public rate against our rate. ${label}`} className="h-auto w-full">
        {list.map((r, i) => {
          const y = 10 + i * groupH;
          const pw = (r.publicRate / max) * barMax;
          const ow = (r.ourRate / max) * barMax;
          return (
            <g key={i} fontSize="12">
              <text x={0} y={y + 30} className="fill-ink">{plain(r.name).slice(0, 22)}</text>
              <rect x={left} y={y} width={pw} height={22} rx={3} className="fill-brand-indigo/35" />
              <text x={left + pw + 6} y={y + 15} className="fill-muted">Public {plain(r.publicRate)}</text>
              <rect x={left} y={y + 28} width={ow} height={22} rx={3} className="fill-bronze" />
              <text x={left + ow + 6} y={y + 43} className="fill-ink">Ours {plain(r.ourRate)}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
