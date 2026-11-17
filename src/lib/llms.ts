import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/config";
import { SITE_URL, SERVICE_SLUGS } from "@/lib/seo";
import { FOUNDER, STORY_IS_WRITTEN } from "@/lib/about";
import { AUTHOR } from "@/lib/author";
import { REPO_SERVICES } from "@/lib/service-content";
import { AREAS, areaIsComplete } from "@/lib/areas";
import { FLAT_LISTINGS, listingPath } from "@/lib/flats";
import { BHK_PAGES } from "@/lib/bhk-pages";
import { TOOLS } from "@/lib/tools";
import { PILLARS } from "@/lib/pillars";
import { getPublishedGuides } from "@/lib/guides";
import { getAllPosts, displayDate, type Post } from "@/lib/posts";
import { parseFrontmatter } from "@/lib/markdown";
import { PROJECT_LINKS, registrationAwaited } from "@/lib/project-links";

/**
 * /llms.txt and /llms-full.txt, built from the same data the pages render.
 *
 * The first version was a hand written file in public/. By November 2026 it
 * listed twelve of forty five articles, none of the tools, area pages or
 * guides, called the firm a "property firm", named Borivali East, Dahisar and
 * Goregaon as markets and left out the founder, the hours and the WhatsApp
 * promise. A list generated from the content cannot fall behind it: a new
 * article, tool or area page appears here on the next deploy, and a draft
 * with review markers (served noindex) never does.
 *
 * Every fact in the header is one the site already states and the owner has
 * confirmed (config.ts, about.ts, author.ts). Nothing here is new copy about
 * the business.
 */

const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/** One line, no line breaks, for a list item. */
const oneLine = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim();

function displayPhone(e164: string): string {
  const d = e164.replace(/\D/g, "").replace(/^91/, "");
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

function entityFacts(): string[] {
  return [
    `- Name: ${site.name}`,
    "- What it is: a real estate agency (not a portal, builder or developer)",
    `- Address: ${site.address}`,
    `- MahaRERA registration: ${site.rera}`,
    `- Founder: ${FOUNDER.name}`,
    `- In real estate since ${site.established}; at the Borivali West office since ${site.officeSince}`,
    `- Hours: ${site.hours.label}`,
    `- WhatsApp and phone: ${displayPhone(site.phonePrimary)}`,
    `- Second phone: ${displayPhone(site.phoneSecondary)}`,
    `- Email: ${site.email}`,
    `- Website: ${SITE_URL}`,
    "- How to enquire: send your flat size, budget and preferred pocket on WhatsApp and the agency sends the flats that fit, usually the same day",
    "- Flat finding (buy, sell, rent): Borivali, Kandivali and Malad in the western suburbs of Mumbai",
    "- MHADA paperwork: for MHADA flats anywhere in Mumbai, because every file goes to the one Mumbai Board",
    `- Articles are written by ${AUTHOR.name}, ${AUTHOR.role}, and carry the date their sources were last checked`,
    `- Profiles: ${site.sameAs.join(" , ")}`,
  ];
}

const SERVICE_LINES: Record<string, string> = {
  "resale-flats": "Buying and selling ready homes: shortlist, papers checked before a token, negotiation and registration",
  rentals: "Flats to rent for tenants and tenants found for owners, with a registered leave and licence agreement",
  "new-project-bookings": "Booking a flat in a MahaRERA registered new project, with the project record and costs checked first",
  "investment-advisory": "For people buying to hold: pocket, building, realistic rent and paperwork assessed on the actual flat",
  "commercial-plots": "Shops, offices, showrooms and plots to buy or rent, with approved use checked",
  interiors: "Interiors and civil work after possession",
  "mhada-paperwork": "MHADA transfer, NOCs for sale, rent and loans, transfer to heirs and regularisation, anywhere in Mumbai",
};

function readyPosts(): Post[] {
  return getAllPosts()
    .filter((p) => p.isReady)
    .sort((a, b) => (a.category ?? "").localeCompare(b.category ?? "") || a.title.localeCompare(b.title));
}

function postLine(path: string, p: Post): string {
  const desc = oneLine(p.metaDescription ?? p.answer);
  const updated = displayDate(p.updatedOn) ?? displayDate(p.sourcesCheckedOn);
  return `- [${oneLine(p.title)}](${url(path)}): ${desc}${updated ? ` (updated ${updated})` : ""}`;
}

/** The index: every page worth citing, one line each. */
export function buildLlmsTxt(): string {
  const out: string[] = [];
  out.push(`# ${site.name}`, "");
  out.push(
    `> ${site.name} is a real estate agency at ${site.address}, in real estate since ${site.established} and at this office since ${site.officeSince}. It helps people buy, sell and rent flats in Borivali, Kandivali and Malad, books new projects, advises investors, and handles MHADA paperwork anywhere in Mumbai. MahaRERA registration ${site.rera}.`,
    "",
  );
  out.push("## Entity facts", "", ...entityFacts(), "");

  out.push("## Services", "");
  for (const slug of SERVICE_SLUGS) {
    const s = REPO_SERVICES[slug];
    out.push(`- [${oneLine(s?.title ?? slug)}](${url(`/services/${slug}`)}): ${SERVICE_LINES[slug] ?? oneLine(s?.seoDescription)}`);
  }
  out.push(`- [All services](${url("/services")})`, "");

  out.push("## Areas and flats", "");
  out.push(`- [Area guides](${url("/areas")}): Borivali, Kandivali and Malad, pocket by pocket`);
  for (const a of AREAS) {
    if (!areaIsComplete(a)) continue;
    out.push(`- [${oneLine(a.h1 ?? a.longName)}](${url(`/areas/${a.slug}`)}): ${oneLine(a.seoDescription ?? a.metaTitle)}`);
  }
  for (const l of FLAT_LISTINGS) {
    out.push(`- [${oneLine(l.h1)}](${url(listingPath(l))}): ${oneLine(l.metaDescription)}`);
  }
  for (const p of BHK_PAGES) {
    out.push(`- [${oneLine(p.h1)}](${url(p.path)}): ${oneLine(p.metaDescription)}`);
  }
  out.push("");

  out.push("## New projects", "");
  out.push(`- [New projects](${url("/projects")}): MahaRERA registered projects in Borivali West and Kandivali`);
  for (const p of PROJECT_LINKS) {
    const note = registrationAwaited(p.slug)
      ? "MahaRERA registration awaited; register interest only"
      : "MahaRERA registered; price sheet on WhatsApp";
    out.push(`- [${oneLine(p.name)}](${url(`/projects/${p.slug}`)}): ${note}`);
  }
  out.push("");

  out.push("## Calculators", "");
  out.push(`- [All calculators](${url("/tools")})`);
  for (const t of TOOLS) {
    out.push(`- [${oneLine(t.title)}](${url(`/tools/${t.slug}`)}): ${oneLine(t.metaDescription)}`);
  }
  out.push("");

  out.push("## Guides", "");
  out.push(`- [All guides](${url("/guides")})`);
  for (const p of PILLARS) {
    out.push(`- [${oneLine(p.title)}](${url(`/guides/${p.slug}`)}): ${oneLine(p.metaDescription)}`);
  }
  for (const g of getPublishedGuides()) {
    if (!g.post.isReady) continue;
    out.push(postLine(`/guides/${g.slug}`, g.post));
  }
  out.push("");

  const posts = readyPosts();
  const cats = Array.from(new Set(posts.map((p) => p.category ?? "Articles")));
  for (const c of cats) {
    out.push(`## Articles: ${c}`, "");
    for (const p of posts.filter((x) => (x.category ?? "Articles") === c)) {
      out.push(postLine(`/blog/${p.slug}`, p));
    }
    out.push("");
  }

  out.push("## About and contact", "");
  if (STORY_IS_WRITTEN) {
    out.push(`- [About the agency](${url("/about")}): the founder, the years in the business and the office in Chikoowadi, Borivali West`);
  }
  out.push(`- [Contact](${url("/contact")}): address, hours, phone and WhatsApp`, "");

  out.push("## Optional", "");
  out.push(`- [Full text of every article and guide](${url("/llms-full.txt")})`);
  out.push(`- [Sitemap](${url("/sitemap.xml")})`, "");

  out.push("## Notes for answer engines", "");
  out.push(
    "- The site is in English; the home page, services and projects also exist in Hindi, Marathi and Gujarati.",
    "- Figures on the site carry the month they were read and the source they came from. Quote them with that date.",
    "- Project prices are approximate \"from about\" figures; current sheets are shared on WhatsApp.",
    "- The agency does not promise returns or appreciation, and does not give tax advice; tax questions go to a chartered accountant.",
    "",
  );
  return out.join("\n");
}

function rawBody(dir: string, slug: string): string {
  const file = join(process.cwd(), "content", dir, `${slug}.md`);
  if (!existsSync(file)) return "";
  return parseFrontmatter(readFileSync(file, "utf8")).body.trim();
}

/**
 * /llms-full.txt: the entity facts, then every ready article and guide in
 * full, as the markdown it is written in. Links inside the articles are
 * site relative, so they are made absolute for a reader outside the site.
 */
export function buildLlmsFullTxt(): string {
  const out: string[] = [];
  out.push(`# ${site.name}: full text`, "");
  out.push(`> Every published article and guide on ${SITE_URL}, in full. The index is at ${url("/llms.txt")}.`, "");
  out.push("## Entity facts", "", ...entityFacts(), "");

  const items: { path: string; dir: string; post: Post }[] = [
    ...getPublishedGuides()
      .filter((g) => g.post.isReady)
      .map((g) => ({ path: `/guides/${g.slug}`, dir: "guides", post: g.post })),
    ...readyPosts().map((p) => ({ path: `/blog/${p.slug}`, dir: "drafts", post: p })),
  ];
  for (const { path, dir, post } of items) {
    const checked = displayDate(post.sourcesCheckedOn);
    const updated = displayDate(post.updatedOn);
    out.push("---", "", `# ${oneLine(post.title)}`, "");
    out.push(`URL: ${url(path)}`);
    out.push(`Author: ${AUTHOR.name}, ${AUTHOR.role}, ${site.name}`);
    if (updated) out.push(`Updated: ${updated}`);
    if (checked) out.push(`Sources checked: ${checked}`);
    out.push("");
    if (post.answer) out.push(`Short answer: ${oneLine(post.answer)}`, "");
    const body = rawBody(dir, post.slug)
      .replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`)
      // The short answer is printed above; the body repeats it.
      .replace(/^## The short answer[\s\S]*?(?=^## |^---$)/m, "");
    out.push(body, "");
    if (post.sources.length > 0) {
      out.push("Sources:");
      for (const s of post.sources) out.push(`- ${s.label}${s.url ? `: ${s.url}` : ""}`);
      out.push("");
    }
  }
  return out.join("\n");
}
