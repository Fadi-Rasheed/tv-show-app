<script setup lang="ts">
import { computed, watch } from 'vue'
import { useInfiniteQuery, type DefaultError, type InfiniteData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useIntersectionObserverTarget } from '@/composables/useIntersectionObserverTarget'
import BrowseHeader from '@/features/browse/BrowseHeader.vue'
import BrowseResultsSection from '@/features/browse/BrowseResultsSection.vue'
import type { ShowsResponse } from '@/shared/types/show'
import { showsByGenreBrowseInfiniteQueryOptions } from '@/shared/api/queries'
import { collectGenreShowsFromPages } from '@/shared/api/utils'

/** Auto-prefetch at most this many index pages to avoid hammering the API for sparse genres. */
const MAX_BROWSE_PREFETCH_PAGES = 5

/** Stop prefetching once the grid has enough tiles or the page cap is hit. */
const MIN_GENRE_RESULTS_TO_FILL_VIEW = 12

const props = defineProps<{
  category: string
}>()

const { t } = useI18n()

const categoryTitle = computed(() => {
  return props.category
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
})

const browseQuery = useInfiniteQuery<
  ShowsResponse,
  DefaultError,
  InfiniteData<ShowsResponse, number>,
  readonly unknown[],
  number
>(() => showsByGenreBrowseInfiniteQueryOptions(props.category))

const filteredItems = computed(() =>
  collectGenreShowsFromPages(browseQuery.data.value?.pages, props.category)
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
</script>

<template>
  <main
    class="bg-background text-foreground xs:px-5 min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8"
    data-testid="browse-page"
  >
    <BrowseHeader :category-title="categoryTitle" />
    <BrowseResultsSection
      :is-fetching="browseQuery.isFetching.value"
      :is-pending="browseQuery.isPending.value"
      :is-error="browseQuery.isError.value"
      :show-no-results="showNoResults"
      :show-empty-while-searching="showEmptyWhileSearching"
      :has-items="filteredItems.length > 0"
      :items="filteredItems"
      :category-title="categoryTitle"
      :has-next-page="browseQuery.hasNextPage.value"
      :is-fetching-next-page="browseQuery.isFetchingNextPage.value"
      :format-rating="formatRating"
      @load-more="onLoadMore"
      @sentinel-change="onSentinelChange"
    />
  </main>
</template>
