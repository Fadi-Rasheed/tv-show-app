<script setup lang="ts">
import Spinner from '@/components/Spinner.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-60 flex-col items-center justify-center gap-3">
    <Spinner size="xl" />
    <span class="sr-only">{{ t('common.pages.search.states.loading') }}</span>
  </div>
</template>
