// @vitest-environment jsdom

import { render, screen } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import ShowDetailsStates from '../ShowDetailsStates.vue'
import commonEn from '@/shared/i18n/locales/en/common.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: commonEn } },
})

describe('ShowDetailsStates', () => {
  it('shows the loading state view for the loading bucket', () => {
    render(ShowDetailsStates, {
      props: { state: 'loading' },
      global: {
        plugins: [i18n],
        stubs: { Spinner: { template: '<div />' } },
      },
    })

    expect(screen.getByTestId('show-details-loading')).toBeTruthy()
  })
})
