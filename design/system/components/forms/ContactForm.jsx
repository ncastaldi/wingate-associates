import React from 'react';
import { Field } from './Field.jsx';

const ERR = { name: 'Enter your name', email: 'Enter a valid email', message: 'Enter a message' };
const FORM_ERR = {
  error: 'Something went wrong. Please try again.',
  ratelimit: 'Too many messages have been sent recently. Please try again in an hour.',
};

export function ContactForm({ state = 'idle', fieldErrors, onSubmit }) {
  const [s, setS] = React.useState(state);
  const [errs, setErrs] = React.useState(fieldErrors || (state === 'invalid' ? ERR : {}));
  React.useEffect(() => { setS(state); setErrs(fieldErrors || (state === 'invalid' ? ERR : {})); }, [state, fieldErrors]);

  if (s === 'success') return <p role="status">Thanks, your message is on its way. I will reply by email.</p>;

  const submit = (e) => {
    e.preventDefault();
    const f = e.currentTarget.elements;
    const next = {};
    if (!f.name.value.trim()) next.name = ERR.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) next.email = ERR.email;
    if (!f.message.value.trim()) next.message = ERR.message;
    setErrs(next);
    if (Object.keys(next).length) return;
    setS('sending');
    Promise.resolve(onSubmit ? onSubmit({ name: f.name.value, email: f.email.value, message: f.message.value }) : 'success')
      .then((r) => setS(r === 'error' || r === 'ratelimit' ? r : 'success'))
      .catch(() => setS('error'));
  };

  const sending = s === 'sending';
  return (
    <form noValidate onSubmit={submit}>
      {FORM_ERR[s] ? <p role="alert">{FORM_ERR[s]}</p> : null}
      <Field label="Name" name="name" autoComplete="name" error={errs.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" error={errs.email} />
      <Field label="Message" name="message" multiline error={errs.message} />
      <button type="submit" disabled={sending} aria-busy={sending ? 'true' : undefined}>
        {sending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
