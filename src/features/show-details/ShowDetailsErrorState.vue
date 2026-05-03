<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section
    class="bg-surface border-border rounded-xl border px-4 py-5"
    role="alert"
    data-testid="show-details-error"
  >
    <p class="font-medium">{{ t('common.pages.showDetails.errorTitle') }}</p>
    <p class="text-muted sm:text-body-md mt-2 text-sm">
      {{ t('common.pages.showDetails.errorDescription') }}
    </p>
  </section>
</template>
