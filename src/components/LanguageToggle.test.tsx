import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageToggle } from "./LanguageToggle";

const replace = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/projects",
  useRouter: () => ({ replace }),
}));

describe("LanguageToggle", () => {
  it("switches to Hindi when हिंदी is clicked", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(replace).toHaveBeenCalledWith("/projects", { locale: "hi" });
  });

  it("switches to Marathi when मराठी is clicked", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "मराठी" }));
    expect(replace).toHaveBeenCalledWith("/projects", { locale: "mr" });
  });

  it("marks the active locale button with aria-current", () => {
    render(<LanguageToggle />);
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "हिंदी" })).toHaveAttribute("aria-current", "false");
  });
});
