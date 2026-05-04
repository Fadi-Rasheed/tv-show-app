import { QueryClient } from '@tanstack/vue-query'

const FIVE_MINUTES_MS = 1000 * 60 * 5

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: FIVE_MINUTES_MS,
      refetchOnWindowFocus: false,
    },
  },
})
