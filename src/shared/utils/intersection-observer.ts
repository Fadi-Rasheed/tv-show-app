export type IntersectionObserverCleanup = () => void

type ObserveElementIntersectionOptions = {
  element: Element
  onIntersect: IntersectionObserverCallback
  observerOptions?: IntersectionObserverInit
}

export const observeElementIntersection = ({
  element,
  onIntersect,
  observerOptions,
}: ObserveElementIntersectionOptions): IntersectionObserverCleanup => {
  if (typeof IntersectionObserver === 'undefined') {
    return () => {}
  }

  const observer = new IntersectionObserver(onIntersect, observerOptions)
  observer.observe(element)

  return () => {
    observer.disconnect()
  }
}
