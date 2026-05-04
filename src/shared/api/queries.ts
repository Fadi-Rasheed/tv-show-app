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

export const showsPagesInfiniteQueryOptions = (queryKeyPart: string) => ({
  queryKey: showQueryKeys.browseGenre(queryKeyPart),
  queryFn: (context: QueryFunctionContext<readonly unknown[], number>) =>
    fetchShowsIndexPage(context.pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage: ShowsResponse, _allPages: ShowsResponse[], lastPageParam: number) =>
    lastPage.length === 0 ? undefined : lastPageParam + 1,
  enabled: queryKeyPart.length > 0,
})

type ShowsQueryResult<TData> = ReturnType<typeof useQuery<ShowsResponse, DefaultError, TData>>

export function useShowsQuery<TTransformed = ShowsResponse>(
  page?: number,
  transform?: (shows: ShowsResponse) => TTransformed
): ShowsQueryResult<TTransformed> {
  return useQuery<ShowsResponse, DefaultError, TTransformed>({
    queryKey: showQueryKeys.list(page),
    queryFn: () => fetchShowsIndexPage(page),
    ...(transform ? { select: transform } : {}),
  })
}

export const useShowsByGenreQuery = (
  page?: number
): ReturnType<typeof useQuery<ShowsResponse, DefaultError, GenreRail[]>> =>
  useShowsQuery(page, buildGenreRails)

export const useShowDetailQuery = (showId: number, embed?: string) =>
  useQuery<ShowWithEmbedded>({
    queryKey: showQueryKeys.detail(showId, embed),
    queryFn: () =>
      fetchApi<ShowWithEmbedded>(
        `/shows/${showId}`,
        embed === undefined || embed === '' ? {} : { query: { embed } }
      ),
    enabled: Boolean(showId),
  })

export const useShowEpisodesQuery = (showId: number, enabled = true) =>
  useQuery({
    queryKey: showQueryKeys.episodes(showId),
    queryFn: () => fetchApi<EpisodesResponse>(`/shows/${showId}/episodes`),
    enabled: showId > 0 && enabled,
  })

export const useShowSearchQuery = (getSearchQuery: () => string) => {
  const getTrimmedQuery = () => getSearchQuery().trim()

  return useQuery<ShowSearchResponse, DefaultError>(() => {
    const q = getTrimmedQuery()

    return {
      queryKey: showQueryKeys.search(q),
      queryFn: () =>
        fetchApi<ShowSearchResponse>('/search/shows', {
          query: { q },
        }),
      enabled: q.length > 0,
    }
  })
}
