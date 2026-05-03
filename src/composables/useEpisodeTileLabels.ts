import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Episode } from '@/shared/types/episode'
import { stripHtml } from '@/shared/utils/html'

/** Episode copy + metadata for the episode detail card (below the thumbnail). */
export function useEpisodeTileLabels(episode: MaybeRefOrGetter<Episode>) {
  const { t } = useI18n()

  const titleLine = computed(() => {
    const ep = toValue(episode)
    const num = ep.number
    const prefix = num != null ? `${num}. ` : ''
    return `${prefix}${ep.name}`
  })

  const summaryPlain = computed(() => {
    const raw = toValue(episode).summary
    if (!raw) {
      return ''
    }

    return stripHtml(raw)
  })

  const airdateLabel = computed(() => {
    const airdate = toValue(episode).airdate
    return airdate ?? ''
  })

  const runtimeLabel = computed(() => {
    const m = toValue(episode).runtime
    if (m == null) {
      return ''
    }

    return t('common.pages.showDetails.episodes.runtimeMinutes', { count: m })
  })

  return {
    titleLine,
    summaryPlain,
    airdateLabel,
    runtimeLabel,
  }
}
