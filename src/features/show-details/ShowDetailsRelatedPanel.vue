<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Rail from '@/components/Rail.vue'
import Spinner from '@/components/Spinner.vue'
import type { RailShowItem } from '@/shared/api/utils'

defineProps<{
  isLoading: boolean
  isError: boolean
  relatedRailItems: RailShowItem[]
}>()

const { t } = useI18n()
</script>

<template>
  <section
    :id="'panel-related'"
    role="tabpanel"
    :aria-labelledby="'tab-related'"
    tabindex="0"
    data-testid="panel-related"
  >
    <div
      v-if="isLoading"
      class="flex min-h-32 items-center justify-center"
      data-testid="related-loading"
    >
      <Spinner />
      <span class="sr-only">{{ t('common.pages.showDetails.related.loading') }}</span>
    </div>

    <div
      v-else-if="isError"
      class="bg-surface border-border rounded-xl border px-4 py-4"
      role="alert"
      data-testid="related-error"
    >
      <p class="text-sm font-medium">{{ t('common.pages.showDetails.errorTitle') }}</p>
      <p class="text-muted mt-1 text-sm">
        {{ t('common.pages.showDetails.errorDescription') }}
      </p>
    </div>

    <p
      v-else-if="!relatedRailItems.length"
      class="text-muted sm:text-body-md text-sm"
      data-testid="related-empty"
    >
      {{ t('common.pages.showDetails.related.empty') }}
    </p>

    <Rail
      v-else
      :title="t('common.pages.showDetails.related.relatedShows')"
      :items="relatedRailItems"
      :max-items="10"
    />
  </section>
</template>
