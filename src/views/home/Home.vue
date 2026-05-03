<script setup lang="ts">
import Rail from '@/components/Rail.vue'
import Spinner from '@/components/Spinner.vue'
import { useShowsByGenreQuery } from '@/shared/api/shows/queries'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const genreRailsQuery = useShowsByGenreQuery()
</script>

<template>
  <main
    class="min-h-screen bg-background px-4 py-5 text-foreground xs:px-5 sm:px-6 sm:py-8 lg:px-8"
    data-testid="home-page"
  >
    <h1 class="mb-5 font-header text-2xl leading-8 sm:mb-6 sm:text-header-md" data-testid="home-title">
      {{ t('common.pages.home.title') }}
    </h1>

    <section
      v-if="genreRailsQuery.isLoading.value"
      class="flex min-h-40 items-center justify-center"
      data-testid="home-loading"
    >
      <Spinner size="lg" />
      <span class="sr-only">{{ t('common.pages.home.states.loading') }}</span>
    </section>

    <section
      v-else-if="genreRailsQuery.isError.value"
      class="bg-surface border-border rounded-xl border px-4 py-5"
      data-testid="home-error"
      role="alert"
    >
      <p class="font-medium">{{ t('common.pages.home.states.errorTitle') }}</p>
      <p class="text-muted mt-2 text-sm sm:text-body-md">
        {{ t('common.pages.home.states.errorDescription') }}
      </p>
    </section>

    <section v-else-if="!genreRailsQuery.data.value?.length" data-testid="home-empty">
      <p class="text-muted text-sm sm:text-body-md">{{ t('common.pages.home.states.empty') }}</p>
    </section>

    <section v-else class="space-y-6 sm:space-y-8" data-testid="home-rails">
      <Rail
        v-for="rail in genreRailsQuery.data.value"
        :key="rail.genre"
        :browse-more="{ categorySlug: rail.categorySlug, showBrowseMore: true }"
        :items="rail.items"
        :title="rail.genre"
      />
    </section>
  </main>
</template>
