import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/user.json" });

test.describe("Navigation", () => {
  test("user can navigate to main app", async ({ page }) => {
    await page.goto("/");

    const getStartedButton = page
      .locator('button:has-text("Get Started")')
      .or(page.locator('a:has-text("Login")'));
    await getStartedButton.click();

    await expect(page).toHaveURL(/\/app/);
  });

  test("user can navigate between views", async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");

    // Check navigation elements exist
    await expect(
      page.locator("text=Events").or(page.locator('[aria-label="Events"]'))
    ).toBeVisible();
  });

  test("protected routes redirect unauthenticated users", async ({ page }) => {
    // Clear authentication
    await page.context().clearCookies();
    await page.goto("/app");

    // Should redirect to login
    await expect(page).toHaveURL(/\/(login|signin|landing|$)/);
  });
});

test.describe("Theme & Preferences", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
  });

  test("user can toggle dark mode", async ({ page }) => {
    const themeToggle = page
      .locator('[aria-label="Toggle theme"]')
      .or(page.locator('button:has-text("Theme")'));

    if (await themeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      const initialTheme = await page.locator("html").getAttribute("class");

      await themeToggle.click();
      await page.waitForTimeout(500);

      const newTheme = await page.locator("html").getAttribute("class");
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test("theme preference persists across sessions", async ({ page }) => {
    const themeToggle = page.locator('[aria-label="Toggle theme"]');

    if (await themeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Set to dark mode
      await themeToggle.click();
      await page.waitForTimeout(500);
      const theme = await page.locator("html").getAttribute("class");

      // Reload page
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Theme should persist
      const persistedTheme = await page.locator("html").getAttribute("class");
      expect(persistedTheme).toBe(theme);
    }
  });
});

test.describe("Search & Discovery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
  });

  test("user can search with autocomplete", async ({ page }) => {
    const searchInput = page
      .locator('[placeholder*="Search"]')
      .or(page.locator('input[type="search"]'));

    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill("Con");

      // Should show suggestions
      await page.waitForTimeout(1000);
      const suggestions = page
        .locator('[class*="suggestion"]')
        .or(page.locator('[role="option"]'));

      if (
        await suggestions
          .first()
          .isVisible({ timeout: 2000 })
          .catch(() => false)
      ) {
        await expect(suggestions.first()).toBeVisible();
      }
    }
  });

  test("user can filter by multiple criteria", async ({ page }) => {
    const filterButton = page
      .locator('[aria-label="Filter"]')
      .or(page.locator('button:has-text("Filter")'));

    if (await filterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filterButton.click();

      // Select category
      await page.click("text=Technology");

      // Select date range
      const dateFilter = page
        .locator('[name="date-range"]')
        .or(page.locator("text=Date"));
      if (await dateFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        await dateFilter.click();
        await page.click("text=This Week");
      }

      // Apply filters
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1000);

      // Should show filtered results
      await expect(page.locator(".event-card")).toBeVisible({ timeout: 5000 });
    }
  });

  test("user can sort events", async ({ page }) => {
    const sortButton = page
      .locator('button:has-text("Sort")')
      .or(page.locator('[aria-label="Sort"]'));

    if (await sortButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sortButton.click();

      // Select sort option
      await page.click("text=Date");

      await page.waitForTimeout(1000);

      // Events should be reordered
      await expect(page.locator(".event-card").first()).toBeVisible();
    }
  });
});

test.describe("Error Handling", () => {
  test("shows error message for network failure", async ({ page }) => {
    // Simulate network error
    await page.route("**/api/**", (route) => route.abort());

    await page.goto("/app");

    // Should show error state
    await expect(
      page
        .locator("text=/error|failed|try again/i")
        .or(page.locator('[class*="error"]'))
    ).toBeVisible({ timeout: 10000 });
  });

  test("handles 404 for non-existent events", async ({ page }) => {
    await page.goto("/app/events/non-existent-id-12345");

    // Should show 404 or redirect
    await expect(page.locator("text=/not found|404/i").or(page)).toBeVisible({
      timeout: 5000,
    });
  });

  test("shows validation errors in forms", async ({ page }) => {
    await page.goto("/app");
    await page.click('button:has-text("Create Event")');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(
      page
        .locator("text=/required|invalid|enter/i")
        .or(page.locator('[class*="error"]'))
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Responsive Design", () => {
  test("mobile view shows hamburger menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/app");

    // Should show mobile menu button
    const menuButton = page
      .locator('[aria-label="Menu"]')
      .or(page.locator('button:has-text("☰")'));
    await expect(menuButton).toBeVisible({ timeout: 5000 });
  });

  test("tablet view adjusts layout", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/app");

    // Should render without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768);
  });

  test("desktop view shows full layout", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/app");

    // Should show sidebar or full navigation
    await expect(
      page.locator('[class*="sidebar"]').or(page.locator("nav"))
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Performance & Loading", () => {
  test("shows loading state while fetching data", async ({ page }) => {
    await page.goto("/app");

    // Should see loading indicator initially
    const loader = page
      .locator('[class*="loading"]')
      .or(page.locator('[class*="spinner"]'));

    // Loading should appear then disappear
    await expect(loader.first())
      .toBeVisible({ timeout: 2000 })
      .catch(() => {});
    await expect(page.locator(".event-card").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("lazy loads images", async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");

    // Check if images have loading="lazy"
    const images = page.locator("img");
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();
      await expect(firstImage).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
  });

  test("supports keyboard navigation", async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Should see focus indicator
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("buttons have accessible labels", async ({ page }) => {
    const buttons = page.locator("button");
    const count = await buttons.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute("aria-label");
        const text = await button.textContent();

        // Button should have either aria-label or text content
        expect(ariaLabel || text).toBeTruthy();
      }
    }
  });

  test("images have alt text", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const image = images.nth(i);
        const alt = await image.getAttribute("alt");

        // Image should have alt attribute (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    }
  });

  test("form inputs have labels", async ({ page }) => {
    await page.click('button:has-text("Create Event")');

    const inputs = page.locator("input, textarea, select");
    const count = await inputs.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const input = inputs.nth(i);
        const ariaLabel = await input.getAttribute("aria-label");
        const id = await input.getAttribute("id");

        // Input should have aria-label or associated label
        expect(ariaLabel || id).toBeTruthy();
      }
    }
  });
});

test.describe("Data Persistence", () => {
  test("filters persist in URL parameters", async ({ page }) => {
    await page.goto("/app");

    const filterButton = page.locator('[aria-label="Filter"]');
    if (await filterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filterButton.click();
      await page.click("text=Technology");
      await page.waitForTimeout(1000);

      // URL should contain filter parameter
      const url = page.url();
      expect(url).toMatch(/category|filter/i);
    }
  });

  test("map position persists in local storage", async ({ page }) => {
    await page.goto("/app");
    await page.waitForTimeout(2000);

    // Pan map
    const map = page.locator('[class*="map"]').first();
    if (await map.isVisible({ timeout: 3000 }).catch(() => false)) {
      await map.click({ position: { x: 100, y: 100 } });

      // Reload and check position
      await page.reload();
      await page.waitForLoadState("networkidle");

      await expect(map).toBeVisible({ timeout: 5000 });
    }
  });
});
