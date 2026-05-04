// @vitest-environment jsdom

import { render, screen } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import SearchResultsSection from '../SearchResultsSection.vue'
import commonEn from '@/shared/i18n/locales/en/common.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: commonEn } },
})

describe('SearchResultsSection', () => {
  it('shows the empty hint when no query exists', () => {
    render(SearchResultsSection, {
      props: {
        isPending: false,
        isError: false,
        showEmptyHint: true,
        showNoResults: false,
        results: [],
      },
      global: {
        plugins: [i18n],
        stubs: {
          SearchResultsGrid: { template: '<div data-testid="search-grid-should-hide" />' },
        },
      },
    })

    expect(screen.getByText(/Enter a show name/i)).toBeTruthy()
    expect(screen.queryByTestId('search-grid-should-hide')).toBeFalsy()
  })
})
