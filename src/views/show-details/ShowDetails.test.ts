// @vitest-environment jsdom

import { ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi } from 'vitest'
import ShowDetails from '@/views/show-details/ShowDetails.vue'
import type { GenreRail } from '@/shared/api/utils'
import commonEn from '@/shared/i18n/locales/en/common.json'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ back: vi.fn() }),
  }
})

const queryMocks = vi.hoisted(() => ({
  useShowDetailQuery: vi.fn(),
  useShowsByGenreQuery: vi.fn(),
  useShowEpisodesQuery: vi.fn(),
}))

vi.mock('@/shared/api/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/api/queries')>()
  return {
    ...actual,
    useShowDetailQuery: () => queryMocks.useShowDetailQuery(),
    useShowsByGenreQuery: () => queryMocks.useShowsByGenreQuery(),
    useShowEpisodesQuery: () => queryMocks.useShowEpisodesQuery(),
  }
})

const createDetailState = ({
  isLoading = false,
  isError = false,
  data = null as null | { name: string; summary: string | null; genres: string[]; image: { medium: string; original: string } | null; rating: { average: number | null } },
} = {}) => ({
  isLoading: ref(isLoading),
  isError: ref(isError),
  data: ref(data),
})

const createGenreRailsState = ({
  isLoading = false,
  isError = false,
  data = [] as GenreRail[],
} = {}) => ({
  isLoading: ref(isLoading),
  isError: ref(isError),
  data: ref(data),
})

const createEpisodesState = ({
  isLoading = false,
  isError = false,
  isSuccess = false,
  data = [] as unknown[],
} = {}) => ({
  isLoading: ref(isLoading),
  isError: ref(isError),
  isSuccess: ref(isSuccess),
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

const renderShowDetails = (id = '1') =>
  render(ShowDetails, {
    props: { id },
    global: {
      plugins: [i18n],
      stubs: {
        RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
      },
    },
  })

describe('ShowDetails view', () => {
  it('shows loading while the show query is loading', () => {
    queryMocks.useShowDetailQuery.mockReturnValue(createDetailState({ isLoading: true }))
    queryMocks.useShowsByGenreQuery.mockReturnValue(createGenreRailsState())
    queryMocks.useShowEpisodesQuery.mockReturnValue(createEpisodesState())

    renderShowDetails()

    expect(screen.getByTestId('show-details-loading')).toBeTruthy()
  })

  it('renders the show title when detail data is available', () => {
    queryMocks.useShowDetailQuery.mockReturnValue(
      createDetailState({
        data: {
          name: 'Example Show',
          summary: '<p>Hello</p>',
          genres: ['Drama'],
          image: { medium: 'https://example.com/m.jpg', original: 'https://example.com/o.jpg' },
          rating: { average: 8 },
        },
      }),
    )
    queryMocks.useShowsByGenreQuery.mockReturnValue(createGenreRailsState())
    queryMocks.useShowEpisodesQuery.mockReturnValue(createEpisodesState())

    renderShowDetails()

    expect(screen.getByTestId('show-details-title').textContent).toContain('Example Show')
  })

  it('treats floating route ids as invalid', () => {
    queryMocks.useShowDetailQuery.mockReturnValue(createDetailState())
    queryMocks.useShowsByGenreQuery.mockReturnValue(createGenreRailsState())
    queryMocks.useShowEpisodesQuery.mockReturnValue(createEpisodesState())

    renderShowDetails('1.5')

    expect(screen.getByTestId('show-details-invalid')).toBeTruthy()
  })
})
