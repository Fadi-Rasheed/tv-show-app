<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Spinner from '@/components/Spinner.vue'

const { t } = useI18n()
</script>

<template>
  <section
    class="flex min-h-40 items-center justify-center"
    data-testid="show-details-loading"
  >
    <Spinner size="lg" />
    <span class="sr-only">{{ t('common.pages.showDetails.loading') }}</span>
  </section>
</template>
