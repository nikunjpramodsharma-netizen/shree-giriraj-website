import { Fragment, type ReactNode } from "react";

/**
 * A value the owner still has to supply. It stays visible on the page, boxed
 * and labelled, so nobody reads a half finished figure as a real one. It is
 * always rendered as text, never inside a link.
 */
export function Ph({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded border border-dashed border-bronze-deep bg-bronze/15 px-1.5 py-0.5 font-mono text-[0.82em] font-medium text-bronze-deep">
      {children}
    </mark>
  );
}

/** True while a value is still a [[PLACEHOLDER]] rather than real data. */
export function isPlaceholder(v: unknown): boolean {
  return typeof v === "string" && /\[\[[^\]]+\]\]/.test(v);
}

/** Text with any [[TOKEN]] inside it shown as a highlighted placeholder. */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = /\[\[([^\]]+)\]\]/g;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<Ph key={m.index}>{m[1]}</Ph>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return (
    <>
      {out.map((n, i) => (
        <Fragment key={i}>{n}</Fragment>
      ))}
    </>
  );
}

/** A rupee amount: formatted when real, the rupee sign plus a marker when not. */
export function Rupee({ value }: { value: number | string }) {
  if (typeof value === "number") return <>₹{value.toLocaleString("en-IN")}</>;
  return (
    <>
      ₹<Rich text={value} />
    </>
  );
}

/** The plain text of a value, for aria labels. */
export function plain(v: number | string): string {
  return typeof v === "number" ? `₹${v.toLocaleString("en-IN")}` : v.replace(/\[\[|\]\]/g, "");
}
