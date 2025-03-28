import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Switch from '../Switch.vue'

describe('Switch', () => {
  it('renders correctly when checked', () => {
    const component = mount(Switch, { props: { checked: true } })
    expect(component.classes()).toContain('checked')
  })

  it('renders correctly when unchecked', () => {
    const component = mount(Switch, { props: { checked: false } })
    expect(component.classes()).not.toContain('checked')
  })
})
