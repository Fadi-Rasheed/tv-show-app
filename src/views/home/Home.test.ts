// @vitest-environment jsdom

import { ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Home from '@/views/home/Home.vue'
import commonEn from '@/shared/i18n/locales/en/common.json'

const useShowsByGenreQueryMock = vi.fn()

vi.mock('@/shared/api/shows/queries', () => ({
  useShowsByGenreQuery: () => useShowsByGenreQueryMock(),
}))

const createQueryState = ({
  isLoading = false,
  isError = false,
  data = [],
}: {
  isLoading?: boolean
  isError?: boolean
  data?: Array<{
    genre: string
    categorySlug: string
    items: Array<{ id: number; title: string; image: { medium: string; original: string }; rating: number }>
  }>
}) => ({
  isLoading: ref(isLoading),
  isError: ref(isError),
  data: ref(data),
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      common: commonEn,
    },
  },
})

const renderHome = () =>
  render(Home, {
    global: {
      plugins: [i18n],
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('Home view', () => {
  beforeEach(() => {
    useShowsByGenreQueryMock.mockReset()
  })

  it('renders loading state while shows query is loading', () => {
    useShowsByGenreQueryMock.mockReturnValue(createQueryState({ isLoading: true }))

    renderHome()

    expect(screen.getByTestId('home-loading')).toBeTruthy()
  })

  it('renders rails when data is available', () => {
    useShowsByGenreQueryMock.mockReturnValue(
      createQueryState({
        data: [
          {
            genre: 'Drama',
            categorySlug: 'drama',
            items: [
              {
                id: 1,
                title: 'Example Show',
                image: {
                  medium: 'https://example.com/show.jpg',
                  original: 'https://example.com/show.jpg',
                },
                rating: 8.1,
              },
            ],
          },
        ],
      })
    )

    renderHome()

    expect(screen.getByTestId('home-rails')).toBeTruthy()
    expect(screen.getByText('Drama')).toBeTruthy()
  })

  it('renders error message on query failure', () => {
    useShowsByGenreQueryMock.mockReturnValue(createQueryState({ isError: true }))

    renderHome()

    expect(screen.getByTestId('home-error')).toBeTruthy()
  })
})
