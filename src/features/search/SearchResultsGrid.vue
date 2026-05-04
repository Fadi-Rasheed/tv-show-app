<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Tile from '@/components/Tile.vue'
import type { ShowSearchResultItem } from '@/shared/types/search'

/** Same fallback as `Rail.vue` when TVMaze omits `image`. */
const FALLBACK_SHOW_POSTER_URL = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'

defineProps<{
  results: ShowSearchResultItem[]
}>()

const { t } = useI18n()

const formatRating = (average: number | null) => {
  if (average == null) {
    return t('common.pages.showDetails.noRating')
  }
  return t('common.pages.search.ratingValue', { rating: average.toFixed(1) })
}
</script>

<template>
  <ul
    class="m-0 flex min-w-0 list-none flex-wrap items-start justify-center gap-x-3 gap-y-6 p-0 sm:gap-x-4 sm:gap-y-8"
    :aria-setsize="results.length"
  >
    <li
      v-for="(entry, index) in results"
      :key="entry.show.id"
      class="basis-poster-tile-sm sm:basis-poster-tile-md md:basis-poster-tile-lg shrink-0 grow-0"
    >
      <RouterLink
        :to="{ name: 'show-details', params: { id: String(entry.show.id) } }"
        class="focus-visible:ring-ring block w-full max-w-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
        :aria-label="
          t('common.pages.search.tileAriaLabel', {
            title: entry.show.name,
            rating: formatRating(entry.show.rating.average),
          })
        "
        :aria-posinset="index + 1"
      >
        <Tile
          :image-url="
            entry.show.image?.medium ?? entry.show.image?.original ?? FALLBACK_SHOW_POSTER_URL
          "
          :genres="entry.show.genres"
          :rating="formatRating(entry.show.rating.average)"
          :title="entry.show.name"
        />
      </RouterLink>
    </li>
  </ul>
</template>
