The contact form with every state; use on the Contact page, and nowhere else needs a way in.

```jsx
<ContactForm onSubmit={async (v) => (await send(v)).ok ? 'success' : 'error'} />
<ContactForm state="ratelimit" />
```

- Copy is fixed: “Send message”, “Sending…”, the success line, the two form-level errors, and the three field errors.
- Form-level errors render as `role="alert"` at the top; success replaces the form with `role="status"`.
- Keep the honeypot field from the repo’s contact-form.tsx when wiring it up.
