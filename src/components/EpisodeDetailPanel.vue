<script setup lang="ts">
defineProps<{
  titleLine: string
  summaryPlain: string
  airdateLabel: string
  runtimeLabel: string
  airdateIso: string | null
}>()
</script>

<template>
  <div class="space-y-1.5 p-3">
    <h3
      class="font-header text-foreground line-clamp-2 text-left text-sm leading-snug font-semibold"
      data-testid="episode-detail-title"
    >
      {{ titleLine }}
    </h3>

    <p
      v-if="summaryPlain"
      class="text-muted sm:text-body-sm line-clamp-2 text-left text-xs leading-relaxed"
      data-testid="episode-detail-summary"
    >
      {{ summaryPlain }}
    </p>

    <div
      class="text-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
      data-testid="episode-detail-meta"
    >
      <span v-if="runtimeLabel">{{ runtimeLabel }}</span>
      <span v-if="runtimeLabel && airdateLabel" aria-hidden="true">·</span>
      <time v-if="airdateLabel" :datetime="airdateIso ?? undefined">{{ airdateLabel }}</time>
    </div>
  </div>
</template>
