import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("user can navigate to sign up page", async ({ page }) => {
    await page.click("text=Sign Up Free");
    await expect(page).toHaveURL(/.*signup/);
  });

  test("user can sign up with valid credentials", async ({ page }) => {
    await page.goto("/signup");

    const uniqueEmail = `user${Date.now()}@example.com`;
    await page.fill('[name="email"]', uniqueEmail);
    await page.fill('[name="password"]', "SecurePass123!");
    await page.fill('[name="name"]', "Test User");

    await page.click('button[type="submit"]');

    // Should redirect to main app
    await expect(page).toHaveURL(/.*app/, { timeout: 10000 });

    // Should see welcome or user name
    await expect(
      page.locator("text=Welcome").or(page.locator(`text=${uniqueEmail}`))
    ).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[name="email"]', "invalid-email");
    await page.fill('[name="password"]', "SecurePass123!");
    await page.fill('[name="name"]', "Test User");

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid email")).toBeVisible();
  });

  test("shows validation error for weak password", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "123");
    await page.fill('[name="name"]', "Test User");

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Password must be at least")).toBeVisible();
  });

  test("user can sign in with existing account", async ({ page }) => {
    await page.goto("/signin");

    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "TestPassword123!");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*app/, { timeout: 10000 });
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/signin");

    await page.fill('[name="email"]', "wrong@example.com");
    await page.fill('[name="password"]', "WrongPassword123!");

    await page.click('button[type="submit"]');

    await expect(
      page
        .locator("text=Invalid credentials")
        .or(page.locator("text=Invalid email or password"))
    ).toBeVisible();
  });

  test("user can toggle password visibility", async ({ page }) => {
    await page.goto("/signin");

    const passwordInput = page.locator('[name="password"]');
    const toggleButton = page.locator(
      '[aria-label="Toggle password visibility"]'
    );

    await expect(passwordInput).toHaveAttribute("type", "password");

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("user can navigate between sign in and sign up", async ({ page }) => {
    await page.goto("/signin");

    await page.click("text=Sign up");
    await expect(page).toHaveURL(/.*signup/);

    await page.click("text=Sign in");
    await expect(page).toHaveURL(/.*signin/);
  });

  test("authenticated user can sign out", async ({ page, context }) => {
    // First sign in
    await page.goto("/signin");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "TestPassword123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*app/);

    // Then sign out
    await page.click('[aria-label="User menu"]');
    await page.click("text=Sign out");

    // Should redirect to landing or signin
    await expect(page).toHaveURL(/.*\/(signin|$)/);

    // Should not be able to access app
    await page.goto("/app");
    await expect(page).toHaveURL(/.*signin/);
  });

  test("remember me checkbox persists session", async ({ page, context }) => {
    await page.goto("/signin");

    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "TestPassword123!");
    await page.check('[name="remember"]');

    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*app/);

    // Close and reopen browser
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto("/app");

    // Should still be authenticated
    await expect(newPage).toHaveURL(/.*app/);
  });

  test("shows loading state during authentication", async ({ page }) => {
    await page.goto("/signin");

    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "TestPassword123!");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show loading state
    await expect(submitButton).toBeDisabled();
    await expect(
      submitButton.or(page.locator('[aria-label="Loading"]'))
    ).toBeVisible();
  });

  test("redirects to app if already authenticated", async ({
    page,
    context,
  }) => {
    // First sign in
    await page.goto("/signin");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "TestPassword123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*app/);

    // Try to access signin page
    await page.goto("/signin");

    // Should redirect to app
    await expect(page).toHaveURL(/.*app/);
  });

  test("protects authenticated routes", async ({ page }) => {
    // Try to access app without authentication
    await page.goto("/app");

    // Should redirect to signin
    await expect(page).toHaveURL(/.*signin/);
  });
});
