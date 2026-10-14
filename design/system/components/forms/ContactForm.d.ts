/**
 * The contact form: Name, Email, Message, all required. Handles field errors, sending, success and form-level errors.
 * @startingPoint section="Forms" subtitle="Contact form with all states" viewport="700x620"
 */
export interface ContactFormProps {
  /** Initial or forced state, mainly for previews. */
  state?: 'idle' | 'invalid' | 'sending' | 'success' | 'error' | 'ratelimit';
  fieldErrors?: { name?: string; email?: string; message?: string };
  /** Return 'error' or 'ratelimit' to show the form-level message. */
  onSubmit?: (values: { name: string; email: string; message: string }) => Promise<string | void> | string | void;
}
export declare function ContactForm(props: ContactFormProps): JSX.Element;
