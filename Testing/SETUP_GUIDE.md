# Testing Setup Guide

This guide will walk you through setting up the EventHive testing environment.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- EventHive project cloned and dependencies installed

## Quick Start

### Step 1: Install Testing Dependencies

Run this single command to install all required testing packages:

```bash
npm install --save-dev \
  jest@^29.7.0 \
  @types/jest@^29.5.11 \
  jest-environment-jsdom@^29.7.0 \
  @testing-library/react@^14.1.2 \
  @testing-library/jest-dom@^6.1.5 \
  @testing-library/user-event@^14.5.1 \
  @playwright/test@^1.40.1 \
  @swc/jest@^0.2.29 \
  next-jest@^14.0.4 \
  identity-obj-proxy@^3.0.0
```

**Alternative (if above fails)**: Install in batches:

```bash
# Core testing frameworks
npm install --save-dev jest @types/jest jest-environment-jsdom

# React testing utilities
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E testing
npm install --save-dev @playwright/test

# Additional tools
npm install --save-dev @swc/jest next-jest identity-obj-proxy
```

### Step 2: Install Playwright Browsers

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers for E2E testing (~300MB).

### Step 3: Verify Installation

```bash
# Check Jest is installed
npx jest --version

# Check Playwright is installed
npx playwright --version
```

Expected output:

```
29.7.0  # Jest version
Version 1.40.1  # Playwright version
```

### Step 4: Run Your First Test

```bash
# Run frontend tests
npm test -- Testing/frontend/button.test.tsx

# Run backend tests
npm test -- Testing/backend/events-api.test.ts

# Run E2E tests (requires app running)
npm run test:e2e
```

## Detailed Setup

### Environment Variables

Create a `.env.test` file for test-specific configuration:

```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=https://your-test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-test-mapbox-token
TEST_USER_EMAIL=test@eventhive.com
TEST_USER_PASSWORD=Test@123456
```

### Test User Setup

For E2E tests, create a test user in Supabase:

```sql
-- Create test user in Supabase
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  gen_random_uuid(),
  'test@eventhive.com',
  crypt('Test@123456', gen_salt('bf')),
  NOW()
);
```

Or sign up manually through your app's authentication flow.

### VS Code Configuration (Optional)

Add Jest extension for better test experience:

1. Install "Jest" extension by Orta
2. Install "Playwright Test for VSCode" extension

Add to `.vscode/settings.json`:

```json
{
  "jest.autoRun": "off",
  "jest.showCoverageOnLoad": false,
  "playwright.reuseBrowser": true
}
```

## Verification Checklist

After installation, verify everything works:

### Unit Tests

```bash
# Run all unit tests
npm test

# Should see output like:
# PASS  Testing/frontend/button.test.tsx
# PASS  Testing/backend/events-api.test.ts
```

### Coverage Report

```bash
npm run test:coverage

# Should generate coverage report in ./coverage/
```

### E2E Tests

```bash
# Start development server in one terminal
npm run dev

# Run E2E tests in another terminal
npm run test:e2e

# Should see browser tests running
```

## Running Tests in CI/CD

### GitHub Actions Example

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Run E2E tests
        run: |
          npx playwright install --with-deps
          npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            coverage/
            playwright-report/
```

## Test Execution Modes

### Development Mode

```bash
# Watch mode - auto-runs tests on file changes
npm run test:watch
```

### Debug Mode

```bash
# Debug specific test file
node --inspect-brk node_modules/.bin/jest Testing/frontend/button.test.tsx --runInBand

# Debug E2E test
PWDEBUG=1 npm run test:e2e
```

### Coverage Mode

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

### E2E UI Mode

```bash
# Interactive Playwright UI
npm run test:e2e:ui
```

## Performance Tips

### Faster Test Runs

```bash
# Run tests in parallel (default)
npm test

# Run in band (sequential) for debugging
npm test -- --runInBand

# Run only changed tests
npm test -- --onlyChanged
```

### Reduce E2E Test Time

```bash
# Run specific browser only
npm run test:e2e -- --project=chromium

# Run specific test file
npm run test:e2e -- auth.spec.ts
```

## Updating Tests

When adding new features:

1. Write test first (TDD approach)
2. Implement feature
3. Run tests: `npm test`
4. Check coverage: `npm run test:coverage`
5. Ensure >70% coverage maintained

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Next Steps

After successful setup:

1. ✅ Run all existing tests: `npm test`
2. ✅ Explore test files in `Testing/` directory
3. ✅ Read `Testing/README.md` for detailed guide
4. ✅ Start writing tests for your assigned components
5. ✅ Maintain >70% code coverage

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages carefully
3. Check `Testing/README.md` for detailed documentation
4. Consult team members
5. Check project's GitHub issues

---
