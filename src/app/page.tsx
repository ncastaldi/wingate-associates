import Link from "next/link";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export default function HomePage() {
  return (
    <main>
      <h1>Wingate Associates</h1>
      <PlaceholderNotice />
      <p>
        Independent consulting practice. One sentence on what Wingate Associates does goes here.
      </p>
      <p>
        One or two sentences on who the practice works with and the outcome clients can expect go
        here.
      </p>
      <p>
        <Link href="/services">See services and how to work together</Link>
      </p>
      <p>
        <Link href="/contact">Get in touch</Link>
      </p>
    </main>
  );
}
