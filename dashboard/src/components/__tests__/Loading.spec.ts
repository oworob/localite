import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Loading from '../Loading.vue'

describe('Loading', () => {
  it('renders correctly', () => {
    const component = mount(Loading)
    expect(component).toBeTruthy()
  })
})
