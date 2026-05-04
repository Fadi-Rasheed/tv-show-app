<script setup lang="ts">
import Button from '@/components/Button.vue'
import type { ShowGenre } from '@/shared/types/genre'
import { useI18n } from 'vue-i18n'

defineProps<{
  genres: ShowGenre[]
  selectedGenres: ShowGenre[]
}>()

const emit = defineEmits<{
  toggleGenre: [ShowGenre]
  clearGenres: []
}>()

const { t } = useI18n()
</script>

<template>
  <section class="mb-6 sm:mb-8" :aria-label="t('common.pages.browse.filters.regionAria')">
    <div class="mb-3 flex items-center justify-between gap-3">
      <h2 class="font-header text-lg leading-7">
        {{ t('common.pages.browse.filters.title') }}
      </h2>
      <Button
        v-if="selectedGenres.length > 0"
        class="browse-clear-btn"
        @click="emit('clearGenres')"
      >
        {{ t('common.pages.browse.filters.clearAll') }}
      </Button>
    </div>

    <ul
      class="m-0 flex list-none flex-wrap gap-2 p-0"
      :aria-label="t('common.pages.browse.filters.listAria')"
    >
      <li v-for="genre in genres" :key="genre">
        <button
          type="button"
          class="browse-filter-badge"
          :aria-pressed="selectedGenres.includes(genre)"
          :data-selected="selectedGenres.includes(genre) ? 'true' : 'false'"
          @click="emit('toggleGenre', genre)"
        >
          {{ genre }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
@reference '../../style.css';
@config '../../../tailwind.config.ts';

.browse-filter-badge {
  @apply border-border bg-surface text-muted hover:text-foreground hover:border-brand-soft;
  @apply focus-visible:ring-ring rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none;
}

.browse-filter-badge[data-selected='true'] {
  @apply border-brand bg-brand/15 text-brand-strong;
}

.browse-clear-btn {
  @apply min-h-9 min-w-auto rounded-full px-4 py-1.5 text-sm;
}
</style>
