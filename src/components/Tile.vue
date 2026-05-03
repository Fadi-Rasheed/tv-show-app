<script setup lang="ts">
import MediaCard from '@/components/MediaCard.vue'
import Rating from '@/components/Rating.vue'

defineProps<{
  imageUrl: string
  title: string
  rating: number | string
}>()
</script>

<template>
  <MediaCard
    image-preset="portrait"
    :image-url="imageUrl"
    :image-alt="title"
    image-data-test-id="show-tile-image"
    data-testid="show-tile"
  >
    <template #overlay>
      <h3
        class="font-header text-foreground sm:text-header-sm min-w-0 flex-1 truncate text-left text-base leading-6 font-semibold"
        data-testid="show-tile-title"
      >
        {{ title }}
      </h3>
      <Rating :value="rating" />
    </template>
  </MediaCard>
</template>
