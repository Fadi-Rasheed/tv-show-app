<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useInfiniteQuery, type DefaultError, type InfiniteData } from '@tanstack/vue-query'
import Button from '@/components/Button.vue'
import Spinner from '@/components/Spinner.vue'
import Tile from '@/components/Tile.vue'
import { useI18n } from 'vue-i18n'
import type { ShowsResponse } from '@/shared/types/show'
import {
  collectGenreShowsFromPages,
  showsByGenreBrowseInfiniteQueryOptions,
} from '@/shared/api/shows/queries'

/** Auto-prefetch at most this many index pages to avoid hammering the API for sparse genres. */
const MAX_BROWSE_PREFETCH_PAGES = 5

/** Stop prefetching once the grid has enough tiles or the page cap is hit. */
const MIN_GENRE_RESULTS_TO_FILL_VIEW = 14

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

const formatRating = (average: number | null) => {
  if (average == null) {
    return t('common.pages.showDetails.noRating')
  }
  return t('common.pages.search.ratingValue', { rating: average.toFixed(1) })
}

const showNoResults = computed(
  () =>
    !browseQuery.isPending.value &&
    !browseQuery.isError.value &&
    !browseQuery.hasNextPage.value &&
    filteredItems.value.length === 0
)

const showEmptyWhileSearching = computed(
  () =>
    filteredItems.value.length === 0 &&
    browseQuery.hasNextPage.value &&
    !browseQuery.isPending.value &&
    !browseQuery.isError.value &&
    prefetchPagesLoaded.value < MAX_BROWSE_PREFETCH_PAGES
)

const loadMoreSentinel = ref<HTMLElement | null>(null)
let intersectionObserver: IntersectionObserver | null = null

const disconnectObserver = () => {
  intersectionObserver?.disconnect()
  intersectionObserver = null
}

const setupIntersectionObserver = (el: HTMLElement) => {
  disconnectObserver()
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      if (!entry?.isIntersecting) {
        return
      }
      if (browseQuery.isPending.value) {
        return
      }
      if (!browseQuery.hasNextPage.value) {
        return
      }
      if (browseQuery.isFetching.value) {
        return
      }
      void browseQuery.fetchNextPage()
    },
    { root: null, rootMargin: '320px 0px', threshold: 0 }
  )
  intersectionObserver.observe(el)
}

watch(
  loadMoreSentinel,
  (el) => {
    disconnectObserver()
    if (el) {
      setupIntersectionObserver(el)
    }
  },
  { flush: 'post' }
)

watch(
  () => [
    prefetchPagesLoaded.value,
    browseQuery.hasNextPage.value,
    browseQuery.isFetching.value,
    browseQuery.isPending.value,
    browseQuery.isError.value,
    filteredItems.value.length,
  ],
  () => {
    if (browseQuery.isError.value || browseQuery.isPending.value) {
      return
    }
    if (!browseQuery.data.value?.pages?.length) {
      return
    }
    if (!browseQuery.hasNextPage.value) {
      return
    }
    if (browseQuery.isFetching.value) {
      return
    }
    if (prefetchPagesLoaded.value >= MAX_BROWSE_PREFETCH_PAGES) {
      return
    }
    if (filteredItems.value.length >= MIN_GENRE_RESULTS_TO_FILL_VIEW) {
      return
    }
    void browseQuery.fetchNextPage()
  },
  { flush: 'post' }
)

const onLoadMore = () => {
  if (browseQuery.isFetchingNextPage.value || !browseQuery.hasNextPage.value) {
    return
  }
  void browseQuery.fetchNextPage()
}

onBeforeUnmount(() => {
  disconnectObserver()
})
</script>

<template>
  <main
    class="bg-background text-foreground xs:px-5 min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8"
    data-testid="browse-page"
  >
    <header class="mb-6 sm:mb-8">
      <h1 class="font-header sm:text-header-md text-2xl leading-8">
        {{ t('common.pages.browse.title', { category: categoryTitle }) }}
      </h1>
      <p class="text-muted sm:text-body-md mt-2 max-w-2xl text-sm leading-6">
        {{ t('common.pages.browse.description', { category: categoryTitle }) }}
      </p>
    </header>

    <section
      :aria-label="t('common.pages.browse.resultsRegionAria')"
      :aria-busy="browseQuery.isFetching.value ? 'true' : 'false'"
      class="min-h-48"
      role="region"
    >
      <div
        v-if="browseQuery.isPending.value"
        class="flex min-h-60 flex-col items-center justify-center gap-3"
      >
        <Spinner size="xl" />
        <span class="sr-only">{{ t('common.pages.browse.states.loading') }}</span>
      </div>

      <div
        v-else-if="browseQuery.isError.value"
        class="bg-surface border-border rounded-xl border px-4 py-5"
        role="alert"
      >
        <p class="font-medium">{{ t('common.pages.browse.states.errorTitle') }}</p>
        <p class="text-muted sm:text-body-md mt-2 text-sm">
          {{ t('common.pages.browse.states.errorDescription') }}
        </p>
      </div>

      <template v-else>
        <p v-if="showNoResults" class="text-muted text-body-md">
          {{ t('common.pages.browse.states.noResults', { category: categoryTitle }) }}
        </p>

        <template v-else>
          <div
            v-if="showEmptyWhileSearching"
            class="text-muted sm:text-body-md flex min-h-40 flex-col items-center justify-center gap-3 text-sm"
            role="status"
          >
            <Spinner size="lg" />
            {{ t('common.pages.browse.states.findingShows') }}
          </div>

          <ul
            v-if="filteredItems.length > 0"
            class="m-0 flex min-w-0 list-none flex-wrap items-start justify-start gap-x-3 gap-y-6 p-0 sm:gap-x-4 sm:gap-y-8"
            :aria-setsize="filteredItems.length"
          >
            <li
              v-for="(item, index) in filteredItems"
              :key="item.id"
              class="basis-poster-tile-sm sm:basis-poster-tile-md md:basis-poster-tile-lg shrink-0 grow-0"
            >
              <RouterLink
                :to="{ name: 'show-details', params: { id: String(item.id) } }"
                class="focus-visible:ring-ring block w-full max-w-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
                :aria-label="
                  t('common.pages.browse.tileAriaLabel', {
                    title: item.title,
                    rating: formatRating(item.ratingAverage),
                  })
                "
                :aria-posinset="index + 1"
              >
                <Tile
                  :image-url="item.image.medium ?? item.image.original"
                  :genres="item.genres"
                  :rating="formatRating(item.ratingAverage)"
                  :title="item.title"
                />
              </RouterLink>
            </li>
          </ul>

          <div
            v-if="browseQuery.hasNextPage.value"
            ref="loadMoreSentinel"
            class="pointer-events-none h-1 w-full shrink-0"
            aria-hidden="true"
          />

          <div
            v-if="browseQuery.hasNextPage.value"
            class="flex w-full justify-center px-2 pt-8 pb-2"
          >
            <Button
              variant="primary"
              :loading="browseQuery.isFetchingNextPage.value"
              @click="onLoadMore"
            >
              {{ t('common.components.button.loadMore') }}
            </Button>
          </div>
        </template>
      </template>
    </section>
  </main>
</template>
