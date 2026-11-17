import { describe, it, expect } from "vitest";
import { writeFileSync } from "node:fs";
import { buildLlmsTxt, buildLlmsFullTxt } from "./llms";
import { getAllPosts } from "./posts";
import { getPublishedGuides } from "./guides";
import { TOOL_SLUGS } from "./tools";
import { SERVICE_SLUGS } from "./seo";

/**
 * llms.txt is generated, so the test is that it stays complete: every ready
 * article, guide, tool and service is listed, no draft is, and the entity
 * facts match the master NAP.
 */
describe("llms.txt", () => {
  const txt = buildLlmsTxt();
  if (process.env.LLMS_DUMP) {
    writeFileSync(process.env.LLMS_DUMP, txt);
    writeFileSync(process.env.LLMS_DUMP + ".full", buildLlmsFullTxt());
  }

  it("carries the master NAP, the RERA number and the founder", () => {
    expect(txt).toContain("Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092");
    expect(txt).toContain("A51800005726");
    expect(txt).toContain("Pramod Kishanlal Sharma");
  });

  it("lists every ready article and guide, and no draft", () => {
    for (const p of getAllPosts()) {
      expect(txt.includes(`/blog/${p.slug})`), p.slug).toBe(p.isReady);
    }
    for (const g of getPublishedGuides()) {
      expect(txt.includes(`/guides/${g.slug})`), g.slug).toBe(g.post.isReady);
    }
  });

  it("lists every tool and service", () => {
    for (const s of TOOL_SLUGS) expect(txt, s).toContain(`/tools/${s})`);
    for (const s of SERVICE_SLUGS) expect(txt, s).toContain(`/services/${s})`);
  });

  it("calls the firm an agency and never an agent", () => {
    expect(txt).not.toMatch(/\breal estate agent\b/i);
    expect(txt).not.toMatch(/[—–]/);
  });

  it("builds the full text without dropping an article", () => {
    const full = buildLlmsFullTxt();
    for (const p of getAllPosts().filter((x) => x.isReady)) {
      expect(full, p.slug).toContain(`/blog/${p.slug}`);
    }
  });
});

import { organizationNode, blogPostingNode } from "./schema";

describe("business markup", () => {
  const org = organizationNode() as Record<string, any>;

  it("spells the address exactly as the master NAP", () => {
    const a = org.address;
    expect(`${a.streetAddress}, ${a.addressLocality} ${a.postalCode}`).toBe(
      "Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092",
    );
  });

  it("always names the founder, serves Mumbai for MHADA, and never self rates", () => {
    expect(org.founder.name).toBe("Pramod Kishanlal Sharma");
    expect(org.areaServed.map((p: any) => p.name)).toContain("Mumbai");
    expect(org.sameAs.length).toBeGreaterThan(0);
    expect(JSON.stringify(org)).not.toMatch(/aggregateRating|"review"/i);
  });

  it("gives an article a resolvable publisher and a publish date no later than the modified date", () => {
    const n = blogPostingNode({
      locale: "en",
      title: "t",
      slug: "s",
      published: "16 November 2026",
      modified: "7 November 2026",
      authorName: "Nikunj Sharma",
    }) as Record<string, any>;
    expect(n.publisher.name).toBeTruthy();
    expect(n.publisher.logo.url).toMatch(/logo\.png$/);
    expect(n.datePublished <= n.dateModified).toBe(true);
  });
});

import { serviceNode } from "./schema";

describe("service markup", () => {
  it("says what each service is and where", () => {
    const resale = serviceNode({ locale: "en", name: "Resale", slug: "resale-flats" }) as Record<string, any>;
    expect(resale.serviceType).toBe("Buying and selling of resale flats");
    expect(resale.areaServed.map((p: any) => p.name)).toEqual([
      "Borivali West, Mumbai",
      "Kandivali, Mumbai",
      "Malad, Mumbai",
    ]);
    const mhada = serviceNode({ locale: "en", name: "MHADA", slug: "mhada-paperwork" }) as Record<string, any>;
    expect(mhada.areaServed.map((p: any) => p.name)).toEqual(["Mumbai"]);
    const custom = serviceNode({ locale: "en", name: "X", slug: "rentals", serviceType: "Y", areaServed: ["Mumbai"] }) as Record<string, any>;
    expect(custom.serviceType).toBe("Y");
    expect(custom.areaServed[0]["@type"]).toBe("City");
  });
});
