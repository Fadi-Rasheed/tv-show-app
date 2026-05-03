import type { ShowGenre } from './genre'

export interface ShowCountry {
  name: string
  code: string
  timezone: string
}

export interface ShowChannel {
  id: number
  name: string
  country: ShowCountry | null
  officialSite: string | null
}

export interface ShowSchedule {
  time: string
  days: string[]
}

export interface ShowRating {
  average: number | null
}

export interface ShowExternals {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

export interface ShowImage {
  medium: string
  original: string
}

export interface ShowLink {
  href: string
  name?: string
}

export interface ShowLinks {
  self: ShowLink
  previousepisode?: ShowLink
  nextepisode?: ShowLink
}

export interface Show {
  id: number
  url: string
  name: string
  type: string
  language: string
  genres: ShowGenre[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: ShowSchedule
  rating: ShowRating
  weight: number
  network: ShowChannel | null
  webChannel: ShowChannel | null
  dvdCountry: ShowCountry | null
  externals: ShowExternals
  image: ShowImage | null
  summary: string | null
  updated: number
  _links: ShowLinks
}

export type ShowsResponse = Show[]
