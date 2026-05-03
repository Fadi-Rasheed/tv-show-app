<script setup lang="ts">
import HomeEmptyState from '@/features/home/HomeEmptyState.vue'
import HomeErrorState from '@/features/home/HomeErrorState.vue'
import HomeLoadingState from '@/features/home/HomeLoadingState.vue'
import HomeRails from '@/features/home/HomeRails.vue'
import { useShowsByGenreQuery } from '@/shared/api/queries'
const genreRailsQuery = useShowsByGenreQuery()
</script>

<template>
  <main
    class="bg-background text-foreground xs:px-5 min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8"
    data-testid="home-page"
  >
    <HomeLoadingState v-if="genreRailsQuery.isLoading.value" />
    <HomeErrorState v-else-if="genreRailsQuery.isError.value" />
    <HomeEmptyState v-else-if="!genreRailsQuery.data.value?.length" />
    <HomeRails v-else :rails="genreRailsQuery.data.value" />
  </main>
</template>
