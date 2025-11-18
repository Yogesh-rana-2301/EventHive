// Authentication setup for E2E tests
import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Go to landing page
  await page.goto('/');

  // Click login/get started button
  const loginButton = page.locator('button:has-text("Get Started")').or(page.locator('a:has-text("Login")'));
  await loginButton.click();

  // Wait for navigation
  await page.waitForLoadState('networkidle');

  // Check if we need to sign in
  const signInButton = page.locator('button:has-text("Sign In")');
  
  if (await signInButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    // Fill in test credentials
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || 'test@eventhive.com');
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || 'Test@123456');
    
    // Submit form
    await page.click('button[type="submit"]:has-text("Sign In")');
    
    // Wait for redirect to app
    await page.waitForURL('**/app**', { timeout: 10000 });
  }

  // Verify authentication succeeded
  await expect(page.locator('text=Events').or(page.locator('[aria-label="Events"]'))).toBeVisible({ timeout: 10000 });

  // Save authentication state
  await page.context().storageState({ path: authFile });
  
  console.log('✅ Authentication setup complete!');
});
