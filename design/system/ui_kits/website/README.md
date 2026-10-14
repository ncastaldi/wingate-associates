# Website UI kit

Plain HTML versions of the three pages, using only `../../styles.css`. This is the markup to copy into Next.js.

- `index.html`: Home
- `services.html`: Services
- `contact.html`: Contact. The form validates and fakes sending. Type "fail" or "limit" in the message to see the form-level errors.
- `pages.html`: all three at 1280px and 375px, light and dark.

`preview.js` and `../../preview/theme.css` are preview-only: `?theme=light|dark` forces a scheme, `?state=invalid|sending|success|error|ratelimit` sets the form state. Don't ship them.
