<script setup lang="ts">
import { Star } from 'lucide-vue-next'

defineProps<{
  value: number | string
}>()
</script>

<template>
  <div
    :aria-label="`Rating ${value} out of 10`"
    class="bg-brand/20 font-display text-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold xs:gap-1.5 xs:px-2.5 xs:py-1 xs:text-body-md"
    data-testid="rating"
  >
    <Star
      aria-hidden="true"
      class="fill-brand-strong text-brand-strong h-3.5 w-3.5 xs:h-4 xs:w-4"
      data-testid="rating-icon"
    />
    <span data-testid="rating-value">{{ value }}</span>
  </div>
</template>
