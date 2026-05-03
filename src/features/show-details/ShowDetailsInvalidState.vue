<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section
    class="bg-surface border-border rounded-xl border px-4 py-5"
    role="alert"
    data-testid="show-details-invalid"
  >
    <p class="font-medium">{{ t('common.pages.showDetails.invalidId') }}</p>
  </section>
</template>
