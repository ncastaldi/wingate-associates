import type { Metadata } from "next";
import { connection } from "next/server";
import { BookingPanel } from "@/components/booking-panel";
import { ContactForm } from "@/components/contact-form";
import { getBookingUrl } from "@/lib/booking";
import { pageMetadata } from "@/lib/page-metadata";
import { submitLead } from "./actions";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Tell me what’s broken. I’ll reply by email.",
  path: "/contact",
});

export default async function ContactPage() {
  // BOOKING_URL is a runtime setting, so render per request rather than at build.
  await connection();
  const bookingUrl = getBookingUrl();

  return (
    <main>
      <header>
        <h1>Contact</h1>
        <p>Tell me what’s broken and what you’ve tried so far. I’ll reply by email.</p>
      </header>
      <div data-split>
        <section aria-label="Contact form">
          <ContactForm action={submitLead} />
        </section>
        <BookingPanel bookingUrl={bookingUrl} />
      </div>
    </main>
  );
}
