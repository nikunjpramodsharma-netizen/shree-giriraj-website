import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestimonialCarousel } from "./TestimonialCarousel";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({ prevAriaLabel: "Previous testimonial", nextAriaLabel: "Next testimonial" })[key] ?? key,
}));

const testimonials = [
  { _id: "1", quote: { en: "Great service" }, author: "Client A", role: { en: "Borivali homeowner" }, rating: 5 },
  { _id: "2", quote: { en: "Very professional" }, author: "Client B", role: { en: "Kandivali homeowner" }, rating: 4 },
  { _id: "3", quote: { en: "Highly recommend" }, author: "Client C", role: { en: "Malad homeowner" }, rating: 5 },
];

describe("TestimonialCarousel", () => {
  it("shows the first testimonial initially", () => {
    render(<TestimonialCarousel testimonials={testimonials} locale="en" />);
    expect(screen.getByText(/Great service/)).toBeInTheDocument();
    expect(screen.queryByText(/Very professional/)).not.toBeInTheDocument();
  });

  it("advances to the next testimonial when the next button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestimonialCarousel testimonials={testimonials} locale="en" />);
    await user.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(screen.getByText(/Very professional/)).toBeInTheDocument();
  });

  it("goes back to the previous testimonial when the prev button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestimonialCarousel testimonials={testimonials} locale="en" />);
    await user.click(screen.getByRole("button", { name: "Previous testimonial" }));
    expect(screen.getByText(/Highly recommend/)).toBeInTheDocument();
  });

  it("auto-advances after the rotation interval", () => {
    vi.useFakeTimers();
    try {
      render(<TestimonialCarousel testimonials={testimonials} locale="en" />);
      expect(screen.getByText(/Great service/)).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(6000);
      });
      expect(screen.getByText(/Very professional/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not render at all when given an empty testimonials array", () => {
    const { container } = render(<TestimonialCarousel testimonials={[]} locale="en" />);
    expect(container).toBeEmptyDOMElement();
  });
});
