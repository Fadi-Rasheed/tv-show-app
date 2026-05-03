<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  leftArrowAriaLabel: string
  rightArrowAriaLabel: string
}>()

const trackRef = ref<HTMLElement | null>(null)

const scrollByAmount = (direction: 'left' | 'right') => {
  if (!trackRef.value) {
    return
  }

  const amount = Math.round(trackRef.value.clientWidth * 0.8)
  trackRef.value.scrollBy({
    left: direction === 'right' ? amount : -amount,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="group/slider relative">
    <div class="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center">
      <button
        :aria-label="props.leftArrowAriaLabel"
        class="bg-surface/85 text-foreground ring-ring pointer-events-auto ml-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full opacity-0 shadow-md transition group-focus-within/slider:opacity-100 group-hover/slider:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 lg:flex"
        type="button"
        @click="scrollByAmount('left')"
      >
        <ChevronLeft aria-hidden="true" class="h-5 w-5" />
      </button>
    </div>

    <div class="pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center">
      <button
        :aria-label="props.rightArrowAriaLabel"
        class="bg-surface/85 text-foreground ring-ring pointer-events-auto mr-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full opacity-0 shadow-md transition group-focus-within/slider:opacity-100 group-hover/slider:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 lg:flex"
        type="button"
        @click="scrollByAmount('right')"
      >
        <ChevronRight aria-hidden="true" class="h-5 w-5" />
      </button>
    </div>

    <div
      ref="trackRef"
      class="slider-track flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 xs:gap-4"
      data-testid="horizontal-slider-track"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.slider-track {
  scrollbar-width: none;
}

.slider-track::-webkit-scrollbar {
  display: none;
}
</style>
