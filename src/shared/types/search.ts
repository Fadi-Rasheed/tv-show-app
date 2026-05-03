import type { Show } from './show'

/** Single entry from `GET /search/shows?q=` — see `mockSearch.json`. */
export interface ShowSearchResultItem {
  score: number
  show: Show
}

export type ShowSearchResponse = ShowSearchResultItem[]
