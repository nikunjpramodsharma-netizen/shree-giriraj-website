import { describe, it, expect } from "vitest";
import { CARD, buildVCard, cardWhatsAppLink, showPhone } from "./card";
import { site } from "./config";
import { shouldOfferContact } from "@/components/card/AutoSave";

describe("the digital card", () => {
  const vcf = buildVCard("QUJD");
  const lines = vcf.split("\r\n");

  it("is a version 3 vCard with CRLF line endings", () => {
    expect(lines[0]).toBe("BEGIN:VCARD");
    expect(lines[1]).toBe("VERSION:3.0");
    expect(lines.filter(Boolean).at(-1)).toBe("END:VCARD");
    expect(vcf.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
  });

  it("carries the founder, the firm and every way to reach it from config", () => {
    expect(vcf).toContain("FN:Pramod Sharma");
    expect(vcf).toContain(`ORG:${site.name}`);
    expect(vcf).toContain(site.phonePrimary);
    expect(vcf).toContain(site.phoneSecondary);
    expect(vcf).toContain(site.email);
    expect(vcf).toContain("400092");
    expect(vcf).toContain(site.rera);
  });

  it("escapes commas inside values", () => {
    const adr = lines.find((l) => l.startsWith("ADR"))!;
    expect(adr).toContain("Shop No 11\\, Clover Grove CHS");
  });

  it("folds every line to 75 characters or fewer", () => {
    const long = buildVCard("A".repeat(400)).split("\r\n");
    for (const l of long) expect(l.length).toBeLessThanOrEqual(75);
    expect(long.some((l) => l.startsWith(" "))).toBe(true);
  });

  it("formats an Indian mobile number for reading", () => {
    expect(showPhone("+919324974133")).toBe("+91 93249 74133");
  });

  it("opens WhatsApp on the firm's number with a message ready", () => {
    expect(cardWhatsAppLink()).toMatch(new RegExp(`^https://wa\\.me/${site.whatsapp}\\?text=`));
  });

  it("uses no dashes in anything a visitor reads", () => {
    expect(JSON.stringify(CARD)).not.toMatch(/[—–]/);
  });

  it("offers the contact file on arrival to a phone, once, and never to a desktop", () => {
    const android = "Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile Safari/537.36";
    const iphone = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Safari/604.1";
    const windows = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0";
    expect(shouldOfferContact(android, 5, false)).toBe(true);
    expect(shouldOfferContact(iphone, 5, false)).toBe(true);
    expect(shouldOfferContact(android, 5, true)).toBe(false);
    expect(shouldOfferContact(windows, 0, false)).toBe(false);
    expect(shouldOfferContact(windows, 10, false)).toBe(false);
  });
});
