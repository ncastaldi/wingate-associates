import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "I’m Nathan Castaldi. I’ve spent 15 years in IT operations. I’m based in Atlanta and work on-site around the metro and remotely anywhere.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <header>
        <h1>About me</h1>
        <p>
          I’m Nathan Castaldi. I’ve spent 15 years in IT operations. Most recently I led a desk-side
          support team of seven across Atlanta and Chicago for a fleet-leasing company.
        </p>
      </header>

      <section aria-label="Background">
        <p>
          Before that I ran IT operations for a global advertising group, first in London and then
          in Atlanta. I was the layer between IBM’s managed service and 12 local business units.
        </p>
        <p>
          I’m based in Atlanta. I work on-site around the metro and remotely anywhere, and I’ll
          travel for the right project.
        </p>
        <p>
          I take on consulting projects and contract roles. I’m open to the right full-time role
          too.
        </p>
        <p>
          <Link data-button="primary" href="/contact">
            Tell me what’s broken
          </Link>
        </p>
      </section>
    </main>
  );
}
