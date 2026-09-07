import { describe, it, expect } from "vitest";
import { subjectFor, textFor, htmlFor, type Lead } from "./lead-email";

const full: Lead = {
  name: "Anita Shah",
  phone: "+91 98200 12345",
  email: "anita@example.com",
  intent: "Buy",
  area: "Borivali",
  message: "Looking at a 2 BHK near the station.",
  locale: "en",
  sourcePage: "/services/resale-flats",
  formLocation: "service-resale-flats",
  gclid: "Cj0KCQiA-abc123",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "resale-borivali",
  landingPage: "/",
  referrer: "https://www.google.com/",
};

const minimal: Lead = { name: "Ravi", phone: "9820011111" };

describe("subject line", () => {
  it("carries the name and what they want, so it can be triaged unopened", () => {
    expect(subjectFor(full)).toBe("New enquiry: Anita Shah, Buy, Borivali");
  });

  it("degrades to just the name when nothing else was picked", () => {
    expect(subjectFor(minimal)).toBe("New enquiry: Ravi");
  });

  it("uses whichever of intent or area is present", () => {
    expect(subjectFor({ name: "Ravi", area: "Malad" })).toBe(
      "New enquiry: Ravi, Malad",
    );
  });
});

describe("plain text body", () => {
  const t = textFor(full);

  it("includes every field the person filled in", () => {
    for (const v of [
      "Anita Shah",
      "+91 98200 12345",
      "anita@example.com",
      "Buy",
      "Borivali",
      "2 BHK near the station",
    ]) {
      expect(t).toContain(v);
    }
  });

  it("separates where the enquiry came from", () => {
    expect(t).toContain("Where this came from");
    expect(t).toContain("utm_campaign: resale-borivali");
    expect(t).toContain("Referrer: https://www.google.com/");
  });

  it("calls out a Google click id, since it is what makes conversion import possible", () => {
    expect(t).toContain("Google Ads");
  });

  it("says nothing about a click id when there is not one", () => {
    expect(textFor(minimal)).not.toContain("Google Ads");
  });

  it("omits empty fields rather than printing blank labels", () => {
    const t2 = textFor(minimal);
    expect(t2).not.toContain("Email:");
    expect(t2).not.toContain("Area:");
    expect(t2).toContain("Name: Ravi");
  });
});

describe("html body", () => {
  it("gives the owner a way to act from a phone", () => {
    const h = htmlFor(full);
    expect(h).toContain('href="tel:+91 98200 12345"');
    expect(h).toContain("https://wa.me/919820012345");
  });

  it("strips non digits from the number for the WhatsApp link", () => {
    expect(htmlFor({ name: "X", phone: "+91 (98200) 12345" })).toContain(
      "wa.me/919820012345",
    );
  });

  it("offers no call buttons when only an email was given", () => {
    const h = htmlFor({ name: "X", email: "x@example.com" });
    expect(h).not.toContain("href=\"tel:");
    expect(h).not.toContain("wa.me");
  });

  it("escapes html so a pasted tag cannot break the email", () => {
    const h = htmlFor({
      name: "<script>alert(1)</script>",
      phone: "1",
      message: 'a "quoted" & <b>bold</b> thing',
    });
    expect(h).not.toContain("<script>alert(1)</script>");
    expect(h).toContain("&lt;script&gt;");
    expect(h).toContain("&amp;");
  });

  it("includes the attribution block when there is attribution", () => {
    expect(htmlFor(full)).toContain("Where this came from");
    expect(htmlFor(minimal)).not.toContain("Where this came from");
  });
});
