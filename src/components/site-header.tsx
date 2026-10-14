import Link from "next/link";

export function SiteHeader() {
  return (
    <header>
      <Link href="/">Wingate Associates</Link>
      <nav aria-label="Main">
        <ul>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
