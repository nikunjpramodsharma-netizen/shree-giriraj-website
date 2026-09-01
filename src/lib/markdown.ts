/**
 * A small markdown parser, scoped to exactly what the drafts use.
 *
 * WHY NOT A LIBRARY
 *
 * The drafts use a narrow, known subset: two heading levels, bold, italic,
 * bullets, numbered lists, tables, blockquotes and rules. Nothing else. A
 * general parser would be a dependency and a bundle for features nobody uses.
 *
 * More importantly, this has to do one thing no library does: recognise the
 * review markers written into the drafts, "[ VERIFY ... ]", "[ YOUR WORDS ... ]"
 * and "[ DECISION ... ]", and lift them out as structured blocks so the page
 * can render them as visible review notes rather than as body copy. That is the
 * whole point of being able to publish from markdown at all: an unfinished post
 * renders honestly instead of leaking a bracket into a paragraph.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "bold"; v: string }
  | { t: "em"; v: string }
  | { t: "link"; v: string; href: string }
  /**
   * A review marker sitting INSIDE a table cell or a list item, where it
   * cannot become its own block. Table cells were leaking raw brackets onto
   * the page until this existed.
   */
  | { t: "marker"; v: string; kind: MarkerKind };

export type MarkerKind = "VERIFY" | "YOUR WORDS" | "DECISION";

export type Block =
  | { t: "h2"; text: string; id: string }
  | { t: "h3"; text: string; id: string }
  | { t: "p"; spans: Inline[] }
  | { t: "ul"; items: Inline[][] }
  | { t: "ol"; items: Inline[][] }
  | { t: "quote"; spans: Inline[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "hr" }
  | { t: "marker"; kind: MarkerKind; text: string };

/* --------------------------------------------------------- frontmatter */

export type Frontmatter = Record<string, unknown>;

/**
 * Minimal YAML, covering only the shapes the drafts use: scalars, quoted
 * scalars, folded blocks introduced by ">", plain lists, and lists of objects
 * with label and url keys.
 */
export function parseFrontmatter(src: string): {
  data: Frontmatter;
  body: string;
} {
  const norm = src.replace(/\r\n/g, "\n");
  if (!norm.startsWith("---\n")) return { data: {}, body: norm };
  const end = norm.indexOf("\n---", 4);
  if (end === -1) return { data: {}, body: norm };

  const head = norm.slice(4, end);
  const body = norm.slice(end + 4).replace(/^\n+/, "");
  const data: Frontmatter = {};

  const lines = head.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = /^([A-Za-z][\w]*):\s*(.*)$/.exec(line);
    if (!m) {
      i += 1;
      continue;
    }
    const key = m[1];
    const rest = m[2].trim();

    // Folded block: key: >
    if (rest === ">" || rest === "|") {
      const parts: string[] = [];
      i += 1;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        parts.push(lines[i].trim());
        i += 1;
      }
      data[key] = parts.join(" ");
      continue;
    }

    // Inline empty value means a list or object list follows.
    if (rest === "" || rest === "[]") {
      const items: unknown[] = [];
      i += 1;
      let current: Record<string, string> | null = null;
      while (i < lines.length && /^\s/.test(lines[i]) && lines[i].trim()) {
        const l = lines[i].trim();
        const item = /^-\s*(.*)$/.exec(l);
        if (item) {
          const val = item[1];
          const kv = /^([A-Za-z][\w]*):\s*(.*)$/.exec(val);
          if (kv) {
            current = { [kv[1]]: unquote(kv[2]) };
            items.push(current);
          } else {
            current = null;
            items.push(unquote(val));
          }
        } else if (current) {
          const kv = /^([A-Za-z][\w]*):\s*(.*)$/.exec(l);
          if (kv) current[kv[1]] = unquote(kv[2]);
        }
        i += 1;
      }
      data[key] = items;
      continue;
    }

    const v = unquote(rest);
    data[key] = /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v;
    i += 1;
  }

  return { data, body };
}

function unquote(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

/* -------------------------------------------------------------- blocks */



export function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const out: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (/^---+$/.test(line)) {
      out.push({ t: "hr" });
      i += 1;
      continue;
    }

    const h = /^(#{2,4})\s+(.*)$/.exec(line);
    if (h) {
      // A marker used as a heading, "## [ YOUR WORDS ] What we check", keeps
      // its heading role: the tail is the real heading text.
      const hm = /\[\s*(VERIFY|YOUR WORDS|DECISION)\b[^\]]*\]\s*/.exec(h[2]);
      const text = h[2].replace(hm ? hm[0] : "", "").trim();
      out.push({
        t: h[1].length === 2 ? "h2" : "h3",
        text: text || h[2],
        id: slugify(text || h[2]),
      });
      // AND emit the marker, or the section stops counting as outstanding.
      // Without this a post whose only unfinished part was a marker heading
      // reported itself as ready, and would have been indexed with a section
      // that had never been written.
      if (hm) {
        out.push({
          t: "marker",
          kind: hm[1] as MarkerKind,
          text: "This section is not written yet.",
        });
      }
      i += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      // Second row is the alignment rule and carries no content.
      const head = rows.shift() ?? [];
      if (rows.length && rows[0].every((c) => /^:?-{2,}:?$/.test(c.trim()))) {
        rows.shift();
      }
      out.push({ t: "table", head, rows });
      continue;
    }

    if (line.startsWith(">")) {
      const parts: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        parts.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      out.push({ t: "quote", spans: parseInline(parts.join(" ")) });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: Inline[][] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().replace(/^[-*]\s+/, "")));
        i += 1;
      }
      out.push({ t: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: Inline[][] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().replace(/^\d+\.\s+/, "")));
        i += 1;
      }
      out.push({ t: "ol", items });
      continue;
    }

    // Paragraph, which may run across lines and may be a review marker.
    const parts: string[] = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      parts.push(lines[i].trim());
      i += 1;
    }
    out.push(...splitOutMarkers(parts.join(" ")));
  }

  return out;
}

/**
 * A paragraph can END with a marker rather than being one:
 *
 *   "...includes the internal partition walls. [ VERIFY: confirm the RERA
 *    definition. ]"
 *
 * Matching only whole paragraphs left those brackets sitting in body copy on
 * the page, which is the single failure this parser exists to prevent. So the
 * text is split into alternating prose and marker blocks wherever one appears.
 */
function splitOutMarkers(text: string): Block[] {
  const re = /\[\s*(VERIFY|YOUR WORDS|DECISION)\b[:.]?\s*([\s\S]*?)\]/g;
  const out: Block[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    const before = text.slice(last, m.index).trim();
    if (before) out.push({ t: "p", spans: parseInline(before) });
    out.push({
      t: "marker",
      kind: m[1] as MarkerKind,
      text: m[2].trim(),
    });
    last = re.lastIndex;
  }

  const tail = text.slice(last).trim();
  if (tail) out.push({ t: "p", spans: parseInline(tail) });
  // An empty paragraph is still a paragraph if nothing else was produced.
  if (out.length === 0 && text.trim()) {
    out.push({ t: "p", spans: parseInline(text.trim()) });
  }
  return out;
}

function isBlockStart(l: string): boolean {
  const t = l.trim();
  return (
    /^#{2,4}\s/.test(t) ||
    /^---+$/.test(t) ||
    t.startsWith("|") ||
    t.startsWith(">") ||
    /^[-*]\s+/.test(t) ||
    /^\d+\.\s+/.test(t)
  );
}

function splitRow(l: string): string[] {
  return l
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

/* -------------------------------------------------------------- inline */

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  // Bold before italic, or "**x**" would be eaten as two italics.
  // Markers first: "[ VERIFY: x ]" must not be read as a link.
  const re =
    /\[\s*(VERIFY|YOUR WORDS|DECISION)[:.]?\s*([\s\S]*?)\]|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push({ t: "text", v: src.slice(last, m.index) });
    if (m[1] !== undefined) {
      out.push({ t: "marker", kind: m[1] as MarkerKind, v: m[2].trim() });
    } else if (m[3] !== undefined) out.push({ t: "bold", v: m[3] });
    else if (m[4] !== undefined) out.push({ t: "link", v: m[4], href: m[5] });
    else if (m[6] !== undefined) out.push({ t: "em", v: m[6] });
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out.length ? out : [{ t: "text", v: src }];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/** Words in the body, ignoring markers, for a reading time. */
export function wordCount(blocks: Block[]): number {
  let n = 0;
  const count = (spans: Inline[]) =>
    spans.reduce((s, x) => s + x.v.trim().split(/\s+/).filter(Boolean).length, 0);
  for (const b of blocks) {
    if (b.t === "p" || b.t === "quote") n += count(b.spans);
    else if (b.t === "ul" || b.t === "ol") n += b.items.reduce((s, it) => s + count(it), 0);
    else if (b.t === "h2" || b.t === "h3") n += b.text.split(/\s+/).length;
    else if (b.t === "table") n += b.rows.flat().join(" ").split(/\s+/).length;
  }
  return n;
}
