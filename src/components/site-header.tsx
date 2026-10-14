import Link from "next/link";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  return (
    <header>
      <Link href="/">
        {/* Decorative: the link's accessible name is the text beside it. The navy mark
            disappears on the dark background, so dark mode swaps in the mark on a paper disc. */}
        <picture>
          <source media="(prefers-color-scheme: dark)" srcSet="/logo-mark-badge.png" />
          {/* A plain img: next/image cannot switch sources by colour scheme. */}
          <img src="/logo-mark.png" alt="" width={32} height={32} />
        </picture>
        Wingate Associates
      </Link>
      <SiteNav />
    </header>
  );
}
