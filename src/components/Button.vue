<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    variant?: 'primary'
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    loading: false,
    disabled: false,
  }
)
</script>

<template>
  <button
    type="button"
    class="btn"
    :data-variant="variant"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
  >
    <LoaderCircle v-if="loading" class="btn__icon" aria-hidden="true" />
    <span class="btn__label" :class="{ 'btn__label--muted': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped>
@reference '../style.css';
@config '../../tailwind.config.ts';

.btn {
  @apply inline-flex min-h-11 min-w-40 items-center justify-center gap-2 rounded-xl px-6 py-3;
  @apply text-body-md font-semibold transition-colors;
  @apply focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none;
}

.btn[data-variant='primary'] {
  @apply bg-brand text-white shadow-sm;
  @apply hover:bg-brand-strong active:bg-brand-soft;
  @apply disabled:pointer-events-none disabled:opacity-60;
}

.btn__icon {
  @apply size-4 shrink-0 animate-spin text-white;
}

.btn__label--muted {
  @apply opacity-90;
}
</style>
