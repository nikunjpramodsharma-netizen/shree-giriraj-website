import { describe, it, expect } from "vitest";
import { SHORTLIST_SUBURBS, SHORTLIST_SUBURB_FOR_AREA, shortlistMessage } from "./shortlist";

describe("same day shortlist", () => {
  it("writes a buyer's message with the choices", () => {
    const m = shortlistMessage({ intent: "buy", suburb: "Kandivali West", bhk: "2 BHK", budget: " 1.5  crore ", timing: "Within a month" });
    expect(m).toContain("I want to buy a 2 BHK in Kandivali West. Budget: 1.5 crore.");
    expect(m).toContain("Timing: within a month.");
  });

  it("writes a tenant's message and leaves a blank when no figure is given", () => {
    const m = shortlistMessage({ intent: "rent", suburb: "Any of these", bhk: "1 BHK", budget: "", timing: "Just starting to look" });
    expect(m).toContain("rent a 1 BHK in Borivali, Kandivali or Malad. Rent: ___ a month.");
  });

  it("offers only the three suburbs the agency finds flats in", () => {
    for (const s of SHORTLIST_SUBURBS) expect(s).toMatch(/^(Borivali|Kandivali|Malad) (West|East)$|^Any of these$/);
    for (const v of Object.values(SHORTLIST_SUBURB_FOR_AREA)) expect(SHORTLIST_SUBURBS as readonly string[]).toContain(v);
  });

  it("caps a long budget and has no dashes", () => {
    const m = shortlistMessage({ intent: "buy", suburb: "Malad West", bhk: "3 BHK", budget: "x".repeat(200), timing: "In 1 to 3 months" });
    expect(m).not.toContain("x".repeat(41));
    expect(m).not.toMatch(/[—–]/);
  });
});
