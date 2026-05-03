<script setup lang="ts">
import Rail from '@/components/Rail.vue'
import type { GenreRail } from '@/shared/api/utils'

defineProps<{
  rails: GenreRail[]
}>()
</script>

<template>
  <section class="space-y-6 sm:space-y-12" data-testid="home-rails">
    <Rail
      v-for="rail in rails"
      :key="rail.genre"
      :browse-more="{ categorySlug: rail.categorySlug, showBrowseMore: true }"
      :items="rail.items"
      :title="rail.genre"
    />
  </section>
</template>
