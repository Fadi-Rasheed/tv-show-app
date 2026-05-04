import { describe, expect, it } from 'vitest'
import { queryClient } from '../vue-query'

describe('queryClient', () => {
  it('uses lightweight defaults for an assignment app', () => {
    const queries = queryClient.getDefaultOptions().queries
    expect(queries?.retry).toBe(1)
    expect(queries?.refetchOnWindowFocus).toBe(false)
  })
})
