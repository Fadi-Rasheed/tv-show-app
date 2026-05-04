// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { afterEach, describe, expect, it } from 'vitest'
import BrowseResultsSection from '../BrowseResultsSection.vue'
import commonEn from '@/shared/i18n/locales/en/common.json'
import type { GenreBrowseShowItem } from '@/shared/api/utils'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: commonEn } },
})

const stubs = {
  BrowseLoadingState: { template: '<div data-testid="browse-branch-loading"></div>' },
  BrowseErrorState: { template: '<div data-testid="browse-branch-error"></div>' },
  BrowseNoResultsState: { template: '<div data-testid="browse-branch-no-results"></div>' },
  BrowseFindingShowsState: { template: '<div data-testid="browse-branch-finding"></div>' },
  BrowseShowsGrid: { template: '<div data-testid="browse-branch-grid"></div>' },
  BrowseLoadMore: { template: '<div />' },
}

const formatRating = (v: number | null) => (v == null ? '—' : String(v))

const baseProps = {
  isFetching: false,
  isPending: false,
  isError: false,
  showNoResults: false,
  showEmptyWhileSearching: false,
  hasItems: false,
  items: [] as GenreBrowseShowItem[],
  hasNextPage: false,
  isFetchingNextPage: false,
  formatRating,
}

describe('BrowseResultsSection', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows the loading stub while the infinite query reports pending status', () => {
    render(BrowseResultsSection, {
      props: { ...baseProps, isPending: true },
      global: { plugins: [i18n], stubs },
    })

    expect(screen.getByTestId('browse-branch-loading')).toBeTruthy()
  })

  it('shows the error stub after loading finishes unsuccessfully', () => {
    render(BrowseResultsSection, {
      props: { ...baseProps, isPending: false, isError: true },
      global: { plugins: [i18n], stubs },
    })

    expect(screen.queryByTestId('browse-branch-loading')).toBeFalsy()
    expect(screen.getByTestId('browse-branch-error')).toBeTruthy()
  })
})

