# Testing Quick Reference

## Installation

```bash
# Install all testing dependencies (one command)
npm install --save-dev jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @swc/jest next-jest identity-obj-proxy

# Install Playwright browsers
npx playwright install
```

## Test Commands

### Unit & Integration Tests (Jest)

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode (auto-rerun on changes)
npm run test:coverage      # Generate coverage report
npm test -- button.test    # Run specific test file
npm test -- --verbose      # Verbose output
```

### End-to-End Tests (Playwright)

```bash
npm run test:e2e           # Run all E2E tests
npm run test:e2e:ui        # Interactive UI mode
npm run test:e2e:headed    # Headed browser mode (see browser)
npm run test:e2e:debug     # Debug mode with inspector
npx playwright test auth   # Run specific test file
```

## Test File Locations

```
Testing/
├── frontend/       # Component unit tests
├── backend/        # API & store tests
├── integration/    # Third-party integration tests
└── e2e/           # End-to-end browser tests
```

## Quick Test Templates

### Component Test

```typescript
import { render, screen, fireEvent } from '@/lib/test-utils';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### API Test

```typescript
import { myApiFunction } from "@/lib/api/my-api";
import { mockSupabaseClient } from "@/lib/test-utils";

jest.mock("@/lib/supabase", () => ({
  supabase: mockSupabaseClient,
}));

describe("myApiFunction", () => {
  it("should fetch data", async () => {
    const result = await myApiFunction();
    expect(result).toBeDefined();
  });
});
```

### E2E Test

```typescript
import { test, expect } from "@playwright/test";

test("should login", async ({ page }) => {
  await page.goto("/");
  await page.click('button:has-text("Login")');
  await expect(page).toHaveURL("/app");
});
```

## Debug Commands

```bash
# Debug unit test
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug E2E test
PWDEBUG=1 npm run test:e2e

# View test output
npm test -- --verbose --silent=false
```

## Coverage Thresholds

- Frontend: 80%+
- Backend: 75%+
- Integration: 70%+
- E2E: 100% critical paths

## Common Fixes

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall Playwright browsers
npx playwright install --force

# Kill port 3000
npx kill-port 3000

# Verify installations
npx jest --version
npx playwright --version
```

## File Reference

| File                     | Purpose                  |
| ------------------------ | ------------------------ |
| `jest.config.ts`         | Jest configuration       |
| `playwright.config.ts`   | Playwright configuration |
| `jest.setup.ts`          | Test environment setup   |
| `src/lib/test-utils.tsx` | Custom test utilities    |
| `Testing/README.md`      | Full documentation       |

## Testing Workflow

1. **Write test** → 2. **Run test** → 3. **Implement** → 4. **Verify** → 5. **Commit**

```bash
npm run test:watch              # Step 2: Auto-run tests
# Code your implementation      # Step 3
npm run test:coverage          # Step 4: Check coverage
git add . && git commit        # Step 5
```

## Status Indicators

- ✅ Test passing
- ❌ Test failing
- ⏭️ Test skipped
- 🔄 Test running

## Help

- Full docs: `Testing/README.md`
- Setup guide: `Testing/SETUP_GUIDE.md`
- Implementation: `Testing/IMPLEMENTATION_SUMMARY.md`

---
