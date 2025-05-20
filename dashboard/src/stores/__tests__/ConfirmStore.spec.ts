import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useConfirmStore } from '../ConfirmSTore'

describe('ConfirmStore', () => {
  let store: ReturnType<typeof useConfirmStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useConfirmStore()
  })

  it('opens the modal and updates modal data', () => {
    store.Open('Test Title', 'Test Message', 'Yes', 'No', true)

    expect(store.modal_data.open).toBe(true)
    expect(store.modal_data.title).toBe('Test Title')
    expect(store.modal_data.message).toBe('Test Message')
    expect(store.modal_data.confirm_text).toBe('Yes')
    expect(store.modal_data.cancel_text).toBe('No')
    expect(store.modal_data.danger).toBe(true)
  })

  it('confirms', async () => {
    const promise = store.Open('Test Title', 'Test Message')
    store.Confirm()
    const confirmed = await promise
    expect(confirmed).toBe(true)
    expect(store.modal_data.open).toBe(false)
  })

  it('cancels', async () => {
    const promise = store.Open('Test Title', 'Test Message')
    store.Cancel()
    const confirmed = await promise
    expect(confirmed).toBe(false)
    expect(store.modal_data.open).toBe(false)
  })
})
