import { expect, test } from "@playwright/test";

// These cover the paths that need neither Postgres nor Resend. A real submission
// stores a lead and sends email, so it belongs in a test with throwaway services.

test.beforeEach(async ({ page }) => {
  await page.goto("/contact");
  // Submitting before hydration would fall back to a native GET, so wait for the network to settle.
  await page.waitForLoadState("networkidle");
});

test("shows a field error for each invalid field and keeps what was typed", async ({ page }) => {
  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Enter a valid email")).toBeVisible();
  await expect(page.getByText("Enter a message")).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("Ada Lovelace");
  await expect(page.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
});

test("reports success for a filled honeypot without needing the database", async ({ page }) => {
  await page.getByLabel("Name").fill("Bot");
  await page.getByLabel("Email").fill("bot@example.com");
  await page.getByLabel("Message").fill("buy now");
  await page.locator("#website").fill("https://spam.example");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toContainText("Thanks, your message is on its way");
});
