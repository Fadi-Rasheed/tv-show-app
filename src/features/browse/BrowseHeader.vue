<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <header class="mb-6 sm:mb-8">
    <h1 class="font-header sm:text-header-md text-2xl leading-8">
      {{ t('common.pages.browse.title') }}
    </h1>
    <p class="text-muted sm:text-body-md mt-2 max-w-2xl text-sm leading-6">
      {{ t('common.pages.browse.description') }}
    </p>
  </header>
</template>
