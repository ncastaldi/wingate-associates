import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// The page only wires the action in; the database and Resend are not needed to render it.
vi.mock("@/app/contact/actions", () => ({ submitLead: vi.fn() }));

const { default: ContactPage, metadata } = await import("@/app/contact/page");

describe("ContactPage", () => {
  it("renders a main heading and the contact form", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
  });

  it("sets a page title", () => {
    expect(metadata.title).toBe("Contact | Wingate Associates");
  });
});
