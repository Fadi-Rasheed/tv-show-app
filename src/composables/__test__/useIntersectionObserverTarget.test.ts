// @vitest-environment jsdom

import { defineComponent, onMounted, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useIntersectionObserverTarget } from '../useIntersectionObserverTarget'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useIntersectionObserverTarget', () => {
  it('begins observing when a target element is attached', async () => {
    const observeSpy = vi.fn()

    class MockIO {
      disconnect = vi.fn()
      unobserve = vi.fn()
      takeRecords = () => [] as IntersectionObserverEntry[]

      constructor(
        _cb: IntersectionObserverCallback,
        _opts?: IntersectionObserverInit
      ) {
        void _cb
        void _opts
      }

      observe = observeSpy
    }

    vi.stubGlobal('IntersectionObserver', MockIO as unknown as typeof IntersectionObserver)

    const Harness = defineComponent({
      setup() {
        const { target } = useIntersectionObserverTarget({ onIntersect: vi.fn() })
        const inner = ref<HTMLElement | null>(null)

        onMounted(() => {
          target.value = inner.value
        })

        return { inner }
      },
      template: '<div ref="inner" />',
    })

    mount(Harness)

    await flushPromises()

    expect(observeSpy).toHaveBeenCalled()
  })
})
