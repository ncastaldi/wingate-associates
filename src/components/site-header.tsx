import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header>
      <Link href="/">
        {/* Decorative: the link's accessible name is the text beside it. */}
        <Image src="/logo-mark.png" alt="" width={36} height={36} priority unoptimized />
        Wingate Associates
      </Link>
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
