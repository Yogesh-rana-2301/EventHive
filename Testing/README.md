# EventHive Testing Guide

This directory contains comprehensive test suites for the EventHive project, organized by testing layer.

## Directory Structure

```
Testing/
├── frontend/          # Frontend component unit tests
├── backend/           # Backend API and store tests
├── integration/       # Third-party integration tests
├── e2e/              # End-to-end Playwright tests
└── README.md         # This file
```

## Testing Stack

- **Jest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end browser testing
- **@testing-library/jest-dom**: Custom DOM matchers

## Getting Started

### Installation

Install all testing dependencies:

```bash
npm install --save-dev jest @types/jest jest-environment-jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @playwright/test @swc/jest next-jest identity-obj-proxy
```

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run specific test file
npm test -- button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

## Test Done

### Person 1: Frontend Testing

**Deliverables**: Component unit tests

- `frontend/button.test.tsx` - Button component tests ✅
- `frontend/event-card.test.tsx` - EventCard component tests ✅
- Create: `frontend/toast.test.tsx` - Toast notification tests
- Create: `frontend/theme-toggle.test.tsx` - Theme toggle tests
- Create: `frontend/loading-spinner.test.tsx` - Spinner tests
- Implement tested components

**Metrics**:

- Test Coverage: >80% for components
- 10+ component test files
- All UI components properly tested

---

### Person 2: Backend Testing

**Deliverables**: API and state management tests

- `backend/events-api.test.ts` - Events API tests ✅
- `backend/events-store.test.ts` - Events store tests ✅
- Create: `backend/auth-api.test.ts` - Authentication API tests
- Create: `backend/chat-api.test.ts` - Chat API tests
- Create: `backend/gamification-store.test.ts` - Gamification store tests
- Implement tested APIs

**Metrics**:

- Test Coverage: >75% for business logic
- All CRUD operations tested
- Error handling validated

---

### Person 3: Integration Testing

**Deliverables**: Third-party integration tests

- `integration/mapbox.test.ts` - Mapbox integration tests ✅
- `integration/geocoding.test.ts` - Geocoding tests ✅
- `integration/realtime.test.ts` - Real-time tests ✅
- Create: `integration/supabase-auth.test.ts` - Supabase auth tests
- Create: `integration/file-upload.test.ts` - File upload tests
- Implement integration code

**Metrics**:

- All external APIs mocked properly
- Connection handling tested
- Error scenarios covered

---

### Person 4: E2E + Documentation

**Deliverables**: End-to-end tests + documentation

- `e2e/auth.spec.ts` - Authentication flow tests ✅
- `e2e/events.spec.ts` - Event management flow tests ✅
- `e2e/social.spec.ts` - Social features tests ✅
- `e2e/navigation.spec.ts` - Navigation tests ✅
- `e2e/auth.setup.ts` - Test setup utilities ✅
- `e2e/global-setup.ts` - Global setup ✅
- Documentation: Testing README ✅
- Create: Test execution report

**Metrics**:

- Complete user journeys tested
- Critical paths covered
- Documentation clear and comprehensive

## Test File Templates

### Frontend Component Test Template

```typescript
// Testing/frontend/component-name.test.tsx
import { render, screen, fireEvent } from '@/lib/test-utils';
import { ComponentName } from '@/components/path/component-name';

describe('ComponentName', () => {
  it('should render successfully', () => {
    render(<ComponentName />);
    expect(screen.getByRole('element')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<ComponentName />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Expected result')).toBeVisible();
  });
});
```

### Backend API Test Template

```typescript
// Testing/backend/api-name.test.ts
import { apiFunction } from "@/lib/api/api-name";
import { mockSupabaseClient } from "@/lib/test-utils";

jest.mock("@/lib/supabase", () => ({
  supabase: mockSupabaseClient,
}));

describe("API Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch data successfully", async () => {
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [{ id: 1 }],
        error: null,
      }),
    });

    const result = await apiFunction();
    expect(result).toHaveLength(1);
  });
});
```

### E2E Test Template

```typescript
// Testing/e2e/feature.spec.ts
import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/user.json" });

test.describe("Feature Name", () => {
  test("should perform user action", async ({ page }) => {
    await page.goto("/app");
    await page.click('button:has-text("Action")');
    await expect(page.locator("text=Success")).toBeVisible();
  });
});
```

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
it("should do something", () => {
  // Arrange: Set up test data
  const input = "test";

  // Act: Execute the code
  const result = functionToTest(input);

  // Assert: Verify the result
  expect(result).toBe("expected");
});
```

### 2. Mock External Dependencies

```typescript
jest.mock("@/lib/supabase", () => ({
  supabase: mockSupabaseClient,
}));
```

### 3. Test User Behavior, Not Implementation

```typescript
// ✅ Good: Test what user sees
expect(screen.getByText("Submit")).toBeInTheDocument();

// ❌ Bad: Test implementation details
expect(component.state.isSubmitted).toBe(true);
```

### 4. Use Descriptive Test Names

```typescript
// ✅ Good
it("should show error message when form is submitted with empty email");

// ❌ Bad
it("test form");
```

### 5. Cleanup After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

## Coverage Requirements

| Layer               | Target Coverage |
| ------------------- | --------------- |
| Frontend Components | 80%+            |
| Backend APIs        | 75%+            |
| Integrations        | 70%+            |
| E2E Critical Paths  | 100%            |

## Debugging Tests

### View Test Output

```bash
# Verbose mode
npm test -- --verbose

# Show console logs
npm test -- --silent=false
```

### Debug E2E Tests

```bash
# Run in headed mode
npm run test:e2e -- --headed

# Run in debug mode
npm run test:e2e -- --debug

# Run with Playwright Inspector
PWDEBUG=1 npm run test:e2e
```

### Debug Unit Tests

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Use VS Code debugger
# Add breakpoint and press F5
```

## Configuration Files

- `jest.config.ts` - Jest configuration
- `jest.setup.ts` - Jest setup (mocks, global config)
- `playwright.config.ts` - Playwright configuration
- `src/lib/test-utils.tsx` - Custom render functions and utilities
- `__mocks__/fileMock.js` - Static asset mocks

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing Tests

1. Write tests before implementing features (TDD)
2. Ensure all tests pass before submitting PR
3. Maintain >70% code coverage
4. Add tests for bug fixes
5. Update documentation when adding new test patterns

## ✅ Pre-Deployment Checklist

- ✅ All unit tests passing
- ✅ Integration tests passing
- ✅ E2E critical paths passing
- ✅ Coverage meets thresholds
- ✅ No console errors in tests
- ✅ Test execution time reasonable (<5 min for unit, <15 min for E2E)

## Support

If you encounter issues with tests:

1. Check test output for error messages
2. Verify all dependencies are installed
3. Ensure environment variables are set
4. Review configuration files
5. Reach out to team members

---
