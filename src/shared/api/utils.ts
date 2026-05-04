import type { ShowGenre } from '@/shared/types/genre'
import type { Show, ShowImage, ShowsResponse } from '@/shared/types/show'

export type RailShowItem = {
  id: number
  title: string
  image: ShowImage
  rating: number
  genres: ShowGenre[]
}

export type GenreRail = {
  genre: ShowGenre
  categorySlug: string
  items: RailShowItem[]
}

export type GenreBrowseShowItem = {
  id: number
  title: string
  image: ShowImage
  ratingAverage: number | null
  genres: ShowGenre[]
}

const FALLBACK_SHOW_IMAGE_URL = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'

const FALLBACK_SHOW_IMAGE: ShowImage = {
  medium: FALLBACK_SHOW_IMAGE_URL,
  original: FALLBACK_SHOW_IMAGE_URL,
}

export const toCategorySlug = (value: string) => value.trim().toLowerCase()

/**
 * Browse match: true if `categorySlug` equals the slug for **any** string in `show.genres`
 * (position does not matter — TVMaze does not expose a separate “primary” genre field).
 */
export const showMatchesBrowseCategory = (show: Show, categorySlug: string): boolean => {
  const genres = Array.isArray(show.genres) ? show.genres : []
  const normalizedCategorySlug = toCategorySlug(categorySlug)

  return genres.some((genre) => {
    if (typeof genre !== 'string') {
      return false
    }

    return normalizedCategorySlug && toCategorySlug(genre) === normalizedCategorySlug
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
  const railsByGenre = new Map<ShowGenre, RailShowItem[]>()

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

const showHasGenre = (show: Show, genre: ShowGenre) => {
  const genres = Array.isArray(show.genres) ? show.genres : []
  return genres.includes(genre)
}

const toBrowseShowItem = (show: Show): GenreBrowseShowItem => ({
  id: show.id,
  title: show.name,
  image: show.image ?? FALLBACK_SHOW_IMAGE,
  ratingAverage: show.rating.average,
  genres: show.genres,
})

export const collectBrowseShowsFromPages = (
  pages: ShowsResponse[] | undefined,
  selectedGenres: ShowGenre[]
): GenreBrowseShowItem[] => {
  if (!pages?.length) {
    return []
  }

  const hasFilters = selectedGenres.length > 0
  const items: GenreBrowseShowItem[] = []

  for (const page of pages) {
    for (const show of page) {
      if (!hasFilters) {
        items.push(toBrowseShowItem(show))
        continue
      }

      const matchesAllSelectedGenres = selectedGenres.every((genre) => showHasGenre(show, genre))
      if (matchesAllSelectedGenres) {
        items.push(toBrowseShowItem(show))
      }
    }
  }

  return items
}

export const relatedItemsFromGenreRails = (
  genreRails: GenreRail[] | undefined,
  options: { excludeId: number; genres: string[] }
): RailShowItem[] => {
  if (!genreRails?.length || !options.genres.length) {
    return []
  }

  const relatedItemsByShowId = new Map<number, RailShowItem>()

  for (const genre of options.genres) {
    const rail = genreRails.find((r) => r.genre === genre)
    if (!rail) {
      continue
    }

    for (const item of rail.items) {
      if (item.id === options.excludeId) {
        continue
      }
      if (relatedItemsByShowId.has(item.id)) {
        continue
      }
      relatedItemsByShowId.set(item.id, item)
    }
  }

  return [...relatedItemsByShowId.values()].sort(sortByRatingDescending)
}
