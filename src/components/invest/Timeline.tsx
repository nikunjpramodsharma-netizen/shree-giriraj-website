import data from "@/data/invest/timeline.json";
import { Rich } from "./Placeholder";

/** A simple horizontal timeline of the builder's own dates. */
export function Timeline() {
  return (
    <ol className="grid gap-6 sm:grid-cols-4">
      {data.stages.map((s, i) => (
        <li key={i} className="relative border-t-2 border-bronze pt-4">
          <span aria-hidden="true" className="absolute -top-[7px] left-0 h-3 w-3 rounded-full bg-brand-indigo" />
          <div className="font-display text-lg text-brand-indigo"><Rich text={s.label} /></div>
          <div className="mt-1 text-sm text-muted"><Rich text={s.date} /></div>
        </li>
      ))}
    </ol>
  );
}
