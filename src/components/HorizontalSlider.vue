<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, onUpdated, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { observeElementResize } from '@/shared/utils/resize-observer'

const props = defineProps<{
  leftArrowAriaLabel: string
  rightArrowAriaLabel: string
}>()

const trackRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
let stopResizeObservation: (() => void) | null = null

const updateScrollState = () => {
  const el = trackRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 1
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

const scrollByAmount = (direction: 'left' | 'right') => {
  if (!trackRef.value) return
  const amount = Math.round(trackRef.value.clientWidth * 0.8)
  trackRef.value.scrollBy({
    left: direction === 'right' ? amount : -amount,
    behavior: 'smooth',
  })
}

onMounted(() => {
  const el = trackRef.value
  if (!el) return

  updateScrollState()
  el.addEventListener('scroll', updateScrollState, { passive: true })
  stopResizeObservation = observeElementResize(el, updateScrollState)
})

onUpdated(async () => {
  await nextTick()
  updateScrollState()
})

onUnmounted(() => {
  const el = trackRef.value
  if (el) {
    el.removeEventListener('scroll', updateScrollState)
  }

  stopResizeObservation?.()
  stopResizeObservation = null
})
</script>

<template>
  <div class="group/slider relative">
    <div
      v-show="canScrollLeft"
      class="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center"
    >
      <button
        :aria-label="props.leftArrowAriaLabel"
        class="slider-arrow-button slider-arrow-button--left"
        type="button"
        @click="scrollByAmount('left')"
      >
        <ChevronLeft aria-hidden="true" class="slider-arrow-chevron" />
      </button>
    </div>

    <div
      v-show="canScrollRight"
      class="pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center"
    >
      <button
        :aria-label="props.rightArrowAriaLabel"
        class="slider-arrow-button slider-arrow-button--right"
        type="button"
        @click="scrollByAmount('right')"
      >
        <ChevronRight aria-hidden="true" class="slider-arrow-chevron" />
      </button>
    </div>

    <div
      ref="trackRef"
      class="slider-track xs:gap-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
      data-testid="horizontal-slider-track"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
@reference '../style.css';
@config '../../tailwind.config.ts';

.slider-arrow-button {
  @apply bg-surface/85 text-foreground ring-ring pointer-events-auto hidden h-16 w-16 cursor-pointer items-center justify-center rounded-full opacity-0 shadow-md transition lg:flex;
  @apply group-focus-within/slider:opacity-100 group-hover/slider:opacity-100 focus-visible:opacity-100 focus-visible:ring-2;
}

.slider-arrow-button--left {
  @apply ml-1;
}

.slider-arrow-button--right {
  @apply mr-1;
}

.slider-arrow-chevron {
  @apply h-8 w-8;
}

.slider-track {
  scrollbar-width: none;
}

.slider-track::-webkit-scrollbar {
  display: none;
}
</style>
