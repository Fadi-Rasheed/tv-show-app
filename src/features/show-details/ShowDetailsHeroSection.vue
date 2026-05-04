<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Rating from '@/components/Rating.vue'
import { toCategorySlug } from '@/shared/api/utils'

defineProps<{
  showName: string
  heroImage: string
  summaryPlain: string
  genresDisplay: string[]
  ratingValue: number | null
}>()

const { t } = useI18n()
</script>

<template>
  <header class="bg-background relative -mx-4 mb-6 overflow-hidden sm:-mx-5 lg:-mx-8">
    <img
      :alt="showName"
      class="absolute inset-0 h-full min-h-[420px] w-full object-cover object-center sm:max-h-[768px] sm:min-h-[640px] md:max-h-[960px] md:min-h-[768px] lg:w-[80%] xl:w-[70%] 2xl:w-[60%]"
      :src="heroImage"
      loading="eager"
    />
    <div
      class="from-background via-background/85 absolute inset-0 h-full min-h-[420px] bg-linear-to-t to-transparent sm:min-h-[480px]"
      aria-hidden="true"
    />
    <div
      class="absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(to_right,rgba(10,6,24,0)_0%,rgba(10,6,24,0.35)_15%,rgba(10,6,24,0.78)_30%,rgba(10,6,24,1)_50%)] lg:block lg:w-[40%] xl:w-[55%] 2xl:w-[65%]"
      aria-hidden="true"
    />
    <div
      class="relative z-10 px-4 pt-[220px] pb-6 sm:px-6 sm:pt-[360px] sm:pb-8 md:pt-[360px] lg:px-8"
    >
      <h1
        class="font-header text-foreground sm:text-header-lg mb-3 text-2xl leading-tight font-bold tracking-tight"
        data-testid="show-details-title"
      >
        {{ showName }}
      </h1>

      <p
        v-if="summaryPlain"
        class="text-foreground/95 text-body-md sm:text-body-lg mb-4 max-w-3xl leading-relaxed"
        data-testid="show-details-summary"
      >
        {{ summaryPlain }}
      </p>
      <p v-else class="text-muted text-body-md mb-4">
        {{ t('common.pages.showDetails.noSummary') }}
      </p>

      <div class="text-muted sm:text-body-md flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <div
          v-if="genresDisplay.length"
          class="flex flex-wrap items-center gap-2"
          :aria-label="t('common.pages.showDetails.genresAria')"
        >
          <RouterLink
            v-for="genre in genresDisplay"
            :key="genre"
            :to="{ name: 'browse', params: { category: toCategorySlug(genre) } }"
            class="text-foreground hover:text-brand-strong focus-visible:ring-ring decoration-border underline underline-offset-4 transition focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {{ genre }}
          </RouterLink>
        </div>

        <span
          v-if="genresDisplay.length && ratingValue != null"
          aria-hidden="true"
          class="text-border"
        >
          ·
        </span>

        <div
          v-if="ratingValue != null"
          class="inline-flex items-center gap-2"
          :aria-label="t('common.pages.showDetails.ratingAria')"
        >
          <Rating :value="ratingValue" />
        </div>
        <span v-else class="text-muted">{{ t('common.pages.showDetails.noRating') }}</span>
      </div>
    </div>
  </header>
</template>
