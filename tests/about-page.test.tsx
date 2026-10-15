import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage, { metadata } from "@/app/about/page";

describe("AboutPage", () => {
  it("renders a main heading and links to the contact page", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1, name: "About me" })).toBeInTheDocument();
    expect(screen.getByText(/I’m Nathan Castaldi/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tell me what’s broken" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("sets a page title and its canonical path", () => {
    expect(metadata.title).toEqual({ absolute: "About | Wingate Associates" });
    expect(metadata.alternates).toEqual({ canonical: "/about" });
  });
});
