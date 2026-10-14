import React from 'react';

export function SiteFooter({ year = 2026, linkedInHref = 'https://www.linkedin.com/in/nathancastaldi' }) {
  return (
    <footer role="contentinfo">
      <p>
        <span>© {year} Wingate Associates LLC</span>
        <span aria-hidden="true">·</span>
        <a href={linkedInHref}>LinkedIn</a>
      </p>
    </footer>
  );
}
