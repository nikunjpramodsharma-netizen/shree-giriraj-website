import { describe, it, expect } from "vitest";
import en from "./en.json";
import hi from "./hi.json";
import mr from "./mr.json";
import gu from "./gu.json";

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null
      ? flattenKeys(value as Record<string, unknown>, path)
      : [path];
  });
}

describe("message catalog key parity", () => {
  it("has identical keys across en, hi, mr and gu", () => {
    const enKeys = flattenKeys(en).sort();
    const hiKeys = flattenKeys(hi).sort();
    const mrKeys = flattenKeys(mr).sort();
    const guKeys = flattenKeys(gu).sort();
    expect(hiKeys).toEqual(enKeys);
    expect(mrKeys).toEqual(enKeys);
    expect(guKeys).toEqual(enKeys);
  });

  it("has no empty string values in any catalog", () => {
    for (const [name, catalog] of [
      ["en", en],
      ["hi", hi],
      ["mr", mr],
      ["gu", gu],
    ] as const) {
      const empty = flattenKeys(catalog).filter(
        (path) => path.split(".").reduce((o: any, k) => o[k], catalog) === ""
      );
      expect(empty, `${name}.json has empty values at: ${empty.join(", ")}`).toEqual([]);
    }
  });

  it("has no em dashes or en dashes in any catalog", () => {
    for (const [name, catalog] of [
      ["en", en],
      ["hi", hi],
      ["mr", mr],
      ["gu", gu],
    ] as const) {
      const dashed = flattenKeys(catalog).filter((path) => {
        const value = path.split(".").reduce((o: any, k) => o[k], catalog);
        return typeof value === "string" && /[—–]/.test(value);
      });
      expect(
        dashed,
        `${name}.json has em/en dash characters at: ${dashed.join(", ")}`
      ).toEqual([]);
    }
  });
});
