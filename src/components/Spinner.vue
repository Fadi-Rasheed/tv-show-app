<script setup lang="ts">
import { computed } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    size: 'md',
  }
)

const { t } = useI18n()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-4'
    case 'md':
      return 'size-8'
    case 'lg':
      return 'size-12'
    case 'xl':
      return 'size-16'
    case 'md':
    default:
      return 'size-8'
  }
})
</script>

<template>
  <span
    class="inline-flex items-center justify-center"
    role="status"
    :aria-label="t('common.components.spinner.loading')"
  >
    <LoaderCircle class="text-brand animate-spin" :class="sizeClass" />
  </span>
</template>
