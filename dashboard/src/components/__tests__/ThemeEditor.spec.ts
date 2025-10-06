import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import ThemeEditor from '../ThemeEditor.vue'

describe('ThemeEditor', () => {
  let component: any

  beforeEach(() => {
    component = mount(ThemeEditor)
    localStorage.clear()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('opens and closes the theme editor', async () => {
    const button = component.find('.toggle')
    await button.trigger('click')
    expect(component.find('.theme-window').exists()).toBe(true)
    await button.trigger('click')
    expect(component.find('.theme-window').exists()).toBe(false)
  })

  it('closes the select window when clicking outside', async () => {
    await component.find('.toggle').trigger('click')
    expect(component.find('.theme-window').exists()).toBe(true)
    await window.dispatchEvent(new Event('click'))
    expect(component.find('.theme-window').exists()).toBe(false)
  })

  it('updates the light and dark theme', async () => {
    await component.find('.toggle').trigger('click')
    await component.find('.theme-switch').trigger('click')
    expect(component.vm.light_theme).toBe(true)
    await component.find('.theme-switch').trigger('click')
    expect(component.vm.light_theme).toBe(false)
  })

  it('updates the color theme', async () => {
    await component.find('.toggle').trigger('click')
    await component.find('.color-theme #blue').setValue(true)
    await flushPromises()
    expect(component.vm.color_theme).toBe('blue')
  })

  it('loads saved theme settings', () => {
    localStorage.setItem('light_theme', 'true')
    localStorage.setItem('color_theme', 'blue')

    component = mount(ThemeEditor)
    expect(component.vm.light_theme).toBe(true)
    expect(component.vm.color_theme).toBe('blue')
  })
})
