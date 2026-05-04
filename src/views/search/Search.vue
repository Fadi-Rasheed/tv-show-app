<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SearchInput from '@/features/search/SearchInput.vue'
import SearchResultsSection from '@/features/search/SearchResultsSection.vue'
import { useShowSearchQuery } from '@/shared/api/queries'
import { createDebouncer } from '@/shared/utils/debounce'

const SEARCH_DEBOUNCE_MS = 350

const { t } = useI18n()

const searchInputId = 'search-page-query'
const searchQuery = ref('')
const debouncedQuery = ref('')

const searchInputDebouncer = createDebouncer<string>({
  debounceDelayMs: SEARCH_DEBOUNCE_MS,
  onDebouncedValue: (latestQuery) => {
    debouncedQuery.value = latestQuery.trim()
  },
  shouldFlushImmediately: (query) => query.trim().length === 0,
})

watch(searchQuery, (nextQuery) => {
  searchInputDebouncer.schedule(nextQuery)
})

onBeforeUnmount(() => {
  searchInputDebouncer.cancelPending()
})

const showSearchQuery = useShowSearchQuery(() => debouncedQuery.value)

const results = computed(() => showSearchQuery.data.value ?? [])

const showEmptyHint = computed(() => !debouncedQuery.value && !searchQuery.value.trim())

const showNoResults = computed(
  () =>
    debouncedQuery.value.length > 0 &&
    !showSearchQuery.isLoading.value &&
    !showSearchQuery.isError.value &&
    results.value.length === 0
)
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
      :is-pending="showSearchQuery.isLoading.value"
      :is-error="showSearchQuery.isError.value"
      :show-empty-hint="showEmptyHint"
      :show-no-results="showNoResults"
      :results="results"
    />
  </main>
</template>
