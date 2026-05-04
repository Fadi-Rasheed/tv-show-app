<script setup lang="ts">
import { computed, watch } from 'vue'
import { useInfiniteQuery, type DefaultError, type InfiniteData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useIntersectionObserverTarget } from '@/composables/useIntersectionObserverTarget'
import BrowseGenreFilters from '@/features/browse/BrowseGenreFilters.vue'
import BrowseHeader from '@/features/browse/BrowseHeader.vue'
import BrowseResultsSection from '@/features/browse/BrowseResultsSection.vue'
import { useBrowseFiltersStore } from '@/stores/useBrowseFiltersStore'
import type { ShowsResponse } from '@/shared/types/show'
import { showsPagesInfiniteQueryOptions } from '@/shared/api/queries'
import { collectBrowseShowsFromPages } from '@/shared/api/utils'
import type { ShowGenre } from '@/shared/types/genre'
import { SHOW_GENRES } from '@/shared/types/genre'

// Auto-prefetch at most this many index pages to avoid hammering the API for sparse genres.
const MAX_BROWSE_PREFETCH_PAGES = 2

// Stop prefetching once the grid has enough tiles or the page cap is hit.
const MIN_GENRE_RESULTS_TO_FILL_VIEW = 10

const { t } = useI18n()
const browseFiltersStore = useBrowseFiltersStore()

const browseQuery = useInfiniteQuery<
  ShowsResponse,
  DefaultError,
  InfiniteData<ShowsResponse, number>,
  readonly unknown[],
  number
>(() => showsPagesInfiniteQueryOptions())

const filteredItems = computed(() =>
  collectBrowseShowsFromPages(browseQuery.data.value?.pages, browseFiltersStore.selectedGenres)
)

const prefetchPagesLoaded = computed(() => browseQuery.data.value?.pages.length ?? 0)
const hasLoadedAnyPage = computed(() => Boolean(browseQuery.data.value?.pages?.length))
const isBrowseReady = computed(() => !browseQuery.isPending.value && !browseQuery.isError.value)
const canFetchNextPage = computed(
  () => isBrowseReady.value && browseQuery.hasNextPage.value && !browseQuery.isFetching.value
)

const formatRating = (average: number | null) => {
  if (average == null) {
    return t('common.pages.showDetails.noRating')
  }
  return t('common.pages.search.ratingValue', { rating: average.toFixed(1) })
}

const showNoResults = computed(
  () => isBrowseReady.value && !browseQuery.hasNextPage.value && filteredItems.value.length === 0
)

const showEmptyWhileSearching = computed(
  () =>
    filteredItems.value.length === 0 &&
    browseQuery.hasNextPage.value &&
    isBrowseReady.value &&
    prefetchPagesLoaded.value < MAX_BROWSE_PREFETCH_PAGES
)

const shouldAutoPrefetch = computed(
  () =>
    canFetchNextPage.value &&
    hasLoadedAnyPage.value &&
    prefetchPagesLoaded.value < MAX_BROWSE_PREFETCH_PAGES &&
    filteredItems.value.length < MIN_GENRE_RESULTS_TO_FILL_VIEW
)

const { target: loadMoreSentinel } = useIntersectionObserverTarget({
  isEnabled: computed(() => browseQuery.hasNextPage.value),
  observerOptions: { root: null, rootMargin: '320px 0px', threshold: 0 },
  onIntersect: (entries) => {
    const [entry] = entries
    if (!entry?.isIntersecting || !canFetchNextPage.value) {
      return
    }
    void browseQuery.fetchNextPage()
  },
})

watch(
  shouldAutoPrefetch,
  (canPrefetch) => {
    if (!canPrefetch) {
      return
    }
    void browseQuery.fetchNextPage()
  },
  { flush: 'post' }
)

const onLoadMore = () => {
  if (browseQuery.isFetchingNextPage.value || !canFetchNextPage.value) {
    return
  }
  void browseQuery.fetchNextPage()
}

const onSentinelChange = (el: HTMLElement | null) => {
  loadMoreSentinel.value = el
}

const onToggleGenre = (genre: ShowGenre) => {
  browseFiltersStore.toggleGenre(genre)
}

const onClearGenres = () => {
  browseFiltersStore.clearGenres()
}
</script>

<template>
  <main
    class="bg-background text-foreground xs:px-5 min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8"
    data-testid="browse-page"
  >
    <BrowseHeader />
    <BrowseGenreFilters
      :genres="SHOW_GENRES"
      :selected-genres="browseFiltersStore.selectedGenres"
      @toggle-genre="onToggleGenre"
      @clear-genres="onClearGenres"
    />
    <BrowseResultsSection
      :is-fetching="browseQuery.isFetching.value"
      :is-pending="browseQuery.isPending.value"
      :is-error="browseQuery.isError.value"
      :show-no-results="showNoResults"
      :show-empty-while-searching="showEmptyWhileSearching"
      :has-items="filteredItems.length > 0"
      :items="filteredItems"
      :has-next-page="browseQuery.hasNextPage.value"
      :is-fetching-next-page="browseQuery.isFetchingNextPage.value"
      :format-rating="formatRating"
      @load-more="onLoadMore"
      @sentinel-change="onSentinelChange"
    />
  </main>
</template>
