import { describe, expect, it } from 'vitest'
import { showQueryKeys } from '@/shared/api/query-keys'

describe('showQueryKeys', () => {
  it('builds list keys with and without page', () => {
    expect(showQueryKeys.list()).toEqual(['shows', 'list'])
    expect(showQueryKeys.list(2)).toEqual(['shows', 'list', 2])
  })

  it('detail key omits embed when not provided', () => {
    expect(showQueryKeys.detail(42)).toEqual(['shows', 'detail', 42])
    expect(showQueryKeys.detail(42, 'cast')).toEqual(['shows', 'detail', 42, 'cast'])
    expect(showQueryKeys.detail(42, '')).toEqual(['shows', 'detail', 42])
  })
})
