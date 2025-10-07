import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ClearableInput from '../ClearableInput.vue'

describe('ClearableInput', () => {
  it('renders correctly', () => {
    const component = mount(ClearableInput, { props: { modelValue: '' } })
    expect(component).toBeTruthy()
  })

  it('updates the input value', async () => {
    const component = mount(ClearableInput, { props: { modelValue: '' } })
    const input = component.find('input')
    await input.setValue('test')
    expect(component.emitted()['update:modelValue'][0]).toEqual(['test'])
  })

  it('clears the input', async () => {
    const component = mount(ClearableInput, { props: { modelValue: 'test' } })
    const button = component.find('.delete-button')
    expect(button.exists()).toBe(true)
    await button.trigger('click')
    expect(component.emitted()['update:modelValue'][0]).toEqual([''])
  })
})
