import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { languages } from '@/assets/testing/test-languages'
import LanguageSelect from '../LanguageSelect.vue'

describe('LanguageSelect', () => {
  let component: any

  beforeEach(() => {
    component = mount(LanguageSelect, {
      props: {
        languages: languages,
        selected_language_id: languages[0].id,
      },
    })
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('displays the selected language', () => {
    const header = component.find('.select-header .main span')
    expect(header.text()).toContain('English')
  })

  it('opens and closes the select window when clicked', async () => {
    const header = component.find('.select-header')
    await header.trigger('click')
    expect(component.find('.select-window').exists()).toBe(true)

    await header.trigger('click')
    expect(component.find('.select-window').exists()).toBe(false)
  })

  it('emits languageSelected event when a language is clicked', async () => {
    const header = component.find('.select-header')
    await header.trigger('click')
    const language = component.findAll('.select-window .language-button').at(1)
    await language.trigger('click')
    expect(component.find('.select-window').exists()).toBe(false)
    expect(component.emitted().languageSelected[0]).toEqual([languages[1].id])
  })

  it('filters languages', async () => {
    const header = component.find('.select-header')
    await header.trigger('click')
    const searchBar = component.find('.select-window .search')
    await searchBar.setValue('spanish')
    expect(component.findAll('.select-window .language-button').at(0).text()).toContain('Spanish')
  })

  it('closes the select window when clicking outside', async () => {
    const header = component.find('.select-header')
    await header.trigger('click')
    expect(component.find('.select-window').exists()).toBe(true)
    await window.dispatchEvent(new Event('click'))
    expect(component.find('.select-window').exists()).toBe(false)
  })
})
