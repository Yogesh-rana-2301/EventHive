// Test utilities and helpers for EventHive
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/theme-context';

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark';
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): ReturnType<typeof render> {
  const { theme = 'light', ...renderOptions } = options || {};

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock data generators
export const generateMockEvent = (overrides?: Partial<any>) => ({
  id: 'test-event-' + Math.random(),
  title: 'Test Conference 2024',
  description: 'A comprehensive test event for unit testing',
  category: 'technology',
  date: new Date('2024-12-31').toISOString(),
  time: '18:00',
  location: {
    address: 'Mumbai, Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
  },
  max_attendees: 100,
  attendee_count: 25,
  creator_id: 'user-123',
  creator: {
    id: 'user-123',
    full_name: 'Test User',
    email: 'test@example.com',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const generateMockUser = (overrides?: Partial<any>) => ({
  id: 'user-' + Math.random(),
  email: 'user@example.com',
  full_name: 'Test User',
  avatar_url: null,
  bio: 'Test bio',
  total_xp: 100,
  level: 1,
  badges: [],
  created_at: new Date().toISOString(),
  ...overrides,
});

export const generateMockMessage = (overrides?: Partial<any>) => ({
  id: 'msg-' + Math.random(),
  event_id: 'event-123',
  user_id: 'user-123',
  content: 'Test message',
  created_at: new Date().toISOString(),
  user: generateMockUser(),
  ...overrides,
});

// Mock Supabase client
export const mockSupabaseClient = {
  from: jest.fn(() => mockSupabaseClient),
  select: jest.fn(() => mockSupabaseClient),
  insert: jest.fn(() => mockSupabaseClient),
  update: jest.fn(() => mockSupabaseClient),
  delete: jest.fn(() => mockSupabaseClient),
  eq: jest.fn(() => mockSupabaseClient),
  single: jest.fn(() => Promise.resolve({ data: null, error: null })),
  order: jest.fn(() => mockSupabaseClient),
  limit: jest.fn(() => mockSupabaseClient),
  range: jest.fn(() => mockSupabaseClient),
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    signIn: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
  },
  channel: jest.fn(() => ({
    on: jest.fn(() => ({ subscribe: jest.fn() })),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  })),
};

// Wait for async operations
export const waitForAsync = (ms = 0) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Custom matchers (optional)
export const customMatchers = {
  toBeValidEvent(received: any) {
    const pass = 
      typeof received.id === 'string' &&
      typeof received.title === 'string' &&
      typeof received.date === 'string' &&
      received.location !== undefined;

    return {
      pass,
      message: () => 
        pass
          ? `Expected ${received} not to be a valid event`
          : `Expected ${received} to be a valid event with id, title, date, and location`,
    };
  },
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Export custom render as default render
export { customRender as render };
