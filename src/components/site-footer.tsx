// No direct contact details here by design: enquiries go through the contact form.
export const LINKEDIN_URL = "https://www.linkedin.com/in/nathancastaldi";

export function SiteFooter() {
  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} Wingate Associates LLC ·{" "}
        <a href={LINKEDIN_URL}>LinkedIn</a>
      </p>
    </footer>
  );
}
