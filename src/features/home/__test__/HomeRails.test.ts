// @vitest-environment jsdom

import { render, screen, fireEvent } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import HomeRails from '../HomeRails.vue'
import commonEn from '@/shared/i18n/locales/en/common.json'
import { SHOW_GENRE } from '@/shared/types/genre'
import { useBrowseFiltersStore } from '@/stores/useBrowseFiltersStore'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: commonEn } },
})

describe('HomeRails', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets browse filter to one genre after Browse all category navigation', async () => {
    render(HomeRails, {
      props: {
        rails: [
          {
            genre: SHOW_GENRE.DRAMA,
            categorySlug: 'drama',
            items: [
              {
                id: 1,
                title: 'Example',
                genres: [SHOW_GENRE.DRAMA],
                rating: 8,
                image: { medium: 'https://example.com/m.jpg', original: 'https://example.com/o.jpg' },
              },
            ],
          },
        ],
      },
      global: {
        plugins: [i18n],
        stubs: {
          HorizontalSlider: { template: '<div><slot /></div>' },
          Tile: { template: '<div />' },
          RouterLink: { props: ['to'], template: '<a role="link" href="#"><slot /></a>' },
        },
      },
    })

    await fireEvent.click(
      screen.getAllByRole('link', { name: /browse all drama shows/i })[0]!,
    )

    expect(useBrowseFiltersStore().selectedGenres).toEqual([SHOW_GENRE.DRAMA])
  })
})
