import { describe, it, expect } from "vitest";
import { itemListNode } from "./schema";

/**
 * A list entry served in English only (Jaswanti Jewel on the hi, mr and gu
 * project lists) must point at the English URL, not at a noindexed copy.
 */
describe("itemListNode", () => {
  it("uses the list's locale by default and an item's own locale when given", () => {
    const node = itemListNode("hi", [
      { name: "Veena Celestia", path: "/projects/veena-celestia" },
      { name: "Jaswanti Jewel", path: "/projects/jaswanti-jewel", locale: "en" },
    ]) as { itemListElement: { url: string; position: number }[] };
    const [a, b] = node.itemListElement;
    expect(a.url).toContain("/hi/projects/veena-celestia");
    expect(b.url).toMatch(/shreegiriraj\.com\/projects\/jaswanti-jewel$/);
    expect(b.position).toBe(2);
  });
});
