export type Debouncer<T> = {
  schedule: (nextValue: T) => void
  cancelPending: () => void
}

export type DebouncerOptions<T> = {
  debounceDelayMs: number
  onDebouncedValue: (latestValue: T) => void
  shouldFlushImmediately?: (candidateValue: T) => boolean
}

export const createDebouncer = <T>(config: DebouncerOptions<T>): Debouncer<T> => {
  const { debounceDelayMs, onDebouncedValue, shouldFlushImmediately } = config
  let debounceTimeoutId: ReturnType<typeof setTimeout> | undefined

  const cancelPending = () => {
    if (debounceTimeoutId !== undefined) {
      clearTimeout(debounceTimeoutId)
      debounceTimeoutId = undefined
    }
  }

  const schedule = (nextValue: T) => {
    cancelPending()
    if (shouldFlushImmediately?.(nextValue)) {
      onDebouncedValue(nextValue)
      return
    }
    debounceTimeoutId = setTimeout(() => {
      debounceTimeoutId = undefined
      onDebouncedValue(nextValue)
    }, debounceDelayMs)
  }

  return { schedule, cancelPending }
}
