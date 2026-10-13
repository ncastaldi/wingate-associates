"use client";

import { useActionState } from "react";
import { HONEYPOT_FIELD } from "@/lib/lead-schema";
import type { SubmitLeadResult } from "@/app/contact/actions";

type ContactFormProps = {
  action: (formData: FormData) => Promise<SubmitLeadResult>;
};

type FormState = {
  result: SubmitLeadResult | null;
  // Kept so a failed submit does not wipe what the visitor typed (React resets the form).
  values: { name: string; email: string; message: string };
};

const initialState: FormState = { result: null, values: { name: "", email: "", message: "" } };

const offscreen = { position: "absolute", left: "-10000px" } as const;

export function ContactForm({ action }: ContactFormProps) {
  const [state, submit, pending] = useActionState(
    async (_previous: FormState, formData: FormData): Promise<FormState> => ({
      result: await action(formData),
      values: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
      },
    }),
    initialState,
  );

  const { result, values } = state;
  if (result?.ok) {
    return <p role="status">Thanks, your message is on its way. I will reply by email.</p>;
  }

  const fieldErrors = result?.fieldErrors ?? {};
  const formError = result?.formError;

  return (
    <form action={submit} noValidate>
      {formError ? <p role="alert">{formError}</p> : null}

      <Field
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        errors={fieldErrors.name}
        defaultValue={values.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        errors={fieldErrors.email}
        defaultValue={values.email}
      />
      <Field
        label="Message"
        name="message"
        multiline
        errors={fieldErrors.message}
        defaultValue={values.message}
      />

      <div style={offscreen} aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email";
  autoComplete?: string;
  multiline?: boolean;
  errors: string[] | undefined;
  defaultValue: string;
};

function Field({ label, name, type, autoComplete, multiline, errors, defaultValue }: FieldProps) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    defaultValue,
    "aria-invalid": errors ? true : undefined,
    "aria-describedby": errors ? errorId : undefined,
  };

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {multiline ? (
        <textarea {...shared} rows={6} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}
      {errors ? <p id={errorId}>{errors[0]}</p> : null}
    </div>
  );
}
