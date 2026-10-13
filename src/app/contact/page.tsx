import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { submitLead } from "./actions";

export const metadata: Metadata = {
  title: "Contact | Wingate Associates",
  description: "Get in touch about a consulting engagement.",
};

export default function ContactPage() {
  return (
    <main>
      <h1>Contact</h1>
      <p>Tell me a little about what you are working on and I will reply by email.</p>
      <ContactForm action={submitLead} />
    </main>
  );
}
