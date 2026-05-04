// @vitest-environment jsdom

import { render, screen, fireEvent } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import BrowseGenreFilters from '../BrowseGenreFilters.vue'
import commonEn from '@/shared/i18n/locales/en/common.json'
import { SHOW_GENRE } from '@/shared/types/genre'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: commonEn } },
})

describe('BrowseGenreFilters', () => {
  it('emits toggleGenre when a badge is clicked and emits clearGenres after selecting', async () => {
    const genres = [SHOW_GENRE.DRAMA, SHOW_GENRE.COMEDY]
    const { emitted, rerender } = render(BrowseGenreFilters, {
      props: {
        genres,
        selectedGenres: [],
      },
      global: { plugins: [i18n] },
    })

    await fireEvent.click(screen.getByRole('button', { name: SHOW_GENRE.DRAMA }))
    expect(emitted().toggleGenre?.[0]).toEqual([SHOW_GENRE.DRAMA])

    await rerender({ genres, selectedGenres: [SHOW_GENRE.DRAMA] })
    expect(screen.getByRole('button', { name: SHOW_GENRE.DRAMA }).getAttribute('aria-pressed')).toBe(
      'true'
    )

    await fireEvent.click(screen.getByRole('button', { name: /Clear all/i }))
    expect(emitted().clearGenres?.length).toBeGreaterThanOrEqual(1)
  })
})