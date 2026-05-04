import { describe, expect, it } from 'vitest'
import { pinia } from '../pinia'

describe('pinia provider', () => {
  it('exports a pinia instance', () => {
    expect(pinia).toBeTruthy()
  })
})
