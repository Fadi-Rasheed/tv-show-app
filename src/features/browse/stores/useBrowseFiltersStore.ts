import { defineStore } from 'pinia'
import type { ShowGenre } from '@/shared/types/genre'

type BrowseFiltersState = {
  selectedGenres: ShowGenre[]
}

export const useBrowseFiltersStore = defineStore('browse-filters', {
  state: (): BrowseFiltersState => ({
    selectedGenres: [],
  }),
  getters: {
    hasActiveFilters: (state) => state.selectedGenres.length > 0,
  },
  actions: {
    setGenres(genres: ShowGenre[]) {
      this.selectedGenres = [...new Set(genres)]
    },
    setSingleGenre(genre: ShowGenre) {
      this.selectedGenres = [genre]
    },
    toggleGenre(genre: ShowGenre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter((value) => value !== genre)
        return
      }

      this.selectedGenres = [...this.selectedGenres, genre]
    },
    clearGenres() {
      this.selectedGenres = []
    },
  },
})
