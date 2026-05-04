// @vitest-environment jsdom

import { cleanup, render, screen, fireEvent } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import DropdownSelect from '../DropdownSelect.vue'

afterEach(() => {
  cleanup()
})

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

describe('DropdownSelect', () => {
  it('shows the placeholder when no value is selected', () => {
    render(DropdownSelect, {
      props: {
        options,
        modelValue: '',
      },
    })

    expect(screen.getByText('Select an option')).toBeTruthy()
  })

  it('emits update:modelValue when an option is chosen', async () => {
    const { emitted } = render(DropdownSelect, {
      props: {
        options,
        modelValue: '',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: /open dropdown options/i }))
    await fireEvent.click(screen.getByRole('option', { name: 'Option B' }))

    expect(emitted()['update:modelValue']?.[0]).toEqual(['b'])
  })
})
