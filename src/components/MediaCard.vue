<script setup lang="ts">
withDefaults(
  defineProps<{
    imageUrl: string
    imageAlt: string
    imagePreset: 'portrait' | 'landscape'
    imageDataTestId?: string
  }>(),
  {
    imageDataTestId: undefined,
  }
)
</script>

<template>
  <article
    class="group border-border bg-surface relative overflow-hidden rounded-2xl border"
    :class="
      imagePreset === 'portrait'
        ? 'max-w-poster-tile-sm sm:max-w-poster-tile-md md:max-w-poster-tile-lg xl:max-w-poster-tile-xl w-full shadow-xl'
        : 'w-full shadow-lg'
    "
  >
    <div v-if="imagePreset === 'portrait'" class="relative w-full overflow-hidden">
      <img
        :alt="imageAlt"
        :data-testid="imageDataTestId"
        :src="imageUrl"
        class="h-poster-tile-sm sm:h-poster-tile-md md:h-poster-tile-lg xl:h-poster-tile-xl block w-full object-cover transition duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div
        v-if="$slots.overlay"
        class="from-background/95 via-surface/85 to-brand-soft/80 xs:gap-3 xs:px-3 absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 bg-linear-to-r px-2.5 py-2.5 sm:px-4 sm:py-3"
        data-testid="show-tile-footer"
      >
        <slot name="overlay" />
      </div>
    </div>

    <div v-else class="bg-background/40 relative aspect-video w-full overflow-hidden">
      <img
        :alt="imageAlt"
        :src="imageUrl"
        class="block h-full w-full object-cover"
        loading="lazy"
      />
      <div
        v-if="$slots.overlay"
        class="from-background/95 via-surface/85 to-brand-soft/80 xs:gap-3 xs:px-3 absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 bg-linear-to-r px-2.5 py-2.5 sm:px-4 sm:py-3"
        data-testid="show-tile-footer"
      >
        <slot name="overlay" />
      </div>
    </div>

    <div v-if="$slots.default" class="min-w-0">
      <slot />
    </div>
  </article>
</template>
