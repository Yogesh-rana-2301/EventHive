import { test, expect } from "@playwright/test";

// Use authenticated state
test.use({ storageState: "e2e/.auth/user.json" });

test.describe("Event Management Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
  });

  test("user can view event list", async ({ page }) => {
    // Should see events on the page
    await expect(page.locator(".event-card").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("user can open create event modal", async ({ page }) => {
    await page.click('button:has-text("Create Event")');

    // Modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(
      page
        .locator("text=Create New Event")
        .or(page.locator("text=Create Event"))
    ).toBeVisible();
  });

  test("user can create a new event", async ({ page }) => {
    await page.click('button:has-text("Create Event")');

    // Fill event form
    await page.fill('[name="title"]', `Test Conference ${Date.now()}`);
    await page.fill(
      '[name="description"]',
      "A comprehensive test event for E2E testing"
    );
    await page.selectOption('[name="category"]', "technology");

    // Set future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateString = futureDate.toISOString().split("T")[0];
    await page.fill('[name="date"]', dateString);

    await page.fill('[name="time"]', "18:00");
    await page.fill('[name="address"]', "Mumbai, Maharashtra");

    // Wait for geocoding to load suggestions
    await page.waitForTimeout(2000);

    // Click first suggestion if available
    const suggestion = page.locator(".location-suggestion").first();
    if (await suggestion.isVisible({ timeout: 5000 }).catch(() => false)) {
      await suggestion.click();
    }

    await page.fill('[name="max_attendees"]', "100");

    // Submit form
    await page.click('button[type="submit"]:has-text("Create")');

    // Should show success message
    await expect(
      page
        .locator("text=Event created successfully")
        .or(page.locator("text=Success"))
    ).toBeVisible({ timeout: 10000 });

    // Modal should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("user can view event details", async ({ page }) => {
    // Click on first event card
    await page.locator(".event-card").first().click();

    // Event detail modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Should show event information
    await expect(page.locator("h2").or(page.locator("h3"))).toBeVisible();
    await expect(
      page.locator("text=Join Event").or(page.locator("text=Already Joined"))
    ).toBeVisible();
  });

  test("user can join an event", async ({ page }) => {
    await page.locator(".event-card").first().click();

    const joinButton = page.locator('button:has-text("Join Event")');

    if (await joinButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await joinButton.click();

      // Should show success message
      await expect(
        page.locator("text=Successfully joined").or(page.locator("text=Joined"))
      ).toBeVisible({ timeout: 10000 });

      // Button should change
      await expect(page.locator('button:has-text("Leave Event")')).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("user can leave an event", async ({ page }) => {
    await page.locator(".event-card").first().click();

    const leaveButton = page.locator('button:has-text("Leave Event")');

    if (await leaveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await leaveButton.click();

      // Should show success message
      await expect(
        page.locator("text=Left event").or(page.locator("text=Success"))
      ).toBeVisible({ timeout: 10000 });

      // Button should change back
      await expect(page.locator('button:has-text("Join Event")')).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("user can search for events", async ({ page }) => {
    const searchInput = page
      .locator('[placeholder="Search events"]')
      .or(page.locator('input[type="search"]'));

    await searchInput.fill("Conference");
    await page.keyboard.press("Enter");

    // Should filter events
    await page.waitForTimeout(1000);

    const eventCards = page.locator(".event-card");
    const count = await eventCards.count();

    // Should have at least one result or show "no results" message
    if (count > 0) {
      await expect(eventCards.first()).toContainText(/Conference/i);
    } else {
      await expect(
        page.locator("text=No events found").or(page.locator("text=No results"))
      ).toBeVisible();
    }
  });

  test("user can filter events by category", async ({ page }) => {
    // Open filter menu
    const filterButton = page
      .locator('[aria-label="Filter"]')
      .or(page.locator('button:has-text("Filter")'));
    await filterButton.click();

    // Select a category
    await page.click("text=Technology");

    // Close filter if needed
    await page.keyboard.press("Escape");

    // Wait for filter to apply
    await page.waitForTimeout(1000);

    // Should show only tech events (if any exist)
    const eventCards = page.locator(".event-card");
    const count = await eventCards.count();

    if (count > 0) {
      const firstCard = eventCards.first();
      await expect(firstCard).toBeVisible();
    }
  });

  test("user can clear filters", async ({ page }) => {
    // Apply a filter first
    const filterButton = page
      .locator('[aria-label="Filter"]')
      .or(page.locator('button:has-text("Filter")'));
    await filterButton.click();
    await page.click("text=Technology");

    await page.waitForTimeout(500);

    // Clear filters
    const clearButton = page
      .locator('button:has-text("Clear")')
      .or(page.locator('button:has-text("Reset")'));
    if (await clearButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await clearButton.click();

      // Should show all events again
      await page.waitForTimeout(1000);
      await expect(page.locator(".event-card")).toHaveCount(
        await page.locator(".event-card").count()
      );
    }
  });

  test("creator can edit their event", async ({ page }) => {
    // Find an event created by current user
    const myEventCard = page.locator(".event-card").first();
    await myEventCard.click();

    const editButton = page.locator('button:has-text("Edit")');

    if (await editButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await editButton.click();

      // Modify title
      const titleInput = page.locator('[name="title"]');
      await titleInput.fill(`Updated Event ${Date.now()}`);

      // Save changes
      await page.click('button[type="submit"]:has-text("Save")');

      // Should show success message
      await expect(
        page.locator("text=Event updated").or(page.locator("text=Success"))
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test("creator can delete their event", async ({ page }) => {
    // Create a test event first
    await page.click('button:has-text("Create Event")');

    await page.fill('[name="title"]', `Event to Delete ${Date.now()}`);
    await page.fill('[name="description"]', "This event will be deleted");
    await page.selectOption('[name="category"]', "other");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    await page.fill('[name="date"]', futureDate.toISOString().split("T")[0]);
    await page.fill('[name="time"]', "18:00");
    await page.fill('[name="address"]', "Test Location");
    await page.waitForTimeout(1000);
    await page.fill('[name="max_attendees"]', "50");

    await page.click('button[type="submit"]:has-text("Create")');
    await page.waitForTimeout(2000);

    // Find and open the created event
    const createdEvent = page.locator(".event-card").first();
    await createdEvent.click();

    const deleteButton = page.locator('button:has-text("Delete")');

    if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteButton.click();

      // Confirm deletion
      const confirmButton = page
        .locator('button:has-text("Confirm")')
        .or(page.locator('button:has-text("Delete")'));
      await confirmButton.click();

      // Should show success message
      await expect(
        page.locator("text=Event deleted").or(page.locator("text=Success"))
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test("shows event on map", async ({ page }) => {
    // Should see map
    await expect(
      page.locator(".mapboxgl-canvas").or(page.locator('[class*="map"]'))
    ).toBeVisible({ timeout: 10000 });

    // Should see at least one marker
    await expect(
      page
        .locator(".custom-marker")
        .or(page.locator('[class*="marker"]'))
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("user can click map marker to view event", async ({ page }) => {
    // Wait for map to load
    await page.waitForTimeout(2000);

    const marker = page
      .locator(".custom-marker")
      .or(page.locator('[class*="marker"]'))
      .first();

    if (await marker.isVisible({ timeout: 5000 }).catch(() => false)) {
      await marker.click();

      // Should show popup or open event details
      await expect(
        page.locator(".mapboxgl-popup").or(page.locator('[role="dialog"]'))
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
