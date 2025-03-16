import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Checkbox from '../Checkbox.vue'

describe('Checkbox', () => {
  it('renders correctly when checked', () => {
    const component = mount(Checkbox, { props: { checked: true } })
    expect(component.classes()).toContain('checked')
  })

  it('renders correctly when unchecked', () => {
    const component = mount(Checkbox, { props: { checked: false } })
    expect(component.classes()).not.toContain('checked')
  })
})
