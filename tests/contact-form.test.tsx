import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact-form";
import type { SubmitLeadResult } from "@/app/contact/actions";

function setup(result: SubmitLeadResult) {
  const action = vi.fn<(formData: FormData) => Promise<SubmitLeadResult>>(async () => result);
  render(<ContactForm action={action} />);
  return action;
}

function fill(name: string, email: string, message: string) {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: message } });
}

describe("ContactForm", () => {
  it("renders labelled name, email and message fields and a submit button", () => {
    setup({ ok: true });
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
  });

  it("hides the honeypot from assistive tech and keyboard users", () => {
    setup({ ok: true });
    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot?.tabIndex).toBe(-1);
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("submits the typed values to the action", async () => {
    const action = setup({ ok: true });
    fill("Ada", "ada@example.com", "Hello there");
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const sent = action.mock.calls[0]![0];
    expect(sent.get("name")).toBe("Ada");
    expect(sent.get("email")).toBe("ada@example.com");
    expect(sent.get("message")).toBe("Hello there");
    expect(sent.get("website")).toBe("");
  });

  it("replaces the form with a confirmation on success", async () => {
    setup({ ok: true });
    fill("Ada", "ada@example.com", "Hello there");
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Thanks");
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });

  it("shows field errors tied to their inputs and keeps what was typed", async () => {
    setup({ ok: false, fieldErrors: { email: ["Enter a valid email"] } });
    fill("Ada", "nope", "Hello there");
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    const email = await screen.findByLabelText("Email");
    await waitFor(() => expect(email).toHaveAttribute("aria-invalid", "true"));
    expect(email).toHaveAccessibleDescription("Enter a valid email");
    expect(screen.getByLabelText("Name")).toHaveValue("Ada");
    expect(screen.getByLabelText("Email")).toHaveValue("nope");
    expect(screen.getByLabelText("Message")).toHaveValue("Hello there");
  });

  it("shows a form-level error as an alert", async () => {
    setup({ ok: false, formError: "Something went wrong. Please try again." });
    fill("Ada", "ada@example.com", "Hello there");
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong");
  });
});
