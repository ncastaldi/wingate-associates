import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/lead-schema";

const valid = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" };

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    expect(leadSchema.parse(valid)).toEqual(valid);
  });

  it("trims surrounding whitespace", () => {
    expect(
      leadSchema.parse({ name: "  Ada  ", email: " ada@example.com ", message: "  Hi \n" }),
    ).toEqual({ name: "Ada", email: "ada@example.com", message: "Hi" });
  });

  it.each(["name", "email", "message"] as const)("rejects an empty or blank %s", (field) => {
    const result = leadSchema.safeParse({ ...valid, [field]: "   " });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([field]);
  });

  it("rejects a malformed email", () => {
    const result = leadSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["email"]);
  });

  it("rejects over-long fields", () => {
    expect(leadSchema.safeParse({ ...valid, name: "a".repeat(201) }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, message: "a".repeat(5001) }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, message: "a".repeat(5000) }).success).toBe(true);
  });

  it("rejects missing or non-string values", () => {
    expect(leadSchema.safeParse({ name: "Ada" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, name: null }).success).toBe(false);
  });
});
