<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Tile from '@/components/Tile.vue'
import type { GenreBrowseShowItem } from '@/shared/api/utils'
import { useI18n } from 'vue-i18n'

defineProps<{
  items: GenreBrowseShowItem[]
  formatRating: (average: number | null) => string
}>()

const { t } = useI18n()
</script>

<template>
  <ul
    class="m-0 flex w-full min-w-0 list-none flex-wrap items-start justify-around gap-x-3 gap-y-6 p-0 sm:gap-x-4 sm:gap-y-8 lg:justify-start"
  >
    <li
      v-for="item in items"
      :key="item.id"
      class="basis-poster-tile-sm sm:basis-poster-tile-md md:basis-poster-tile-lg shrink-0 grow-0"
    >
      <RouterLink
        :to="{ name: 'show-details', params: { id: String(item.id) } }"
        class="focus-visible:ring-ring block w-full max-w-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
        :aria-label="
          t('common.pages.browse.tileAriaLabel', {
            title: item.title,
            rating: formatRating(item.ratingAverage),
          })
        "
      >
        <Tile
          :image-url="item.image.medium ?? item.image.original"
          :genres="item.genres"
          :rating="formatRating(item.ratingAverage)"
          :title="item.title"
        />
      </RouterLink>
    </li>
  </ul>
</template>
