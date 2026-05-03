<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="bg-surface border-border rounded-xl border px-4 py-5" role="alert">
    <p class="font-medium">{{ t('common.pages.search.states.errorTitle') }}</p>
    <p class="text-muted sm:text-body-md mt-2 text-sm">
      {{ t('common.pages.search.states.errorDescription') }}
    </p>
  </div>
</template>
