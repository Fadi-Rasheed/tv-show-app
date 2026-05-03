<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '@/components/Button.vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  isFetchingNextPage: boolean
}>()

const emit = defineEmits<{
  loadMore: []
  sentinelChange: [HTMLElement | null]
}>()
const sentinelEl = ref<HTMLElement | null>(null)

watch(
  sentinelEl,
  (el) => {
    emit('sentinelChange', el)
  },
  { flush: 'post' }
)

const { t } = useI18n()
</script>

<template>
  <div>
    <div ref="sentinelEl" class="pointer-events-none h-1 w-full shrink-0" aria-hidden="true" />

    <div class="flex w-full justify-center px-2 pt-8 pb-2">
      <Button variant="primary" :loading="isFetchingNextPage" @click="emit('loadMore')">
        {{ t('common.components.button.loadMore') }}
      </Button>
    </div>
  </div>
</template>
