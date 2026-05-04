import { describe, expect, it } from 'vitest'
import { defaultLocale, i18n } from '../index'

describe('i18n', () => {
  it('boots with the default English locale', () => {
    expect(defaultLocale).toBe('en')
    expect(i18n.global.locale.value).toBe('en')
  })
})
