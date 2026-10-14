import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata: Metadata = {
  title: "Services | Wingate Associates",
  description: "What Wingate Associates offers and how engagements work.",
};

export default function ServicesPage() {
  return (
    <main>
      <h1>Services</h1>
      <PlaceholderNotice />

      <section aria-labelledby="services-heading">
        <h2 id="services-heading">What I do</h2>
        <ul>
          <li>
            <h3>Service one</h3>
            <p>A short description of the service and the problem it solves.</p>
          </li>
          <li>
            <h3>Service two</h3>
            <p>A short description of the service and the problem it solves.</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="engagement-heading">
        <h2 id="engagement-heading">How we work together</h2>
        <ul>
          <li>
            <h3>Engagement model one</h3>
            <p>When it fits, what the client gets, and how it is priced.</p>
          </li>
          <li>
            <h3>Engagement model two</h3>
            <p>When it fits, what the client gets, and how it is priced.</p>
          </li>
        </ul>
      </section>

      <p>
        <Link href="/contact">Tell me about your project</Link>
      </p>
    </main>
  );
}
