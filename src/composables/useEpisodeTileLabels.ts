import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Episode } from '@/shared/types/episode'
import { stripHtml } from '@/shared/utils/html'

export function useEpisodeTileLabels(episode: MaybeRefOrGetter<Episode>) {
  const { t } = useI18n()

  const titleLine = computed(() => {
    const ep = toValue(episode)
    const num = ep.number
    const prefix = num ? `${num}. ` : ''

    return `${prefix}${ep.name}`
  })

  const summaryPlain = computed(() => {
    const summary = toValue(episode).summary

    return summary ? stripHtml(summary) : ''
  })

  const airdateLabel = computed(() => {
    return toValue(episode).airdate ?? ''
  })

  const runtimeLabel = computed(() => {
    const runtime = toValue(episode).runtime

    return runtime ? t('common.pages.showDetails.episodes.runtimeMinutes', { count: runtime }) : ''
  })

  return {
    titleLine,
    summaryPlain,
    airdateLabel,
    runtimeLabel,
  }
}
