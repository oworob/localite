import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { notifications } from '@/assets/testing/test-notifications'
import { useNotificationStore } from '@/stores/NotificationStore'
import Notifications from '../Notifications.vue'

describe('Notifications', () => {
  let component: any
  let NotificationStore: any

  beforeEach(() => {
    component = mount(Notifications, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              NotificationStore: {
                notifications: notifications,
              },
            },
          }),
        ],
      },
    })
    NotificationStore = useNotificationStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('displays notifications', () => {
    expect(component.findAll('.notification').length).toBe(4)
  })

  it('removes notification', async () => {
    const notification = component.find('.notification')
    await notification.trigger('click')
    expect(NotificationStore.RemoveNotification).toHaveBeenCalled()
  })
})
