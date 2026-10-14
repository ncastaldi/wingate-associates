Site header with the Wingate mark, name and the two-link main nav; use once at the top of every page.

```jsx
<SiteHeader current="Services" markSrc="/logo-mark.png" markDarkSrc="/logo-mark-badge.png" />
```

- `current` sets `aria-current="page"`, drawn as a 2px teal underline.
- Below 480px the nav moves to a full-width second row. No menu button: two links don't need one.
- In plain HTML, a `<header>` that is a direct child of `<body>` gets the same styles.
