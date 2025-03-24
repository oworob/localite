import { createPinia, setActivePinia } from 'pinia'
import { afterEach } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNotificationStore } from '../NotificationStore'

describe('NotificationStore', () => {
  let store: ReturnType<typeof useNotificationStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useNotificationStore()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds a notification and removes it after timeout', async () => {
    store.AddNotification('test', 'success')
    expect(store.notifications).toHaveLength(1)
    vi.advanceTimersByTime(2000)
    expect(store.notifications[0].removing).toBe(true)
    vi.advanceTimersByTime(500)
    expect(store.notifications).toHaveLength(0)
  })

  it('does not try to remove a non-existent notification', () => {
    store.RemoveNotification(1)
    expect(store.notifications).toHaveLength(0)
  })
})
