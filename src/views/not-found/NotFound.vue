<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main
    class="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 sm:px-8"
    data-testid="not-found-page"
  >
    <p class="font-display text-header-lg text-foreground">{{ t('common.pages.notFound.title') }}</p>
    <p class="text-body-md text-muted">{{ t('common.pages.notFound.description') }}</p>
    <RouterLink
      :to="{ name: 'home' }"
      class="bg-brand text-body-md hover:bg-brand-strong focus-visible:ring-ring inline-flex min-h-11 w-fit min-w-40 items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:bg-brand-soft"
    >
      {{ t('common.pages.notFound.goHome') }}
    </RouterLink>
  </main>
</template>
