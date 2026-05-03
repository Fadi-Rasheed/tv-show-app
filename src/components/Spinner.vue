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

const sizeClassMap: Record<NonNullable<typeof props.size>, string> = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
  xl: 'size-16',
}

const sizeClass = computed(() => sizeClassMap[props.size] ?? sizeClassMap.md)
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
