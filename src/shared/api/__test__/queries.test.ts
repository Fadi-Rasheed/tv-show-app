import { describe, expect, it } from 'vitest'
import { SHOW_GENRE } from '@/shared/types/genre'
import type { ShowsResponse } from '@/shared/types/show'
import { buildGenreRails, relatedItemsFromGenreRails, showMatchesBrowseCategory } from '@/shared/api/utils'

const showsFixture: ShowsResponse = [
  {
    id: 1,
    url: 'https://example.com/1',
    name: 'Top Drama',
    type: 'Scripted',
    language: 'English',
    genres: [SHOW_GENRE.DRAMA],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2020-01-01',
    ended: null,
    officialSite: null,
    schedule: { time: '21:00', days: ['Monday'] },
    rating: { average: 9.1 },
    weight: 90,
    network: null,
    webChannel: null,
    dvdCountry: null,
    externals: { tvrage: null, thetvdb: null, imdb: null },
    image: { medium: 'https://example.com/1-medium.jpg', original: 'https://example.com/1-original.jpg' },
    summary: null,
    updated: 1,
    _links: { self: { href: 'https://example.com/1' } },
  },
  {
    id: 2,
    url: 'https://example.com/2',
    name: 'Action Hit',
    type: 'Scripted',
    language: 'English',
    genres: [SHOW_GENRE.ACTION, SHOW_GENRE.DRAMA],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2020-01-01',
    ended: null,
    officialSite: null,
    schedule: { time: '22:00', days: ['Tuesday'] },
    rating: { average: 8.4 },
    weight: 80,
    network: null,
    webChannel: null,
    dvdCountry: null,
    externals: { tvrage: null, thetvdb: null, imdb: null },
    image: null,
    summary: null,
    updated: 1,
    _links: { self: { href: 'https://example.com/2' } },
  },
]

describe('buildGenreRails', () => {
  it('groups shows by genre and sorts each rail by rating desc', () => {
    const rails = buildGenreRails(showsFixture)

    expect(rails.map((rail) => rail.genre)).toEqual(['Action', 'Drama'])
    expect(rails[1].items.map((item) => item.title)).toEqual(['Top Drama', 'Action Hit'])
    expect(rails[1].items.map((item) => item.rating)).toEqual([9.1, 8.4])
  })

  it('uses fallback image for shows with no image', () => {
    const rails = buildGenreRails(showsFixture)
    const actionRail = rails.find((rail) => rail.genre === 'Action')

    expect(actionRail?.items[0].image.medium).toContain('no-img-portrait-text.png')
  })
})

describe('showMatchesBrowseCategory', () => {
  it('matches when the genre appears anywhere in the genres array, not only first', () => {
    const show = showsFixture[1]!
    const withEspionageLast: typeof show = {
      ...show,
      genres: [SHOW_GENRE.THRILLER, SHOW_GENRE.DRAMA, SHOW_GENRE.ESPIONAGE],
    }

    expect(showMatchesBrowseCategory(withEspionageLast, 'espionage')).toBe(true)
    expect(showMatchesBrowseCategory(withEspionageLast, 'war')).toBe(false)
  })
})

describe('relatedItemsFromGenreRails', () => {
  it('uses the genre rail from buildGenreRails and excludes the current show', () => {
    const rails = buildGenreRails(showsFixture)
    const items = relatedItemsFromGenreRails(rails, {
      excludeId: 1,
      genres: [SHOW_GENRE.DRAMA],
    })

    expect(items.map((item) => item.id)).toEqual([2])
    expect(items[0]?.title).toBe('Action Hit')
  })

  it('dedupes a show that appears in multiple selected genre rails', () => {
    const rails = buildGenreRails(showsFixture)
    const items = relatedItemsFromGenreRails(rails, {
      excludeId: 999,
      genres: [SHOW_GENRE.DRAMA, SHOW_GENRE.ACTION],
    })

    expect(items.filter((item) => item.id === 2)).toHaveLength(1)
  })
})
