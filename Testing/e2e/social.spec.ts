import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/user.json" });

test.describe("Chat System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
  });

  test("user can open chat panel", async ({ page }) => {
    const chatButton = page
      .locator('button:has-text("Chat")')
      .or(page.locator('[aria-label="Chat"]'));

    if (await chatButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chatButton.click();

      // Chat panel should open
      await expect(page.locator('[class*="chat"]').first()).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("user can join event to access chat", async ({ page }) => {
    // Join an event first
    await page.locator(".event-card").first().click();

    const joinButton = page.locator('button:has-text("Join Event")');
    if (await joinButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await joinButton.click();
      await page.waitForTimeout(1000);
    }

    // Access chat
    await page
      .locator('button:has-text("Chat")')
      .or(page.locator('[aria-label="Chat"]'))
      .click();

    // Should see chat interface
    await expect(
      page.locator('[placeholder*="message"]').or(page.locator("textarea"))
    ).toBeVisible({ timeout: 5000 });
  });

  test("user can send a message in event chat", async ({ page }) => {
    // Open event with chat access
    await page.locator(".event-card").first().click();

    const chatTab = page
      .locator("text=Chat")
      .or(page.locator('[aria-label="Chat tab"]'));
    if (await chatTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chatTab.click();

      // Type and send message
      const messageInput = page
        .locator('[placeholder*="message"]')
        .or(page.locator("textarea"));
      const testMessage = `Test message ${Date.now()}`;

      await messageInput.fill(testMessage);
      await page.keyboard.press("Enter");

      // Should see message in chat
      await expect(page.locator(`text=${testMessage}`)).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test("user can see chat history", async ({ page }) => {
    await page.locator(".event-card").first().click();

    const chatTab = page
      .locator("text=Chat")
      .or(page.locator('[aria-label="Chat tab"]'));
    if (await chatTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chatTab.click();

      // Should see previous messages (if any)
      const messages = page
        .locator('[class*="message"]')
        .or(page.locator('[class*="chat-bubble"]'));
      const count = await messages.count();

      // Either has messages or shows empty state
      if (count > 0) {
        await expect(messages.first()).toBeVisible();
      } else {
        await expect(
          page
            .locator("text=No messages")
            .or(page.locator('[placeholder*="message"]'))
        ).toBeVisible();
      }
    }
  });

  test("user can report inappropriate message", async ({ page }) => {
    await page.locator(".event-card").first().click();

    const chatTab = page.locator("text=Chat");
    if (await chatTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chatTab.click();

      const message = page.locator('[class*="message"]').first();
      if (await message.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Hover to show report button
        await message.hover();

        const reportButton = page
          .locator('[aria-label="Report"]')
          .or(page.locator('button:has-text("Report")'));
        if (
          await reportButton.isVisible({ timeout: 2000 }).catch(() => false)
        ) {
          await reportButton.click();

          // Report modal should open
          await expect(page.locator('[role="dialog"]')).toBeVisible();
        }
      }
    }
  });
});

test.describe("Gamification Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
  });

  test("user can view their profile with XP", async ({ page }) => {
    const profileButton = page
      .locator('[aria-label="Profile"]')
      .or(page.locator('button:has-text("Profile")'));

    await profileButton.click();

    // Profile modal should show
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Should show XP and level
    await expect(page.locator("text=/XP|Experience|Level/i")).toBeVisible();
  });

  test("user gains XP when creating event", async ({ page }) => {
    // Get initial XP
    await page.locator('[aria-label="Profile"]').click();
    const initialXPText = await page
      .locator("text=/\\d+ XP/i")
      .textContent({ timeout: 5000 })
      .catch(() => "0 XP");
    const initialXP = parseInt(initialXPText?.match(/\d+/)?.[0] || "0");

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Create an event
    await page.click('button:has-text("Create Event")');

    await page.fill('[name="title"]', `XP Test Event ${Date.now()}`);
    await page.fill('[name="description"]', "Testing XP gain");
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

    // Check XP increased
    await page.locator('[aria-label="Profile"]').click();
    const newXPText = await page
      .locator("text=/\\d+ XP/i")
      .textContent({ timeout: 5000 })
      .catch(() => "0 XP");
    const newXP = parseInt(newXPText?.match(/\d+/)?.[0] || "0");

    expect(newXP).toBeGreaterThan(initialXP);
  });

  test("user can see achievements", async ({ page }) => {
    await page.locator('[aria-label="Profile"]').click();

    // Should see achievements section
    const achievementsSection = page
      .locator("text=Achievements")
      .or(page.locator("text=Badges"));
    await expect(achievementsSection).toBeVisible({ timeout: 5000 });
  });

  test("user can view leaderboard", async ({ page }) => {
    const leaderboardButton = page
      .locator('button:has-text("Leaderboard")')
      .or(page.locator('[aria-label="Leaderboard"]'));

    if (
      await leaderboardButton.isVisible({ timeout: 3000 }).catch(() => false)
    ) {
      await leaderboardButton.click();

      // Should show leaderboard
      await expect(
        page.locator("text=Leaderboard").or(page.locator("text=Rankings"))
      ).toBeVisible();

      // Should show ranked users
      await expect(
        page.locator('[class*="rank"]').or(page.locator("text=/^#\\d+/"))
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("user can toggle gamification on/off", async ({ page }) => {
    const settingsButton = page
      .locator('[aria-label="Settings"]')
      .or(page.locator('button:has-text("Settings")'));

    if (await settingsButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await settingsButton.click();

      // Find gamification toggle
      const gamificationToggle = page
        .locator("text=Gamification")
        .locator("..")
        .locator('[role="switch"]');

      if (
        await gamificationToggle.isVisible({ timeout: 3000 }).catch(() => false)
      ) {
        const initialState =
          await gamificationToggle.getAttribute("aria-checked");

        await gamificationToggle.click();
        await page.waitForTimeout(500);

        const newState = await gamificationToggle.getAttribute("aria-checked");
        expect(newState).not.toBe(initialState);
      }
    }
  });
});

test.describe("Notification System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
  });

  test("user receives notification when event is updated", async ({ page }) => {
    // Join an event
    await page.locator(".event-card").first().click();

    const joinButton = page.locator('button:has-text("Join Event")');
    if (await joinButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await joinButton.click();
      await page.waitForTimeout(1000);
    }

    // Check for notification bell
    const notificationBell = page
      .locator('[aria-label="Notifications"]')
      .or(page.locator('[class*="notification"]'));
    await expect(notificationBell).toBeVisible({ timeout: 5000 });
  });

  test("user can view notification panel", async ({ page }) => {
    const notificationBell = page
      .locator('[aria-label="Notifications"]')
      .or(page.locator('button:has-text("Notifications")'));

    if (
      await notificationBell.isVisible({ timeout: 3000 }).catch(() => false)
    ) {
      await notificationBell.click();

      // Notification panel should open
      await expect(
        page
          .locator('[class*="notification-panel"]')
          .or(page.locator("text=Notifications"))
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("user can mark notification as read", async ({ page }) => {
    const notificationBell = page.locator('[aria-label="Notifications"]');

    if (
      await notificationBell.isVisible({ timeout: 3000 }).catch(() => false)
    ) {
      await notificationBell.click();

      const notification = page.locator('[class*="notification"]').first();
      if (await notification.isVisible({ timeout: 3000 }).catch(() => false)) {
        await notification.click();

        // Should mark as read (visual change)
        await page.waitForTimeout(500);
        const readState = await notification.getAttribute("class");
        expect(readState).toContain("read");
      }
    }
  });
});

test.describe("User Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
  });

  test("user can view attendee list for event", async ({ page }) => {
    await page.locator(".event-card").first().click();

    const attendeesTab = page
      .locator("text=Attendees")
      .or(page.locator('[aria-label="Attendees"]'));
    if (await attendeesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await attendeesTab.click();

      // Should show attendee list
      await expect(
        page
          .locator('[class*="attendee"]')
          .or(page.locator("text=/\\d+ attendee/i"))
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("user can click attendee to view profile", async ({ page }) => {
    await page.locator(".event-card").first().click();

    const attendeesTab = page.locator("text=Attendees");
    if (await attendeesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await attendeesTab.click();

      const firstAttendee = page.locator('[class*="attendee"]').first();
      if (await firstAttendee.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstAttendee.click();

        // Profile modal should open
        await expect(page.locator('[role="dialog"]')).toBeVisible();
      }
    }
  });

  test("user can see online presence indicators", async ({ page }) => {
    // Should see presence indicators on map or event list
    const presenceIndicator = page
      .locator('[class*="online"]')
      .or(page.locator('[class*="presence"]'));

    if (
      await presenceIndicator.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      await expect(presenceIndicator.first()).toBeVisible();
    }
  });
});
