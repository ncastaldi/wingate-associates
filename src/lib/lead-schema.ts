import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(200, "Name is too long"),
  email: z.string().trim().max(254, "Email is too long").pipe(z.email("Enter a valid email")),
  message: z.string().trim().min(1, "Enter a message").max(5000, "Message is too long"),
});

export type LeadInput = z.infer<typeof leadSchema>;
