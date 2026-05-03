<script setup lang="ts">
import Spinner from '@/components/Spinner.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div
    class="text-muted sm:text-body-md flex min-h-40 flex-col items-center justify-center gap-3 text-sm"
    role="status"
  >
    <Spinner size="lg" />
    {{ t('common.pages.browse.states.findingShows') }}
  </div>
</template>
