import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

describe("SiteHeader", () => {
  it("links the name to home and the main nav to Services, About and Contact", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Wingate Associates" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav).toHaveTextContent("Services");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
});

describe("SiteNav", () => {
  it("marks the current page's link", () => {
    pathname.current = "/services";
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Contact" })).not.toHaveAttribute("aria-current");
  });
});

describe("SiteFooter", () => {
  it("shows the company name in a contentinfo landmark", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Wingate Associates LLC");
  });

  it("links to LinkedIn and shows no direct contact details", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/nathancastaldi",
    );
    expect(screen.getByRole("contentinfo")).not.toHaveTextContent("@");
  });
});
