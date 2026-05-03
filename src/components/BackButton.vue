<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="text-muted hover:text-foreground focus-visible:ring-brand/70 mr-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
    aria-label="Go back"
    @click="emit('click')"
  >
    <ArrowLeft class="h-5 w-5" />
  </button>
</template>
