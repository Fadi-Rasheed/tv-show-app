<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section data-testid="home-empty">
    <p class="text-muted sm:text-body-md text-sm">{{ t('common.pages.home.states.empty') }}</p>
  </section>
</template>
