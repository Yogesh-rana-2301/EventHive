'use client'

import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

// Conditional import for React Query
let QueryClient: any, QueryClientProvider: any
try {
  const reactQuery = require('@tanstack/react-query')
  QueryClient = reactQuery.QueryClient
  QueryClientProvider = reactQuery.QueryClientProvider
} catch (error) {
  // Fallback if not installed
  console.warn('@tanstack/react-query not found, using fallback provider')
  QueryClientProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    if (QueryClient) {
      return new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
    }
    return null
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}