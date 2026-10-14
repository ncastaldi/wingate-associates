import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("leads with the practice's one-line pitch", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Most IT problems aren’t technology problems.",
      }),
    ).toBeInTheDocument();
  });

  it("shows recent work and no placeholder notice", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 2, name: "Recent work" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Jobsquatch" })).toHaveAttribute(
      "href",
      "https://jobsquatch.us",
    );
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("shows the identity drift diagram with an accessible description", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("img", { name: /HR, Active Directory and Entra ID compared/ }),
    ).toBeInTheDocument();
  });

  it("links to services and the contact page", () => {
    render(<HomePage />);
    expect(screen.getByRole("link", { name: "See services" })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: "Tell me what’s broken" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
