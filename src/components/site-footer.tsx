// No direct contact details here by design: enquiries go through the contact form.
export const LINKEDIN_URL = "https://www.linkedin.com/in/nathancastaldi";

export function SiteFooter() {
  return (
    <footer>
      <p>
        <span>&copy; {new Date().getFullYear()} Wingate Associates LLC</span>
        <span aria-hidden="true">·</span>
        <a href={LINKEDIN_URL}>LinkedIn</a>
      </p>
    </footer>
  );
}
