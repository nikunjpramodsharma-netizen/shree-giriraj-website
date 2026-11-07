import { describe, it, expect } from "vitest";
import { buildShareQuery, readShareNumber, readShareChoice } from "./tool-share";

describe("tool share links", () => {
  it("writes numbers and choices, skipping empty values", () => {
    expect(buildShareQuery({ v: 12000000, who: "female", r: undefined, x: "" })).toBe("v=12000000&who=female");
  });
  it("reads a number only inside its range", () => {
    const sp = new URLSearchParams("v=12000000&bad=abc&big=99999999999");
    expect(readShareNumber(sp, "v", 0, 1e9)).toBe(12000000);
    expect(readShareNumber(sp, "bad", 0, 1e9)).toBeUndefined();
    expect(readShareNumber(sp, "big", 0, 1e9)).toBeUndefined();
    expect(readShareNumber(sp, "missing", 0, 1e9)).toBeUndefined();
  });
  it("reads a choice only from the allowed list", () => {
    const sp = new URLSearchParams("who=female&odd=<script>");
    expect(readShareChoice(sp, "who", ["male", "female", "joint"] as const)).toBe("female");
    expect(readShareChoice(sp, "odd", ["male", "female", "joint"] as const)).toBeUndefined();
  });
});
