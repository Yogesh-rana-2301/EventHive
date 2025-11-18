// Global setup for Playwright E2E tests
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright global setup...');

  // You can add global setup logic here:
  // - Seed test database
  // - Start mock servers
  // - Perform authentication
  
  // Example: Create authenticated state for tests
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to app
    await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3000');

    // Check if user is already authenticated
    const isAuthenticated = await page.evaluate(() => {
      return localStorage.getItem('supabase.auth.token') !== null;
    });

    if (!isAuthenticated) {
      console.log('ℹ️  No authenticated session found. Tests will use setup project for auth.');
    } else {
      console.log('✅ Authenticated session found.');
    }

  } catch (error) {
    console.error('❌ Global setup failed:', error);
  } finally {
    await browser.close();
  }

  console.log('✅ Playwright global setup complete!');
}

export default globalSetup;
