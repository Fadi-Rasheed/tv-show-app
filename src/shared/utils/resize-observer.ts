export type ResizeObserverCleanup = () => void

export const observeElementResize = (
  element: Element,
  onResize: ResizeObserverCallback
): ResizeObserverCleanup => {
  if (typeof ResizeObserver === 'undefined') {
    return () => {}
  }

  const observer = new ResizeObserver(onResize)
  observer.observe(element)

  return () => {
    observer.disconnect()
  }
}
