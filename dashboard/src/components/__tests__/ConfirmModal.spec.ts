import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfirmStore } from '@/stores/ConfirmSTore'
import ConfirmModal from '../ConfirmModal.vue'

describe('ConfirmModal', () => {
  let component: any
  let ConfirmStore: ReturnType<typeof useConfirmStore>

  beforeEach(() => {
    component = mount(ConfirmModal, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    })
    ConfirmStore = useConfirmStore()
  })

  it('opens the modal', async () => {
    ConfirmStore.Open('Test Title', 'Test Message')
    await flushPromises()
    expect(component.find('.title').text()).toBe('Test Title')
    expect(component.find('.message').text()).toBe('Test Message')
  })

  it('cancels', async () => {
    const promise = ConfirmStore.Open('Test Title', 'Test Message')
    await flushPromises()
    await component.find('.close').trigger('click')
    const confirmed = await promise
    expect(confirmed).toBe(false)
    expect(component.find('.modal').exists()).toBe(false)
  })

  it('confirms', async () => {
    const promise = ConfirmStore.Open('Test Title', 'Test Message')
    await flushPromises()
    await component.find('.confirm').trigger('click')
    const confirmed = await promise
    expect(confirmed).toBe(true)
    expect(component.find('.modal').exists()).toBe(false)
  })

  it('cancels when clicking outside', async () => {
    const promise = ConfirmStore.Open('Test Title', 'Test Message')
    await flushPromises()
    await window.dispatchEvent(new Event('click'))
    const confirmed = await promise
    expect(confirmed).toBe(false)
    expect(component.find('.modal').exists()).toBe(false)
  })
})
