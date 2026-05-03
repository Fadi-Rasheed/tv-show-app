<script setup lang="ts">
import type { Person } from '@/shared/types/person'

const FALLBACK = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'

defineProps<{
  person: Person
}>()
</script>

<template>
  <div
    class="border-border bg-surface/80 flex min-w-0 max-w-[200px] items-center gap-3 rounded-xl border px-3 py-2"
    data-testid="person-credit"
  >
    <img
      alt=""
      class="border-border h-11 w-11 shrink-0 rounded-full border object-cover"
      :src="person.image?.medium || person.image?.original || FALLBACK"
      loading="lazy"
      width="44"
      height="44"
    />
    <span class="text-foreground truncate text-sm font-medium leading-snug sm:text-body-md">
      {{ person.name }}
    </span>
  </div>
</template>
