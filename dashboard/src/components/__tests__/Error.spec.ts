import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import Error from '../Error.vue'

describe('Error', () => {
  let component: any

  beforeEach(() => {
    component = mount(Error, {
      global: {
        plugins: [
          createRouter({
            history: createWebHistory(),
            routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
          }),
        ],
      },
    })
  })

  it('renders correctly with props', () => {
    component.setProps({ error: 'Error' })
    expect(component.text()).toContain('Error')
  })

  it('renders correctly without props', () => {
    expect(component.text()).toContain('Unknown Error')
  })
})
