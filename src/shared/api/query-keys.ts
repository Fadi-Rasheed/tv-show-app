export const showQueryKeys = {
  all: ['shows'] as const,
  search: (query: string) => [...showQueryKeys.all, 'search', query] as const,
  list: (page?: number) =>
    page === undefined
      ? ([...showQueryKeys.all, 'list'] as const)
      : ([...showQueryKeys.all, 'list', page] as const),

  browse: () => [...showQueryKeys.all, 'browse'] as const,
  detail: (id: number, embed?: string) =>
    embed === undefined || embed === ''
      ? ([...showQueryKeys.all, 'detail', id] as const)
      : ([...showQueryKeys.all, 'detail', id, embed] as const),
  episodes: (id: number) => [...showQueryKeys.all, 'episodes', id] as const,
}
