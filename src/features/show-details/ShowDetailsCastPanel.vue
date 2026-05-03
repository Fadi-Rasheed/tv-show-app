<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PersonCredit from '@/features/show-details/PersonCredit.vue'
import type { Person } from '@/shared/types/person'

defineProps<{
  castMembers: Person[]
}>()

const { t } = useI18n()
</script>

<template>
  <section
    :id="'panel-details'"
    role="tabpanel"
    :aria-labelledby="'tab-details'"
    tabindex="0"
    data-testid="panel-details"
  >
    <div
      class="border-border bg-surface/60 rounded-2xl border px-4 py-5 sm:px-6 sm:py-6"
      data-testid="details-panel"
    >
      <h2 class="font-header text-foreground sm:text-header-sm mb-5 text-lg font-semibold">
        {{ t('common.pages.showDetails.details.sectionTitle') }}
      </h2>

      <div v-if="castMembers.length" class="space-y-6">
        <dd class="xs:flex-row xs:flex-wrap flex flex-col gap-3">
          <PersonCredit v-for="p in castMembers" :key="p.id" :person="p" />
        </dd>
      </div>
      <p v-else class="text-muted text-sm">
        {{ t('common.pages.showDetails.details.emptyCast') }}
      </p>
    </div>
  </section>
</template>
