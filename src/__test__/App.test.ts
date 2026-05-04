// @vitest-environment jsdom

import { render } from '@testing-library/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { i18n } from '@/shared/i18n'

describe('App.vue', () => {
  it('mounts router outlet under the navigation chrome', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'home', component: { template: '<div />' } }],
    })

    await router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [createPinia(), i18n, router],
        stubs: { RouterView: { template: '<main data-testid="router-view-stub"></main>' } },
      },
    })

    expect(document.querySelector('[data-testid="router-view-stub"]')).toBeTruthy()
    expect(document.querySelector('[aria-label="Primary navigation"]')).toBeTruthy()
  })
})
