import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/page-metadata";
import { submitLead } from "./actions";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Tell me what’s broken. I’ll reply by email.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <header>
        <h1>Contact</h1>
        <p>Tell me what’s broken and what you’ve tried so far. I’ll reply by email.</p>
      </header>
      <section aria-label="Contact form">
        <ContactForm action={submitLead} />
      </section>
    </main>
  );
}
