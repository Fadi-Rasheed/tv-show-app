import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDebouncer } from '../debounce'

describe('createDebouncer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls onDebouncedValue once after delay with the last scheduled value', () => {
    const onDebouncedValue = vi.fn()
    const debouncer = createDebouncer<string>({
      debounceDelayMs: 100,
      onDebouncedValue,
    })

    debouncer.schedule('a')
    debouncer.schedule('b')
    debouncer.schedule('c')

    expect(onDebouncedValue).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(onDebouncedValue).toHaveBeenCalledTimes(1)
    expect(onDebouncedValue).toHaveBeenCalledWith('c')
  })

  it('does not call onDebouncedValue before delay elapses', () => {
    const onDebouncedValue = vi.fn()
    const debouncer = createDebouncer<number>({
      debounceDelayMs: 50,
      onDebouncedValue,
    })

    debouncer.schedule(1)
    vi.advanceTimersByTime(49)
    expect(onDebouncedValue).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onDebouncedValue).toHaveBeenCalledWith(1)
  })

  it('cancelPending drops a scheduled invocation', () => {
    const onDebouncedValue = vi.fn()
    const debouncer = createDebouncer<string>({
      debounceDelayMs: 200,
      onDebouncedValue,
    })

    debouncer.schedule('x')
    vi.advanceTimersByTime(100)
    debouncer.cancelPending()
    vi.advanceTimersByTime(200)

    expect(onDebouncedValue).not.toHaveBeenCalled()
  })

  it('shouldFlushImmediately invokes onDebouncedValue immediately and skips the delay', () => {
    const onDebouncedValue = vi.fn()
    const debouncer = createDebouncer<string>({
      debounceDelayMs: 300,
      onDebouncedValue,
      shouldFlushImmediately: (candidateValue) => candidateValue.trim().length === 0,
    })

    debouncer.schedule('hello')
    expect(onDebouncedValue).not.toHaveBeenCalled()

    debouncer.schedule('   ')
    expect(onDebouncedValue).toHaveBeenCalledTimes(1)
    expect(onDebouncedValue).toHaveBeenLastCalledWith('   ')

    vi.runAllTimers()
    expect(onDebouncedValue).toHaveBeenCalledTimes(1)
  })
})
