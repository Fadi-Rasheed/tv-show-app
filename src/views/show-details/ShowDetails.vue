<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UnderlineTabs from '@/components/UnderlineTabs.vue'
import ShowDetailsCastPanel from '@/features/show-details/ShowDetailsCastPanel.vue'
import ShowDetailsErrorState from '@/features/show-details/ShowDetailsErrorState.vue'
import ShowDetailsHeroSection from '@/features/show-details/ShowDetailsHeroSection.vue'
import ShowDetailsInvalidState from '@/features/show-details/ShowDetailsInvalidState.vue'
import ShowDetailsLoadingState from '@/features/show-details/ShowDetailsLoadingState.vue'
import ShowDetailsRelatedPanel from '@/features/show-details/ShowDetailsRelatedPanel.vue'
import ShowEpisodesPanel from '@/features/show-details/ShowEpisodesPanel.vue'
import { useShowDetailQuery, useShowsByGenreQuery } from '@/shared/api/queries'
import { relatedItemsFromGenreRails } from '@/shared/api/utils'
import type { Person } from '@/shared/types/person'
import { stripHtml } from '@/shared/utils/html'

const props = defineProps<{
  id: string
}>()

const { t } = useI18n()

const showId = computed(() => {
  const n = Number.parseInt(props.id, 10)
  return Number.isFinite(n) && n > 0 ? n : NaN
})

const invalidRouteId = computed(() => !Number.isFinite(showId.value))

const activeTab = ref<'related' | 'details' | 'episodes'>('related')

const showQuery = useShowDetailQuery(showId.value, 'cast')

const genreRailsQuery = useShowsByGenreQuery()

const relatedRailItems = computed(() => {
  const genres = showQuery.data.value?.genres ?? []
  if (!Number.isFinite(showId.value) || !genres.length) {
    return []
  }

  return relatedItemsFromGenreRails(genreRailsQuery.data.value, {
    excludeId: showId.value,
    genres,
  })
})

const summaryPlain = computed(() => {
  const raw = showQuery.data.value?.summary
  if (!raw) {
    return ''
  }

  return stripHtml(raw)
})

const heroImage = computed(
  () =>
    showQuery.data.value?.image?.original ??
    showQuery.data.value?.image?.medium ??
    'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'
)

const ratingValue = computed(() => showQuery.data.value?.rating?.average ?? null)

const genresDisplay = computed(() => showQuery.data.value?.genres ?? [])

const castMembers = computed((): Person[] => {
  const list = showQuery.data.value?._embedded?.cast
  if (!list?.length) {
    return []
  }

  const seen = new Set<number>()
  const out: Person[] = []
  for (const c of list) {
    if (seen.has(c.person.id)) {
      continue
    }

    seen.add(c.person.id)
    out.push(c.person)
  }

  return out
})

const tabs = computed(() => [
  { value: 'related', label: t('common.pages.showDetails.tabs.related') },
  { value: 'details', label: t('common.pages.showDetails.tabs.details') },
  { value: 'episodes', label: t('common.pages.showDetails.tabs.episodes') },
])
</script>

<template>
  <main
    class="bg-background text-foreground xs:px-5 min-h-screen px-4 pb-5 sm:px-6 sm:pb-8 lg:px-8"
    data-testid="show-details-page"
  >
    <ShowDetailsInvalidState v-if="invalidRouteId" />
    <ShowDetailsLoadingState v-else-if="showQuery.isLoading.value" />
    <ShowDetailsErrorState v-else-if="showQuery.isError.value" />

    <template v-else-if="showQuery.data.value">
      <ShowDetailsHeroSection
        :show-name="showQuery.data.value.name"
        :hero-image="heroImage"
        :summary-plain="summaryPlain"
        :genres-display="genresDisplay"
        :rating-value="ratingValue"
      />

      <div class="space-y-6">
        <UnderlineTabs
          v-model="activeTab"
          :tabs="tabs"
          :tablist-aria-label="t('common.pages.showDetails.tabsAria')"
        />

        <ShowDetailsRelatedPanel
          v-show="activeTab === 'related'"
          :is-loading="genreRailsQuery.isLoading.value"
          :is-error="genreRailsQuery.isError.value"
          :genres-display="genresDisplay"
          :related-rail-items="relatedRailItems"
        />

        <ShowDetailsCastPanel v-show="activeTab === 'details'" :cast-members="castMembers" />

        <ShowEpisodesPanel v-if="activeTab === 'episodes'" :key="showId" :show-id="showId" />
      </div>
    </template>
  </main>
</template>
