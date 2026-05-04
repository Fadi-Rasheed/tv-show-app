// @vitest-environment jsdom

import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import Button from '../Button.vue'

describe('Button', () => {
  it('shows a spinner placeholder while loading', () => {
    render(Button, { props: { loading: true }, slots: { default: 'Continue' } })
    const button = screen.getByRole('button', { name: /continue/i })
    expect(button.getAttribute('aria-busy')).toBe('true')
    expect(button.hasAttribute('disabled')).toBe(true)
  })
})
