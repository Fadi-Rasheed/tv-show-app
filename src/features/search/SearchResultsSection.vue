<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SearchEmptyHintState from '@/features/search/SearchEmptyHintState.vue'
import SearchErrorState from '@/features/search/SearchErrorState.vue'
import SearchLoadingState from '@/features/search/SearchLoadingState.vue'
import SearchNoResultsState from '@/features/search/SearchNoResultsState.vue'
import SearchResultsGrid from '@/features/search/SearchResultsGrid.vue'
import type { ShowSearchResultItem } from '@/shared/types/search'

defineProps<{
  isPending: boolean
  isError: boolean
  showEmptyHint: boolean
  showNoResults: boolean
  results: ShowSearchResultItem[]
  formatRating: (average: number | null) => string
}>()

const { t } = useI18n()
</script>

<template>
  <section
    :aria-label="t('common.pages.search.resultsRegionAria')"
    :aria-busy="isPending ? 'true' : 'false'"
    class="min-h-48"
    role="region"
  >
    <SearchEmptyHintState v-if="showEmptyHint" />
    <SearchLoadingState v-else-if="isPending" />
    <SearchErrorState v-else-if="isError" />
    <SearchNoResultsState v-else-if="showNoResults" />
    <SearchResultsGrid v-else :results="results" :format-rating="formatRating" />
  </section>
</template>
