import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { AREAS } from "./areas";

/**
 * The owner's rule: no picture appears twice across the area pages, and none
 * may be missing. The rotating cards on the homepage read the same data, so
 * this guards both.
 */
describe("area card pictures", () => {
  const all = AREAS.flatMap((a) =>
    [...a.motion.pocketScenes, ...a.motion.landmarks].map((c) => ({ area: a.slug, title: c.title, src: c.image?.src })),
  );

  it("gives every card a picture that exists", () => {
    for (const c of all) {
      expect(c.src, `${c.area}: ${c.title}`).toBeTruthy();
      expect(existsSync(join(process.cwd(), "public", c.src!)), c.src).toBe(true);
    }
  });

  it("never repeats a picture", () => {
    const seen = new Map<string, string>();
    for (const c of all) {
      const prior = seen.get(c.src!);
      expect(prior, `${c.src} is on both "${prior}" and "${c.title}"`).toBeUndefined();
      seen.set(c.src!, c.title);
    }
  });
});
