<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import EpisodeDetailPanel from '@/features/show-details/EpisodeDetailPanel.vue'
import MediaCard from '@/components/MediaCard.vue'
import { useEpisodeTileLabels } from '@/composables/useEpisodeTileLabels'
import type { Episode } from '@/shared/types/episode'

const props = defineProps<{
  episode: Episode
}>()

const { t } = useI18n()
const { titleLine, summaryPlain, airdateLabel, runtimeLabel } = useEpisodeTileLabels(
  () => props.episode
)

const FALLBACK = 'https://static.tvmaze.com/images/no-img/no-img-landscape-text.png'

const imageUrl = computed(
  () => props.episode.image?.medium || props.episode.image?.original || FALLBACK
)
</script>

<template>
  <div class="w-[168px] shrink-0 snap-start" data-testid="episode-tile">
    <MediaCard
      image-preset="landscape"
      :image-url="imageUrl"
      :image-alt="episode.name"
      :aria-label="
        t('common.pages.showDetails.episodes.episodeCardAriaLabel', { title: episode.name })
      "
    >
      <EpisodeDetailPanel
        :title-line="titleLine"
        :summary-plain="summaryPlain"
        :airdate-label="airdateLabel"
        :runtime-label="runtimeLabel"
        :airdate-iso="episode.airdate"
      />
    </MediaCard>
  </div>
</template>
