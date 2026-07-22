import { describe, it, expect } from "vitest";
import { getLocalizedField } from "./i18n-content";

describe("getLocalizedField", () => {
  it("returns the value for the requested locale when present", () => {
    const field = { en: "Hello", hi: "नमस्ते", mr: "नमस्कार" };
    expect(getLocalizedField(field, "hi")).toBe("नमस्ते");
  });

  it("falls back to English when the requested locale is missing", () => {
    const field = { en: "Hello" };
    expect(getLocalizedField(field, "mr")).toBe("Hello");
  });

  it("returns undefined when the field itself is undefined", () => {
    expect(getLocalizedField(undefined, "en")).toBeUndefined();
  });

  it("returns undefined when neither the locale nor the fallback has a value", () => {
    const field = { hi: "नमस्ते" };
    expect(getLocalizedField(field, "mr")).toBeUndefined();
  });

  it("supports a custom fallback locale", () => {
    const field = { hi: "नमस्ते" };
    expect(getLocalizedField(field, "mr", "hi")).toBe("नमस्ते");
  });
});
