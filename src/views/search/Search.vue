<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuery, type DefaultError } from '@tanstack/vue-query'
import { Search, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Spinner from '@/components/Spinner.vue'
import Tile from '@/components/Tile.vue'
import type { ShowSearchResponse } from '@/shared/types/search'
import { showSearchQueryOptions } from '@/shared/api/shows/queries'
import { createDebouncer } from '@/shared/utils/debounce'

const SEARCH_DEBOUNCE_MS = 350

/** Same fallback as `Rail.vue` when TVMaze omits `image`. */
const FALLBACK_SHOW_POSTER_URL = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'

const { t } = useI18n()

const searchInputId = 'search-page-query'
const searchQuery = ref('')
const debouncedQuery = ref('')

const searchInputDebouncer = createDebouncer<string>({
  debounceDelayMs: SEARCH_DEBOUNCE_MS,
  onDebouncedValue: (latestRawQuery) => {
    debouncedQuery.value = latestRawQuery.trim()
  },
  shouldFlushImmediately: (candidateRawQuery) => candidateRawQuery.trim().length === 0,
})

watch(searchQuery, (nextRawQuery) => {
  searchInputDebouncer.schedule(nextRawQuery)
})

onBeforeUnmount(() => {
  searchInputDebouncer.cancelPending()
})

const showSearchQuery = useQuery<ShowSearchResponse, DefaultError>(() =>
  showSearchQueryOptions(debouncedQuery.value)
)

const results = computed(() => showSearchQuery.data.value ?? [])

const showEmptyHint = computed(() => !debouncedQuery.value && !searchQuery.value.trim())

const showNoResults = computed(
  () =>
    debouncedQuery.value.length > 0 &&
    !showSearchQuery.isPending.value &&
    !showSearchQuery.isError.value &&
    results.value.length === 0
)

const formatRating = (average: number | null) => {
  if (average == null) {
    return t('common.pages.showDetails.noRating')
  }
  return t('common.pages.search.ratingValue', { rating: average.toFixed(1) })
}
</script>

<template>
  <main
    class="bg-background text-foreground xs:px-5 min-h-screen px-4 py-8 sm:px-6 sm:pt-14 sm:pb-10 lg:px-8 lg:pt-16"
  >
    <h1 class="sr-only">{{ t('common.pages.search.title') }}</h1>

    <section class="mb-6 sm:mb-12" :aria-label="t('common.pages.search.searchSectionAria')">
      <label class="sr-only" :for="searchInputId">
        {{ t('common.pages.search.searchInput.label') }}
      </label>
      <div class="relative w-full max-w-none">
        <Search
          class="text-foreground pointer-events-none absolute top-1/2 left-0 h-6 w-6 -translate-y-1/2 sm:h-7 sm:w-7"
          aria-hidden="true"
        />
        <input
          :id="searchInputId"
          v-model="searchQuery"
          type="text"
          inputmode="search"
          enterkeyhint="search"
          autocomplete="off"
          :aria-label="t('common.pages.search.searchInput.ariaLabel')"
          :placeholder="t('common.pages.search.searchInput.placeholder')"
          class="placeholder:text-muted/90 text-foreground w-full appearance-none border-0 border-b border-white/25 bg-transparent py-3 pr-11 pl-10 text-xl leading-snug transition-colors outline-none focus-visible:border-white/70 sm:py-4 sm:pl-12 sm:text-2xl"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="text-muted hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-0 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :aria-label="t('common.pages.search.clearAria')"
          @click="searchQuery = ''"
        >
          <X class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </section>

    <section
      :aria-label="t('common.pages.search.resultsRegionAria')"
      :aria-busy="showSearchQuery.isPending.value ? 'true' : 'false'"
      class="min-h-48"
      role="region"
    >
      <p v-if="showEmptyHint" class="text-muted text-body-md">
        {{ t('common.pages.search.states.emptyHint') }}
      </p>

      <div
        v-else-if="showSearchQuery.isPending.value"
        class="flex min-h-60 flex-col items-center justify-center gap-3"
      >
        <Spinner size="xl" />
        <span class="sr-only">{{ t('common.pages.search.states.loading') }}</span>
      </div>

      <div
        v-else-if="showSearchQuery.isError.value"
        class="bg-surface border-border rounded-xl border px-4 py-5"
        role="alert"
      >
        <p class="font-medium">{{ t('common.pages.search.states.errorTitle') }}</p>
        <p class="text-muted sm:text-body-md mt-2 text-sm">
          {{ t('common.pages.search.states.errorDescription') }}
        </p>
      </div>

      <p v-else-if="showNoResults" class="text-muted text-body-md">
        {{ t('common.pages.search.states.noResults') }}
      </p>

      <ul
        v-else
        class="m-0 list-none flex min-w-0 flex-wrap items-start justify-center gap-x-3 gap-y-6 p-0 sm:gap-x-4 sm:gap-y-8"
        :aria-setsize="results.length"
      >
        <li
          v-for="(entry, index) in results"
          :key="entry.show.id"
          class="basis-poster-tile-sm sm:basis-poster-tile-md md:basis-poster-tile-lg shrink-0 grow-0"
        >
          <RouterLink
            :to="{ name: 'show-details', params: { id: String(entry.show.id) } }"
            class="focus-visible:ring-ring block w-full max-w-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
            :aria-label="
              t('common.pages.search.tileAriaLabel', {
                title: entry.show.name,
                rating: formatRating(entry.show.rating.average),
              })
            "
            :aria-posinset="index + 1"
          >
            <Tile
              :image-url="
                entry.show.image?.medium ?? entry.show.image?.original ?? FALLBACK_SHOW_POSTER_URL
              "
              :rating="formatRating(entry.show.rating.average)"
              :title="entry.show.name"
            />
          </RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>
