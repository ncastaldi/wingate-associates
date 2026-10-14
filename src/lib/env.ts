import { z } from "zod";

// Validated in two halves so a bad email setting cannot stop leads being stored:
// the database needs only DATABASE_URL, and only the notification needs the rest.
const dbEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
});

const emailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_TO_EMAIL: z.string().email(),
  CONTACT_FROM_EMAIL: z.string().min(1),
});

export type DbEnv = z.infer<typeof dbEnvSchema>;
export type EmailEnv = z.infer<typeof emailEnvSchema>;

type Source = Record<string, string | undefined>;

function parse<T>(schema: z.ZodType<T>, source: Source): T {
  const result = schema.safeParse(source);
  if (!result.success) {
    const names = [...new Set(result.error.issues.map((issue) => issue.path.join(".")))];
    throw new Error(`Invalid or missing environment variables: ${names.join(", ")}`);
  }
  return result.data;
}

export const parseDbEnv = (source: Source): DbEnv => parse(dbEnvSchema, source);
export const parseEmailEnv = (source: Source): EmailEnv => parse(emailEnvSchema, source);

let dbEnv: DbEnv | undefined;
let emailEnv: EmailEnv | undefined;

// Parsed on first use, not at import, so `next build` and the image build need no secrets.
export function getDbEnv(): DbEnv {
  dbEnv ??= parseDbEnv(process.env);
  return dbEnv;
}

export function getEmailEnv(): EmailEnv {
  emailEnv ??= parseEmailEnv(process.env);
  return emailEnv;
}
