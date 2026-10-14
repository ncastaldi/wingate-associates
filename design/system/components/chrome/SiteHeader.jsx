import React from 'react';

const DEFAULT_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader({ current, homeHref = '/', links = DEFAULT_LINKS, markSrc = '/logo-mark.png', markDarkSrc = '/logo-mark-badge.png' }) {
  return (
    <header role="banner">
      <a href={homeHref}>
        <picture>
          {markDarkSrc ? <source media="(prefers-color-scheme: dark)" srcSet={markDarkSrc} /> : null}
          <img src={markSrc} alt="" width={32} height={32} />
        </picture>
        Wingate Associates
      </a>
      <nav aria-label="Main">
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} aria-current={current === l.label ? 'page' : undefined}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
