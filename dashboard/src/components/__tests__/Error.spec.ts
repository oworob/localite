import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Error from '../Error.vue'

describe('Error', () => {
  it('renders correctly with props', () => {
    const component = mount(Error, { props: { error: 'Error' } })
    expect(component.text()).toContain('Error')
  })

  it('renders correctly without props', () => {
    const component = mount(Error)
    expect(component.text()).toContain('Unknown Error')
  })
})
