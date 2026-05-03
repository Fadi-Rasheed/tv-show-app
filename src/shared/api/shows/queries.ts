import type { QueryFunctionContext } from '@tanstack/query-core'
import { useQuery, type DefaultError } from '@tanstack/vue-query'
import { fetchApi, fetchShowsIndexPage } from '@/shared/api/fetch'
import type { ShowSearchResponse } from '@/shared/types/search'
import type { Show, ShowImage, ShowsResponse } from '@/shared/types/show'
import type { ShowWithEmbedded } from '@/shared/types/show-embedded'
import type { EpisodesResponse } from '@/shared/types/episode'
import { showQueryKeys } from './query-keys'

type RailShowItem = {
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

export const showsByGenreBrowseInfiniteQueryOptions = (categorySlug: string) => ({
  queryKey: showQueryKeys.browseGenre(categorySlug),
  queryFn: (context: QueryFunctionContext<readonly unknown[], number>) =>
    fetchShowsIndexPage(context.pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage: ShowsResponse, _allPages: ShowsResponse[], lastPageParam: number) =>
    lastPage.length === 0 ? undefined : lastPageParam + 1,
  enabled: categorySlug.length > 0,
})

export const useShowsByGenreQuery = (page?: number) =>
  useQuery<ShowsResponse, DefaultError, GenreRail[]>({
    queryKey: showQueryKeys.list(page),
    queryFn: () => fetchApi<ShowsResponse>('/shows', page === undefined ? {} : { query: { page } }),
    select: (shows) => buildGenreRails(shows),
  })

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

/** @param showId - Numeric show id. Use `RouterView` `:key="route.path"` (or similar) so this updates when the route id changes. */
export const useShowDetailQuery = (showId: number, embed?: string) =>
  useQuery<ShowWithEmbedded, DefaultError, ShowWithEmbedded>({
    queryKey: showQueryKeys.detail(showId, embed),
    queryFn: () =>
      fetchApi<ShowWithEmbedded>(
        `/shows/${showId}`,
        embed === undefined || embed === '' ? {} : { query: { embed } }
      ),
    enabled: Number.isFinite(showId) && showId > 0,
  })

export const useShowEpisodesQuery = (showId: number, enabled = true) =>
  useQuery({
    queryKey: showQueryKeys.episodes(showId),
    queryFn: () => fetchApi<EpisodesResponse>(`/shows/${showId}/episodes`),
    enabled: showId > 0 && enabled,
  })

export const showSearchQueryOptions = (searchQuery: string) => {
  const q = searchQuery.trim()

  return {
    queryKey: showQueryKeys.search(q),
    queryFn: () =>
      fetchApi<ShowSearchResponse>('/search/shows', {
        query: { q },
      }),
    enabled: q.length > 0,
  }
}
