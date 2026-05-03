<script setup lang="ts">
import { Star } from 'lucide-vue-next'

defineProps<{
  value: number | string
}>()
</script>

<template>
  <div
    :aria-label="`Rating ${value} out of 10`"
    class="bg-brand/20 font-display text-foreground xs:gap-1 xs:px-2 xs:py-1 inline-flex items-center gap-1 rounded-full px-1 py-0 text-xs font-semibold"
    data-testid="rating"
  >
    <Star
      aria-hidden="true"
      class="fill-brand-strong text-brand-strong h-3 w-3"
      data-testid="rating-icon"
    />
    <span data-testid="rating-value">{{ value }}</span>
  </div>
</template>
