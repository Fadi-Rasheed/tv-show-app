import { describe, expect, it } from 'vitest'
import { SHOW_GENRE, SHOW_GENRES } from '../genre'

describe('SHOW_GENRES', () => {
  it('lists every known genre string', () => {
    expect(SHOW_GENRES).toContain(SHOW_GENRE.DRAMA)
    expect(SHOW_GENRES.length).toBeGreaterThan(10)
  })
})
