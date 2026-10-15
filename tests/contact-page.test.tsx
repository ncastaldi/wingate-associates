import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// The page only wires the action in; the database and Resend are not needed to render it.
vi.mock("@/app/contact/actions", () => ({ submitLead: vi.fn() }));
// connection() only works inside a Next request; here it just resolves.
vi.mock("next/server", () => ({ connection: vi.fn().mockResolvedValue(undefined) }));

const { default: ContactPage, metadata } = await import("@/app/contact/page");

describe("ContactPage", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders a main heading and the contact form", async () => {
    render(await ContactPage());
    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
  });

  it("points to the form for scheduling while BOOKING_URL is unset", async () => {
    vi.stubEnv("BOOKING_URL", "");
    render(await ContactPage());
    expect(screen.getByRole("heading", { level: 2, name: "Book a call" })).toBeInTheDocument();
    expect(screen.queryByTitle("Book a 30-minute call")).not.toBeInTheDocument();
  });

  it("embeds the booking page once BOOKING_URL is set", async () => {
    vi.stubEnv("BOOKING_URL", "https://cal.wingate.associates/nathan/intro");
    render(await ContactPage());
    expect(screen.getByTitle("Book a 30-minute call")).toHaveAttribute(
      "src",
      "https://cal.wingate.associates/nathan/intro",
    );
    expect(screen.getByRole("link", { name: /new tab/ })).toHaveAttribute(
      "href",
      "https://cal.wingate.associates/nathan/intro",
    );
  });

  it("sets a page title and its canonical path", () => {
    expect(metadata.title).toEqual({ absolute: "Contact | Wingate Associates" });
    expect(metadata.alternates).toEqual({ canonical: "/contact" });
  });
});
