import { Link } from "@/i18n/navigation";
import { parseInline, type Block, type Inline, type MarkerKind } from "@/lib/markdown";

/**
 * Renders parsed markdown in the site's own type scale.
 *
 * The interesting part is the marker block. A "[ VERIFY ]" or "[ YOUR WORDS ]"
 * left in a draft is not body copy and must never look like it, so it renders
 * as a clearly separate review note. That makes an unfinished post honest to
 * read rather than embarrassing, and it means drafts can go on the deployment
 * for review instead of sitting in a folder nobody opens.
 */

const MARKER_STYLE: Record<MarkerKind, { label: string; cls: string }> = {
  VERIFY: {
    label: "Needs checking",
    cls: "border-brass/40 bg-brass/10",
  },
  "YOUR WORDS": {
    label: "Needs your words",
    cls: "border-brand-indigo/30 bg-brand-indigo/5",
  },
  DECISION: {
    label: "Needs a decision",
    cls: "border-brand-red/30 bg-brand-red/5",
  },
};

export function MarkdownBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-[68ch]">
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </div>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "h2":
      return (
        <h2
          id={b.id}
          className="mt-12 scroll-mt-24 text-2xl text-ink md:text-3xl"
        >
          {b.text}
        </h2>
      );
    case "h3":
      return (
        <h3 id={b.id} className="mt-8 scroll-mt-24 text-xl text-ink">
          {b.text}
        </h3>
      );
    case "p":
      return (
        <p className="mt-4 text-ink/85">
          <Spans spans={b.spans} />
        </p>
      );
    case "ul":
      return (
        <ul className="mt-4 space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-ink/85">
              <span aria-hidden="true" className="text-brass">
                ·
              </span>
              <span>
                <Spans spans={it} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-ink/85">
              <span
                aria-hidden="true"
                className="mt-0.5 text-sm font-bold tabular-nums text-brass"
              >
                {i + 1}
              </span>
              <span>
                <Spans spans={it} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="mt-6 border-l-[3px] border-brass bg-paper-alt px-5 py-4 text-ink/85">
          <Spans spans={b.spans} />
        </blockquote>
      );
    case "table":
      return (
        // Wide tables scroll inside their own box rather than pushing the page.
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-paper-alt text-left">
              <tr>
                {b.head.map((h, i) => (
                  <th key={i} className="p-3 font-semibold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  {r.map((c, j) => (
                    <td key={j} className="p-3 align-top text-ink/80">
                      <Spans spans={inlineOf(c)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "hr":
      return <hr className="mt-10 border-line" />;
    case "marker": {
      const s = MARKER_STYLE[b.kind];
      return (
        <div className={`mt-6 rounded-xl border border-dashed ${s.cls} p-5`}>
          <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
            {s.label}
          </div>
          <p className="mt-2 text-sm text-ink/70">{b.text || "See the draft."}</p>
        </div>
      );
    }
  }
}

function Spans({ spans }: { spans: Inline[] }) {
  return (
    <>
      {spans.map((s, i) => {
        if (s.t === "marker") {
          // Inline marker, from a table cell or list item. A chip, so it can
          // never be mistaken for content.
          return (
            <span
              key={i}
              title={s.v}
              className="inline-block rounded-full border border-dashed border-brass/60 bg-brass/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-brass"
            >
              {MARKER_STYLE[s.kind].label}
            </span>
          );
        }
        if (s.t === "bold") return <b key={i} className="font-semibold text-ink">{s.v}</b>;
        if (s.t === "em") return <em key={i}>{s.v}</em>;
        if (s.t === "link") {
          const internal = s.href.startsWith("/");
          return internal ? (
            <Link
              key={i}
              href={s.href}
              className="text-brand-indigo underline underline-offset-4"
            >
              {s.v}
            </Link>
          ) : (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-indigo underline underline-offset-4"
            >
              {s.v}
            </a>
          );
        }
        return <span key={i}>{s.v}</span>;
      })}
    </>
  );
}

/** Table cells carry inline markup and markers too, so they use the same parser. */
function inlineOf(cell: string): Inline[] {
  return parseInline(cell);
}
