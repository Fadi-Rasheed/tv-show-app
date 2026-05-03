import type { Show, ShowImage, ShowsResponse } from '@/shared/types/show'

export type RailShowItem = {
  id: number
  title: string
  image: ShowImage
  rating: number
  genres: string[]
}

export type GenreRail = {
  genre: string
  categorySlug: string
  items: RailShowItem[]
}

/** Browse grid item with nullable average for the same rating copy as search. */
export type GenreBrowseShowItem = {
  id: number
  title: string
  image: ShowImage
  ratingAverage: number | null
  genres: string[]
}

const FALLBACK_SHOW_IMAGE_URL = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'

const FALLBACK_SHOW_IMAGE: ShowImage = {
  medium: FALLBACK_SHOW_IMAGE_URL,
  original: FALLBACK_SHOW_IMAGE_URL,
}

export const toCategorySlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '')

/**
 * Browse match: true if `categorySlug` equals the slug for **any** string in `show.genres`
 * (position does not matter — TVMaze does not expose a separate “primary” genre field).
 */
export const showMatchesBrowseCategory = (show: Show, categorySlug: string): boolean => {
  const genres = Array.isArray(show.genres) ? show.genres : []

  return genres.some((g) => {
    if (typeof g !== 'string') {
      return false
    }
    const trimmed = g.trim()
    if (!trimmed) {
      return false
    }
    return toCategorySlug(trimmed) === toCategorySlug(categorySlug)
  })
}

const toRailItem = (show: Show): RailShowItem => ({
  id: show.id,
  title: show.name,
  image: show.image ?? FALLBACK_SHOW_IMAGE,
  rating: show.rating.average ?? 0,
  genres: show.genres,
})

const sortByRatingDescending = (left: RailShowItem, right: RailShowItem) => {
  if (right.rating !== left.rating) {
    return right.rating - left.rating
  }

  return left.title.localeCompare(right.title)
}

export const buildGenreRails = (shows: ShowsResponse): GenreRail[] => {
  const railsByGenre = new Map<string, RailShowItem[]>()

  for (const show of shows) {
    for (const genre of show.genres) {
      const existingItems = railsByGenre.get(genre)
      const showItem = toRailItem(show)

      if (!existingItems) {
        railsByGenre.set(genre, [showItem])
        continue
      }

      existingItems.push(showItem)
    }
  }

  return [...railsByGenre.entries()]
    .map(([genre, items]) => ({
      genre,
      categorySlug: toCategorySlug(genre),
      items: [...items].sort(sortByRatingDescending),
    }))
    .sort((left, right) => left.genre.localeCompare(right.genre))
}

export const collectGenreShowsFromPages = (
  pages: ShowsResponse[] | undefined,
  categorySlug: string
): GenreBrowseShowItem[] => {
  if (!pages?.length) {
    return []
  }

  const seen = new Set<number>()
  const items: GenreBrowseShowItem[] = []

  for (const page of pages) {
    for (const show of page) {
      if (!showMatchesBrowseCategory(show, categorySlug)) {
        continue
      }
      if (seen.has(show.id)) {
        continue
      }
      seen.add(show.id)
      items.push({
        id: show.id,
        title: show.name,
        image: show.image ?? FALLBACK_SHOW_IMAGE,
        ratingAverage: show.rating.average,
        genres: show.genres,
      })
    }
  }

  return items
}

/** Related rail items from cached genre rails (same source as `useShowsByGenreQuery`). */
export const relatedItemsFromGenreRails = (
  genreRails: GenreRail[] | undefined,
  options: { excludeId: number; genres: string[] }
): RailShowItem[] => {
  if (!genreRails?.length || !options.genres.length) {
    return []
  }

  const showIdsAlreadyIncluded = new Set<number>()
  const uniqueRelatedItems: RailShowItem[] = []

  for (const genre of options.genres) {
    const rail = genreRails.find((r) => r.genre === genre)
    if (!rail) {
      continue
    }

    for (const item of rail.items) {
      if (item.id === options.excludeId) {
        continue
      }
      if (showIdsAlreadyIncluded.has(item.id)) {
        continue
      }
      showIdsAlreadyIncluded.add(item.id)
      uniqueRelatedItems.push(item)
    }
  }

  return uniqueRelatedItems.sort(sortByRatingDescending)
}
