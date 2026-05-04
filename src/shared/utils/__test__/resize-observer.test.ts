// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'
import { observeElementResize } from '../resize-observer'

describe('observeElementResize', () => {
  it('returns a no-op cleanup when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined)

    const el = document.createElement('div')
    const cleanup = observeElementResize(el, vi.fn())

    expect(() => cleanup()).not.toThrow()

    vi.unstubAllGlobals()
  })
})
