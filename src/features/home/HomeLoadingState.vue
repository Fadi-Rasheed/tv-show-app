<script setup lang="ts">
import Spinner from '@/components/Spinner.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="flex min-h-40 items-center justify-center" data-testid="home-loading">
    <Spinner size="lg" />
    <span class="sr-only">{{ t('common.pages.home.states.loading') }}</span>
  </section>
</template>
