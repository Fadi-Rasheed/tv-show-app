<script setup lang="ts">
import { computed } from 'vue'
import MediaCard from '@/components/MediaCard.vue'
import Rating from '@/components/Rating.vue'

const props = withDefaults(
  defineProps<{
    imageUrl: string
    title: string
    rating: number | string
    genres?: string[]
  }>(),
  {
    genres: () => [],
  }
)

const genresLabel = computed(() => props.genres.filter(Boolean).join(' | '))
</script>

<template>
  <MediaCard
    image-preset="portrait"
    :image-url="props.imageUrl"
    :image-alt="props.title"
    image-data-test-id="show-tile-image"
    data-testid="show-tile"
  >
    <template #overlay>
      <div class="w-full min-w-0">
        <h3
          class="font-header text-foreground min-w-0 truncate text-left text-sm leading-5 font-semibold"
          data-testid="show-tile-title"
        >
          {{ props.title }}
        </h3>
        <div class="mt-1 flex min-w-0 items-center justify-between gap-2">
          <p class="text-muted min-w-0 truncate text-left text-xs leading-4">
            {{ genresLabel || '—' }}
          </p>
          <Rating :value="props.rating" />
        </div>
      </div>
    </template>
  </MediaCard>
</template>
