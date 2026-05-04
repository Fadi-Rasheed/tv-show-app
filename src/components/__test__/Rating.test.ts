// @vitest-environment jsdom

import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import Rating from '../Rating.vue'

describe('Rating', () => {
  it('shows the numeric value with an accessible rating label', () => {
    render(Rating, { props: { value: 8.2 } })

    expect(screen.getByTestId('rating-value').textContent).toBe('8.2')
    expect(screen.getByTestId('rating').getAttribute('aria-label')).toBe('Rating 8.2 out of 10')
  })
})
