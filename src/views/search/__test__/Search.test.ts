// @vitest-environment jsdom

import { render, screen } from '@testing-library/vue'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Search from '@/views/search/Search.vue'
import commonEn from '@/shared/i18n/locales/en/common.json'

const useShowSearchQueryMock = vi.fn()

vi.mock('@/shared/api/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/api/queries')>()
  return {
    ...actual,
    useShowSearchQuery: (...args: unknown[]) => useShowSearchQueryMock(...args),
  }
})

describe('Search view', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: { common: commonEn } },
  })

  beforeEach(() => {
    useShowSearchQueryMock.mockReset()
    useShowSearchQueryMock.mockReturnValue({
      data: ref([]),
      isLoading: ref(false),
      isError: ref(false),
    })
  })

  it('shows the introductory hint before the user submits a trimmed query', () => {
    render(Search, {
      global: {
        plugins: [i18n],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    })

    expect(screen.getByText(/Enter a show name/i)).toBeTruthy()
  })
})
