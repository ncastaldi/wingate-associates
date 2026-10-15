"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Client component only so the current page's link can carry aria-current,
// which the stylesheet underlines.
export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main">
      <ul>
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} aria-current={pathname === href ? "page" : undefined}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
