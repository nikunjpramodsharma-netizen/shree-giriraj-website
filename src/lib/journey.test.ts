import { describe, it, expect } from "vitest";
import { railProgress, dotLit } from "./journey";

const VH = 900;
const LINE = VH * 0.62; // 558

describe("journey rail progress", () => {
  it("is zero while the rail top is still below the trigger line", () => {
    expect(railProgress({ top: 700, bottom: 2100, height: 1400 }, VH).p).toBe(0);
  });

  it("matches the hand measurement taken on the live page", () => {
    // Rail top at the viewport top, 1422px tall, 900px viewport: 558/1422.
    const r = railProgress({ top: 0, bottom: 1422, height: 1422 }, VH);
    expect(r.p).toBeCloseTo(0.392, 3);
    expect(r.terminal).toBeNull();
  });

  it("reaches exactly one when the trigger line meets the rail bottom", () => {
    const top = LINE - 1400;
    expect(railProgress({ top, bottom: top + 1400, height: 1400 }, VH).p).toBeCloseTo(1, 10);
  });

  it("settles past the end in either direction", () => {
    expect(railProgress({ top: -3000, bottom: -1600, height: 1400 }, VH)).toEqual({ p: 1, terminal: "after" });
    expect(railProgress({ top: 5000, bottom: 6400, height: 1400 }, VH)).toEqual({ p: 0, terminal: "before" });
  });

  it("keeps tracking a rail that is just off screen", () => {
    // 200px below the fold is inside the margin, so it is measured, not settled.
    const r = railProgress({ top: VH + 200, bottom: VH + 1600, height: 1400 }, VH);
    expect(r.terminal).toBeNull();
    expect(r.p).toBe(0);
  });

  it("never divides by zero on an unmeasured rail", () => {
    expect(railProgress({ top: 0, bottom: 0, height: 0 }, VH)).toEqual({ p: 0, terminal: null });
  });

  it("is reversible: the same box always gives the same value", () => {
    const a = railProgress({ top: 100, bottom: 1500, height: 1400 }, VH).p;
    const b = railProgress({ top: 100, bottom: 1500, height: 1400 }, VH).p;
    expect(a).toBe(b);
  });
});

describe("dot lighting", () => {
  it("lights on the same line the fill head uses", () => {
    expect(dotLit(LINE, VH)).toBe(true);
    expect(dotLit(LINE + 1, VH)).toBe(false);
  });
  it("matches the live page: first dot at 245 lit, second at 735 not", () => {
    expect(dotLit(245, VH)).toBe(true);
    expect(dotLit(735, VH)).toBe(false);
    expect(dotLit(1225, VH)).toBe(false);
  });
});
