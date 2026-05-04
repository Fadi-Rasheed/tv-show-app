// @vitest-environment jsdom

import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import HorizontalSlider from '../HorizontalSlider.vue'

describe('HorizontalSlider', () => {
  it('renders the track and default slot content', () => {
    render(HorizontalSlider, {
      props: {
        leftArrowAriaLabel: 'Scroll left',
        rightArrowAriaLabel: 'Scroll right',
      },
      slots: { default: 'Slider row content' },
    })

    const track = screen.getByTestId('horizontal-slider-track')
    expect(track.textContent).toContain('Slider row content')
  })
})
