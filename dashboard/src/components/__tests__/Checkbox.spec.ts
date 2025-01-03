import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Checkbox from '../Checkbox.vue'

describe('Checkbox', () => {
  it('renders correctly when checked', () => {
    const wrapper = mount(Checkbox, { props: { checked: true } })
    expect(wrapper.classes()).toContain('checked')
  })

  it('renders correctly when unchecked', () => {
    const wrapper = mount(Checkbox, { props: { checked: false } })
    expect(wrapper.classes()).not.toContain('checked')
  })
})
