import { describe, it, expect } from "vitest";
import {
  localizedStringField,
  localizedTextField,
  localizedBlockContentField,
} from "./localizedFields";

function fieldNames(def: any) {
  return def.fields.map((f: any) => f.name);
}

describe("localized Sanity field builders", () => {
  it("localizedStringField produces an object field with en/hi/mr/gu string subfields", () => {
    const def = localizedStringField("summary", "Summary");
    expect(def.name).toBe("summary");
    expect(def.title).toBe("Summary");
    expect(def.type).toBe("object");
    expect(fieldNames(def)).toEqual(["en", "hi", "mr", "gu"]);
    expect(def.fields.every((f: any) => f.type === "string")).toBe(true);
  });

  it("localizedTextField produces en/hi/mr/gu text subfields with the given row count", () => {
    const def = localizedTextField("body", "Body", 6);
    expect(fieldNames(def)).toEqual(["en", "hi", "mr", "gu"]);
    expect(def.fields.every((f: any) => f.type === "text" && f.rows === 6)).toBe(true);
  });

  it("localizedBlockContentField produces en/hi/mr/gu blockContent subfields", () => {
    const def = localizedBlockContentField("body", "Full description");
    expect(fieldNames(def)).toEqual(["en", "hi", "mr", "gu"]);
    expect(def.fields.every((f: any) => f.type === "blockContent")).toBe(true);
  });
});
