export interface EpisodeImage {
  medium: string
  original: string
}

export interface Episode {
  id: number
  name: string
  season: number
  number: number | null
  airdate: string | null
  runtime: number | null
  image: EpisodeImage | null
  summary: string | null
}

export type EpisodesResponse = Episode[]
