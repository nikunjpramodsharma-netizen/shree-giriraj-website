/**
 * The journey rail's arithmetic, kept pure so it can be tested without a
 * browser. The component in JourneyRail.tsx only measures and writes.
 */

export type Box = { top: number; bottom: number; height: number };

/** Result of one measurement: fill progress and whether we are past an end. */
export type RailState = { p: number; terminal: "before" | "after" | null };

/**
 * Where the fill should be, given the rail's box and the viewport.
 *
 * `trigger` is the share of the viewport height, from the top, at which a row
 * lights and the fill head sits. The two share one line on purpose: a dot
 * lights at the moment the head reaches it, which two separate measurements
 * would not guarantee.
 *
 * Fully past the rail in either direction reports a terminal state so the
 * caller can settle every row rather than leave it half lit after a fast
 * flick or an anchor jump that skipped every frame in between. The 300px
 * margin means a rail just off screen is still tracked, so scrolling back
 * into it never starts from a stale value.
 */
export function railProgress(rail: Box, viewportHeight: number, trigger = 0.62): RailState {
  if (rail.height <= 0) return { p: 0, terminal: null };
  if (rail.bottom < -300) return { p: 1, terminal: "after" };
  if (rail.top > viewportHeight + 300) return { p: 0, terminal: "before" };
  const line = viewportHeight * trigger;
  const p = Math.min(1, Math.max(0, (line - rail.top) / rail.height));
  return { p, terminal: null };
}

/** A dot is lit once its centre has crossed the trigger line. */
export function dotLit(dotCentreY: number, viewportHeight: number, trigger = 0.62): boolean {
  return dotCentreY <= viewportHeight * trigger;
}
