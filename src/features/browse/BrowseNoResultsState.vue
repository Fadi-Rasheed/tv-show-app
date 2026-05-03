<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  categoryTitle: string
}>()

const { t } = useI18n()
</script>

<template>
  <p class="text-muted text-body-md">
    {{ t('common.pages.browse.states.noResults', { category: categoryTitle }) }}
  </p>
</template>
