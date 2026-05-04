import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { SHOW_GENRE } from '@/shared/types/genre'
import { useBrowseFiltersStore } from '../useBrowseFiltersStore'

describe('useBrowseFiltersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('toggles genres and exposes hasActiveFilters', () => {
    const store = useBrowseFiltersStore()
    expect(store.hasActiveFilters).toBe(false)

    store.toggleGenre(SHOW_GENRE.DRAMA)
    expect(store.selectedGenres).toEqual([SHOW_GENRE.DRAMA])
    expect(store.hasActiveFilters).toBe(true)

    store.toggleGenre(SHOW_GENRE.DRAMA)
    expect(store.selectedGenres).toEqual([])
    expect(store.hasActiveFilters).toBe(false)
  })

  it('clearGenres resets the selection', () => {
    const store = useBrowseFiltersStore()
    store.toggleGenre(SHOW_GENRE.ACTION)
    store.clearGenres()
    expect(store.selectedGenres).toEqual([])
  })

  it('dedupes setGenres and setSingleGenre replaces selection', () => {
    const store = useBrowseFiltersStore()
    store.setGenres([SHOW_GENRE.DRAMA, SHOW_GENRE.DRAMA])
    expect(store.selectedGenres).toEqual([SHOW_GENRE.DRAMA])

    store.setSingleGenre(SHOW_GENRE.COMEDY)
    expect(store.selectedGenres).toEqual([SHOW_GENRE.COMEDY])
  })
})
