export const showQueryKeys = {
  all: ['shows'] as const,
  search: (query: string) => [...showQueryKeys.all, 'search', query] as const,
  list: (page?: number) =>
    page === undefined
      ? ([...showQueryKeys.all, 'list'] as const)
      : ([...showQueryKeys.all, 'list', page] as const),

  browseGenre: (categorySlug: string) => [...showQueryKeys.all, 'browse', categorySlug] as const,
  /** Include `embed` in the key when present so cache differentiates embedded responses. */
  detail: (id: number, embed?: string) =>
    embed === undefined || embed === ''
      ? ([...showQueryKeys.all, 'detail', id] as const)
      : ([...showQueryKeys.all, 'detail', id, embed] as const),
  episodes: (id: number) => [...showQueryKeys.all, 'episodes', id] as const,
}
