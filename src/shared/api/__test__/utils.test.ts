import { describe, expect, it } from 'vitest'
import { SHOW_GENRE } from '@/shared/types/genre'
import type { ShowsResponse } from '@/shared/types/show'
import { collectBrowseShowsFromPages, toCategorySlug } from '@/shared/api/utils'

const page: ShowsResponse = [
  {
    id: 1,
    url: 'https://example.com/1',
    name: 'S1',
    type: 'Scripted',
    language: 'English',
    genres: [SHOW_GENRE.DRAMA, SHOW_GENRE.ACTION],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2020-01-01',
    ended: null,
    officialSite: null,
    schedule: { time: '21:00', days: ['Monday'] },
    rating: { average: 7 },
    weight: 50,
    network: null,
    webChannel: null,
    dvdCountry: null,
    externals: { tvrage: null, thetvdb: null, imdb: null },
    image: null,
    summary: null,
    updated: 1,
    _links: { self: { href: 'https://example.com/1' } },
  },
  {
    id: 2,
    url: 'https://example.com/2',
    name: 'S2',
    type: 'Scripted',
    language: 'English',
    genres: [SHOW_GENRE.DRAMA],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2020-01-01',
    ended: null,
    officialSite: null,
    schedule: { time: '22:00', days: ['Tuesday'] },
    rating: { average: 6 },
    weight: 40,
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

describe('toCategorySlug', () => {
  it('trims and lowercases', () => {
    expect(toCategorySlug('  Drama  ')).toBe('drama')
  })
})

describe('collectBrowseShowsFromPages', () => {
  it('returns empty when pages are missing', () => {
    expect(collectBrowseShowsFromPages(undefined, [])).toEqual([])
  })

  it('includes all shows when no genre filter is active', () => {
    const items = collectBrowseShowsFromPages([page], [])
    expect(items.map((i) => i.id)).toEqual([1, 2])
  })

  it('requires every selected genre to match (AND)', () => {
    const items = collectBrowseShowsFromPages([page], [SHOW_GENRE.DRAMA, SHOW_GENRE.ACTION])
    expect(items.map((i) => i.id)).toEqual([1])
  })
})
