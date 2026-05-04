<script setup lang="ts">
import { getActivePinia } from 'pinia'
import Rail from '@/components/Rail.vue'
import { useBrowseFiltersStore } from '@/features/browse/stores/useBrowseFiltersStore'
import type { GenreRail } from '@/shared/api/utils'
import type { ShowGenre } from '@/shared/types/genre'

defineProps<{
  rails: GenreRail[]
}>()

const onBrowseMoreClick = (genre: ShowGenre) => {
  if (!getActivePinia()) {
    return
  }

  const browseFiltersStore = useBrowseFiltersStore()
  browseFiltersStore.setSingleGenre(genre)
}
</script>

<template>
  <section class="space-y-6 sm:space-y-12" data-testid="home-rails">
    <Rail
      v-for="rail in rails"
      :key="rail.genre"
      :browse-more="{ genre: rail.genre, showBrowseMore: true }"
      :items="rail.items"
      :title="rail.genre"
      @browse-more-click="onBrowseMoreClick"
    />
  </section>
</template>
