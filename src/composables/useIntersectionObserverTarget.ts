import { onBeforeUnmount, ref, watch, type MaybeRefOrGetter, toValue } from 'vue'
import { observeElementIntersection } from '@/shared/utils/intersection-observer'

type UseIntersectionObserverTargetOptions = {
  isEnabled?: MaybeRefOrGetter<boolean>
  observerOptions?: IntersectionObserverInit
  onIntersect: IntersectionObserverCallback
}

export function useIntersectionObserverTarget(options: UseIntersectionObserverTargetOptions) {
  const target = ref<HTMLElement | null>(null)
  let stopObserving: () => void = () => {}

  const disconnect = () => {
    stopObserving()
    stopObserving = () => {}
  }

  watch(
    [target, () => toValue(options.isEnabled ?? true)],
    ([element, isEnabled]) => {
      disconnect()

      if (!element || !isEnabled) {
        return
      }

      stopObserving = observeElementIntersection({
        element,
        onIntersect: options.onIntersect,
        observerOptions: options.observerOptions,
      })
    },
    { flush: 'post' }
  )

  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    target,
    disconnect,
  }
}
