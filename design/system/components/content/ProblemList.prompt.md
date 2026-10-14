Numbered queue rows for a list of problems or symptoms; use for the home page “What that tends to look like” list.

```jsx
<ProblemList items={['Tickets sit for days and nobody can say why.', 'Nobody is sure who has access to what.']} />
```

- Rows fill column one first, then column two (3 + 2 for five items).
- `status` adds a dot at the row end. Leave it off unless the row has a real state.
- Plain HTML: `<ul data-list="queue">`.
