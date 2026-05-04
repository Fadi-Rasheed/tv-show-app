// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { router } from '@/router/index'

describe('router', () => {
  it('registers primary app routes', () => {
    const names = router.getRoutes().map((route) => route.name)
    expect(names).toEqual(
      expect.arrayContaining(['home', 'search', 'browse', 'show-details', 'not-found']),
    )
  })

  it('maps unknown paths to the not-found route', async () => {
    await router.push('/browse/Espionage')
    expect(router.currentRoute.value.name).toBe('not-found')
    expect(router.currentRoute.value.path).toBe('/browse/Espionage')
  })
})
