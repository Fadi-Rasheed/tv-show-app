<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DropdownSelect from '@/components/DropdownSelect.vue'
import EpisodeTile from '@/features/show-details/EpisodeTile.vue'
import HorizontalSlider from '@/components/HorizontalSlider.vue'
import Spinner from '@/components/Spinner.vue'
import { useShowEpisodesQuery } from '@/shared/api/queries'

const props = defineProps<{
  showId: number
}>()

const { t } = useI18n()

const episodesQuery = useShowEpisodesQuery(props.showId, true)

const selectedSeason = ref('1')
const initializedShowId = ref<number | null>(null)

const availableSeasons = computed(() => {
  const eps = episodesQuery.data.value
  if (!eps?.length) {
    return []
  }

  return [...new Set(eps.map((e) => e.season))].sort((a, b) => a - b)
})

watch(
  () => props.showId,
  () => {
    initializedShowId.value = null
    selectedSeason.value = '1'
  }
)

watch(
  () => [props.showId, episodesQuery.data.value] as const,
  ([id, eps]) => {
    if (!Number.isFinite(id) || !eps?.length) {
      return
    }

    if (initializedShowId.value === id) {
      return
    }

    initializedShowId.value = id
    selectedSeason.value = availableSeasons.value.includes(1)
      ? '1'
      : `${availableSeasons.value[0] ?? 1}`
  }
)

const filteredEpisodes = computed(() => {
  const eps = episodesQuery.data.value
  if (!eps?.length) {
    return []
  }

  const seasonNumber = Number.parseInt(selectedSeason.value, 10)
  return eps
    .filter((e) => e.season === seasonNumber)
    .sort((a, b) => {
      const aNumber = a.number ?? 0
      const bNumber = b.number ?? 0
      return aNumber - bNumber
    })
})

const seasonOptions = computed(() => {
  if (!availableSeasons.value.length) {
    return []
  }

  return availableSeasons.value.map((s) => ({
    value: String(s),
    label: t('common.pages.showDetails.episodes.seasonLabel', { n: s }),
  }))
})

const episodeCountLabel = computed(() =>
  t('common.pages.showDetails.episodes.count', { count: filteredEpisodes.value.length })
)
</script>

<template>
  <section
    :id="'panel-episodes'"
    role="tabpanel"
    :aria-labelledby="'tab-episodes'"
    tabindex="0"
    data-testid="panel-episodes"
  >
    <div
      v-if="episodesQuery.isLoading.value"
      class="flex min-h-40 items-center justify-center"
      data-testid="episodes-loading"
    >
      <Spinner size="lg" />
      <span class="sr-only">{{ t('common.pages.showDetails.episodes.loading') }}</span>
    </div>

    <div
      v-else-if="episodesQuery.isError.value"
      class="bg-surface border-border rounded-xl border px-4 py-4"
      role="alert"
      data-testid="episodes-error"
    >
      <p class="text-sm font-medium">{{ t('common.pages.showDetails.errorTitle') }}</p>
      <p class="text-muted mt-1 text-sm">
        {{ t('common.pages.showDetails.errorDescription') }}
      </p>
    </div>

    <template v-else-if="episodesQuery.isSuccess.value">
      <p
        v-if="!episodesQuery.data.value?.length"
        class="text-muted text-sm"
        data-testid="episodes-empty-all"
      >
        {{ t('common.pages.showDetails.episodes.emptyAll') }}
      </p>

      <template v-else>
        <div class="mb-4 max-w-xs">
          <DropdownSelect
            id="show-season-select"
            v-model="selectedSeason"
            :options="seasonOptions"
            :placeholder="t('common.pages.showDetails.episodes.seasonSelectAria')"
            :aria-label="t('common.pages.showDetails.episodes.seasonSelectAria')"
            :list-aria-label="t('common.pages.showDetails.episodes.seasonListAria')"
          />
        </div>

        <p class="text-muted mb-4 text-sm" data-testid="episode-count">
          {{ episodeCountLabel }}
        </p>

        <div
          v-if="!filteredEpisodes.length"
          class="text-muted text-sm"
          data-testid="episodes-empty-season"
        >
          {{ t('common.pages.showDetails.episodes.emptySeason') }}
        </div>

        <div v-else class="group/episodes relative" data-testid="episodes-rail">
          <HorizontalSlider
            :left-arrow-aria-label="t('common.components.rail.scrollLeftAriaLabel')"
            :right-arrow-aria-label="t('common.components.rail.scrollRightAriaLabel')"
          >
            <EpisodeTile v-for="ep in filteredEpisodes" :key="ep.id" :episode="ep" />
          </HorizontalSlider>
        </div>
      </template>
    </template>
  </section>
</template>
