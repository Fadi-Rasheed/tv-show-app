<script setup lang="ts">
import Rail from '@/components/Rail.vue'
import { useBrowseFiltersStore } from '@/stores/useBrowseFiltersStore'
import type { GenreRail } from '@/shared/api/utils'
import type { ShowGenre } from '@/shared/types/genre'

defineProps<{
  rails: GenreRail[]
}>()

const browseFiltersStore = useBrowseFiltersStore()

const onBrowseMoreClick = (genre: ShowGenre) => {
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
