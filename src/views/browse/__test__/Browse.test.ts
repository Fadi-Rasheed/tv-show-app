// @vitest-environment jsdom

import { render, screen } from '@testing-library/vue'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Browse from '@/views/browse/Browse.vue'
import commonEn from '@/shared/i18n/locales/en/common.json'

const useInfiniteQueryMock = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
  useInfiniteQuery: (...args: unknown[]) => useInfiniteQueryMock(...args),
}))

describe('Browse view', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: { common: commonEn } },
  })

  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    useInfiniteQueryMock.mockReset()
    useInfiniteQueryMock.mockReturnValue({
      data: ref(undefined),
      isPending: ref(true),
      isError: ref(false),
      hasNextPage: ref(false),
      isFetching: ref(false),
      isFetchingNextPage: ref(false),
      fetchNextPage: vi.fn(),
    })
  })

  it('renders browse shell while the index query is still pending', () => {
    render(Browse, {
      global: {
        plugins: [i18n, pinia],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    })

    expect(screen.getByTestId('browse-page')).toBeTruthy()
    expect(screen.getByText(/Loading shows/i)).toBeTruthy()
  })
})
