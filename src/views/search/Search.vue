<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useQuery, type DefaultError } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import SearchInput from '@/features/search/SearchInput.vue'
import SearchResultsSection from '@/features/search/SearchResultsSection.vue'
import type { ShowSearchResponse } from '@/shared/types/search'
import { showSearchQueryOptions } from '@/shared/api/queries'
import { createDebouncer } from '@/shared/utils/debounce'

const SEARCH_DEBOUNCE_MS = 350

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
  <main class="bg-background text-foreground xs:px-5 px-4 pt-8 sm:px-6 sm:pt-10">
    <section class="mb-6 sm:mb-12" :aria-label="t('common.pages.search.searchSectionAria')">
      <SearchInput
        :id="searchInputId"
        v-model="searchQuery"
        :label="t('common.pages.search.searchInput.label')"
        :input-aria-label="t('common.pages.search.searchInput.ariaLabel')"
        :placeholder="t('common.pages.search.searchInput.placeholder')"
        :clear-input-aria-label="t('common.pages.search.clearAria')"
      />
    </section>

    <SearchResultsSection
      :is-pending="showSearchQuery.isPending.value"
      :is-error="showSearchQuery.isError.value"
      :show-empty-hint="showEmptyHint"
      :show-no-results="showNoResults"
      :results="results"
      :format-rating="formatRating"
    />
  </main>
</template>
