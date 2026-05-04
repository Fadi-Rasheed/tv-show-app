// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { useEpisodeTileLabels } from '../useEpisodeTileLabels'
import type { Episode } from '@/shared/types/episode'
import commonEn from '@/shared/i18n/locales/en/common.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: commonEn } },
})

describe('useEpisodeTileLabels', () => {
  it('formats title, stripped summary text, and runtime label', () => {
    const episode: Episode = {
      id: 1,
      name: 'Pilot',
      season: 1,
      number: 1,
      airdate: '2025-02-02',
      runtime: 45,
      image: null,
      summary: '<p>Hello friend</p>',
    }

    const EpisodeTileLabels = defineComponent({
      setup() {
        const episodeRef = ref(episode)
        const { titleLine, summaryPlain, runtimeLabel } = useEpisodeTileLabels(episodeRef)
        return { titleLine, summaryPlain, runtimeLabel }
      },
      template: `
        <div>
          <span data-testid="title">{{ titleLine }}</span>
          <span data-testid="summary">{{ summaryPlain }}</span>
          <span data-testid="runtime">{{ runtimeLabel }}</span>
        </div>
      `,
    })

    render(EpisodeTileLabels, {
      global: { plugins: [i18n] },
    })

    expect(screen.getByTestId('title').textContent).toContain('1.')
    expect(screen.getByTestId('title').textContent).toContain('Pilot')
    expect(screen.getByTestId('summary').textContent).toBe('Hello friend')
    expect(screen.getByTestId('runtime').textContent).toBe('45 min')
  })
})
