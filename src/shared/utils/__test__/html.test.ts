// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { stripHtml } from '../html'

describe('stripHtml', () => {
  it('extracts readable text using the DOM parser in jsdom', () => {
    expect(stripHtml('<p>Hello <strong>there</strong></p>')).toBe('Hello there')
  })
})
