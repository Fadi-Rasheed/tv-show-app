<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SearchResultsGrid from '@/features/search/SearchResultsGrid.vue'
import SearchResultsState from '@/features/search/SearchResultsState.vue'
import type { SearchResultsViewState } from '@/features/search/SearchResultsState.vue'
import type { ShowSearchResultItem } from '@/shared/types/search'

const props = defineProps<{
  isPending: boolean
  isError: boolean
  showEmptyHint: boolean
  showNoResults: boolean
  results: ShowSearchResultItem[]
}>()

const { t } = useI18n()

const activeState = computed<SearchResultsViewState | null>(() => {
  if (props.showEmptyHint) {
    return 'emptyHint'
  }
  if (props.isPending) {
    return 'loading'
  }
  if (props.isError) {
    return 'error'
  }
  if (props.showNoResults) {
    return 'noResults'
  }

  return null
})
</script>

<template>
  <section
    :aria-label="t('common.pages.search.resultsRegionAria')"
    :aria-busy="isPending ? 'true' : 'false'"
    class="min-h-48"
    role="region"
  >
    <SearchResultsState v-if="activeState" :state="activeState" />
    <SearchResultsGrid v-else :results="results" />
  </section>
</template>
