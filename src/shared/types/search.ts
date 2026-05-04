import type { Show } from './show'

export interface ShowSearchResultItem {
  score: number
  show: Show
}

export type ShowSearchResponse = ShowSearchResultItem[]
