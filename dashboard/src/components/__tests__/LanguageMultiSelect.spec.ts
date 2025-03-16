import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { languages } from '@/assets/testing/test-languages'
import LanguageMultiSelect from '../LanguageMultiSelect.vue'

describe('LanguageMultiSelect', () => {
  let component: any

  beforeEach(() => {
    component = mount(LanguageMultiSelect, {
      props: {
        languages: languages,
        selected_languages: [languages[0]],
      },
    })
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('displays the number of selected languages', async () => {
    const header = component.find('.select-header span')
    expect(header.text()).toBe('1 language selected')

    await component.setProps({ selected_languages: [] })
    expect(header.text()).toBe('0 languages selected')
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
