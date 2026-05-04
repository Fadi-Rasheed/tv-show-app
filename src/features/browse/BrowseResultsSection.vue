<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BrowseErrorState from '@/features/browse/BrowseErrorState.vue'
import BrowseFindingShowsState from '@/features/browse/BrowseFindingShowsState.vue'
import BrowseLoadMore from '@/features/browse/BrowseLoadMore.vue'
import BrowseLoadingState from '@/features/browse/BrowseLoadingState.vue'
import BrowseNoResultsState from '@/features/browse/BrowseNoResultsState.vue'
import BrowseShowsGrid from '@/features/browse/BrowseShowsGrid.vue'
import type { GenreBrowseShowItem } from '@/shared/api/utils'

defineProps<{
  isFetching: boolean
  isPending: boolean
  isError: boolean
  showNoResults: boolean
  showEmptyWhileSearching: boolean
  hasItems: boolean
  items: GenreBrowseShowItem[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  formatRating: (average: number | null) => string
}>()

const emit = defineEmits<{
  loadMore: []
  sentinelChange: [HTMLElement | null]
}>()

const { t } = useI18n()
</script>

<template>
  <section
    :aria-label="t('common.pages.browse.resultsRegionAria')"
    :aria-busy="isFetching ? 'true' : 'false'"
    class="min-h-48"
    role="region"
  >
    <BrowseLoadingState v-if="isPending" />
    <BrowseErrorState v-else-if="isError" />

    <template v-else>
      <BrowseNoResultsState v-if="showNoResults" />

      <template v-else>
        <BrowseFindingShowsState v-if="showEmptyWhileSearching" />

        <BrowseShowsGrid v-if="hasItems" :items="items" :format-rating="formatRating" />

        <BrowseLoadMore
          v-if="hasNextPage"
          :is-fetching-next-page="isFetchingNextPage"
          @load-more="emit('loadMore')"
          @sentinel-change="(el) => emit('sentinelChange', el)"
        />
      </template>
    </template>
  </section>
</template>
