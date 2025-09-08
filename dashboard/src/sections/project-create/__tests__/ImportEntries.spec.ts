import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { new_entries, new_entries_csv } from '@/assets/testing/test-entries'
import ImportEntries from '../ImportEntries.vue'

describe('ImportEntries', () => {
  let component: any

  beforeEach(() => {
    component = mount(ImportEntries)
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('closes the select window when clicking outside', async () => {
    await window.dispatchEvent(new Event('click'))
    expect(component.emitted('close')).toBeTruthy()
  })

  it('closes the select window when clicking the cancel button', async () => {
    await component.find('.cancel').trigger('click')
    expect(component.emitted('close')).toBeTruthy()
  })

  it('changes the import mode', async () => {
    await component.find('.options #overwrite').setValue(true)
    expect(component.vm.mode).toBe('overwrite')

    await component.find('.options #append').setValue(true)
    expect(component.vm.mode).toBe('append')
  })

  it('emits saveEntries event with correct data', async () => {
    component.vm.imported_entries = new_entries
    component.vm.current_file = new File([], 'test.csv', { type: 'text/csv' })
    await flushPromises()
    await component.find('.submit').trigger('click')
    expect(component.emitted().saveEntries[0]).toEqual([new_entries, 'append'])
  })

  it('handles file input', async () => {
    const file = new File([new_entries_csv], 'test.csv', { type: 'text/csv' })
    const input = component.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [file],
    })
    await input.trigger('change')
    await flushPromises()
    expect(component.find('.file-label').text()).toContain('test.csv')
  })
})
