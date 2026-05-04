// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'
import { observeElementIntersection } from '../intersection-observer'

describe('observeElementIntersection', () => {
  it('returns a no-op cleanup when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    const el = document.createElement('div')
    const cleanup = observeElementIntersection({
      element: el,
      onIntersect: vi.fn(),
    })

    expect(() => cleanup()).not.toThrow()

    vi.unstubAllGlobals()
  })
})
