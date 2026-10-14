import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ServicesPage, { metadata } from "@/app/services/page";

describe("ServicesPage", () => {
  it("renders a main heading with services and engagement sections", () => {
    render(<ServicesPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Services" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What I do" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "How we work together" }),
    ).toBeInTheDocument();
  });

  it("flags the copy as placeholder and links to the contact page", () => {
    render(<ServicesPage />);
    expect(screen.getByRole("note")).toHaveTextContent("Placeholder copy");
    expect(screen.getByRole("link", { name: "Tell me about your project" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("sets a page title and its canonical path", () => {
    expect(metadata.title).toEqual({ absolute: "Services | Wingate Associates" });
    expect(metadata.alternates).toEqual({ canonical: "/services" });
  });
});
