<script setup lang="ts">
import HomeRails from '@/features/home/HomeRails.vue'
import HomeStates, { type HomeViewState } from '@/features/home/HomeStates.vue'
import { useShowsByGenreQuery } from '@/shared/api/queries'
import { computed } from 'vue'

const genreRailsQuery = useShowsByGenreQuery()

const homeState = computed<HomeViewState | null>(() => {
  if (genreRailsQuery.isLoading.value) {
    return 'loading'
  }
  if (genreRailsQuery.isError.value || !genreRailsQuery.data.value) {
    return 'error'
  }
  if (genreRailsQuery.data.value.length === 0) {
    return 'empty'
  }

  return null
})
</script>

<template>
  <main
    class="bg-background text-foreground xs:px-5 min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8"
    data-testid="home-page"
  >
    <HomeStates v-if="homeState" :state="homeState" />
    <HomeRails v-else :rails="genreRailsQuery.data.value ?? []" />
  </main>
</template>
