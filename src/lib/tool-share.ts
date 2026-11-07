/**
 * Shareable calculator results.
 *
 * A result link carries the inputs as numbers and fixed choices only, in the
 * query string. Never a name, phone number or email. The page's canonical URL
 * stays parameter free, because the query is read on the client after load.
 */

export type ShareValue = string | number;

/** The query string (no leading "?") for a set of inputs. Empty values are left out. */
export function buildShareQuery(params: Record<string, ShareValue | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    sp.set(k, String(v));
  }
  return sp.toString();
}

/** A number from the query, or undefined when absent, not a number, or outside the range. */
export function readShareNumber(
  sp: URLSearchParams,
  key: string,
  min: number,
  max: number,
): number | undefined {
  const raw = sp.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < min || n > max) return undefined;
  return n;
}

/** A choice from the query, only if it is one of the allowed values. */
export function readShareChoice<T extends string>(
  sp: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T | undefined {
  const raw = sp.get(key);
  return raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : undefined;
}
