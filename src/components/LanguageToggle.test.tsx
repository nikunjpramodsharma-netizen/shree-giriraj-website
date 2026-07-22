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
  it("shows the current locale as the closed trigger label", () => {
    render(<LanguageToggle />);
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens a dropdown listing all languages when the trigger is clicked", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "हिंदी" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "मराठी" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "ગુજરાતી" })).toBeInTheDocument();
  });

  it("switches to Hindi when हिंदी is clicked in the open dropdown", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    await userEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(replace).toHaveBeenCalledWith("/projects", { locale: "hi" });
  });

  it("switches to Marathi when मराठी is clicked in the open dropdown", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    await userEvent.click(screen.getByRole("button", { name: "मराठी" }));
    expect(replace).toHaveBeenCalledWith("/projects", { locale: "mr" });
  });

  it("switches to Gujarati when ગુજરાતી is clicked in the open dropdown", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    await userEvent.click(screen.getByRole("button", { name: "ગુજરાતી" }));
    expect(replace).toHaveBeenCalledWith("/projects", { locale: "gu" });
  });

  it("closes the dropdown after selecting a language", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    await userEvent.click(screen.getByRole("button", { name: "मराठी" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks the active locale option with aria-selected", async () => {
    render(<LanguageToggle />);
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByRole("option", { name: "EN" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "हिंदी" })).toHaveAttribute("aria-selected", "false");
  });
});
