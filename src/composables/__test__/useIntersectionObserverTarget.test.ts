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

    class MockIntersectionObserver {
      disconnect = vi.fn()
      unobserve = vi.fn()
      takeRecords = () => [] as IntersectionObserverEntry[]

      constructor(callback: IntersectionObserverCallback, init?: IntersectionObserverInit) {
        void callback
        void init
      }

      observe = observeSpy
    }

    vi.stubGlobal(
      'IntersectionObserver',
      MockIntersectionObserver as unknown as typeof IntersectionObserver
    )

    const IntersectionObserverTarget = defineComponent({
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

    mount(IntersectionObserverTarget)

    await flushPromises()

    expect(observeSpy).toHaveBeenCalled()
  })
})
