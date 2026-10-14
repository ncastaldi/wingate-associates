Primary and secondary actions with the arrow treatment; use for calls to action and form submit.

```jsx
<Button href="/contact">Tell me what’s broken</Button>
<Button variant="secondary" href="/services">See services</Button>
<Button type="submit" disabled busy>Sending…</Button>
```

- One primary per view. Primary is navy in light, teal in dark.
- The arrow nudges 3px on hover. Disabled buttons drop the arrow.
- Plain HTML: `<a data-button="primary">`, or `<button type="submit">` (primary by default).
