Cards for services and recent work; use when each item has a title and a short paragraph.

```jsx
<CardList cards={[
  { title: 'Nexus', body: 'An MCP server I built in Python…' },
  { title: 'Jobsquatch', href: 'https://jobsquatch.us', body: 'A text-based interview…' },
]} />
```

- Linked title stays underlined. Hover raises the card; focus rings the whole card.
- Off-site links get the small external arrow automatically.
- `stat` places a StatCallout at the card foot.
