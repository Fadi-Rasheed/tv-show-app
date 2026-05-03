import type { QueryFunctionContext } from '@tanstack/query-core'
import { useQuery, type DefaultError } from '@tanstack/vue-query'
import { fetchApi, fetchShowsIndexPage } from '@/shared/api/fetch'
import type { ShowSearchResponse } from '@/shared/types/search'
import type { ShowsResponse } from '@/shared/types/show'
import type { ShowWithEmbedded } from '@/shared/types/show-embedded'
import type { EpisodesResponse } from '@/shared/types/episode'
import { showQueryKeys } from './query-keys'
import { buildGenreRails } from './utils'
import type { GenreRail } from './utils'

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
